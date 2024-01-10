    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getFirestore, collection, getDocs, query, where, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

    // Create a query to get documents where 'uid' field exists 
    const querySnapshot = await getDocs(query(recordCollection, where('ticketNumber', '!=', null)));
    // Reference to the table body
    const tableBody = document.querySelector('#tableBody tbody');
    const totalParagraph = document.querySelector('#total');
    let totalPaymentAmount = 0;

    // Loop through the documents and perform the desired operations
    for (const doc of querySnapshot.docs) {
        const formattedDate = doc.data().dateTime.toDate().toLocaleDateString();
        
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
            if ('paymentAmount' in doc.data()) {
                totalViolationAmount += violation.Amount;   
            }  else {
                totalViolationAmount += violation.Amount;
                
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
           
            totalPaymentAmount += isNaN(doc.data().paymentAmount) ? 0 : doc.data().paymentAmount;
            
            // Append the row to the table body
            tableBody.appendChild(newRow);
      
    }
    
    console.log(totalPaymentAmount);
    
    
    console.log('Total Payment Amount:', totalPaymentAmount);
    totalParagraph.textContent = `TOTAL: \u20B1 ${totalPaymentAmount.toFixed(2)}`;






    




    async function fetchDataAndDisplay(startDate, endDate) {
        // Clear existing rows from the table
        tableBody.innerHTML = '';
    
        // Array to store rows
        const rows = [];
    
        try {
            // Query to retrieve data within the specified date range
            const dateFilteredQuery = query(recordCollection, 
                where("dateTime", ">=", new Date(startDate)), 
                where("dateTime", "<=", new Date(endDate))
            );
    
            // Fetch documents based on the date range
            const querySnapshot = await getDocs(dateFilteredQuery);
    
            // Loop through each document in the collection
            for (const doc of querySnapshot.docs) {
                const timestamp = doc.data().dateTime.toMillis();
                const formattedDate = new Date(timestamp).toLocaleDateString();
    
                // Check if the document has the 'ticketNumber' field
                if (!doc.data().ticketNumber) {
                    continue; // Skip this row if 'ticketNumber' is not present
                }
    
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
                    if ('paymentAmount' in doc.data()) {
                        totalViolationAmount += violation.Amount;   
                    }  else {
                        totalViolationAmount += violation.Amount;
                        
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
               
                    
                    rows.push({ date: formattedDate, row: newRow });
                    
                
            }
    
            // Sort the rows based on the date
            rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            // Calculate and display the total payment amount
            const totalPaymentAmount = rows.reduce((total, rowObj) => {
                const paymentAmount = parseFloat(rowObj.row.cells[5].textContent);
                return isNaN(paymentAmount) ? total : total + paymentAmount;
               
            }, 0);
    
            console.log('Total Payment Amount:', totalPaymentAmount);
            totalParagraph.textContent = `TOTAL: \u20B1 ${totalPaymentAmount.toFixed(2)}`;
    
            // Append sorted rows to the table body
            rows.forEach((rowObj) => {
                tableBody.appendChild(rowObj.row);
            });
        } catch (error) {
            console.error("Error fetching and displaying data:", error);
        }
    }






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






