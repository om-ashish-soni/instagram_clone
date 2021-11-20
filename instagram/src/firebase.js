import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you
const firebaseConfig = {
    apiKey: "AIzaSyA-Fw1geV20jQJTRmaiHZEh70wCBGVf_R8",
    authDomain: "instagram-clone-react-c9ed0.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-c9ed0-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-c9ed0",
    storageBucket: "instagram-clone-react-c9ed0.appspot.com",
    messagingSenderId: "977192272979",
    appId: "1:977192272979:web:b5abedc80a4e9dc0e432a6",
    measurementId: "G-CZ5MYW65NJ"
  };
// Initialize Firebase
const app=firebase.initializeApp(firebaseConfig);
const db=getFirestore(app);
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();
const storage = getStorage(app);
export {auth,provider,storage};
export default db;