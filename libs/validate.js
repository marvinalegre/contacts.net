import validator from "validator";

export function validateUser(user) {
  const errors = {};

  if (!/^\w*$/.test(user.username)) {
    errors.username =
      "You can only use alphanumeric characters and the underscore in creating a username.";
  }

  if (user.username.length > 30) {
    if (errors.username) {
      errors.username += " Usernames has maximum length of 30 characters.";
    } else {
      errors.username = "Usernames has maximum length of 30 characters.";
    }
  }

  if (user.password.length < 8) {
    errors.password = "Passwords must be at least 8 characters long.";
  }

  return errors;
}

export function validateContact(contact) {
  let errors = {};

  if (!/^[\w\s.]*$/.test(contact.name)) {
    errors.name =
      "You can only use alphanumeric characters \
    the period and whitespaces in creating a contact name.";
  }

  let invalidEmails = [];
  let invalidNumbers = [];
  for (let key in contact) {
    if (/^email/.test(key) && contact[key] !== "") {
      if (!validator.isEmail(contact[key])) {
        invalidEmails.push(key.slice(5));
      }
    }

    if (/^mobile/.test(key) && contact[key] !== "") {
      if (!validator.isMobilePhone(contact[key])) {
        invalidNumbers.push(key.slice(12));
      }
    }
  }

  if (invalidEmails.length !== 0) {
    if (invalidEmails.length === 1) {
      errors.email = `The email on field ${invalidEmails[0]} is invalid.`;
    } else {
      errors.email = `The emails on fields ${invalidEmails.join(
        ", "
      )} are invalid.`;
    }
  }

  if (invalidNumbers.length !== 0) {
    if (invalidNumbers.length === 1) {
      errors.number = `The mobile number on field ${invalidNumbers[0]} is invalid.`;
    } else {
      errors.number = `The mobile numbers on fields ${invalidNumbers.join(
        ", "
      )} are invalid.`;
    }
  }

  return errors;
}
