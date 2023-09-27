import { useState } from "react";
import { Form, useActionData, redirect } from "react-router-dom";

import { validateContact } from "../../libs/validate";

export async function loader() {
  let result = await fetch("/api/checkifsignedin");
  result = await result.json();

  if (result.username) {
    return {};
  } else {
    return redirect("/signin");
  }
}

export async function action({ request }) {
  const contact = Object.fromEntries(await request.formData());

  let errors = validateContact(contact);

  // if data is valid, make a post request
  if (!errors.name && !errors.email && !errors.number) {
    let errors = await fetch("/api/createcontact", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    errors = await errors.json();

    if (Object.keys(errors).length === 0) {
      // TODO: redirect to /:username
      return redirect("/signin");
    } else {
      return errors;
    }
  } else {
    return errors;
  }
}

export default function CreateContact() {
  const [numberFields, setNumberFields] = useState([1]);
  const [emailFields, setEmailFields] = useState([1]);
  let errors = useActionData();

  function addNumberField(e) {
    e.preventDefault();

    let newNumberField = [...numberFields];
    newNumberField.push(newNumberField[newNumberField.length - 1] + 1);
    setNumberFields(newNumberField);
  }

  function addEmailField(e) {
    e.preventDefault();

    let newEmailField = [...emailFields];
    newEmailField.push(newEmailField[newEmailField.length - 1] + 1);
    setEmailFields(newEmailField);
  }

  return (
    <Form method="post">
      {errors?.post && <span>{errors.post}</span>}
      <label htmlFor="name">name:</label>
      {errors?.name && <span>{errors.name}</span>}
      <input id="name" name="name" />

      <label>mobile number:</label>
      {errors?.number && <span>{errors.number}</span>}
      {numberFields.map((val) => (
        <input key={val} name={`mobileNumber${val}`}></input>
      ))}
      <button onClick={addNumberField}>add another number</button>

      <label htmlFor="email">email:</label>
      {errors?.email && <span>{errors.email}</span>}
      {emailFields.map((val) => (
        <input key={val} name={`email${val}`}></input>
      ))}
      <button onClick={addEmailField}>add another email</button>

      <input type="submit" value="Create Contact"></input>
    </Form>
  );
}
