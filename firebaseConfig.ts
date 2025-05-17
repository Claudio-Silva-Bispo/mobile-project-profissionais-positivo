import { initializeApp } from "firebase/app"; // Instalar npm install firebase
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBak2VrKCUU-jyvwbQIHib7PInRH5l0AtQ",
  authDomain: "profissionais-positivo.firebaseapp.com",
  projectId: "profissionais-positivo",
  storageBucket: "profissionais-positivo.firebasestorage.app",
  messagingSenderId: "1060470286139",
  appId: "1:1060470286139:web:b887e140cbb95fbe75b91e",
  measurementId: "G-HT8DDP349P"
};

// Inicializa o Firebase
console.log("Inicializando Firebase para iniciar os trabalhos...");
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export default app;