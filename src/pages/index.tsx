import { graphql } from "gatsby"
import * as React from "react"
import { useCollection } from "../../useCollection"
import { db, firebase } from "../../firebase.js"
import { Link } from "gatsby"
import styled from "styled-components"
import SelectOptions from "./page-2"
const Button = styled.button`
  display: ${props => (props.toggle ? "none" : "")};
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
  const user = useAuth()
  const [bool, setBool] = React.useState(false)

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
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    // this effect allows us to persist login
    return firebase.auth().onAuthStateChanged((firebaseUser: firebaseUser) => {
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
  return user
}
export default App
