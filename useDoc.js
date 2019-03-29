import { useEffect, useState } from "react"
import { db } from "./firebase"

export function useDoc(path) {
  const [doc, setDoc] = useState(null)
  useEffect(() => {
    return db.doc(path).onSnapshot(doc => {
      setDoc({
        ...doc.data(),
        id: doc.id,
      })
    })
  }, [path])
  return doc
}
