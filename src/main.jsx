import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Root from "./routes/root";
import SignUp, {
  loader as signUpLoader,
  action as signUpAction,
} from "./routes/signup";
import SignIn, {
  loader as signInLoader,
  action as signInAction,
} from "./routes/signin";
import SignOut, { loader as signOutLoader } from "./routes/signout";
import CreateContact, {
  loader as createContactLoader,
  action as createContactAction,
} from "./routes/createcontact";
import Contacts, { loader as contactsLoader } from "./routes/contacts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
        loader: signUpLoader,
        action: signUpAction,
      },
      {
        path: "/signin",
        element: <SignIn />,
        loader: signInLoader,
        action: signInAction,
      },
      {
        path: "/signout",
        element: <SignOut />,
        loader: signOutLoader,
      },
      {
        path: "/createcontact",
        element: <CreateContact />,
        loader: createContactLoader,
        action: createContactAction,
      },
      {
        path: "/:username",
        element: <Contacts />,
        loader: contactsLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
