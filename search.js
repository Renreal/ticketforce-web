 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 /* // Your web app's Firebase configuration
 const firebaseConfig = {
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

/// Import Firestore functions from Firebase Firestore
import { getFirestore, query, where, getDocs, collection} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Initialize Firebase Firestore
const db = getFirestore(app);



//for search function

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Function to search for enforcers by ID or firstname
const searchEnforcers = async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    

    // Clear previous search results
    searchResults.innerHTML = '';

    if (!searchTerm) {
        // Handle the case when the search term is empty
        searchResults.innerHTML = '';
        return;
    }

    const enforcersCollection = collection(db, "enforcers");
    const q1 = query(enforcersCollection, where("ID", ">=", searchTerm), where("ID", "<=", searchTerm + "\uf8ff"));
    const q2 = query(enforcersCollection, where("firstname", ">=", searchTerm), where("firstname", "<=", searchTerm + "\uf8ff"));

    const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    const uniqueResults = new Set(); // Use a Set to store unique results

    querySnapshot1.forEach((doc) => {
        const data = doc.data();
        if (!uniqueResults.has(data.ID)) {
            uniqueResults.add(data.ID);
            displayResult(data);
        }
    });

    querySnapshot2.forEach((doc) => {
        const data = doc.data();
        if (!uniqueResults.has(data.ID)) {
            uniqueResults.add(data.ID);
            displayResult(data);
        }
    });

    if (uniqueResults.size === 0) {
        // Display a message if no results are found
        searchResults.innerHTML = "No matching enforcers found.";
    }
}

function displayResult(data) {
    const resultElement = document.createElement("div");
    resultElement.innerHTML = ` 
        <img src="${data.imageDownloadURL}" alt="Enforcer Image" width="100"><br>
        <p>Name: ${data.firstname} ${data.lastname} </p>
        <p>ID No.: ${data.ID}</p>
        <div class="divider">
        <button class="viewBtn" data-id="${data.ID}">MODIFY</button>
        <button class="btnDelete" data-id="${data.ID}">DELETE</button>    
        </div>
        
    `;
    searchResults.appendChild(resultElement);
}




searchResults.addEventListener("click", (e) => {
    if (e.target.classList.contains("viewBtn")) {
        const id = e.target.getAttribute("data-id");
        
        // Redirect to enforcerProfile.html with the ID as a query parameter
        window.location.href = `enforcerProfile.html?id=${id}`;
    }
});



  


searchInput.addEventListener("input", searchEnforcers);