import { useEffect, useState } from "react";
import { dbRequest, initSchema, pool } from "@/lib/db";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const [isAuthResolved, setIsAuthResolved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const resolveAuth = async () => {
            try {
                await initSchema();

                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");
                const storedUserId = sessionStorage.getItem("user_id");

                if (token) {
                    // Validate token
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

                            // Initialize user in database
                            const existingUser = await dbRequest("SELECT * FROM users WHERE id = $1", [userId]);
                            if (existingUser.length === 0) {
                                await dbRequest("INSERT INTO users (id) VALUES ($1)", [userId]);
                            }

                            // Remove token from URL
                            const newUrl = window.location.pathname + window.location.search.replace(/[?&]token=[^&]+/, '').replace(/^&/, '?');
                            window.history.replaceState({}, "", newUrl || "/");

                            setIsAuthResolved(true);
                            return;
                        }
                    }

                    // If token provided but invalid
                    window.location.href = "/token";
                    return;
                }

                if (storedUserId) {
                    setIsAuthResolved(true);
                    return;
                }

                // No token and no stored user_id
                window.location.href = "/token";
            } catch (err) {
                console.error("Auth error:", err);
                setError("Authentication failed. Please try again.");
            }
        };

        resolveAuth();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-background">
                <h2 className="text-xl font-heading text-destructive mb-4">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-primary text-white rounded-full shadow-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!isAuthResolved) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-heading text-lg animate-pulse">Entering your gently peaceful space...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
