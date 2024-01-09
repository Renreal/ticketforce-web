 // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

// Function to check if a value is a valid integer
function isInteger(value) {
  return /^\d+$/.test(value);
}

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

  const enforcersCollection = collection(db, "Record");

  let queryPromises = [];

  if (isInteger(searchTerm)) {
    // If the search term is an integer, query by ticketNumber
    const q = query(enforcersCollection, where("ticketNumber", "==", parseInt(searchTerm)));
    queryPromises.push(getDocs(q));
  } else {
    // If the search term is not an integer, query by name
    const q1 = query(enforcersCollection, 
      where("name", ">=", searchTerm), 
      where("name", "<=", searchTerm + "\uf8ff"),
    );
    queryPromises.push(getDocs(q1));
  }

  try {
    const querySnapshots = await Promise.all(queryPromises);

    querySnapshots.forEach((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Check if the document has a 'ticketNumber' field before displaying
        if ('ticketNumber' in data) {
          displayResult(data);
        }
      });
    });

    if (querySnapshots.length === 0 || querySnapshots.every(snapshot => snapshot.size === 0)) {
      // Display a message if no results are found
      searchResults.innerHTML = "No matching enforcers found.";
    }
  } catch (error) {
    console.error("Error searching enforcers:", error);
  }
};


function displayResult(data) {
  const resultElement = document.createElement("div");
  resultElement.innerHTML = `
        <img src="${data.profilePicture}" alt="Enforcer Image" width="100"><br>
        <p class="fname">Name: ${data.name}</p>
        <p class="ticketNumber">Ticket Number: ${data.ticketNumber}</p>
        <button class="view-button">VIEW</button>
    `;
  searchResults.appendChild(resultElement);

  // Add click event listener to the "VIEW" button
  const viewButton = resultElement.querySelector(".view-button");
  viewButton.addEventListener("click", async () => {
    // Log the associated data when the button is clicked
    console.log("Associated Data:", data);
    showModal();

    try {
      // Query Firestore to find the document with matching ticketNumber
      const querySnapshot = await getDocs(
        query(collection(db, "Record"), where("ticketNumber", "==", data.ticketNumber))
      );

      const recordsList = document.querySelector('.records');
      recordsList.innerHTML = '';
      const amountList = document.querySelector('.amountsList');
      amountList.innerHTML = '';

      if (querySnapshot.size > 0) {
        const violationsArray = querySnapshot.docs[0].data().violations;

        // Log the name and other desired fields
        console.log(`Name: ${data.name}`);
        console.log(`Ticket No.: ${data.ticketNumber}`);
        console.log(`Status: ${data.status}`); // Log the status field

        // Update the vHeader with the document name
        const Dname = `${data.name}`;
        const vHeaderName = vioRecordsContainer.querySelector('.vHeader .name');
        vHeaderName.textContent = Dname;

        // Update the ticket number in the vHeader
        const tckNo = `${data.ticketNumber}`;
        const tckElement = vioRecordsContainer.querySelector('.vHeader2 .tckt');
        tckElement.textContent = 'Ticket No. ' + tckNo;

        const tcktNum = document.getElementById('ticketNum');
        tcktNum.textContent = 'Ticket No. ' + tckNo;

        const tcktName = document.getElementById('name');
        tcktName.textContent = Dname + ' = ';

        let totalAmount = 0;

        // Loop through each violation in the array and log its information
        for (const violation of violationsArray) {
          console.log(`- ${violation["Name of Violation"]}`);

          // Create an li element for each violation and append it to the list
          const li = document.createElement('li');
          li.textContent = `${violation["Name of Violation"]}`;
          recordsList.appendChild(li);

          const li2 = document.createElement('li');
          li2.textContent = ` ₱ ${violation.Amount}`;
          amountList.appendChild(li2);

          totalAmount += violation.Amount;
        }

        const totalAmountElement = document.getElementById('total');
        const tcktAmount = document.getElementById('amount') || document.querySelector('#amount');

        const allPaid = querySnapshot.docs[0].data().allPaid;

        if (allPaid || data.status === "paid") {
          totalAmountElement.textContent = 'Total Amount = Paid';
          tcktAmount.textContent = 'Paid';
        } else {
          totalAmountElement.textContent = `Total Amount = ₱ ${totalAmount}`;
          tcktAmount.textContent = '₱' + totalAmount;
        }

        // btnOk logic
document.getElementById('btnOk').addEventListener('click', async () => {
  // Get the payment amount from the input field
  const paymentAmount = document.getElementById('paymentAmount').value;

  // Check if the payment amount is valid (you might want to add additional validation)
  if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      alert('Please enter a valid payment amount.');
      return;
  }

  // Get the total amount displayed on the UI
  const totalAmountElement = document.getElementById('total');
  const totalAmount = parseFloat(totalAmountElement.textContent.split('₱')[1]);

  // Compare totalAmount with the paymentAmount
  if (totalAmount !== parseFloat(paymentAmount)) {
      alert('Payment amount does not match the total amount. Please enter the correct payment amount.');
      return;
  }

  try {
      // Update the document with the new status and payment amount
      const currentDateTime = new Date();
      // Update the document with the current date as aV timestamp
      await updateDoc(querySnapshot.docs[0].ref, {
          status: "paid",
          paymentAmount: parseFloat(paymentAmount),
          dateOfPayment: currentDateTime,
      });

      alert('Payment successfully processed.');

      // Listen for real-time updates to the document
      const unsubscribe = onSnapshot(querySnapshot.docs[0].ref, (updatedDoc) => {
          // Refresh the displayed data based on the updated document
          refreshDisplayedData(updatedDoc);
          // Unsubscribe from further updates
          unsubscribe();
      });
  } catch (error) {
      console.error("Error updating 'Record' document:", error);
  }
});

// Function to refresh the displayed data based on the updated document
function refreshDisplayedData(updatedDoc) {
  const recordsList = document.querySelector('.records');
  recordsList.innerHTML = '';
  const amountList = document.querySelector('.amountsList');
  amountList.innerHTML = '';

  const data = updatedDoc.data();
  const violationsArray = data.violations;

  // Log the name and other desired fields
  console.log(`Name: ${data.name}`);
  console.log(`Ticket No.: ${data.ticketNumber}`);
  console.log(`Status: ${data.status}`); // Log the status field

  // Update the vHeader with the document name
  const Dname = `${data.name}`;
  const vHeaderName = vioRecordsContainer.querySelector('.vHeader .name');
  vHeaderName.textContent = Dname;

  // Update the ticket number in the vHeader
  const tckNo = `${data.ticketNumber}`;
  const tckElement = vioRecordsContainer.querySelector('.vHeader2 .tckt');
  tckElement.textContent = 'Ticket No. ' + tckNo;

  const tcktNum = document.getElementById('ticketNum');
  tcktNum.textContent = 'Ticket No. ' + tckNo;

  const tcktName = document.getElementById('name');
  tcktName.textContent = Dname + ' = ';

  let totalAmount = 0;

  // Loop through each violation in the array and log its information
  for (const violation of violationsArray) {
      console.log(`- ${violation["Name of Violation"]}`);

      // Create an li element for each violation and append it to the list
      const li = document.createElement('li');
      li.textContent = `${violation["Name of Violation"]}`;
      recordsList.appendChild(li);

      const li2 = document.createElement('li');
      li2.textContent = ` ₱ ${violation.Amount}`;
      amountList.appendChild(li2);

      totalAmount += violation.Amount;
  }

  const totalAmountElement = document.getElementById('total');
  const tcktAmount = document.getElementById('amount') || document.querySelector('#amount');

  const allPaid = data.allPaid;

  if (allPaid || data.status === "paid") {
      totalAmountElement.textContent = 'Total Amount = Paid';
      tcktAmount.textContent = 'Paid';
  } else {
      totalAmountElement.textContent = `Total Amount = ₱ ${totalAmount}`;
      tcktAmount.textContent = '₱' + totalAmount;
  }
}


      } else {
        console.log(`No document found in the "Record" collection with ticket number ${data.ticketNumber}`);
        // Handle the case where no document is found with the specified ticket number
      }
    } catch (error) {
      console.error("Error querying 'Record' collection:", error);
    }
  });
}




      
const vioRecordsContainer = document.querySelector('.vioContainer');





























  // Assuming you have a button with the id "back"
  const backButton = document.getElementById('back');
  const proceedBtn = document.getElementById('proceed');
  const backButton2 = document.getElementById('btnBack');


  proceedBtn.addEventListener('click', proceedModal);
  backButton.addEventListener('click', hideModal);
  backButton2.addEventListener('click', showModal);





  function proceedModal(){
    document.querySelector('.registerWrapper').style.display = 'none';
    document.querySelector('.paymentContainer').style.display = 'flex';
        document.querySelector('.vioContainer').style.display = 'none';
  }

  function showModal(){
    document.querySelector('.registerWrapper').style.display = 'none';
        document.querySelector('.vioContainer').style.display = 'block';
        document.querySelector('.paymentContainer').style.display = 'none';
  }
  function hideModal(){
    document.querySelector('.registerWrapper').style.display = 'flex';
        document.querySelector('.vioContainer').style.display = 'none';
        document.querySelector('.paymentContainer').style.display = 'none';
  }









  // Add an event listener to the "X" span inside the viocontainer
  document.querySelector('.VioRecords span').addEventListener("click", () => {
  
          document.querySelector('.registerWrapper').style.display = 'flex';
          document.querySelector('.vioContainer').style.display = 'none';

  });



  searchInput.addEventListener("input", searchEnforcers);

