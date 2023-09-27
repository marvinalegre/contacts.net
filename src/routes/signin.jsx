import {
  Form,
  useActionData,
  redirect,
  Link
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
    let errors = await fetch("/api/signin", {
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

export default function SignInPage() {
  const errors = useActionData();
  return (
    <>
      <h3>Sign In</h3>
      <Form method="post">
        {errors?.post && <span>{errors.post}</span>}

        <label htmlFor="username">username:</label>
        {errors?.username && <span>{errors.username}</span>}
        <input id="username" name="username" />

        <label htmlFor="password">password:</label>
        {errors?.password && <span>{errors.password}</span>}
        <input id="password" name="password" type="password" />

        <input type="submit" value="Sign In"></input>
      </Form>
      <p>Dont have an account yet?</p>
      <Link to="/signup">Sign up.</Link>
    </>
  );
}
