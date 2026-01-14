import { IonItem, IonLabel, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { trashOutline, createOutline } from 'ionicons/icons';
import { RepositoryItem } from '../interfaces/RepositoryItem';

interface Props {
  repo: RepositoryItem;
  onDelete: () => void;
  onEdit: () => void;
}

const RepoItem: React.FC<Props> = ({ repo, onDelete, onEdit }) => {
  return (
    <IonItemSliding>
      <IonItem button>
        <IonThumbnail slot="start">
          <img
            src={repo.imageUrl || 'https://via.placeholder.com/100'}
            alt={repo.name}
          />
        </IonThumbnail>

        <IonLabel>
          <h2>{repo.name}</h2>
          <p>{repo.description}</p>
          <p>Lenguaje: {repo.language}</p>
        </IonLabel>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="warning" onClick={onEdit}>
          <IonIcon slot="icon-only" icon={createOutline} />
        </IonItemOption>

        <IonItemOption color="danger" onClick={onDelete}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default RepoItem;


