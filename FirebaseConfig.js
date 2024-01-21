
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
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
     
     import { userSignIn} from './auth.js';
     import { getNameByUid,checkUserInCollection} from './firestore.js';
   
     
     // Now you can use these functions in your main.js file
     const signInButton = document.querySelector('#signInButton');
     const userEmailSignIn = document.querySelector("#userEmailSignIn");
     const userPasswordSignIn = document.querySelector("#userPasswordSignIn");
    
   
     signInButton.addEventListener('click', async () => {
       const signInEmail = userEmailSignIn.value;
       const signInPassword = userPasswordSignIn.value;
   
       try {
           const userCredential = await userSignIn(signInEmail, signInPassword);
           const user = userCredential.user;
   
           // Call the function to check if the user is in the 'admins' or 'cashiers' collection
           const isAdmin = await checkUserInCollection(user.uid, 'admins');
           const isCashier = await checkUserInCollection(user.uid, 'cashiers');
           getNameByUid(user.uid);
           // Redirect based on the collection
           if (isAdmin) {
            alert("Welcome!");
            window.location.href = "home.html";
                  } else if (isCashier) {
            alert("Cashiers are not allowed to access this page.");
            window.location.href = "index.html";
            // You can choose to handle the cashier case differently, e.g., show an error message.
                } else {
                    console.log("User not found in 'admins' or 'cashiers' collection.");
                    alert(" Warning! Enforcers are not allowed to access this site. Please use the app");
                    window.location.href = "index.html";
            // Handle the case where the user is not in either collection
        }    
       } catch (error) {
           const errorCode = error.code;
           const errorMessage = error.message;
           alert(errorCode, errorMessage);
           if (errorCode === "auth/invalid-email") {
               alert("Please enter a valid email");
           }
           else if (errorCode === "auth/invalid-login-credentials") {
               alert("You have entered a wrong email or password");
           } else {
               console.log("Error: " + errorMessage);
           }
       }
   });
   

   
const forgotPasswordSpan = document.getElementById('forgotPass');
forgotPasswordSpan.addEventListener('click', () => {
    alert('Please contact the moderator at renreal.dev@gmail.com ');
});