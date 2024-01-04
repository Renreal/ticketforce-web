  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
  import { getFirestore, collection, query, where, getDocs , updateDoc} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
  // ...

searchResults.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-button")) {
    // Get the clicked result element
    const resultElement = e.target.closest("div");
    showModal();
    // Get the 'license' value associated with the clicked result
    const license = resultElement.querySelector('.license').textContent.split(":")[1].trim();

    try {
      // Perform a new query to Firestore to get all documents with the matching 'license' value in "Record" collection
      const recordsCollection = collection(db, "Record");
      const q = query(recordsCollection, where("license", "==", license));
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

// ...



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

