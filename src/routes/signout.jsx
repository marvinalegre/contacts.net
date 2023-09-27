import { redirect } from "react-router-dom"

export async function loader() {
  await fetch('/api/signout')

  return redirect('/signin')
}

export default function SignOut() {
  return <p>...</p>
}