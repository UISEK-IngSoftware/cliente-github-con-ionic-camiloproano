import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonToast, IonAlert, IonModal, IonButton, IonInput, IonIcon, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import { refreshOutline } from 'ionicons/icons';
import LoadingSpinner from '../components/LoadingSpinner';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, deleteRepository, updateRepository } from '../services/GithubService';

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
    if (loading) return; // evita doble carga

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
      setLoading(true); // spinner durante DELETE
      await deleteRepository(repoToDelete.owner, repoToDelete.name);
      setRepoToDelete(null);
      await loadRepos(); // recarga lista con spinner
    } catch {
      setError('Error al eliminar repositorio');
    } finally {
      setLoading(false); // spinner OFF
    }
  };

  // Guardar EDICIÓN
  const handleUpdate = async () => {
    if (!repoToEdit || !repoToEdit.owner) return;

    try {
      setLoading(true); // spinner durante UPDATE
      await updateRepository(
        repoToEdit.owner,
        repoToEdit.name,
        {
          name: newName,
          description: newDescription
        }
      );

      setRepoToEdit(null);
      await loadRepos(); // recarga lista con spinner
    } catch {
      setError('Error al actualizar repositorio');
    } finally {
      setLoading(false); // spinner OFF
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

          {/* Botón refrescar */}
          <IonButton slot="end" fill="clear" onClick={loadRepos}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Lista solo cuando NO está cargando */}
        {!loading && (
          <IonList>
            {repos.map((repo) => (
              <RepoItem
                key={repo.name} // key correcta
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
        )}

        {/* LOADING */}
        <LoadingSpinner isOpen={loading} />

        {/* ERROR */}
        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          color="danger"
          onDidDismiss={() => setError('')}
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