const admin = require("firebase-admin");
const readline = require("readline");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(" Enter the email of the user to make admin: ", (email) => {
  admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, { admin: true });
    })
    .then(() => {
      console.log(` ${email} has been granted admin privileges.`);
      rl.close();
    })
    .catch((error) => {
      console.error(" Error setting admin claim:", error.message);
      rl.close();
    });
});
