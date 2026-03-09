import { useEffect, useState } from "react";
import { dbRequest, initSchema } from "@/lib/db";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const [isAuthResolved, setIsAuthResolved] = useState(false);
    const [status, setStatus] = useState<string>("Authenticating...");

    useEffect(() => {
        const resolveAuth = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");
            const storedUserId = sessionStorage.getItem("user_id");

            try {
                if (token) {
                    setStatus("Validating handshake...");
                    const response = await fetch("https://api.mantracare.com/user/user-info", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const userId = data.user_id;

                        if (userId) {
                            sessionStorage.setItem("user_id", userId.toString());

                            // Handle database initialization in the background
                            setStatus("Syncing peaceful space...");
                            try {
                                await initSchema();
                                const existingUser = await dbRequest("SELECT * FROM users WHERE id = $1", [userId]);
                                if (existingUser && existingUser.length === 0) {
                                    await dbRequest("INSERT INTO users (id) VALUES ($1)", [userId]);
                                }
                            } catch (dbErr) {
                                console.warn("Database initialization skipped or failed:", dbErr);
                            }

                            // Clean URL
                            const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]+/, '').replace(/^&/, '?');
                            window.history.replaceState({}, "", newUrl || "/");

                            setIsAuthResolved(true);
                            return;
                        }
                    }
                    console.error("Token validation failed");
                    window.location.href = "/token";
                    return;
                }

                if (storedUserId) {
                    setIsAuthResolved(true);
                    // Ensure the user exists in DB as well to prevent FK constraint issues
                    initSchema().then(async () => {
                        try {
                            const res = await dbRequest("SELECT * FROM users WHERE id = $1", [storedUserId]);
                            if (res && res.length === 0) {
                                await dbRequest("INSERT INTO users (id) VALUES ($1)", [storedUserId]);
                            }
                        } catch (e) {
                            console.warn("DB user sync skipped:", e);
                        }
                    }).catch(() => { });
                    return;
                }

                window.location.href = "/token";
            } catch (err) {
                console.error("Auth process error:", err);
                setStatus("Handshake failed. Redirecting...");
                setTimeout(() => {
                    window.location.href = "/token";
                }, 2000);
            }
        };

        resolveAuth();
    }, []);

    if (!isAuthResolved) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-heading text-lg animate-pulse">{status}</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
