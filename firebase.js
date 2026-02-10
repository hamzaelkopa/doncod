import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

export const firebaseConfig = {
  apiKey: "PUT_YOUR_KEY",
  authDomain: "doncod-life.firebaseapp.com",
  projectId: "doncod-life",
  storageBucket: "doncod-life.appspot.com",
  messagingSenderId: "1014581889148",
  appId: "1:1014581889148:web:144b1024fd168b1ea621f9"
};

export const app = initializeApp(firebaseConfig);
