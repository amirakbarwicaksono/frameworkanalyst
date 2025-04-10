"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@auth";

export default function SubpageGuard({ requiredAccess, children }: { requiredAccess: string; children: React.ReactNode }) {
    const { access } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!access.includes(requiredAccess)) {
            router.push("/dashboard");
        }
    }, [access, requiredAccess, router]);

    return <>{children}</>;
}
