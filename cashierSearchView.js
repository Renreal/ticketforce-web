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
  const searchTerm = searchInput.value.trim();


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
      <p class="fname">First Name: ${data.fname}</p>
      <p class="lname">Last Name: ${data.lname}</p>
      <p class="license">ID No.: ${data.license}</p>
      <button class="view-button">VIEW</button>
  `;
  searchResults.appendChild(resultElement);
}


// Trigger the search function on the "input" event
searchInput.addEventListener("input", searchEnforcers);
const vioRecordsContainer = document.querySelector('.vioContainer');






// ...

searchResults.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-button")) {
      // Get the clicked result element
      const resultElement = e.target.closest("div");
      showModal();
      // Get the 'license' value associated with the clicked result
      const license = resultElement.querySelector('.license').textContent.split(":")[1].trim();

      try {
          // Perform a new query to Firestore to get all documents with the matching 'license' value
          const enforcersCollection = collection(db, "Record");
          const q = query(enforcersCollection, where("license", "==", license));
          const querySnapshot = await getDocs(q);

          // Clear the list outside the loop
          const recordsList = document.querySelector('.records');
          recordsList.innerHTML = '';
          const amountList = document.querySelector('.amountsList');
          amountList.innerHTML = '';

          // Check if any matching documents are found
          if (querySnapshot.size > 0) {
            let totalAmount = 0;
              // Loop through each matching document and print the desired fields
              querySnapshot.forEach((doc) => {
                  const data = doc.data();

                  // Extract the violations array from the data
                  const violationsArray = data.violations;

                  // Log the name and other desired fields
                  console.log(`Name: ${data.name}`);
                  console.log(`Ticket No.: ${data.id}`);
                  console.log("Violations:");

                  // Update the vHeader with the document name
                  const Dname = `${data.name}`;
                  const vHeaderName = vioRecordsContainer.querySelector('.vHeader .name');
                  vHeaderName.textContent = Dname;
                  
                  

                  // Update the ticket number in the vHeader
                  const tckNo = `${data.id}`;
                  const tckElement = vioRecordsContainer.querySelector('.vHeader2 .tckt');
                  tckElement.textContent = 'Ticket No. ' + tckNo;
                  
                  const tcktNum = document.getElementById('ticketNum');
                  tcktNum.textContent = 'Ticket No. ' + tckNo;

                  const tcktName = document.getElementById('name');
                  tcktName.textContent = Dname  + ' = ';
                 
                  // Loop through each violation in the array and log its information
                  violationsArray.forEach((violation) => {
                      console.log(`- ${violation["Name of Violation"]}`);

                      // Create an li element for each violation and append it to the list
                      const li = document.createElement('li');
                      li.textContent = `${violation["Name of Violation"]}`;
                      recordsList.appendChild(li);

                      const li2 = document.createElement('li');
                      li2.textContent = ` ₱ ${violation.Amount}`;
                      amountList.appendChild(li2);

                      totalAmount += violation.Amount;
                  });

                  const totalAmountElement = document.getElementById('total');
                  totalAmountElement.textContent = `Total Amount = ₱ ${totalAmount}`;
                  
                  const tcktAmount = document.getElementById('amount');
                  tcktAmount.textContent = '₱' + totalAmount;
              });
          } else {
              console.log(`No documents found in the "Record" collection with license ${license}`);
              // Handle the case where no documents are found with the specified 'license'
          }
      } catch (error) {
          console.error("Error querying 'Record' collection:", error);
      }
  }
});




// Assuming you have a button with the id "back"
const backButton = document.getElementById('back');
const proceedBtn = document.getElementById('proceed');
proceedBtn.addEventListener('click', proceedModal);
// Add an event listener to the back button
backButton.addEventListener('click', hideModal);





function proceedModal(){
  document.querySelector('.registerWrapper').style.display = 'none';
  document.querySelector('.paymentContainer').style.display = 'flex';
      document.querySelector('.vioContainer').style.display = 'none';
}

function showModal(){
  document.querySelector('.registerWrapper').style.display = 'none';
      document.querySelector('.vioContainer').style.display = 'block';
}
function hideModal(){
  document.querySelector('.registerWrapper').style.display = 'flex';
      document.querySelector('.vioContainer').style.display = 'none';
}









// Add an event listener to the "X" span inside the viocontainer
document.querySelector('.VioRecords span').addEventListener("click", () => {
 
        document.querySelector('.registerWrapper').style.display = 'flex';
        document.querySelector('.vioContainer').style.display = 'none';

});



searchInput.addEventListener("input", searchEnforcers);

