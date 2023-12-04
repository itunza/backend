const axios = require("axios");
var FormData = require("form-data");

// const username = "absa_wezesha_api_user";
// const password = "CfkE+E2gc#";
// const source = 'AbsaBank'; // AbsaBank
const username = "kmuoka@izoneafrica.net";
const password = "r6r5bb!!";
const source = "AbsaBank"; // AbsaBank
const connectorRule = 146;

axios.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

axios.interceptors.response.use((response) => {
  console.log("Response:", response);
  return response;
});

const sendSms = (phone, message, result) => {
  const data = {
    username: username,
    password: password,
    source: source,
    connectorRule: connectorRule,
    destination: phone,
    message: message,
    clientSMSID: "izsms" + new Date().getTime()
  }
  // const data = new FormData();
  // data.append("username", username);
  // data.append("password", password);
  // data.append("source", source);
  // data.append("connectorRule", connectorRule);
  // data.append("destination", phone);
  // data.append("message", message);
  // data.append("clientSMSID", "izsms" + new Date().getTime());

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  axios
    .post(
      "https://ting.cellulant.co.ke:9001/hub/channels/api/responses/SingleSMSAPI.php",
      data
    )
    .then((res) => {
      const responses = JSON.parse(res);
      let ret;
      if (responses.success) {
        if (response.success && response.stat_code == 1) {
          ret = {
            code: true,
            message: response.stat_description,
          };
        } else {
          ret = {
            code: false,
            message: "SMS Error: " +
              (response.stat_description ?
                response.stat_description :
                response.REASON ?
                response.REASON :
                "Unable to send SMS"),
          };
        }
      } else {
        ret = {
          code: false,
          message: "SMS Error: " +
            (response.stat_description ?
              response.stat_description :
              response.REASON ?
              response.REASON :
              "Unable to send SMS"),
        };
      }

      result(null, ret);
    })
    .catch(function (error) {
      result(error.message, null);
    });
};

module.exports = sendSms;