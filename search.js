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
        
            const deleteButton = resultElement.querySelector(".btnDelete");
            deleteButton.addEventListener("click", () => handleDelete(data));
        }
        
        const handleDelete = async (enforcerData) => {
            showModal();
          
            const yesBtn = document.getElementById('yes');
          
            const identifier = enforcerData.ID;
           
          
            const deleteHandler = async () => {
              try {
                // Delete user from Firebase Authentication
               
                
          
                // Delete user from Firestore
                const enforcersCollection = collection(db, "enforcers");
                const q = query(enforcersCollection, where("ID", "==", identifier));
                const querySnapshot = await getDocs(q);
          
                if (querySnapshot.size === 1) {
                  const enforcerRef = doc(enforcersCollection, querySnapshot.docs[0].id);
                  await deleteDoc(enforcerRef);
                  alert('ACCOUNT SUCCESSFULLY DELETED!');
          
                  // Refresh the page after deletion
                  location.reload();
                } else {
                  console.log(`No or multiple documents found with ID ${identifier}`);
                  // Handle the case where no or multiple documents are found with the specified ID
                }
              } catch (error) {
                console.error("Error deleting enforcer:", error);
              }
          
              hideModal();
            };
          
            yesBtn.addEventListener("click", deleteHandler);
          };
          
        
        
        
        
        

        //show modal when check icon is clicked
        function showModal() {
            document.getElementById('popup').style.display = 'block';   
        }

        // Function to hide the modal 
        function hideModal() {
            document.getElementById('popup').style.display = 'none';
        }

        //cancel button
        document.getElementById('btnCancel').addEventListener('click', () => {
        hideModal();
        });





        searchResults.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
        
            
            if (e.target.classList.contains("viewBtn")) {
                // Redirect to enforcerProfile.html with the ID as a query parameter
                window.location.href = `enforcerProfile.html?id=${id}`;
            }        
        
        });

            

        






        searchInput.addEventListener("input", searchEnforcers);