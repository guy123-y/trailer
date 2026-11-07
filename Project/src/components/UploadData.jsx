import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import data from '../data.js'; // ודא שהנתיב לקובץ הנתונים נכון
import { db } from '../firebase.js';
import { Navigate } from 'react-router-dom';

export default function UploadData() {

  async function uploadData() {
    try {
      for (const item of data) {
        await addDoc(collection(db, "travels"), item);
      }
      console.log("המידע עלה בהצלחה!");
      alert("כל הטיולים הועלו בהצלחה ל-Firestore!");
      Navigate('/');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>העלאת נתונים ראשוניים</h2>
      <button onClick={uploadData} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        לחץ כאן להעלאת הטיולים ל-Firestore
      </button>
    </div>
  );
}