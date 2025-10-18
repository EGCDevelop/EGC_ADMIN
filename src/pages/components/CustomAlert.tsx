import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import '../../styles/custom-alert.css';

interface Props {
    title: string;
    message: string;
    status?: "success" | "error" | "warning" | "info";
    onClose?: () => void;
}

export const CustomAlert = ({ title, message, status = "success", onClose }: Props) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const getStatusClasses = () => {
        switch (status) {
            case "success":
                return "alert-success";
            case "error":
                return "alert-error";
            case "info":
                return "alert-info";
            case "warning":
                return "alert-warning";
            default:
                return "alert-success";
        }
    }

    return (
        <div className={`container-custom-alert ${getStatusClasses()}`}>
            <FaTimes className="icon" onClick={onClose} />
            <strong>{title}</strong>
            <p>{message}</p>
        </div>
    )
}
