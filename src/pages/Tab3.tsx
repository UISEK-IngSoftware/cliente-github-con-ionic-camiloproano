import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { getUserInfo } from '../services/GithubService';
import { UserInfo } from '../interfaces/UserInfo';
import { useState } from 'react';
import './Tab3.css';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import AuthService from '../services/AuthService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const info = await getUserInfo();
      setUserInfo(info);
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });

  const handleLogout = () => {
    AuthService.logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de usuario</IonTitle>
          </IonToolbar>
        </IonHeader>

        {userInfo && (
          <IonCard>
            <img
              alt={userInfo.name}
              src={userInfo.avatar_url}
            />
            <IonCardHeader>
              <IonCardTitle>{userInfo.name}</IonCardTitle>
              <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {userInfo.bio}
            </IonCardContent>
          </IonCard>
        )}

        <IonButton
          expand="block"
          color="danger"
          onClick={handleLogout}
        >
          <IonIcon slot="start" icon={logOutOutline} />
          Cerrar sesión
        </IonButton>

        {/* LOADING */}
        <LoadingSpinner isOpen={loading} />
        
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
