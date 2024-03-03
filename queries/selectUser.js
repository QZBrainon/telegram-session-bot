const sqlite3 = require("sqlite3").verbose();

// Function to select a user by their Telegram ID
function selectUserByTelegramId(telegramId) {
  return new Promise((resolve, reject) => {
    // Open a connection to the SQLite database
    const db = new sqlite3.Database(
      "../database.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        } else {
          // Define SQL query to select user by Telegram ID
          const selectQuery = `
            SELECT * FROM users
            WHERE telegram_id = ?
          `;

          // Execute the SQL query to select the user
          db.get(selectQuery, [telegramId], function (err, row) {
            if (err) {
              reject(err);
            } else {
              if (row) {
                console.log("User found:", row);
                resolve(row);
              } else {
                console.log("User not found.");
                resolve(null);
              }
            }
          });
        }
      }
    );
  });
}

module.exports = selectUserByTelegramId;
