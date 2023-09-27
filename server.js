import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import {
  isUsernameAvailable,
  isContactNameAvailable,
  createUser,
  createContact,
  authenticateUser,
  getContacts,
} from "./libs/database.js";
import { validateUser, validateContact } from "./libs/validate.js";

dotenv.config();
const app = express();

app.use(express.json());

app.route("/api/checkifsignedin").get((req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/checkifsignedin`);

  let cookies = cookie.parse(req.headers.cookie || "");

  if (cookies.JWT_TOKEN) {
    try {
      var result = jwt.verify(cookies.JWT_TOKEN, process.env.SECRET_TOKEN);
      res.json({
        username: result.username,
      });
    } catch (e) {
      console.log(e.message);
      res.json({});
    }
  } else {
    res.json({});
  }
});

app.route("/api/signup").post(async (req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/signup`);
  const keywords = ["signup", "signin", "createcontact", "checkifsignedin"];
  const errors = validateUser(req.body);
  if (Object.keys(errors).length !== 0) {
    res.json(errors);
  } else if (keywords.includes(req.body.username)) {
    res.json({
      username: "This username is no longer available",
    });
  } else if (!(await isUsernameAvailable(req.body.username))) {
    res.json({
      username: "This username is no longer available",
    });
  } else {
    try {
      await createUser(req.body);
    } catch (e) {
      console.log(e);
      res.json({
        post: "Something went wrong. Please try again later.",
      });
    }

    const token = jwt.sign(
      { username: req.body.username },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "3600s",
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("JWT_TOKEN", token, {
        httpOnly: true,
      })
    );
    res.json({});
  }
});

app.route("/api/signin").post(async (req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/signin`);
  const errors = validateUser(req.body);
  if (Object.keys(errors).length !== 0) {
    res.json(errors);
  } else if (await authenticateUser(req.body)) {
    const token = jwt.sign(
      { username: req.body.username },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "3600s",
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("JWT_TOKEN", token, {
        httpOnly: true,
      })
    );
    res.json({});
  } else {
    res.json({
      post: "Invalid username or password.",
    });
  }
});

app.route("/api/signout").get((req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/signout`);
  const token = jwt.sign(
    { username: req.body.username },
    process.env.SECRET_TOKEN,
    {
      expiresIn: "0s",
    }
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("JWT_TOKEN", token, {
      httpOnly: true,
    })
  );
  res.json({});
});

app.route("/api/createcontact").post(async (req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/createcontact`);

  let cookies = cookie.parse(req.headers.cookie || "");

  try {
    let errors = validateContact(req.body);
    if (Object.keys(errors).length === 0) {
      var result = jwt.verify(cookies.JWT_TOKEN, process.env.SECRET_TOKEN);

      if (isContactNameAvailable(req.body.name, result.username)) {
        try {
          await createContact(req.body, result.username);
        } catch (e) {
          console.log(e);
          res.json({
            post: "Something went wrong. Please try again later.",
          });
        }

        res.json({});
      } else {
        res.json({
          name: "This contact name is unavailable.",
        });
      }
    } else {
      res.json(errors);
    }
  } catch (e) {
    console.log(e);
    res.json({
      post: "Something went wrong. Please try again later.",
    });
  }
});

app.route("/api/:username").get(async (req, res) => {
  console.log(`${new Date().toLocaleString()}  -  /api/${req.params.username}`);
  let cookies = cookie.parse(req.headers.cookie || "");
  let result;

  try {
    throw new Error();
    result = jwt.verify(cookies.JWT_TOKEN, process.env.SECRET_TOKEN);
    if (result.username === req.params.username) {
      res.json(await getContacts(result.username));
    } else {
      res.json({});
    }
  } catch (e) {
    console.log(e.message);
    res.json({
      post: "Something went wrong. Try again later.",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Now listening at ${process.env.PORT}.`);
});
