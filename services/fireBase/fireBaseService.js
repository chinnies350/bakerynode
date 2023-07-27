var admin = require("firebase-admin");

var serviceAccount = require("./google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sample-project-e1a84.firebaseio.com",
});

class FireBae {
  async notificationSend(req, res) {
    const payload = {
      data: {
        title: "testing",
        message: req.body.message,
      },
    };
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24, //24 hours
    };
    admin
      .messaging()
      .sendToDevice(req.body.registrationToken, payload, options)
      .then((response) => {
        res
          .status(200)
          .send("Notification sent successfully" + JSON.stringify(response));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

let firebase = new FireBae();
module.exports = {
  firebase,
};
// module.exports.admin = admin
