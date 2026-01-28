import { IonSpinner } from "@ionic/react";
import "./loadingSpinner.css";

interface loadingSpinnerProps {
    isOpen: boolean;
}
const LoadingSpinner: React.FC<loadingSpinnerProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="loading-overlay">
            <IonSpinner name="crescent" color="primary" className="loading-spinner" />
        </div>
    );
}

export default LoadingSpinner;