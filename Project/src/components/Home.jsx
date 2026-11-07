import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Link } from 'react-router-dom';

export default function Home() {
  const [travels, setTravels] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('הכל');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedPayment, setSelectedPayment] = useState('הכל');

  const namesTranslations = {
    'Masada': 'מצדה',
    'Mount Meron': 'הר מירון',
    'Ein Gedi': 'עין גדי',
    'Park Hayrkon': 'פארק הירקון',
    'Mount Arbel': 'הר ארבל',
    'Red Canyon': 'הקניון האדום',
    'Timna Park': 'פארק תמנע',
    'Nahal Prat': 'נחל פרת',
    'Nahal Snir': 'נחל שניר'
  };

  useEffect(() => {
    async function fetchTravels() {
      try {
        const querySnapshot = await getDocs(collection(db, "travels"));
        const travelsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTravels(travelsList);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTravels();
  }, []);

  async function handleDelete(id) {
    if (window.confirm("האם למחוק את המסלול?")) {
      try {
        await deleteDoc(doc(db, "travels", id));
        setTravels(travels.filter(item => item.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  }

  const filteredTravels = travels.filter((item) => {
    const itemPlace = item.place || item.location || 'הכל';
    const itemCategory = item.category || 'הכל';
    const itemPayment = item.payment || 'הכל';

    const matchPlace = selectedPlace === 'הכל' || itemPlace === selectedPlace;
    const matchCategory = selectedCategory === 'הכל' || itemCategory === selectedCategory;
    const matchPayment = selectedPayment === 'הכל' || itemPayment === selectedPayment;

    return matchPlace && matchCategory && matchPayment;
  });

  return (
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'right' }}>
      <h1>מאגר מסלולי הטיול</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#eef2f5', padding: '15px', borderRadius: '8px', flexWrap: 'wrap' }}>
        <div>
          <label>אזור: </label>
          <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)}>
            <option value="הכל">הכל</option>
            <option value="גליל עליון">גליל עליון</option>
            <option value="גליל תחתון">גליל תחתון</option>
            <option value="רמת הגולן">רמת הגולן</option>
            <option value="רמת גן">רמת גן</option>
            <option value="מדבר יהודה">מדבר יהודה</option>
            <option value="ים המלח">ים המלח</option>
            <option value="הערבה">הערבה</option>
            <option value="הרי אילת">הרי אילת</option>
          </select>
        </div>

        <div>
          <label>סגנון: </label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="הכל">הכל</option>
            <option value="משפחתי">משפחתי</option>
            <option value="מטיבי לכת">מטיבי לכת</option>
            <option value="טבע">טבע</option>
            <option value="אתגרי">אתגרי</option>
            <option value="היסטוריה">היסטוריה</option>
            <option value="מים">מים</option>
          </select>
        </div>

        <div>
          <label>תשלום: </label>
          <select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
            <option value="הכל">הכל</option>
            <option value="free">חינם</option>
            <option value="paid">בתשלום</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {filteredTravels.map((item) => {
          const rawName = item.name || item.title || "מסלול ללא שם";
          const title = namesTranslations[rawName] || rawName;
          const place = item.place || item.location || "לא צוין";
          const category = item.category || "כללי";

          return (
            <div 
              key={item.id} 
              style={{ 
                border: '1px solid #ccc', 
                padding: '15px', 
                borderRadius: '8px', 
                width: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3>{title}</h3>
                <p><strong>מיקום:</strong> {place}</p>
                <p><strong>סגנון:</strong> {category}</p>
                <p><strong>תשלום:</strong> {item.payment === 'free' ? 'חינם' : 'בתשלום'}</p>
                <p>{item.description}</p>
                
                <Link to={`/route/${item.id}`} style={{ color: '#0066cc', textDecoration: 'none', display: 'block', marginTop: '10px' }}>
                  לפרטים נוספים ←
                </Link>
              </div>

              <button 
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                מחק מסלול
              </button>
            </div>
          );
        })}
      </div>

      {filteredTravels.length === 0 && (
        <p style={{ marginTop: '20px', color: '#666' }}>
          לא נמצאו מסלולים התואמים את הסינון שנבחר.
        </p>
      )}
    </div>
  );
}