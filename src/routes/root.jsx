import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <h1>contacts.net</h1>
      <nav>
        <Link className="link" to="/createcontact">
          create contact
        </Link>
        <Link className="link" to="/signup">
          sign up
        </Link>
        <Link className="link" to="/signin">
          sign in
        </Link>
        <Link className="link" to="/signout">
          sign out
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
