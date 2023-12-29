 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 /* const firebaseConfig = {
   apiKey: "AIzaSyAgbOwN82nOnMm2TQtlAIEkObBbtaH9okw",
   authDomain: "ticketforce-87c1d.firebaseapp.com",
   projectId: "ticketforce-87c1d",
   storageBucket: "ticketforce-87c1d.appspot.com",
   messagingSenderId: "389530136369",
   appId: "1:389530136369:web:2bf5bdcc84ebbc86474a10"
 };
 */
 const firebaseConfig = {
  apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
  authDomain: "ticketforce-5ac87.firebaseapp.com",
  projectId: "ticketforce-5ac87",
  storageBucket: "ticketforce-5ac87.appspot.com",
  messagingSenderId: "185677887310",
  appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
};
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
// console.log("initialized firebase");

import {checkAuthState,userSignOut} from './auth.js';


checkAuthState();

const logoutButton = document.querySelector('#logoutButton');
const redirectButton = document.querySelector("#cancel");


  logoutButton.addEventListener('click', () => {
    userSignOut();
  });

  

  // Add an event listener to the button
  redirectButton.addEventListener("click", function () {
    window.location.href = "home.html";
  });

