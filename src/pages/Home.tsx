import React, { useState, useEffect } from 'react';
import { IonApp, IonPage, IonContent, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { MdRefresh, MdShuffle } from "react-icons/md";
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
          setCategory(initialCategory);
          setCurrentPhrase(getRandomPhrase(groupedData[initialCategory]));
        }

        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              id: 1,
              title: "Daily Affirmation 🌟",
              body: groupedData["ORDEN"]?.[0]?.text || "Start your day with positivity!",
              schedule: { 
                repeats: true,
                every: "day",
                at: new Date(new Date().setHours(9, 0, 0, 0))
              },
            }]
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
    if (!phrases?.length) return "";
    return phrases[Math.floor(Math.random() * phrases.length)].text;
  };

  const handleCategoryChange = (newCategory: Category) => {
    if (!phrasesData?.[newCategory]?.length) return;
    
    setCategory(newCategory);
    setCurrentPhrase(getRandomPhrase(phrasesData[newCategory]));
    setColors(getRandomColorPair());
  };

  const refreshPhrase = () => {
    if (!phrasesData?.[category]?.length) return;
    setCurrentPhrase(getRandomPhrase(phrasesData[category]));
    setColors(getRandomColorPair());
  };

  const shuffleCategory = () => {
    if (!shuffledCategories.length) return;
    const randomIndex = Math.floor(Math.random() * shuffledCategories.length);
    const randomCategory = shuffledCategories[randomIndex];
    handleCategoryChange(randomCategory);
  };

  const retryFetch = () => {
    setError("");
    setLoading(true);
//    fetchPhrases();
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
              
              <div style={{display: 'flex', gap: '1rem'}}>
              <IonSelect
                value={category}
                onIonChange={e => handleCategoryChange(e.detail.value)}
                interface="popover"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto',
                  borderRadius: '12px',
                  backgroundColor: `${colors.bgColor}30`,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.textColor}20`,
                  boxShadow: `0 4px 24px ${colors.textColor}10`,
                  transition: 'inherit'
                }}
              >
                {shuffledCategories.map((cat) => (
                  <IonSelectOption 
                    key={cat} 
                    value={cat}
                    style={{
                      backgroundColor: `${colors.textColor}10`,
                      margin: '4px',
                      borderRadius: '8px',
                      transition: 'inherit'
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonButton
              onClick={shuffleCategory}
              style={{
                '--background': `${colors.textColor}15`,
                '--color': colors.textColor,
                '--border-radius': '12px',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${colors.textColor}20`,
                boxShadow: `0 4px 24px ${colors.textColor}10`,
                transition: 'inherit',
                marginLeft: 'auto'
              }}
            >
              <MdShuffle style={{ 
                fontSize: '1.5rem',
                filter: `drop-shadow(0 2px 2px ${colors.textColor}30)`
              }} />
            </IonButton>
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