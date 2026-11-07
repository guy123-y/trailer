import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useNavigate } from 'react-router-dom';

export default function AddRoute() {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('גליל עליון');
  const [customPlace, setCustomPlace] = useState('');
  const [category, setCategory] = useState('משפחתי');
  const [payment, setPayment] = useState('free');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const finalPlace = place === 'אחר' ? customPlace : place;

    try {
      await addDoc(collection(db, "travels"), {
        name,
        place: finalPlace,
        category,
        payment,
        description
      });

      alert("המסלול נוסף בהצלחה!");
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', direction: 'rtl', textAlign: 'right' }}>
      <h2>הוספת מסלול חדש</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>שם המסלול: </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label>אזור/מיקום: </label>
          <select 
            value={place} 
            onChange={(e) => setPlace(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="גליל עליון">גליל עליון</option>
            <option value="גליל תחתון">גליל תחתון</option>
            <option value="רמת הגולן">רמת הגולן</option>
            <option value="רמת גן">רמת גן</option>
            <option value="מדבר יהודה">מדבר יהודה</option>
            <option value="ים המלח">ים המלח</option>
            <option value="הערבה">הערבה</option>
            <option value="הרי אילת">הרי אילת</option>
            <option value="אחר">אחר (הקלד ידנית)</option>
          </select>

          {place === 'אחר' && (
            <input 
              type="text" 
              placeholder="הכנס שם עיר או אזור"
              value={customPlace} 
              onChange={(e) => setCustomPlace(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '8px', boxSizing: 'border-box' }}
            />
          )}
        </div>

        <div>
          <label>סגנון: </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
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
          <select 
            value={payment} 
            onChange={(e) => setPayment(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="free">חינם</option>
            <option value="paid">בתשלום</option>
          </select>
        </div>

        <div>
          <label>תיאור: </label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          שמור מסלול
        </button>
      </form>
    </div>
  );
}