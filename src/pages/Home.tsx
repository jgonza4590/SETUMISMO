import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonContent, IonButton, IonSelect, IonSelectOption, IonToggle, IonLabel, isPlatform } from '@ionic/react';
import { MdRefresh } from "react-icons/md";
import { LocalNotifications } from '@capacitor/local-notifications';
import axios from 'axios';
import Papa from 'papaparse';
import './../theme/variables.css';

type Category = string;
type Phrase = { text: string };
type PhrasesData = Record<Category, Phrase[]>;

const shuffleArray = <T,>(array: T[]): T[] => {
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
  const [error, setError] = useState("");
  const [randomMode, setRandomMode] = useState(false);

  // Configurar canal de notificaciones
  useEffect(() => {
    const setupNotificationChannels = async () => {
      await LocalNotifications.createChannel({
        id: 'affirmations_channel',
        name: 'Afirmaciones',
        description: 'Notificaciones de afirmaciones diarias',
        importance: 4,
        visibility: 1,
        vibration: true,
        lights: true,
        ...(isPlatform('android') && {
          style: {
            type: 'media'
          }
        })
      });
    };
    
    setupNotificationChannels();
  }, []);

  const scheduleSpotifyLikeNotification = async (phrase: string, schedule?: any) => {
    const permission = await LocalNotifications.requestPermissions();
    
    if (permission.display === 'granted') {
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title: "🌟 Nueva Afirmación",
          body: phrase,
          summaryText: "Toca para más detalles",
          largeBody: `${phrase}\n\n✨ Mantén tu motivación alta!`,
          extra: { phrase },
          channelId: 'affirmations_channel',
          threadIdentifier: 'daily-affirmations',
          schedule
        }]
      });
    }
  };

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

        const groupedData = parsed.data.reduce((acc: PhrasesData, row) => {
          const cat = row.category?.trim().toUpperCase();
          const text = row.text?.trim();
          if (cat && text) {
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ text });
          }
          return acc;
        }, {});

        const categories = Object.keys(groupedData);
        const shuffled = shuffleArray(categories);
        
        setPhrasesData(groupedData);
        setShuffledCategories(shuffled);
        setLoading(false);

        if (shuffled.length > 0) {
          const initialCategory = shuffled[0];
          const initialPhrase = getRandomPhrase(groupedData[initialCategory]);
          setCategory(initialCategory);
          setCurrentPhrase(initialPhrase);
          
          // Programar notificación diaria
          scheduleSpotifyLikeNotification(initialPhrase, {
            repeats: true,
            every: "day",
            at: new Date(new Date().setHours(9, 0, 0, 0))
          });
        }
      } catch (err) {
        console.error("Error loading phrases:", err);
        setError("Error loading data. Please try again.");
        setLoading(false);
      }
    };

    fetchPhrases();
  }, []);

  const getRandomPhrase = (phrases: Phrase[]) => {
    return phrases?.[Math.floor(Math.random() * phrases.length)]?.text || "";
  };

  const handleCategoryChange = (newCategory: Category) => {
    if (!phrasesData?.[newCategory]) return;
    
    const newPhrase = getRandomPhrase(phrasesData[newCategory]);
    setCategory(newCategory);
    setCurrentPhrase(newPhrase);
    setColors(getRandomColorPair());
  };

  const refreshPhrase = () => {
    if (!phrasesData) return;
    
    let newPhrase = "";
    if (randomMode) {
      const randomCategory = shuffledCategories[Math.floor(Math.random() * shuffledCategories.length)];
      newPhrase = getRandomPhrase(phrasesData[randomCategory]);
      setCategory(randomCategory);
    } else {
      newPhrase = getRandomPhrase(phrasesData[category]);
    }
    
    if (newPhrase) {
      setCurrentPhrase(newPhrase);
      setColors(getRandomColorPair());
    }
  };

  const retryFetch = () => {
    setError("");
    setLoading(true);
  };

  return (
    <IonApp>
      <IonPage>
        <IonContent
          style={{ 
            backgroundColor: colors.bgColor,
            color: colors.textColor,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Lexend Deca', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100vh',
            '--ion-text-color': colors.textColor,
            padding: '1rem'
          }}
        >
          {error ? (
            <div style={{ 
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '16px',
              backgroundColor: `${colors.textColor}15`,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${colors.textColor}20`,
              margin: '1rem',
              boxShadow: `0 4px 24px ${colors.textColor}15`
            }}>
              <p style={{ margin: '0 0 1.5rem' }}>{error}</p>
              <IonButton 
                onClick={retryFetch}
                style={{
                  '--background': `${colors.textColor}20`,
                  '--color': colors.textColor,
                  '--border-radius': '8px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Try Again
              </IonButton>
            </div>
          ) : loading ? (
            <div style={{ 
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '16px',
              backgroundColor: `${colors.textColor}10`,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${colors.textColor}15`,
              margin: '1rem',
              boxShadow: `0 4px 24px ${colors.textColor}10`
            }}>
              Loading Affirmations...
            </div>
          ) : (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '1rem'
            }}>
              
              <div style={{
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <IonSelect
                  value={category}
                  onIonChange={e => handleCategoryChange(e.detail.value)}
                  interface="popover"
                >
                  {shuffledCategories.map((cat) => (
                    <IonSelectOption 
                      key={cat} 
                      value={cat}
                      style={{
                        backgroundColor: `${colors.textColor}`,
                        margin: '4px',
                        borderRadius: '8px',
                        transition: 'inherit'
                      }}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '12px',
                  backgroundColor: `${colors.textColor}15`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.textColor}20`,
                  boxShadow: `0 4px 24px ${colors.textColor}10`
                }}>
                  <IonLabel style={{ fontSize: '0.85rem' }}></IonLabel>
                  <IonToggle 
                    checked={randomMode}
                    onIonChange={e => setRandomMode(e.detail.checked)}
                    style={{
                      '--handle-background-checked': colors.textColor,
                      '--background-checked': `${colors.textColor}30`,
                      '--background': `${colors.textColor}15`
                    }}
                  />
                </div>
              </div>

              <div style={{
                minHeight: '400px',
                padding: '2.5rem',
                borderRadius: '24px',
                backgroundColor: `${colors.bgColor}50`,
                backdropFilter: 'blur(16px)',
                border: `1px solid ${colors.textColor}20`,
                boxShadow: `0 8px 48px ${colors.textColor}15`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'inherit'
              }}>
                <h1 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  lineHeight: '1.4',
                  margin: 0,
                  fontWeight: 600,
                  fontFamily: 'system-ui',
                  textShadow: `0 2px 8px ${colors.textColor}25`,
                  transition: 'inherit'
                }}>
                  {currentPhrase.toUpperCase()}
                </h1>
              </div>

              <IonButton
                onClick={refreshPhrase}
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  margin: '0 auto',
                  '--background': `${colors.textColor}15`,
                  '--color': colors.textColor,
                  '--border-radius': '12px',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.textColor}20`,
                  boxShadow: `0 4px 24px ${colors.textColor}10`,
                  transition: 'inherit'
                }}
              >
                <MdRefresh style={{ 
                  fontSize: '1.75rem',
                  filter: `drop-shadow(0 2px 2px ${colors.textColor}30)`
                }} />
              </IonButton>
            </div>
          )}
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default App;