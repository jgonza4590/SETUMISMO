import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { MdRefresh } from "react-icons/md";
import { LocalNotifications } from '@capacitor/local-notifications';
import './../theme/variables.css';

// Define type for categories
type Category = keyof typeof phrases;

// Frases categorizadas
const phrases = {
trae aca las frases desde google sheets con axius es un csv que esta en https://docs.google.com/spreadsheets/d/1bnVyeB7JjPvfQ_IX74LeQ6mnBOEHaIJjkLfFU9Dyeck/edit?usp=sharing
} as const;

// Función para generar colores aesthetic
const getRandomColorPair = () => {
  const hue = Math.floor(Math.random() * 360); // Rango completo de tonos
  const variations = [
    { bg: [85, 95], text: [25, 35] },   // Pastel claro + oscuro
    { bg: [20, 30], text: [85, 95] },   // Oscuro + pastel claro
    { bg: [90, 95], text: [40, 50] },   // Blanco roto + colores terrosos
    { bg: [95, 98], text: [20, 30] },   // Casi blanco + tono oscuro
    { bg: [80, 90], text: [30, 40] },   // Pastel medio + tono medio
  ];

  const variation = variations[Math.floor(Math.random() * variations.length)];

  return {
    bgColor: `hsla(
      ${hue},
      ${30 + Math.floor(Math.random() * 20)}%,
      ${variation.bg[0] + Math.floor(Math.random() * (variation.bg[1] - variation.bg[0]))}%,
      0.97
    )`,
    textColor: `hsl(
      ${hue + (Math.random() > 0.5 ? 180 : 0)},
      ${60 + Math.floor(Math.random() * 30)}%,
      ${variation.text[0] + Math.floor(Math.random() * (variation.text[1] - variation.text[0]))}%
    )`
  };
};

type PhraseText = typeof phrases[keyof typeof phrases][number]['text'];

const App: React.FC = () => {
  const [category, setCategory] = useState<Category>("ORDEN");
  const [currentPhrase, setCurrentPhrase] = useState<PhraseText>(phrases[category][0].text);
  const [colors, setColors] = useState(getRandomColorPair());

  useEffect(() => {
    scheduleNotifications();
  }, []);

  // Función para actualizar colores
  const updateColors = () => {
    setColors(getRandomColorPair());
  };

  const changePhrase = () => {
    const categoryPhrases = phrases[category];
    const newPhrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)].text as PhraseText;
    setCurrentPhrase(newPhrase);
    updateColors();
  };

  // Actualizar colores al cambiar categoría
  useEffect(() => {
    const categoryPhrases = phrases[category];
    const newPhrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)].text as PhraseText;
    setCurrentPhrase(newPhrase);
    updateColors();
  }, [category]);

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center" style={{
              color: 'lightgray',
              marginTop: '30px',
            }}> MIS AFIRMACIONES</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', allignItems: 'center', height: '100vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Selector de categoría */}
            <IonSelect
              value={category}
              onIonChange={(e) => setCategory(e.detail.value as Category)}
              interface="popover"
              style={{
                maxWidth: '300px',
                backgroundColor: '#455269bc',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {(Object.keys(phrases) as Category[]).map((cat) => (
                <IonSelectOption key={cat} value={cat} style={{ textAlign: 'center' }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>

            {/* Tarjeta de frase */}
            <div style={{
              minHeight: '450px',
              margin: '20px',
              padding: '25px',
              backgroundColor: colors.bgColor,
              borderRadius: '20px',
              boxShadow: `0 8px 32px ${colors.textColor}20`,
              transition: 'all 0.6s ease',
              backdropFilter: 'blur(4px)',
              border: `1px solid ${colors.textColor}20`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center' // Asegura que el texto se centre horizontalmente
            }}>
              <h1 style={{
                fontSize: '2rem',
                lineHeight: '1.4',
                color: colors.textColor,
                margin: 0,
                fontWeight: 600,
                transition: 'all 0.6s ease',
                fontFamily: 'system-ui',
                textShadow: `0 2px 4px ${colors.textColor}10`
              }}>
                {currentPhrase.toUpperCase()}
              </h1>
            </div>

            {/* Botón de actualización */}
            <IonButton
              expand="block"
              onClick={changePhrase}
              style={{
                maxWidth: '300px',
                margin: '0px auto',
                padding: '10px',
                fontSize: '1.1rem',
              }}
            >
              <MdRefresh style={{ marginRight: '0px', fontSize: '1.5rem' }} />
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </IonApp>);
};

const scheduleNotifications = async () => {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  await LocalNotifications.schedule({
    notifications: [{
      id: 1,
      title: "Holi 💡",
      body: ":) " + phrases["ORDEN"][0].text,
      schedule: { repeats: true, every: "minute", count: 5 }, // Se repetirá 5 veces cada minuto
    }],
  });
};


export default App;
