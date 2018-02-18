const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Datapoint = require('./datapoint');

function connect() {
   return mongoose.connect(process.env.ATLAS_FASCRAPE_CS);
}

function oneDayStock() {
    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-1);
    return Datapoint.find({posted_at : {$lte : cutoff}, queried_OneDay: false}).exec();
}

function oneWeekStock() {
    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-7);
    return Datapoint.find({posted_at : {$lte : cutoff}, queried_OneWeek: false}).exec();
}

function saveDatapoint(datapoint) {
    return Datapoint.create(datapoint);
}

function disconnect(){
    return mongoose.connection.close();
}

module.exports = {
    connect: connect,
    oneDayStock: oneDayStock,
    oneWeekStock: oneWeekStock,
    saveDatapoint: saveDatapoint,
    disconnect: disconnect
};



