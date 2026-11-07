import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function RouteDetails() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [weather, setWeather] = useState(null);

  const coordinatesMap = {
    'גליל עליון': { lat: 33.0, lon: 35.5 },
    'גליל תחתון': { lat: 32.7, lon: 35.3 },
    'רמת הגולן': { lat: 33.1, lon: 35.7 },
    'רמת גן': { lat: 32.0, lon: 34.8 },
    'מדבר יהודה': { lat: 31.5, lon: 35.3 },
    'ים המלח': { lat: 31.3, lon: 35.4 },
    'הערבה': { lat: 30.5, lon: 35.1 },
    'הרי אילת': { lat: 29.5, lon: 34.9 }
  };

  useEffect(() => {
    async function fetchRoute() {
      try {
        const docRef = doc(db, "travels", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRoute(data);

          const placeName = data.place || 'רמת גן';

          if (coordinatesMap[placeName]) {
            const selectedCoords = coordinatesMap[placeName];
            getWeatherData(selectedCoords.lat, selectedCoords.lon);
          } else {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=1`)
              .then(res => res.json())
              .then(geoData => {
                if (geoData.results && geoData.results.length > 0) {
                  const lat = geoData.results[0].latitude;
                  const lon = geoData.results[0].longitude;
                  getWeatherData(lat, lon);
                } else {
                  getWeatherData(32.0, 34.8);
                }
              })
              .catch(() => {
                getWeatherData(32.0, 34.8);
              });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    function getWeatherData(lat, lon) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(weatherData => {
          if (weatherData.current_weather) {
            setWeather(weatherData.current_weather);
          }
        })
        .catch(err => console.error(err));
    }

    fetchRoute();
  }, [id]);

  if (!route) {
    return <div style={{ padding: '20px', direction: 'rtl', textAlign: 'right' }}>טוען פרטים...</div>;
  }

  const routeName = route.name || route.title || "מסלול ללא שם";
  const routePlace = route.place || "לא צוין";
  const routeCategory = route.category || "כללי";
  const routeDescription = route.description || "אין תיאור זמין למסלול זה.";

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', direction: 'rtl', textAlign: 'right' }}>
      <h2>{routeName}</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <img 
          src={route.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop"} 
          alt={routeName} 
          style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>

      <p><strong>אזור/מיקום:</strong> {routePlace}</p>
      <p><strong>סגנון:</strong> {routeCategory}</p>
      <p><strong>תשלום:</strong> {route.payment === 'free' ? 'חינם' : 'בתשלום'}</p>
      
      <div style={{ marginTop: '15px', lineHeight: '1.6' }}>
        <h3>סקירה נרחבת על המסלול:</h3>
        <p>{routeDescription}</p>
        <p>
          מסלול הטיול ב{routeName} מציע חוויית טיול ייחודית באזור {routePlace}. 
          המסלול מותאם במיוחד עבור טיולי {routeCategory} ומאפשר ליהנות מנופים מרשימים, פינות חמד לעצירה ומסלול הליכה נוח ומסודר.
          מומלץ להגיע מצוידים במים מספקים, נעלי הליכה נוחות וכובע.
        </p>
      </div>

      {weather && (
        <div style={{ background: '#eef2f5', padding: '12px', borderRadius: '6px', marginTop: '20px' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>מזג אוויר עדכני באזור {routePlace}:</h4>
          <p style={{ margin: '3px 0' }}><strong>טמפרטורה:</strong> {weather.temperature}°C</p>
        </div>
      )}

      <br />
      <Link to="/" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none', color: '#0066cc' }}>
        ← חזרה לדף הבית
      </Link>
    </div>
  );
}