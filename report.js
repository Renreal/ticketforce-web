    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getFirestore, collection, getDocs, query, where, getDoc, doc, orderBy} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAuH9VHIHMBwrTOaUg2MZau4qsCpbVFSn4",
        authDomain: "ticketforce-5ac87.firebaseapp.com",
        projectId: "ticketforce-5ac87",
        storageBucket: "ticketforce-5ac87.appspot.com",
        messagingSenderId: "185677887310",
        appId: "1:185677887310:android:5c2d30b29f40ee6063901f"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Reference to the "Record" collection
    const recordCollection = collection(db, 'Record');

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

const querySnapshot = await getDocs(query(recordCollection, orderBy("dateTime", "desc")));
   
   
    // Reference to the table body
    const tableBody = document.querySelector('#tableBody tbody');
    const totalParagraph = document.querySelector('#total');
    let totalPaymentAmount = 0;

    // Loop through the documents and perform the desired operations
    for (const doc of querySnapshot.docs) {
        
        const dateObject = doc.data().dateTime.toDate();
        const formattedDate = `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}`;
        const uid = doc.data().uid;

        // Check if there's a matching document in the "enforcers" collection
        const enforcerQuerySnapshot = await getDocs(query(collection(db, 'enforcers'), where('uid', '==', uid)));
        
        // Retrieve the enforcer's name if a match is found
        let enforcerName = '';
        if (enforcerQuerySnapshot.size > 0) {
            const enforcerfName = enforcerQuerySnapshot.docs[0].data().firstname || '';
            const enforcerlName = enforcerQuerySnapshot.docs[0].data().lastname || '';
            enforcerName = enforcerfName + ' ' + enforcerlName;
        }


        let totalViolationAmount = 0;
        
        doc.data().violations.forEach((violation) => {
            const amount = parseFloat(violation.amount);
            if ('paymentAmount' in doc.data()) {
                totalViolationAmount += amount;   
            }  else {
                totalViolationAmount += amount;
                
            }  
        });
            const paidDate = doc.data().dateOfPayment ? new Date(doc.data().dateOfPayment.toMillis()).toLocaleDateString() : '';

            // Create a new row for each combination of 'Amount' and 'Name of Violation'
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${formattedDate}</td>
                <td>${enforcerName}</td>
                <td>${doc.data().name}</td>
                <td>${totalViolationAmount}</td>
                <td>${paidDate}</td>
                <td>${doc.data().paymentAmount}</td>
                <td>${doc.data().status}</td>
            `;
            console.log(formattedDate);
           
            totalPaymentAmount += isNaN(doc.data().paymentAmount) ? 0 : doc.data().paymentAmount;
            
            // Append the row to the table body
            tableBody.appendChild(newRow);
      
    }
    
    console.log(totalPaymentAmount);    
    console.log('Total Payment Amount:', totalPaymentAmount);
    totalParagraph.textContent = `TOTAL: \u20B1 ${totalPaymentAmount.toFixed(2)}`;



// Function to fetch data and display based on date range
async function fetchDataAndDisplay(startDate, endDate) {
    // Reference to the "Record" collection
    const recordCollection = collection(db, 'Record');

    // Parse the selected dates to Firestore timestamps
    const startTimestamp = startDate ? new Date(startDate) : null;
    const endTimestamp = endDate ? new Date(endDate) : null;

    // Create a base query with orderBy
    let baseQuery = query(recordCollection, orderBy("dateTime", "desc"));

    // Add where conditions based on the date range
    if (startTimestamp) {
        baseQuery = query(baseQuery, where("dateTime", ">=", startTimestamp));
    }

    if (endTimestamp) {
        // Adjust the end date to include the entire day
        const endTimestampAdjusted = new Date(endTimestamp);
        endTimestampAdjusted.setHours(23, 59, 59, 999);
        baseQuery = query(baseQuery, where("dateTime", "<=", endTimestampAdjusted));
    }

    // Get the query snapshot
    const querySnapshot = await getDocs(baseQuery);

    // Reference to the table body
    const tableBody = document.querySelector('#tableBody tbody');
    const totalParagraph = document.querySelector('#total');
    let totalPaymentAmount = 0;

    // Clear existing rows from the table
    tableBody.innerHTML = '';

    // Loop through the documents and perform the desired operations
    for (const doc of querySnapshot.docs) {
        const dateObject = doc.data().dateTime.toDate();
        const formattedDate = `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}`;
        const uid = doc.data().uid;

        // Check if there's a matching document in the "enforcers" collection
        const enforcerQuerySnapshot = await getDocs(query(collection(db, 'enforcers'), where('uid', '==', uid)));

        // Retrieve the enforcer's name if a match is found
        let enforcerName = '';
        if (enforcerQuerySnapshot.size > 0) {
            const enforcerfName = enforcerQuerySnapshot.docs[0].data().firstname || '';
            const enforcerlName = enforcerQuerySnapshot.docs[0].data().lastname || '';
            enforcerName = enforcerfName + ' ' + enforcerlName;
        }

        let totalViolationAmount = 0;

        doc.data().violations.forEach((violation) => {
            const amount = parseFloat(violation.amount);
            if ('paymentAmount' in doc.data()) {
                totalViolationAmount += amount;
            } else {
                totalViolationAmount += amount;
            }
        });
        const paidDate = doc.data().dateOfPayment ? new Date(doc.data().dateOfPayment.toMillis()).toLocaleDateString() : '';

        // Create a new row for each combination of 'Amount' and 'Name of Violation'
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${enforcerName}</td>
            <td>${doc.data().name}</td>
            <td>${totalViolationAmount}</td>
            <td>${paidDate}</td>
            <td>${doc.data().paymentAmount}</td>
            <td>${doc.data().status}</td>
        `;
        console.log(formattedDate);

        totalPaymentAmount += isNaN(doc.data().paymentAmount) ? 0 : doc.data().paymentAmount;

        // Append the row to the table body
        tableBody.appendChild(newRow);
    }

    console.log(totalPaymentAmount);
    console.log('Total Payment Amount:', totalPaymentAmount);
    totalParagraph.textContent = `TOTAL: \u20B1 ${totalPaymentAmount.toFixed(2)}`;
}
 




// Attach event listeners to Flatpickr inputs
const flatpickrInput = flatpickr("#flatpickrInput", {
    onChange: handleDateRangeChange,
});

const flatpickrInput2 = flatpickr("#flatpickrInput2", {
    onChange: handleDateRangeChange,
});

// Initial call to fetchDataAndDisplay when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchDataAndDisplay(
        flatpickrInput.selectedDates[0] ? flatpickrInput.selectedDates[0].toISOString() : null,
        flatpickrInput2.selectedDates[0] ? flatpickrInput2.selectedDates[0].toISOString() : null
    );
});

// Function to handle date range changes
function handleDateRangeChange(selectedDates, dateStr, instance) {
    const startDate = flatpickrInput.selectedDates[0] ? flatpickrInput.selectedDates[0].toISOString() : null;
    const endDate = flatpickrInput2.selectedDates[0] ? flatpickrInput2.selectedDates[0].toISOString() : null;
    fetchDataAndDisplay(startDate, endDate);
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
   
    printToPDF(); // Print to PDF after fetching and displaying data
});






