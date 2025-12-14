import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:5000";

export function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/logout`);
            navigate("/");
            toast.success("Disconnected successfully.");
        } catch (error) {
            console.error("Logout failed", error);
            toast.error("Logout failed. You're stuck here forever.");
        }
    };

    return logout;
}
