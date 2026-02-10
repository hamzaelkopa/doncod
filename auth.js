import { app } from "./firebase.js";

import {
 getAuth,
 GoogleAuthProvider,
 signInWithPopup,
 signOut,
 onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");

loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, user=>{
 if(user){
   window.currentUser = user;
   userBox.textContent = user.displayName;
 } else {
   window.currentUser = null;
   userBox.textContent = "غير مسجل";
 }
});
