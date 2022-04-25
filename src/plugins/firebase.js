import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAJFFCEXx2bdZAZEaeaIJAETCsgBMUszqk",
  authDomain: "vaccineschedule-nemo.firebaseapp.com",
  databaseURL: "https://vaccineschedule-nemo-default-rtdb.firebaseio.com",
  projectId: "vaccineschedule-nemo",
  storageBucket: "vaccineschedule-nemo.appspot.com",
  messagingSenderId: "589205173449",
  appId: "1:589205173449:web:ea83fd3622619104e9c918",
  measurementId: "G-GMCN8XSNPZ",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default database;
