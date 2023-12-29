
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

/* const firebaseConfig = {
  apiKey: "AIzaSyAgbOwN82nOnMm2TQtlAIEkObBbtaH9okw",
  authDomain: "ticketforce-87c1d.firebaseapp.com",
  projectId: "ticketforce-87c1d",
  storageBucket: "ticketforce-87c1d.appspot.com",
  messagingSenderId: "389530136369",
  appId: "1:389530136369:web:2bf5bdcc84ebbc86474a10"
}; */

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

      // Clear existing content in the container
      resultsContainer.innerHTML = '';

      // Iterate over the documents and create HTML elements
      querySnapshot.forEach((doc) => {
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

  // Call the function to display Violations data initially
  displayViolations();

  // Add event listener for search input changes
  const searchInput = document.getElementById("vSearch");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim();
    displayViolations(searchTerm);
  });