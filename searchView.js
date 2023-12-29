//clone of modify.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, query, where, getDocs, collection,doc,updateDoc} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
/* 
const firebaseConfig = {
  apiKey: "AIzaSyAgbOwN82nOnMm2TQtlAIEkObBbtaH9okw",
  authDomain: "ticketforce-87c1d.firebaseapp.com",
  projectId: "ticketforce-87c1d",
  storageBucket: "ticketforce-87c1d.appspot.com",
  messagingSenderId: "389530136369",
  appId: "1:389530136369:web:2bf5bdcc84ebbc86474a10"
}; */


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
const db = getFirestore(app);
const storage = getStorage(app);

  




 // Retrieve the ID from the query parameter
 const urlParams = new URLSearchParams(window.location.search);
 const id = urlParams.get("id");

 function newfetchDataById(id) {
    const enforcersCollection = collection(db, "enforcers");
    const q = query(enforcersCollection, where("ID", "==", id));

    // Use getDocs to retrieve the data based on the query
    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const associatedData = doc.data();
                    const firstname = associatedData.firstname;
                    const lastname = associatedData.lastname;
                    const imageDownloadURL = associatedData.imageDownloadURL;
                    const address = associatedData.address;
                    const contact = associatedData.contactNo;
                    const location = associatedData.location;
                   
                    // Set the values in the HTML input fields
                    document.getElementById("firstname").value = firstname;
                    document.getElementById("lastname").value = lastname;
                    document.getElementById("contactNo").value = contact;
                    document.getElementById("address").value = address;
                    document.getElementById("ID").value = id;
                    document.getElementById("location").value = location;
                    document.getElementById("uploadedImage").src = imageDownloadURL;
                    // Set the text content for the <p> elements
                    document.getElementById("displayFirstName").textContent = "Name: " + firstname +" "+ lastname;
                    document.getElementById("displayID").textContent = "ID No.: " + id;

                });
            } else {
                console.log("Associated data not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching associated data:", error);
        });
}

 if (id) {
    
     newfetchDataById(id);
 }


    const fileInput = document.getElementById("fileInput");
    const uploadedImage = document.getElementById("uploadedImage");


    // Add an event listener to the file input
    fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
        // Display the selected image immediately
        const reader = new FileReader();
        reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    });





  
