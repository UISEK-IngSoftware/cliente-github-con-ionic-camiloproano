import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import RepoItem from '../components/RepoItem';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <RepoItem
            name="android-project"
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/3/3e/Android_logo_2019.png"
          />
          <RepoItem
            name="ios-project"
            imageUrl="https://static.vecteezy.com/system/resources/thumbnails/021/496/368/small_2x/ios-icon-logo-software-phone-apple-symbol-with-name-black-design-mobile-illustration-free-vector.jpg"
          />
          <RepoItem
            name="ionic-project"
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ionic_Logo.svg/1280px-Ionic_Logo.svg.png"
          />  
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
