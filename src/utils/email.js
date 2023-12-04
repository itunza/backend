const axios = require("axios").default;
axios.defaults.headers.common["Authorization"] = "Bearer <<YOUR_API_KEY>>";

// axios.defaults.baseURL = baseURL;

// axios.interceptors.request.use(request => {
//   console.log("Starting Request", request);
//   return request;
// });

// axios.interceptors.response.use(response => {
//   console.log("Response:", response);
//   return response;
// });

module.exports = function send(
  receiver_email,
  receiver_name,
  subject,
  content,
  sender_email,
  sender_name
) {
  const data = {
    personalizations: [
      {
        to: [{ email: sender_email, name: sender_name }],
        subject: subject
      }
    ],
    content: [{ type: "text/plain", value: content }],
    from: { email: receiver_email, name: receiver_name },
    reply_to: { email: receiver_email, name: receiver_name }
  };

  return new Promise(function(resolve, reject) {
    axios
      .post("https://api.sendgrid.com/v3/mail/send", data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
