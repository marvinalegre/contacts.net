import { useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  let result = await fetch(`/api/${params.username}`)
  result = await result.json()

  return {
    username: params.username,
    contacts: result
  };
}

export default function Contacts() {
  const loaderData = useLoaderData();

  function handleClick(e) {
    console.log(e.target.value)
  }

  return (
    <>
      <p>{`Your signed in as ${loaderData.username}.`}</p>
      <h2>Contacts</h2>
      {
        loaderData.contacts.map((contact) => (
          <p onClick={handleClick} key={contact.contact_id}>{contact.name}</p>
        ))
      }
    </>
  );
}
