const sqlite3 = require("sqlite3").verbose();

// Open a connection to the SQLite database
const db = new sqlite3.Database("../database.db");

// Define SQL commands to drop tables
const dropUsersTableQuery = `
    DROP TABLE IF EXISTS users
`;

const dropSessionsTableQuery = `
    DROP TABLE IF EXISTS sessions
`;

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER UNIQUE,
        name TEXT,
        terms_of_service TEXT
    )
`;

const createSessionsTableQuery = `
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, -- Nullable user_id column
        filename TEXT,
        purchase_status TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`;

// Run SQL commands to drop tables
db.serialize(() => {
  // Drop tables
  db.run(dropUsersTableQuery);
  db.run(dropSessionsTableQuery);

  // Create tables
  db.run(createUsersTableQuery, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Users table created");
    }
  });

  db.run(createSessionsTableQuery, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Sessions table created");
    }

    // Close the database connection after all commands have been executed
  });
  db.close();
});
