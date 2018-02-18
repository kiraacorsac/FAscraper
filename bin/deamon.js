const app = require('../app.js');

app.setup()
    .then(() => app.repeat())
    .catch((err) => console.log("Uhhh wtf: " + err));
