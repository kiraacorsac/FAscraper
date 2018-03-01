const request = require('request-promise');
const provider = "https://faexport.herokuapp.com/";

function pollSubmission(id) {
    return request(provider + `submission/${id}.json`);
}

function pollUser(id) {
    return request(provider  + `user/${id}.json`);
}

module.exports = {
    submission: pollSubmission,
    user: pollUser,
};