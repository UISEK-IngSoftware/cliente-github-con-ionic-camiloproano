import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonLoading, IonToast, IonAlert, IonModal, IonButton, IonInput, IonIcon, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import { refreshOutline } from 'ionicons/icons';

import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import {
  fetchRepositories,
  deleteRepository,
  updateRepository
} from '../services/GithubService';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // DELETE
  const [repoToDelete, setRepoToDelete] = useState<RepositoryItem | null>(null);

  // EDIT
  const [repoToEdit, setRepoToEdit] = useState<RepositoryItem | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Cargar repositorios
  const loadRepos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRepositories();
      setRepos(data);
    } catch {
      setError('Error al cargar repositorios');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar DELETE
  const confirmDelete = async () => {
    if (!repoToDelete || !repoToDelete.owner) return;

    try {
      await deleteRepository(repoToDelete.owner, repoToDelete.name);
      setRepoToDelete(null);
      loadRepos();
    } catch {
      setError('Error al eliminar repositorio');
    }
  };

  // Guardar EDICIÓN (nombre + descripción)
  const handleUpdate = async () => {
    if (!repoToEdit || !repoToEdit.owner) return;

    try {
      await updateRepository(
        repoToEdit.owner,
        repoToEdit.name,
        {
          name: newName,
          description: newDescription
        }
      );

      setRepoToEdit(null);
      loadRepos();
    } catch {
      setError('Error al actualizar repositorio');
    }
  };

  useIonViewDidEnter(() => {
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>

          {/* Botón de refrescar */}
          <IonButton slot="end" fill="clear" onClick={loadRepos}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {repos.map((repo, index) => (
            <RepoItem
              key={index}
              repo={repo}
              onDelete={() => setRepoToDelete(repo)}
              onEdit={() => {
                setRepoToEdit(repo);
                setNewName(repo.name);
                setNewDescription(repo.description || '');
              }}
            />
          ))}
        </IonList>

        {/* LOADING */}
        <IonLoading
          isOpen={loading}
          message="Cargando repositorios..."
        />

        {/* ERROR */}
        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          color="danger"
        />

        {/* CONFIRMAR DELETE */}
        <IonAlert
          isOpen={!!repoToDelete}
          header="Eliminar repositorio"
          message={`¿Deseas eliminar el repositorio "${repoToDelete?.name}"?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: confirmDelete
            }
          ]}
          onDidDismiss={() => setRepoToDelete(null)}
        />

        {/* MODAL EDITAR */}
        <IonModal
          isOpen={!!repoToEdit}
          onDidDismiss={() => setRepoToEdit(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar repositorio</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonInput
              label="Nombre del repositorio"
              labelPlacement="floating"
              value={newName}
              onIonInput={(e) => setNewName(e.detail.value!)}
            />

            <IonInput
              label="Descripción"
              labelPlacement="floating"
              value={newDescription}
              onIonInput={(e) => setNewDescription(e.detail.value!)}
            />

            <IonButton expand="block" onClick={handleUpdate}>
              Guardar cambios
            </IonButton>

            <IonButton
              expand="block"
              color="medium"
              onClick={() => setRepoToEdit(null)}
            >
              Cancelar
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
