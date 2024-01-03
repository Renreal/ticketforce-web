        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
            authDomain: "ticketforce-5ac87.firebaseapp.com",
            projectId: "ticketforce-5ac87",
            storageBucket: "ticketforce-5ac87.appspot.com",
            messagingSenderId: "185677887310",
            appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
        };
        // Initialize Firebase

        
        /// Import Firestore functions from Firebase Firestore
        import { getFirestore, query, where, getDocs, collection, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
       

        // Initialize Firebase auth and firestore
      const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
        
  
  
  
  
     // Reference to the "Record" collection
const recordCollection = collection(db, "Record");

// Retrieve all documents from the "Record" collection
const querySnapshot = await getDocs(recordCollection);


// Access the table body of the second table to append rows
const tableBody2 = document.getElementById("tableBody").getElementsByTagName("tbody")[0];

// Check if there is at least one document in the collection
if (!querySnapshot.empty) {
    // Loop through each document in the collection
    querySnapshot.forEach(async (doc) => {
        // Get the data from the current document
        const docData = doc.data();
        
        const enforcerUid = docData.uid;

        // Reference to the "enforcers" collection
        const enforcersCollection = collection(db, "enforcers");

        // Query to find the enforcer with the matching uid
        const enforcerQuery = query(enforcersCollection, where("uid", "==", enforcerUid));
        const enforcerQuerySnapshot = await getDocs(enforcerQuery);

        // Check if there is at least one matching enforcer
        if (!enforcerQuerySnapshot.empty) {
            const matchingEnforcer = enforcerQuerySnapshot.docs[0].data();
            const enforcerName = `${matchingEnforcer.firstname} ${matchingEnforcer.lastname}`;
            
            const driverName = docData.name;
            const timestamp = docData.dateTime.toMillis(); // Convert timestamp to milliseconds
            const formattedDate = new Date(timestamp).toLocaleDateString();

            const violationsArray = docData.violations || [];

            // Create a new table row and cells for the second table for each violation
            violationsArray.forEach((violation) => {
                const newRow2 = tableBody2.insertRow(-1);
                const dateCell2 = newRow2.insertCell(0);
                const enforcerCell2 = newRow2.insertCell(1);
                const violationCell = newRow2.insertCell(2);
                const violationFeeCell = newRow2.insertCell(3);
                const paymentDateCell = newRow2.insertCell(4);
                const collectedFeeCell = newRow2.insertCell(5);
                const remarksCell = newRow2.insertCell(6);

                // Set the text content of the cells for the second table
                dateCell2.textContent = formattedDate;
                enforcerCell2.textContent = enforcerName;
                violationCell.textContent = violation["Name of Violation"];
                violationFeeCell.textContent = violation["Amount"];
                paymentDateCell.textContent = formattedDate;
                collectedFeeCell.textContent = "null"; // Replace with actual data
                remarksCell.textContent = "null"; // Replace with actual data
            });

        } else {
            console.error("No matching enforcer found for uid:", enforcerUid);
        }
    });
} else {
    console.error("No documents found in the 'Record' collection.");
}







// Function to fetch and display data based on date range
async function fetchDataAndDisplay(startDate, endDate) {
    // Reference to the "Record" collection
    const recordCollection = collection(db, "Record");

    // Query to retrieve data within the specified date range
    const dateFilteredQuery = query(recordCollection, where("dateTime", ">=", new Date(startDate)), where("dateTime", "<=", new Date(endDate)));
    const querySnapshot = await getDocs(dateFilteredQuery);

    // Access the table body to append rows
    const tableBody = document.getElementById("tableBody").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing rows

    // Loop through each document in the collection
    querySnapshot.forEach(async (doc) => {
        const docData = doc.data();
        const enforcerUid = docData.uid;

        // Reference to the "enforcers" collection
        const enforcersCollection = collection(db, "enforcers");

        // Query to find the enforcer with the matching uid
        const enforcerQuery = query(enforcersCollection, where("uid", "==", enforcerUid));
        const enforcerQuerySnapshot = await getDocs(enforcerQuery);

        // Check if there is at least one matching enforcer
        if (!enforcerQuerySnapshot.empty) {
            const matchingEnforcer = enforcerQuerySnapshot.docs[0].data();
            const enforcerName = `${matchingEnforcer.firstname} ${matchingEnforcer.lastname}`;
            const driverName = docData.name;
            const timestamp = docData.dateTime.toMillis(); // Convert timestamp to milliseconds
            const formattedDate = new Date(timestamp).toLocaleDateString();

            const violationsArray = docData.violations || [];

            // Create a new table row and cells for the second table for each violation
            violationsArray.forEach((violation) => {
                const newRow2 = tableBody.insertRow(-1);
                const dateCell2 = newRow2.insertCell(0);
                const enforcerCell2 = newRow2.insertCell(1);
                const violationCell = newRow2.insertCell(2);
                const violationFeeCell = newRow2.insertCell(3);
                const paymentDateCell = newRow2.insertCell(4);
                const collectedFeeCell = newRow2.insertCell(5);
                const remarksCell = newRow2.insertCell(6);

                // Set the text content of the cells for the second table
                dateCell2.textContent = formattedDate;
                enforcerCell2.textContent = enforcerName;
                violationCell.textContent = violation["Name of Violation"];
                violationFeeCell.textContent = violation["Amount"];
                paymentDateCell.textContent = formattedDate;
                collectedFeeCell.textContent = "null"; // Replace with actual data
                remarksCell.textContent = "null"; // Replace with actual data
            });
        } else {
            console.error("No matching enforcer found for uid:", enforcerUid);
        }
    });
}

function printToPDF() {
    // Select the element containing the table (modify the selector if needed)
    const element = document.getElementById("tableBody");

    // Open a new window and write the HTML content to it
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print</title>
            <style>
                /* Add any additional styles for printing here */
                body {
                    font-family: Arial, sans-serif;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            ${element.outerHTML}
        </body>
        </html>
    `);

    // Close the document for writing
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
}


// Attach an event listener to the "PRINT" button to trigger data fetching and display
document.getElementById("print").addEventListener("click", () => {
    fetchDataAndDisplay();
    printToPDF(); // Print to PDF after fetching and displaying data
});







// Attach event listeners to Flatpickr inputs
const flatpickrInput = flatpickr("#flatpickrInput", {
    onChange: (selectedDates) => {
        const startDate = selectedDates[0] ? selectedDates[0].toISOString() : null;
        const endDate = flatpickrInput2.selectedDates[0] ? flatpickrInput2.selectedDates[0].toISOString() : null;
        fetchDataAndDisplay(startDate, endDate);
    },
});

const flatpickrInput2 = flatpickr("#flatpickrInput2", {
    onChange: (selectedDates) => {
        const startDate = flatpickrInput.selectedDates[0] ? flatpickrInput.selectedDates[0].toISOString() : null;
        const endDate = selectedDates[0] ? selectedDates[0].toISOString() : null;
        fetchDataAndDisplay(startDate, endDate);
    },
});

// Initial call to fetchDataAndDisplay when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const startDate = flatpickrInput.selectedDates[0] ? flatpickrInput.selectedDates[0].toISOString() : null;
    const endDate = flatpickrInput2.selectedDates[0] ? flatpickrInput2.selectedDates[0].toISOString() : null;
    fetchDataAndDisplay(startDate, endDate);
});