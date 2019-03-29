import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import Select from "react-select"
import { useCollection } from "../../useCollection"
import { db, firebase } from "../../firebase.js"

const options = [
  { value: "Athletic ability", label: "Athletic ability" },
  { value: "Art and literature", label: "Art and literature" },
  {
    value:
      "Creativity, discovering, or inventing things to make a difference in the world ",
    label:
      "Creativity, discovering, or inventing things to make a difference in the world ",
  },
  { value: "Athletic Independence", label: "Independence" },
  { value: "Kindness and generosity ", label: "Kindness and generosity " },
  { value: "Living in the moment", label: "Living in the moment" },
  {
    value:
      "Membership in a social group (such as your community, racial group, or school club) ability",
    label:
      "Membership in a social group (such as your community, racial group, or school club)",
  },
  { value: "Music", label: "Music" },
  { value: "My community", label: "My community" },
  { value: "Sense of humor", label: "Sense of humor" },
  { value: "Success in my career ", label: "Success in my career " },
  { value: "My moral principles", label: "My moral principles" },
  { value: "Nature and the environment", label: "Nature and the environment" },
  {
    value: "Relationships with friends and family",
    label: "Relationships with friends and family",
  },
]

function SelectOptions({ user }) {
  const [selectedOption, setSelectedOption] = useState([])
  const handleChange = selectedOption => {
    setSelectedOption([...selectedOption, selectedOption])
    const values = selectedOption.map(obj => {
      return Object.assign({}, obj)
    })
    setSelectedOption(values)
  }
  const SubmitValues = e => {
    e.preventDefault()
    db.collection("users")
      .doc(user.uid)
      .collection("values")
      .add({
        user: db.collection("users").doc(user.uid),
        values: [...selectedOption],
        createdAt: new Date(),
      })
    navigate("/page-3", {
      state: { user },
    })
  }
  return (
    <>
      <Select
        isMulti
        value={selectedOption.find(option => option.label === selectedOption)}
        onChange={handleChange}
        options={options}
      />
      <button onClick={SubmitValues}>Submit</button>
    </>
  )
}
// function ChatInputBox({ user, channelId }) {
// 	return (
// 		<form
// 			onSubmit={event => {
// 				event.preventDefault();
// 				const value = event.target.elements[0].value;
// 				db.collection('channels')
// 					.doc(channelId)
// 					.collection('messages')
// 					.add({
// 						user: db.collection('users').doc(user.uid),
// 						text: value,
// 						createdAt: new Date(),
// 					});
// 				event.target.reset();
// 			}}
// 			className="ChatInputBox">
// 			<input className="ChatInput" placeholder="Message #general" />
// 		</form>
// 	);
// }

export default SelectOptions
