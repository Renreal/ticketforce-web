    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
    import { getFirestore, collection, getDocs, query, where, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
    // ...

  // ...
  const vioNameInput = document.getElementById("vioName");
  const amountInput = document.getElementById("amountInput");
  const saveBtn = document.getElementById("btnSave");
  
  let selectedDocId; // Variable to store the selected document ID
  
  async function displayViolations(searchTerm = "") {
    const resultsContainer = document.getElementById("resContainer");
  
    try {
      const violationsRef = collection(db, "Violations");
  
      // Fetch data from Firestore
      let querySnapshot;
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        querySnapshot = await getDocs(
          query(
            violationsRef,
            where("name", ">=", lowerCaseSearchTerm),
            where("name", "<=", lowerCaseSearchTerm + "\uf8ff"),
            orderBy("name")
          )
        );
      } else {
        querySnapshot = await getDocs(violationsRef);
      }
  
      // Sort the querySnapshot by violation name
      const sortedQuerySnapshot = querySnapshot.docs.sort((a, b) => {
        const nameA = a.data().name.toUpperCase(); // ignore case
        const nameB = b.data().name.toUpperCase(); // ignore case
        return nameA.localeCompare(nameB);
      });
  
      // Clear existing content in the container
      resultsContainer.innerHTML = '';
  
      // Iterate over the sorted documents and create HTML elements
      sortedQuerySnapshot.forEach((doc) => {
        const data = doc.data();
  
        // Create HTML elements
        const violationElement = document.createElement("div");
        violationElement.className = "sResults";
  
        const vTypeElement = document.createElement("p");
        vTypeElement.id = "vType";
        vTypeElement.textContent = data.name;
  
        const subconElement = document.createElement("div");
        subconElement.className = "subcon";
  
        const priceElement = document.createElement("p");
        priceElement.id = "price";
        priceElement.textContent = "P" + data.amount;
  
        const searchIconElement = document.createElement("i");
        searchIconElement.className = "fa fa-edit";
  
        // Add click event listener to the search icon
        searchIconElement.addEventListener("click", function () {
          console.log("Clicked on id:", doc.id);
          hideModal();
  
          // Populate the input fields with the clicked violation's data
          vioNameInput.value = data.name;
          amountInput.value = data.amount;
  
          // Store the selected document ID
          selectedDocId = doc.id;
        });
  
        // Append elements to the container
        subconElement.appendChild(priceElement);
        subconElement.appendChild(searchIconElement);
  
        violationElement.appendChild(vTypeElement);
        violationElement.appendChild(subconElement);
  
        resultsContainer.appendChild(violationElement);
      });
    } catch (error) {
      console.error("Error fetching Violations data:", error);
    }
  }
// ...
// Add e// ...

// Add event listener for save button click
saveBtn.addEventListener("click", async function () {
  if (!selectedDocId) {
    console.error("No document selected.");
    return;
  }

  console.log("Clicked on id:", selectedDocId);

  // Update the document in Firestore with the new values
  const updatedName = vioNameInput.value;
  const updatedAmount = parseFloat(amountInput.value); // Assuming amount is a number

  const violationRef = doc(db, "Violations", selectedDocId);

  try {
    await updateDoc(violationRef, {
      name: updatedName,
      amount: updatedAmount,
    });

    alert("Violation Updated!");
    showModal();

    // Call the displayViolations function to refresh the displayed data
    displayViolations();
  } catch (error) {
    console.error("Error updating Violation:", error);
  }
});





    displayViolations();

    const searchInput = document.getElementById("vSearch");
    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.trim();
      displayViolations(searchTerm);
    });












    // Add event listener for save button click
    saveBtn.addEventListener("click", async function () {
      console.log("Clicked on id:", doc.id);
      // Update the document in Firestore with the new values
      const updatedName = vioNameInput.value;
      const updatedAmount = parseFloat(amountInput.value); // Assuming amount is a number

      const violationRef = collection(db, "Violations").doc(doc.id);

      try {
        await updateDoc(violationRef, {
          name: updatedName,
          amount: updatedAmount,
        });

        alert("Violation Updated!");
        showModal();
      } catch (error) {
        console.error("Error updating Violation:", error);
      }
    });



    
    const cancelBtn = document.getElementById("btnCancel");
    cancelBtn.addEventListener("click", function () {
      showModal();
    });

    function hideModal() {
      document.getElementById('hideContainer').style.display = 'none';
      document.getElementById('editVioPage').style.display = 'flex';
    }

    function showModal() {
      document.getElementById('hideContainer').style.display = 'flex';
      document.getElementById('editVioPage').style.display = 'none';
    }
