import "@globals";
import Navbar from "@navbar";
import { AuthProvider } from "@auth";

export const metadata = {
    title: "Lion Parcel",
    description: "A Next.js app with login functionality",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground min-h-screen">
                <AuthProvider>
                    <Navbar />
                    <main className="container mx-auto px-4 py-6 bg-background">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
