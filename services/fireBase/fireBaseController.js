var admin = require("firebase-admin");
var notificationModel = require("./model");

var serviceAccount = require("../../config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.GoogleServices),
  databaseURL: serviceAccount.FirebaseDbUrl,
});

class FireBase {
  async notificationSend(req, res) {
    try {
      let NotificationModel = new notificationModel(req.body);
      const payload = {
        data: {
          title: req.body.title,
          message: req.body.message
        },
      };
      const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24, //24 hours
      };
      admin
        .messaging()
        .sendToDevice(req.body.registrationToken, payload, options)
        .then(async (response) => {
          if (response.results[0].hasOwnProperty("messageId")) {
            NotificationModel.userId = req.body.userId;
            NotificationModel.title = req.body.title;
            NotificationModel.message = req.body.message;
            NotificationModel.messageId = response.results[0].messageId;
            NotificationModel.multicastId = response.multicastId;
            await NotificationModel.save();
            res.status(200).send({ status: true, data: response });
          } else
            res
              .status(200)
              .send({ status: false, data: response.results[0].error.message });
        })
        .catch((error) => {
          res.status(500).send({ status: false, message: error });
        });
    } catch (err) {
      res.status(500).send({ status: false, message: err });
    }
  }
  async findNotificationsById(req, res) {
    let response = {
      status: false,
      data: "",
    };
    await notificationModel.find(
      { userId: req.query.userId },
      (err, result) => {
        if (err) {
          response.data = err;
          res.status(500).send(response);
        } else {
          response.status = true;
          response.data = result;
          res.status(200).send({ response });
        }
      }
    );
  }
}

let firebase = new FireBase();
module.exports = {
  firebase,
};
