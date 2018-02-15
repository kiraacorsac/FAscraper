const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Datapoint = require('./datapoint');

mongoose.connect(process.env.ATLAS_FASCRAPE_CS);
function saveDatapoint(datapoint) {
    return Datapoint.create(datapoint);
}

function disconnect(){
    return mongoose.connection.close();
}

module.exports = {
    saveDatapoint: saveDatapoint,
    disconnect: disconnect
};



