import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/react';
import { MdRefresh, MdFavorite, MdLightbulb, MdStar, MdRocket, MdNature, MdPalette, MdMusicNote, MdBook, MdDirectionsRun, MdSunny, MdCloud, MdHeartBroken, MdThumbsUpDown, MdPublic, MdSchool, MdWork, MdRestaurant, MdLocalFlorist, MdPets, MdBeachAccess, MdNightlight, MdCake, MdFitnessCenter, MdTravelExplore, MdScience, MdComputer, MdBuild, MdColorLens } from "react-icons/md";
import { useSpring, animated, config } from '@react-spring/web';
import './../theme/variables.css';
import { LocalNotifications } from '@capacitor/local-notifications';

// JSON quemado con frases e íconos
const phrases = [
  { text: "La vida es una aventura, atrévete a vivirla.", icon: <MdRocket size={48} /> },
  { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", icon: <MdStar size={48} /> },
  { text: "La felicidad no es algo hecho. Viene de tus propias acciones.", icon: <MdSunny size={48} /> },
  { text: "No te rindas, comienza siempre con lo que tienes y donde estás.", icon: <MdDirectionsRun size={48} /> },
  { text: "El único límite para nuestros logros de mañana es nuestras dudas de hoy.", icon: <MdLightbulb size={48} /> },
  { text: "Cada día es una nueva oportunidad para cambiar tu vida.", icon: <MdSunny size={48} /> },
  { text: "La creatividad es la inteligencia divirtiéndose.", icon: <MdPalette size={48} /> },
  { text: "La música es el lenguaje del alma.", icon: <MdMusicNote size={48} /> },
  { text: "Un libro es un sueño que sostienes en tus manos.", icon: <MdBook size={48} /> },
  { text: "La naturaleza es la mejor maestra de la vida.", icon: <MdNature size={48} /> },
  { text: "El amor es la fuerza más poderosa del universo.", icon: <MdFavorite size={48} /> },
  { text: "La paciencia es la clave para alcanzar tus sueños.", icon: <MdCloud size={48} /> },
  { text: "El aprendizaje es un tesoro que sigue a su dueño toda la vida.", icon: <MdSchool size={48} /> },
  { text: "El trabajo duro siempre da sus frutos.", icon: <MdWork size={48} /> },
  { text: "La comida es el ingrediente que nos une a todos.", icon: <MdRestaurant size={48} /> },
  { text: "Las flores sonrisas de la tierra.", icon: <MdLocalFlorist size={48} /> },
  { text: "Los animales son ángeles con pelaje.", icon: <MdPets size={48} /> },
  { text: "El mar es el espejo del cielo.", icon: <MdBeachAccess size={48} /> },
  { text: "La noche esconde secretos que el día nunca conocerá.", icon: <MdNightlight size={48} /> },
  { text: "Celebra cada momento como si fuera tu cumpleaños.", icon: <MdCake size={48} /> },
  { text: "El ejercicio es la clave para una vida saludable.", icon: <MdFitnessCenter size={48} /> },
  { text: "Viajar es descubrir que todos están equivocados sobre otros países.", icon: <MdTravelExplore size={48} /> },
  { text: "La ciencia es la poesía de la realidad.", icon: <MdScience size={48} /> },
  { text: "La tecnología es el futuro en nuestras manos.", icon: <MdComputer size={48} /> },
  { text: "Construye tus sueños con tus propias manos.", icon: <MdBuild size={48} /> },
  { text: "El color es la sonrisa de la naturaleza.", icon: <MdColorLens size={48} /> },
  { text: "El mundo es un libro, y quienes no viajan leen solo una página.", icon: <MdPublic size={48} /> },
  { text: "La educación es el arma más poderosa para cambiar el mundo.", icon: <MdSchool size={48} /> },
  { text: "El amor propio es el primer paso hacia la felicidad.", icon: <MdHeartBroken size={48} /> },
  { text: "La vida es como una bicicleta, para mantener el equilibrio debes seguir adelante.", icon: <MdThumbsUpDown size={48} /> },
];

// Componente de animación de estrellitas
const StarAnimation = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Generar estrellitas aleatorias
    const newStars = Array.from({ length: 30 }).map((_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1, // Tamaño aleatorio entre 1 y 4
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.map((star) => (
        <animated.div
          key={star.id}
          style={{
            position: 'absolute',
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
            backgroundColor: '#ffeb3b',
            borderRadius: '50%',
            boxShadow: '0 0 10px #ffeb3b',
          }}
        />
      ))}
    </div>
  );
};

// 🔔 Función para obtener una frase aleatoria
const getRandomPhrase = () => phrases[Math.floor(Math.random() * phrases.length)].text;

// Notificaciones locales
const scheduleNotifications = async () => {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: "Frase Motivacional 💡",
        body: getRandomPhrase(),
        schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 6), repeats: true, every: 'hour', count: 6 },
      },
    ],
  });
};

const App: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);

  useEffect(() => {
    scheduleNotifications();
  }, []);

  const changePhrase = () => {
    let newPhrase;
    do {
      newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    } while (newPhrase.text === currentPhrase.text);
    setCurrentPhrase(newPhrase);
  };

  return (
    <IonApp>
      <IonPage style={{ backgroundColor: 'var(--ion-background-color)', position: 'relative' }}>
        <IonHeader>
          <IonToolbar style={{ backgroundColor: 'var(--ion-color-primary)' }}>
            <IonTitle style={{ color: 'var(--ion-color-primary-contrast)' }}>S3 t5 m1sm0</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard style={{ backgroundColor: 'var(--ion-card-background)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <IonCardHeader>
                <div style={{ marginBottom: '16px', color: 'var(--ion-color-primary)' }}>{currentPhrase.icon}</div>
                <IonCardSubtitle style={{ color: '#5a4a3b' }}>Frase del día</IonCardSubtitle>
                <IonCardTitle style={{ color: '#5a4a3b', fontSize: '1.2em' }}>{currentPhrase.text}</IonCardTitle>
              </IonCardHeader>
            </IonCard>
            <IonButton expand="full" onClick={changePhrase} style={{
              marginTop: '16px',
              backgroundColor: 'var(--ion-color-primary)',
              color: 'var(--ion-color-primary-contrast)'
            }}>
              <MdRefresh style={{ marginRight: '10px' }} />
              Cambiar Frase
            </IonButton>
        <IonContent className="ion-padding">
          {/* Estrellas en el fondo */}
          <StarAnimation />

          {/* Contenedor de la carta y el botón */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
            zIndex: 10, // Elevar por encima de las estrellas
          }}>
            
          </div>

        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default App;