import {
  Form,
  useActionData,
  redirect,
  useLoaderData,
  Link,
} from "react-router-dom";

import { validateUser } from "../../libs/validate";

export async function loader() {
  let result = await fetch("/api/checkifsignedin");
  result = await result.json();

  if (result.username) {
    return redirect(`/${result.username}`);
  } else {
    return {};
  }
}

export async function action({ request }) {
  const user = Object.fromEntries(await request.formData());

  let errors = validateUser(user);

  if (Object.keys(errors).length === 0) {
    let errors = await fetch("/api/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    errors = await errors.json();

    if (Object.keys(errors).length === 0) {
      return redirect(`/${user.username}`);
    } else {
      return errors;
    }
  } else {
    return errors;
  }
}

export default function SignUp() {
  const errors = useActionData();
  const loaderData = useLoaderData();

  return (
    <>
      <h3>Sign Up</h3>
      <p>{loaderData.message}</p>
      <Form method="post">
        {errors?.post && <span>{errors.post}</span>}

        <label htmlFor="username">username:</label>
        {errors?.username && <span>{errors.username}</span>}
        <input id="username" name="username" maxLength={60} />

        <label htmlFor="password">password:</label>
        {errors?.password && <span>{errors.password}</span>}
        <input id="password" name="password" type="password" />

        <input type="submit" value="Sign Up"></input>
      </Form>
      <p>Already have an account?</p>
      <Link to="/signin">Sign in.</Link>
    </>
  );
}
