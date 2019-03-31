import { graphql } from "gatsby"
import * as React from "react"
import { useCollection } from "../../useCollection"
import { db, firebase } from "../../firebase.js"
import { Link } from "gatsby"
import styled from "styled-components"
import SelectOptions from "./page-2"
const Button = styled.button`
  display: ${(props: { toggle: boolean }) => (props.toggle ? "none" : "")};
`
const Container = styled.div`
  border: 3px solid blue;
`

interface User {
  displayName: string
  photoUrl: string
  uid: string
}
interface firebaseUser {
  displayName: string
  photoURL: string
  uid: string
}
const App: React.FC = () => {
  const [user, docs] = useAuth()
  const [bool, setBool] = React.useState(false)
  {
    const res = docs.map(doc => doc.user.id)
    console.log(res, "IMPORTANT")
    const fin = res.map(x => {
      if (x == user.uid) {
        return true
      } else {
        return false
      }
    })
    console.log(fin, "fin")
    if (fin.includes(true)) return <ReturningUser />
    // if (res[0] === user.uid) return "Hey"
  }

  function ReturningUser() {
    return <h3>Welcome Back!</h3>
  }

  return user ? (
    <Container>
      <h1>Hello {user.displayName}</h1>
      <p>Welcome to the Discplined Pursuit of Less</p>
      <Button onClick={() => setBool(true)} toggle={bool}>
        Get Started
      </Button>
      {bool && user && <SelectOptions user={user} />}
    </Container>
  ) : (
    <Login />
  )
}
function Login() {
  const [authError, setAuthError] = React.useState<{ message: string } | null>(
    null
  )

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    try {
      await firebase.auth().signInWithPopup(provider)
    } catch (error) {
      setAuthError(error)
    }
  }
  return (
    <div className="Login">
      <h1>Chat!</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
      {authError && (
        <div>
          <p>Sorry, there was a problem</p>
          <p>
            <i>{authError.message}</i>
          </p>
          <p>Please try again</p>
        </div>
      )}
    </div>
  )
}
function useAuth() {
  const [docs, setDocs] = React.useState([])
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    // this effect allows us to persist login
    return firebase.auth().onAuthStateChanged((firebaseUser: firebaseUser) => {
      const x = db.collection(`users/${firebaseUser.uid}/values`)
      x.onSnapshot(snapshot => {
        const docs = []
        snapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            id: doc.id,
          })
        })
        setDocs(docs)
      })
      if (firebaseUser) {
        const user = {
          displayName: firebaseUser.displayName,
          photoUrl: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }
        setUser(user)
        db.collection("users") //fb will automatically create collection/doc for us
          .doc(user.uid)
          .set(user, { merge: true }) // merge adds safety
      } else {
        setUser(null)
      }
    })
  }, [])
  return [user, docs]
}
export default App
