import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonLoading } from "@ionic/react";
import { logoGithub } from "ionicons/icons";
import './Login.css';
import { useState } from "react";
import AuthService from "../services/AuthService";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !token) {
            setError('Por favor, ingrese usuario y token de Github.');
            return;
        }

        setLoading(true);
        const success = await AuthService.loginWithGithub(username, token);
        setLoading(false);

        if (success) {
            window.location.href = '/tab1';
        } else {
            setError('Usuario o token incorrecto. Verifique sus credenciales.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Iniciar sesión</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className='ion-padding'>
                <IonLoading
                    isOpen={loading}
                    message="Validando credenciales..."
                />

                <div className="login-container">
                    <IonIcon icon={logoGithub} className="login-logo"/>
                    <h1>Inicio de sesión a Github</h1>

                    <form className="login-form" onSubmit={handleLogin}>
                        <IonInput
                            className="login-field"
                            label="Usuario de Github"
                            labelPlacement="floating"
                            fill="outline"
                            type="text"
                            value={username}
                            onIonInput={e => setUsername(e.detail.value!)}
                            required
                        />
                        <IonInput
                            className="login-field"
                            label="Token de Github"
                            labelPlacement="floating"
                            fill="outline"
                            type="password"
                            value={token}
                            onIonInput={e => setToken(e.detail.value!)}
                            required
                        />

                        {error && (
                            <IonText color="danger" className="error-message">
                                {error}
                            </IonText>
                        )}

                        <IonButton expand="block" type="submit">
                            Iniciar sesión
                        </IonButton>

                        <IonText color="medium" className="login-hint">
                            <p>Ingresa tu usuario y tu token de Github</p>
                        </IonText>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
