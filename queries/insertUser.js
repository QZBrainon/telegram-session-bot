const sqlite3 = require("sqlite3").verbose();

// Function to insert a new user into the users table
function insertUser(telegramId, name, terms_of_service = "declined") {
  return new Promise((resolve, reject) => {
    // Open a connection to the SQLite database
    const db = new sqlite3.Database(
      "../database.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        } else {
          // Define SQL query to insert a new user
          const insertUserQuery = `
            INSERT INTO users (telegram_id, name, terms_of_service) VALUES (?, ?, ?)
          `;

          // Execute the SQL query to insert the user

          db.run(
            insertUserQuery,
            [telegramId, name, terms_of_service],
            function (err) {
              if (err) {
                reject(err);
              } else {
                console.log("User inserted successfully.");
                resolve({ name, telegramId });
              }
            }
          );
        }
      }
    );
  });
}

module.exports = insertUser;
