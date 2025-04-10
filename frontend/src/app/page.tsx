"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import ProtectedRoute from "../components/ProtectedRoute";
// import { useAuth } from "../context/AuthContext";
import "@globals"; // Import global CSS
import { FaClock, FaHistory } from "react-icons/fa"; // Import icons

type CollectionCount = {
    collection: string;
    count: number;
};

type UpdateLog = {
    collection: string;
    lastUpdated: string; // Assuming ISO 8601 date format
};

export default function HomePage() {
    const dataCollections: { [key: string]: string } = {
        datakof: "Data Konsolidator Outbound Fee (KOF)",
        datakif: "Data Konsolidator Inbound Fee (KIF)",
        datasof: "Data Subkonsol Outbound Fee (SOF)",
        datasif: "Data Subkonsol Inbound Fee (SIF)",
        datapof: "Data Pick Up Posactive Fee (POF)",
        datafrd: "Data Forward Destination Fee",
        datafro: "Data Forward Origin Fee (FRO)",
        datadef: "Data Delivery Fee (DEF)",
        datatfs: "Data Trucking Fee (STT)",
        datatft: "Data Trucking Fee (TUC)",
        datakpf: "Data KVP Pick Up Fee (KPF)",
        datakdf: "Data KVP Delivery Fee (KDF)",
    };

    const tbsCollections: { [key: string]: string } = {
        mastertbs_4: "Konsolidator Outbound Fee",
        mastertbs_41: "Konsolidator Inbound Fee",
        mastertbs_42: "Subkonsolidator Outbound Fee",
        mastertbs_43: "Subkonsolidator Inbound Fee",
        mastertbs_44: "Pick Up Posactive Fee",
        mastertbs_46: "Forward Destination Fee",
        mastertbs_45: "Forward Origin Fee",
        mastertbs_47: "Delivery Fee",
        mastertbs_48: "Trucking Fee STT",
        mastertbs_49: "Trucking Fee TUC",
        mastertbs_50: "KVP Pick Up Fee",
        mastertbs_51: "KVP Delivery Fee",
    };

    const masterCollections: { [key: string]: string } = {
        mastermn_1: "Master Mitra Name",
        masteric_2: "Master IC",
        masterls_3: "Master Last Status",
        masterbc_5: "Master Berat Corp",
        masterrg_6: "Master Routing",
        masterrf_7: "MasterRateForward",
        masterrt_8: "MasterRateTrucking",
        masterdl_9: "Master DTPL",
        mastermt_10: "Master MTUC",
    };

    const [collections, setCollections] = useState<CollectionCount[]>([]);
    const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collectionsResponse, updateLogsResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/countCollections`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUpdateLogs`),
                ]);

                if (!collectionsResponse.ok) {
                    throw new Error(
                        `Collections Error: ${collectionsResponse.status} ${collectionsResponse.statusText}`
                    );
                }

                if (!updateLogsResponse.ok) {
                    throw new Error(
                        `Update Logs Error: ${updateLogsResponse.status} ${updateLogsResponse.statusText}`
                    );
                }

                const collectionsResult = await collectionsResponse.json();
                const updateLogsResult = await updateLogsResponse.json();

                setCollections(collectionsResult);
                setUpdateLogs(updateLogsResult);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            }
        };

        fetchData();
    }, []);
    const getLastUpdated = (collectionName: string) => {
        const log = updateLogs.find((log) => log.collection === collectionName);
        if (!log) return "No updates";

        const date = new Date(log.lastUpdated);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("id-ID", options).replace(',', '');
    };

    return (
        <div className="min-h-screen bg-background text-black p-4">
            {/* Teks Header */}
            <header className="mb-4">
                <h1 className="text-xl font-bold mb-1 flex justify-between items-center">
                    Fee App!
                    <Link className="px-3 py-1 bg-secondary text-black font-mono rounded-md hover:bg-secondary transition" href="/log-history">
                        <FaHistory className="inline mr-1" /> Log History
                    </Link>
                </h1>
                <p className="font-mono text-xs text-black-100">Login for access menu function.</p>
            </header>
            {/* Layout Dua Kolom */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sisi Kiri: Data */}
                <div className="flex-1 border border-black rounded-lg p-4 bg-background shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-center text-black">Data Fee</h2>
                    {error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {Object.keys(dataCollections).map((collectionName) => {
                                const collectionData = collections.find((col) => col.collection === collectionName);
                                return (
                                    <div
                                        key={collectionName}
                                        className="p-4 bg-primary rounded-lg shadow-md transition-transform transform hover:scale-105 border border-gray-300"
                                    >
                                        <h4
                                            className="text-xs font-bold text-black mb-2 shadow-md rounded-lg p-1 text-center"
                                            title={dataCollections[collectionName]}
                                        >
                                            {dataCollections[collectionName]}
                                        </h4>
                                        <p className="text-lg font-bold text-black mb-1 text-center">
                                            {collectionData ? collectionData.count.toLocaleString() : "Loading..."}
                                        </p>
                                        <p className="text-xs text-black flex items-center justify-center text-center italic">
                                            {/* <FaClock className="inline mr-1" size={15} />  */}
                                            <span className="text-xxxs" style={{ fontSize: '8pt' }}>Last Updated: {getLastUpdated(collectionName)}</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sisi Kanan: Master TBS & Master */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Section Master TBS */}
                    <section className="border border-black rounded-lg p-4 bg-background shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">Master Data Total Bulan Sebelum (TBS)</h2>
                        {error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                {Object.keys(tbsCollections).map((collectionName) => {
                                    const collectionData = collections.find((col) => col.collection === collectionName);
                                    return (
                                        <div
                                            key={collectionName}
                                            className="p-4 bg-primary rounded-lg shadow-md transition-transform transform hover:scale-105 border border-gray-300"
                                        >
                                            <h4
                                                className="text-xs font-bold text-black mb-2 shadow-md rounded-lg p-1 text-center"
                                                title={tbsCollections[collectionName]}
                                            >
                                                {tbsCollections[collectionName]}
                                            </h4>
                                            <p className="text-lg font-bold text-black mb-1 text-center">
                                                {collectionData ? collectionData.count.toLocaleString() : "Loading..."}
                                            </p>
                                            <p className="text-xs text-black flex items-center justify-center text-center italic">
                                                {/* <FaClock className="inline mr-1" size={15} />  */}
                                                <span className="text-xxxs" style={{ fontSize: '8pt' }}>Last Updated: {getLastUpdated(collectionName)}</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Section All Master */}
                    <section className="border border-black rounded-lg p-4 bg-background shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">Master Data Others</h2>
                        {error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                {Object.keys(masterCollections).map((collectionName) => {
                                    const collectionData = collections.find((col) => col.collection === collectionName);
                                    return (
                                        <div
                                            key={collectionName}
                                            className="p-4 bg-primary rounded-lg shadow-md transition-transform transform hover:scale-105 border border-gray-300"
                                        >
                                            <h4
                                                className="text-xs font-bold text-black mb-2 shadow-md rounded-lg p-1 text-center"
                                                title={masterCollections[collectionName]}
                                            >
                                                {masterCollections[collectionName]}
                                            </h4>
                                            <p className="text-lg font-bold text-black mb-1 text-center">
                                                {collectionData ? collectionData.count.toLocaleString() : "Loading..."}
                                            </p>
                                            <p className="text-xs text-black flex items-center justify-center text-center italic">
                                                {/* <FaClock className="inline mr-1" size={15} />  */}
                                                <span className="text-xxxs" style={{ fontSize: '8pt' }}>Last Updated: {getLastUpdated(collectionName)}</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
