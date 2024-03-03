const sqlite3 = require("sqlite3").verbose();

// Function to update the accepted column of a user to 'accepted'
async function updateUserAcceptedToAccepted(telegramId) {
  // Open a connection to the SQLite database
  const db = new sqlite3.Database(
    "../database.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      console.error(err);
    }
  );
  // Define SQL query to update the accepted column
  const updateQuery = `
        UPDATE users
        SET terms_of_service = 'accepted'
        WHERE telegram_id = ?
    `;

  // Execute the SQL query to update the accepted column
  db.run(updateQuery, [telegramId], function (err) {
    if (err) {
      console.error("Error updating user:", err);
    } else {
      console.log(
        `User with ID ${telegramId} has accepted the terms of service.`
      );
    }
    // Close the database connection
    db.close();
  });
}

module.exports = updateUserAcceptedToAccepted;
