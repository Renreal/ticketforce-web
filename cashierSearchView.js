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
    const q1 = query(enforcersCollection, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
    queryPromises.push(getDocs(q1));
  }

  try {
    const querySnapshots = await Promise.all(queryPromises);

    const uniqueResults = new Set(); // Use a Set to store unique results

    querySnapshots.forEach((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!uniqueResults.has(data.name)) {
          uniqueResults.add(data.name);
          displayResult(data);
        }
      });
    });

    if (uniqueResults.size === 0) {
      // Display a message if no results are found
      searchResults.innerHTML = "No matching enforcers found.";
    }
  } catch (error) {
    console.error("Error searching enforcers:", error);
  }
};


// ... (Previous code remains unchanged)

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
      // Retrieve the document from Firestore based on the unique identifier (e.g., ticketNumber)
      const querySnapshot = await getDocs(query(collection(db, "Record"), where("ticketNumber", "==", data.ticketNumber)));

      const recordsList = document.querySelector('.records');
      recordsList.innerHTML = '';
      const amountList = document.querySelector('.amountsList');
      amountList.innerHTML = '';

      if (querySnapshot.size > 0) {
        // Extract the violations array from the data
        const violationsArray = querySnapshot.docs[0].data().violations;

        // Log the name and other desired fields
        console.log(`Name: ${data.name}`);
        console.log(`Ticket No.: ${data.id}`);
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

        if (allPaid) {
          totalAmountElement.textContent = 'Total Amount = Paid';
          tcktAmount.textContent = 'Paid';
        } else {
          totalAmountElement.textContent = `Total Amount = ₱ ${totalAmount}`;
          tcktAmount.textContent = '₱' + totalAmount;
        }
      } else {
        console.log(`No documents found in the "Record" collection with ticket number ${data.ticketNumber}`);
        // Handle the case where no documents are found with the specified ticket number
      }
    } catch (error) {
      console.error("Error querying 'Record' collection:", error);
    }
  });
}







  const vioRecordsContainer = document.querySelector('.vioContainer');








/* 

searchResults.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-button")) {
    // Get the clicked result element
    const resultElement = e.target.closest("div");
    showModal();
    // Get the 'license' value associated with the clicked result
    const  ticket = resultElement.querySelector('.ticketNumber').textContent.split(":")[1].trim();
    console.log(ticket);
    try {
      // Perform a new query to Firestore to get all documents with the matching 'license' value in "Record" collection
      const recordsCollection = collection(db, "Record", license);
      const q = query(recordsCollection);
      const querySnapshot = await getDocs(q);

      // Clear the list outside the loop
      const recordsList = document.querySelector('.records');
      recordsList.innerHTML = '';
      const amountList = document.querySelector('.amountsList');
      amountList.innerHTML = '';

      // Check if any matching documents are found
      if (querySnapshot.size > 0) {
        let totalAmount = 0;
        let allPaid = true; // Flag to track if all records have 'status' equal to 'paid'

        // Loop through each matching document and print the desired fields
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          console.log(' Data if this document: '+data)
          // Check if 'status' field exists and is equal to 'paid'
          if (data.status !== 'paid') {
            allPaid = false;
          }

          // Extract the violations array from the data
          const violationsArray = data.violations;

          // Log the name and other desired fields
          console.log(`Name: ${data.name}`);
          console.log(`Ticket No.: ${data.id}`);
          console.log(`Status: ${data.status}`); // Log the status field

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
          tcktName.textContent = Dname + ' = ';

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
        }

        const totalAmountElement = document.getElementById('total');
        const tcktAmount = document.getElementById('amount') || document.querySelector('#amount');

        if (allPaid) {
          totalAmountElement.textContent = 'Total Amount = Paid';
          tcktAmount.textContent = 'Paid';
        } else {
          totalAmountElement.textContent = `Total Amount = ₱ ${totalAmount}`;
          tcktAmount.textContent = '₱' + totalAmount;
        }
      } else {
        console.log(`No documents found in the "Record" collection with license ${license}`);
        // Handle the case where no documents are found with the specified 'license'
      }
    } catch (error) {
      console.error("Error querying 'Record' collection:", error);
    }
  }
});
 */


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

    // Get the license from the displayed enforcer
    const licenseElement = document.querySelector('.license');
    const license = licenseElement.textContent.split(":")[1].trim();

    try {
        // Perform a new query to Firestore to get all documents with the matching 'license' value
        const enforcersCollection = collection(db, "Record");
        const q = query(enforcersCollection, where("license", "==", license));
        const querySnapshot = await getDocs(q);

        // Check if any matching documents are found
        if (querySnapshot.size > 0) {
            // Loop through each matching document and update it with the new status and payment amount
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();

                // Update the document with the new status and payment amount
                await updateDoc(doc.ref, {
                    status: "paid",
                    paymentAmount: parseFloat(paymentAmount),
                });
            });

            alert('Payment successfully processed.');
            hideModal();

            // Assuming you want to do something else after payment, you can trigger it here
        } else {
            console.log(`No documents found in the "Record" collection with license ${license}`);
            // Handle the case where no documents are found with the specified 'license'
        }
    } catch (error) {
        console.error("Error updating 'Record' documents:", error);
    }
  });























  // Assuming you have a button with the id "back"
  const backButton = document.getElementById('back');
  const proceedBtn = document.getElementById('proceed');
  const backButton2 = document.getElementById('btnBack');


  proceedBtn.addEventListener('click', proceedModal);
  backButton.addEventListener('click', hideModal);
  backButton2.addEventListener('click', hideModal);





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

