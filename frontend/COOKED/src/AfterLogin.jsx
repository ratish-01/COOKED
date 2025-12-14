import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

export default function AfterLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        // Determine login status
        fetch(`${BACKEND_URL}/after-login`)
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    navigate("/dashboard");
                } else {
                    // If not logged in, go back home
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error("Auth check failed", err);
                navigate("/");
            });
    }, [navigate]);

    return (
        <div style={styles.container}>
            <h2 style={styles.text}>Finalizing Login...</h2>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0b",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
    },
    text: {
        fontSize: "1.5rem",
        animation: "pulse 1.5s infinite",
    },
};
