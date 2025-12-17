import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonInput, IonTextarea } from '@ionic/react';
import { useHistory } from 'react-router';
import './Tab2.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { createRepository } from '../services/GithubService';

const Tab2: React.FC = () => {

  const history = useHistory();

  const repoFormData : RepositoryItem = {
    name: '',
    description: '',
    imageUrl: null,
    owner: null,
    language : null,
  }

  const setRepoName = (value: string) => {
    repoFormData.name = value;
  };

    const setRepoDescription = (value: string) => {
    repoFormData.description = value;
  };
  
const saveRepository = () => {
  if (repoFormData.name.trim() === '') {
    alert('El nombre del repositorio es obligatorio.');
    return;
  }
  createRepository(repoFormData)
  .then(() => { history.push('/tab1'); })
  .catch(() => {
    alert('Ocurrió un error al crear el repositorio.');
  });
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

        <div className="form-container">
          <IonInput label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            className="form-field"
            value={repoFormData.name}
            onIonChange={(e) => setRepoName(e.detail.value!)}
            ></IonInput>
          <IonTextarea
            label="Descripción del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Este es un repositorio de Android"
            className="form-field"
            value={repoFormData.description}
            onIonChange={(e) => setRepoDescription(e.detail.value!)}
            rows={6}
          ></IonTextarea>

          <IonButton expand="block" className="form-field" onClick={saveRepository}>
            Guardar
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
