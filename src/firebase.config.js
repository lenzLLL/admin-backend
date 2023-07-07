// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAXLTDi_0ek3hACdPtMqyqzvOTInIy3dI",
  authDomain: "commune1-eb9ef.firebaseapp.com",
  projectId: "commune1-eb9ef",
  storageBucket: "commune1-eb9ef.appspot.com",
  messagingSenderId: "740557356257",
  appId: "1:740557356257:web:57b8a35f7610c5ad3b4ba0",
  measurementId: "G-MPPLE5CR5R"
};
// Initialize Firebase


const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const storage = getStorage(app)

 export {app,firestore,storage}