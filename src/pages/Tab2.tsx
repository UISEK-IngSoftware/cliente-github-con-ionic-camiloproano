import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonTextarea,
  IonLoading,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router';
import './Tab2.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { createRepository } from '../services/GithubService';
import { useState } from 'react';

const Tab2: React.FC = () => {
  const history = useHistory();

  const [repoFormData, setRepoFormData] = useState<RepositoryItem>({
    name: '',
    description: '',
    imageUrl: null,
    owner: null,
    language: null,
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Función para actualizar el state dinámicamente
  const handleInputChange = (field: 'name' | 'description', value: string) => {
    setRepoFormData(prev => ({ ...prev, [field]: value }));
  };

  // Guardar repositorio
  const saveRepository = async () => {
    if (repoFormData.name.trim() === '') {
      setToastMessage('El nombre del repositorio es obligatorio.');
      setToastColor('danger');
      return;
    }

    try {
      setLoading(true);

      // Crear el repo (POST + PATCH en GithubService garantiza la descripción)
      await createRepository(repoFormData);

      setLoading(false);
      setToastMessage('Repositorio creado correctamente!');
      setToastColor('success');

      // Limpiar formulario
      setRepoFormData({
        name: '',
        description: '',
        imageUrl: null,
        owner: null,
        language: null,
      });

      // Redirigir a Tab1 después de mostrar el toast
      setTimeout(() => {
        history.push('/tab1');
      }, 1000);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setToastMessage('Ocurrió un error al crear el repositorio.');
      setToastColor('danger');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Crear repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Loading */}
        <IonLoading
          isOpen={loading}
          message="Creando repositorio..."
        />

        {/* Toast */}
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          onDidDismiss={() => setToastMessage('')}
        />

        <div className="form-container">
          <IonInput
            label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            className="form-field"
            value={repoFormData.name}
            onIonChange={(e) => handleInputChange('name', e.detail.value!)}
          />

          <IonTextarea
            label="Descripción del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Este es un repositorio de Android"
            className="form-field"
            value={repoFormData.description}
            onIonChange={(e) => handleInputChange('description', e.detail.value!)}
            rows={6}
          />

          <IonButton
            expand="block"
            className="form-field"
            onClick={saveRepository}
          >
            Guardar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
