import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;
import bcrypt from "bcryptjs";

dotenv.config();

const pgCreds = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

export async function createUser(user) {
  const client = new Client(pgCreds);
  await client.connect();

  const hash = bcrypt.hashSync(user.password, 10);

  await client.query(`
    prepare createuser (varchar(60), varchar(60)) as
    insert into users (username, hashed_password)
    values ($1, $2)
  `);

  await client.query(`
    execute createuser ('${user.username}', '${hash}')
  `);

  await client.end();
}

export async function createContact(contact, username) {
  const client = new Client(pgCreds);
  await client.connect();

  let result1 = await client.query(`
    select user_id from users where username = '${username}'
  `);
  let userId = result1.rows[0].user_id;

  await client.query(`
    prepare insert_contact_name (varchar(50), int) as
    insert into contacts (name, user_id)
    values ($1, $2) returning contact_id
  `);

  let result2 = await client.query(`
    execute insert_contact_name ('${contact.name}', ${userId})
  `);
  let contactId = result2.rows[0].contact_id;

  await client.query(`
    prepare insert_email (varchar(256)) as
    insert into emails (email)
    values ($1) returning email_id;

    prepare insert_number (varchar(15)) as
    insert into mobile_numbers (mobile_number)
    values ($1) returning mobile_number_id;

    prepare insert_contact_email (int, int) as
    insert into contact_email (contact_id, email_id)
    values ($1, $2);

    prepare insert_contact_mobile_number (int, int) as
    insert into contact_mobile_number (contact_id, mobile_number_id)
    values ($1, $2);
  `);

  for (let key in contact) {
    let result;
    if (/^email/.test(key)) {
      if (contact[key] === "") {
        continue;
      }

      result = await client.query(`
        execute insert_email ('${contact[key]}')
      `);
      await client.query(`
        execute insert_contact_email (${contactId}, ${result.rows[0].email_id})
      `);
    } else if (/^mobile/.test(key)) {
      if (contact[key] === "") {
        continue;
      }

      result = await client.query(`
        execute insert_number ('${contact[key]}')
      `);
      await client.query(`
        execute insert_contact_mobile_number (${contactId}, ${result.rows[0].mobile_number_id})
      `);
    }
  }

  await client.end();
}

export async function isUsernameAvailable(username) {
  const client = new Client(pgCreds);
  await client.connect();

  let result = await client.query(`
    select * from users where username = '${username}'
  `);

  await client.end();

  if (result.rows.length === 0) {
    return true;
  } else {
    return false;
  }
}

export async function isContactNameAvailable(name, username) {
  const client = new Client(pgCreds);
  await client.connect();

  let result = await client.query(`
    select * from contacts
    full join users using (user_id)
    where username = '${username}' and name = '${name}'
  `);

  await client.end();

  if (result.rows.length === 0) {
    return true;
  } else {
    return false;
  }
}

export async function authenticateUser(user) {
  const client = new Client(pgCreds);
  await client.connect();

  let result = await client.query(`
    select hashed_password from users where username = '${user.username}'
  `);

  await client.end();

  if (result.rows.length === 0) {
    return false;
  }
  return bcrypt.compareSync(user.password, result.rows[0].hashed_password);
}

export async function getContacts(username) {
  const client = new Client(pgCreds);
  await client.connect();

  let result = await client.query(`
    select name, contact_id from contacts
    full join users using(user_id)
    where username = '${username}'
  `);

  await client.end();

  return result.rows;
}
