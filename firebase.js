import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/database"
import "firebase/auth"

var config = {
  apiKey: "AIzaSyC3rOH6XTGNCA0XPRQ312TnFk4gXlivPpI",
  authDomain: "my-app-a2ca2.firebaseapp.com",
  databaseURL: "https://my-app-a2ca2.firebaseio.com",
  projectId: "my-app-a2ca2",
  storageBucket: "my-app-a2ca2.appspot.com",
  messagingSenderId: "736847031404",
}

firebase.initializeApp(config)

const db = firebase.firestore()
export { db, firebase }
