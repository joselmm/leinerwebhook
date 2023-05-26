const fetch = require("node-fetch");
async function sendMessageToPoe(messageFromUser, clearContext = false) {
  var urlPOE = "https://poe-leiner.onrender.com/talk/";
  var payload = {
    message: messageFromUser,
    clearContext,
  };

  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  var result = await fetch(urlPOE, options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
      console.log("respuesta poe:\n");
      console.log(res);
      return { botRespuesta: "HOLA QUE", noError: true };
    });

  if (!result.noError) {
    console.log("ocurrio une eee");
    return "Ocurrio un error:\n" + result.message;
  }
  return result.botRespuesta;
}

module.exports = {
  sendMessageToPoe,
};
