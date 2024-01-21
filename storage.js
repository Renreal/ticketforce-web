import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

/* // Your web app's Firebase configuration
const firebaseConfig = {
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
const auth = getAuth(app);
const storage = getStorage(app);

const fileInput = document.getElementById("fileInput");
const uploadedImage = document.getElementById("uploadedImage");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

const uploadButton = document.getElementById("uploadButton");
const enforcersCollection = collection(db, 'enforcers');

uploadButton.addEventListener("click", () => {
  const ID = document.getElementById("ID").value;

  // Check if ID already exists
  const idQuery = query(enforcersCollection, where('ID', '==', ID));

  getDocs(idQuery)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // ID already exists, show an alert and return
        alert("Enforcer with this ID already exists. Please choose a different ID.");
        return;
      }

      // ID doesn't exist, proceed with the registration
      const firstname = document.getElementById("firstname").value.toLowerCase();
      const lastname = document.getElementById("lastname").value.toLowerCase();
      const contactNo = document.getElementById("contactNo").value.toLowerCase();
      const address = document.getElementById("address").value.toLowerCase();
      const location = document.getElementById("location").value.toLowerCase();

      const file = fileInput.files[0];

      if (file) {
        const storageRef = ref(storage, `images/${firstname}/${file.name}`);

        uploadBytes(storageRef, file)
          .then((snapshot) => {
            console.log("File uploaded!");
            getDownloadURL(snapshot.ref)
              .then((downloadURL) => {
                uploadedImage.src = downloadURL;
                const rawPassword = ID; // Assuming ID is the raw password
                const password = `Enforcer@${rawPassword}`; // Append "20223Traffic" to the end

                createUserWithEmailAndPassword(auth, `${firstname.toLowerCase()}.${lastname.toLowerCase()}@enforcer.com`, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    const uid = user.uid; // Get the UID
                    const enforcerData = {
                      uid,
                      email: user.email,
                      firstname,
                      lastname,
                      contactNo,
                      address,
                      ID,
                      location,
                      imageDownloadURL: downloadURL,
                      password,
                    };

                    addDoc(enforcersCollection, enforcerData)
                      .then(() => {
                        alert("SUCCESSFULLY REGISTERED!");
                        document.getElementById("firstname").value = '';
                        document.getElementById("lastname").value = '';
                        document.getElementById("contactNo").value = '';
                        document.getElementById("address").value = '';
                        document.getElementById("ID").value = '';
                        document.getElementById("location").value = '';
                        uploadedImage.src = "personIcon.svg";
                      })
                      .catch((error) => {
                        console.error("Error saving data to Firestore: ", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error creating user: ", error);
                    if (error.code === "auth/email-already-in-use") {
                      alert("This person already exists! Cannot create multiple accounts.");
                    } 
                  });
              })
              .catch((error) => {
                console.error("Error getting download URL: ", error);
              });
          })
          .catch((error) => {
            console.error("Error uploading file: ", error);
          });
      } else {
        console.error("No file selected for upload.");
        alert("Please upload a photo of the enforcer");
      }
    })
    .catch((error) => {
      console.error("Error checking ID existence: ", error);
    });
});
