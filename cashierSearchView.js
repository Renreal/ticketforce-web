// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

// Initialize Firebase Firestore
const db = getFirestore(app);

const searchInput = document.getElementById("searchInput");



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
const enforcersCollection = collection(db, "Drivers");

    const q3 = query(
        enforcersCollection,
        where("fname", ">=", searchTerm),
        where("fname", "<=", searchTerm + "\uf8ff")
      );
      
      getDocs(q3)
        .then((querySnapshot) => {
          const results = [];
      
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });
      
          // Now, use array-contains-any to filter the results further
          const filteredResults = results.filter((result) => {
            return result.fname.includes(searchTerm);
          });
      
          // Log the filtered results to console
          console.clear();
          filteredResults.forEach((result) => {
            console.log(result.fname, result.lname);
            console.log(result);
          });
          
        })
        .catch((error) => {
          console.error("Error searching enforcers:", error);
        });
        

    const q1 = query(enforcersCollection, where("fname", ">=", searchTerm), where("fname", "<=", searchTerm + "\uf8ff"));
    const q2 = query(enforcersCollection, where("license", ">=", searchTerm), where("license", "<=", searchTerm + "\uf8ff"));

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
        <img src="${data.profilePicture}" alt="Enforcer Image" width="100"><br>
        <p>Name: ${data.fname} ${data.lname} </p>
        <p>ID No.: ${data.license}</p>
        <button class="view-button">VIEW</button>
    `;
    searchResults.appendChild(resultElement);
}

// Trigger the search function on the "input" event
searchInput.addEventListener("input", searchEnforcers);


searchResults.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-button")) {
      document.querySelector('.registerWrapper').style.display = 'none';
      document.querySelector('.vioContainer').style.display = 'block';
    
       // Get the name from the clicked result
       const name = `${data.fname} ${data.lname}`;

       // Update the name in the vHeader
       const vHeaderName = vioRecordsContainer.querySelector('.vHeader .name');
       vHeaderName.textContent = name;
  }
});

// Add an event listener to the "X" span inside the viocontainer
document.querySelector('.VioRecords span').addEventListener("click", () => {
 
        document.querySelector('.registerWrapper').style.display = 'flex';
        document.querySelector('.vioContainer').style.display = 'none';

});



searchInput.addEventListener("input", searchEnforcers);

