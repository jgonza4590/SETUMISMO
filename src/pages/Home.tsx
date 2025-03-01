import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { MdRefresh } from "react-icons/md";
import { LocalNotifications } from '@capacitor/local-notifications';
import axios from 'axios';
import Papa from 'papaparse';
import './../theme/variables.css';

type Category = string;
type Phrase = { text: string };
type PhrasesData = Record<Category, Phrase[]>;

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getRandomColorPair = () => {
  const hue = Math.floor(Math.random() * 360);
  const variations = [
    { bg: [85, 95], text: [25, 35] },
    { bg: [20, 30], text: [85, 95] },
    { bg: [90, 95], text: [40, 50] },
    { bg: [95, 98], text: [20, 30] },
    { bg: [80, 90], text: [30, 40] },
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

const App: React.FC = () => {
  const [category, setCategory] = useState<Category>("");
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [colors, setColors] = useState(getRandomColorPair());
  const [phrasesData, setPhrasesData] = useState<PhrasesData | null>(null);
  const [shuffledCategories, setShuffledCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        const response = await axios.get(
          'https://docs.google.com/spreadsheets/d/1bnVyeB7JjPvfQ_IX74LeQ6mnBOEHaIJjkLfFU9Dyeck/export?format=csv'
        );

        const parsed = Papa.parse<{ category: string; text: string }>(response.data, {
          header: true,
          skipEmptyLines: true,
        });

        const groupedData = parsed.data.reduce((acc: PhrasesData, row: { category: string; text: string }) => {
          const cat = row.category?.toUpperCase()?.trim();
          const text = row.text?.trim();
          if (cat && text) {
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ text });
          }
          return acc;
        }, {} as PhrasesData);

        const categories = Object.keys(groupedData);
        const shuffled = shuffleArray(categories);
        
        setPhrasesData(groupedData);
        setShuffledCategories(shuffled);
        setLoading(false);

        if (shuffled.length > 0) {
          const initialCategory = shuffled[0];
          setCategory(initialCategory);
          setCurrentPhrase(getRandomPhrase(groupedData[initialCategory]));
        }

        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              id: 1,
              title: "Holi 💡",
              body: ":) " + (groupedData["ORDEN"]?.[0]?.text || "Positive affirmation"),
              schedule: { repeats: true, every: "day", at: new Date(Date.now() + 1000 * 60 * 60) },
            }]
          });
        }
      } catch (error) {
        console.error("Error loading phrases:", error);
        setLoading(false);
      }
    };

    fetchPhrases();
  }, []);

  const getRandomPhrase = (phrases: Phrase[]) => 
    phrases[Math.floor(Math.random() * phrases.length)]?.text || "";

  const updateColors = () => {
    setColors(getRandomColorPair());
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    if (phrasesData && phrasesData[newCategory]) {
      setCurrentPhrase(getRandomPhrase(phrasesData[newCategory]));
      updateColors();
    }
  };

  const refreshPhrase = () => {
    if (!phrasesData || !phrasesData[category]) return;
    setCurrentPhrase(getRandomPhrase(phrasesData[category]));
    updateColors();
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center" style={{
              color: 'lightgray',
              marginTop: '30px',
              fontWeight: 600
            }}></IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'gray' }}>
              Cargando afirmaciones...
            </div>
          ) : phrasesData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <IonSelect
                value={category}
                onIonChange={e => handleCategoryChange(e.detail.value)}
                interface="popover"
                style={{
                  maxWidth: '300px',
                  backgroundColor: '#455269bc',
                  borderRadius: '8px',
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                {shuffledCategories.map((cat) => (
                  <IonSelectOption key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                  </IonSelectOption>
                ))}
              </IonSelect>

              <div style={{
                minHeight: '450px',
                margin: '0 20px',
                padding: '25px',
                backgroundColor: colors.bgColor,
                borderRadius: '20px',
                boxShadow: `0 8px 32px ${colors.textColor}20`,
                transition: 'all 0.6s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontSize: '2rem',
                  lineHeight: '1.4',
                  color: colors.textColor,
                  margin: 0,
                  fontWeight: 600,
                  fontFamily: 'system-ui',
                  textShadow: `0 2px 4px ${colors.textColor}10`
                }}>
                  {currentPhrase.toUpperCase()}
                </h1>
              </div>

              <IonButton
                onClick={refreshPhrase}
                style={{
                  maxWidth: '300px',
                  margin: '0 auto',
                  '--background': '#515d75',
                  '--border-radius': '12px'
                }}
              >
                <MdRefresh style={{ fontSize: '1.5rem' }} />
              </IonButton>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'red' }}>
              Error cargando datos. Por favor intenta nuevamente.
            </div>
          )}
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default App;