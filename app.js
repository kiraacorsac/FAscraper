const console = require('console');
const database = require('./mongoose-storage');
const frontpage = require('./frontpage-scraper');
const api = require('./faexport');

function stripUsefulFromSubmission(submission) {
    return {
        category: submission.category,
        comments: submission.comments,
        favorites: submission.favorites,
        gender: submission.gender,
        keywords: submission.keywords,
        user: getRealUsername(submission),
        posted_at: submission.posted_at,
        rating: submission.rating,
        species: submission.species,
        theme: submission.theme,
        views: submission.views
    }
}

function stripUsefulFromUser(user) {
    return {
        user_comments_given: user.comments_given,
        user_comments_recieved: user.comments_received,
        user_current_mood: user.current_mood,
        user_favorites: user.favorites,
        user_journals: user.journals,
        user_pageviews: user.pageviews,
        user_registred_at: user.registered_at,
        user_submissions: user.submissions,
        user_watcher_count: user.watchers.count,
        user_watching_count: user.watching.count,
    }
}

function getRealUsername(submission) {
    return submission.profile.match(/\/([^\/]+)\/$/).slice(-1)[0];
}

function saveLastSubmissions(lastId) {
    let lastSubmissionsSaved = lastId - 30;
    let promises = [];
    for (let i = lastId; i > lastSubmissionsSaved; i--) {
        promises.push(processSubmission(i));
    }
    return Promise.all(promises);
}

function processSubmission(id) {
    return api.submission(id).then((body) => {
        let submission = JSON.parse(body);
        let username = getRealUsername(submission);
        return Promise.all([submission, api.user(username)]);
    }).then(([submission, userbody]) => {
        let user = JSON.parse(userbody);
        let datapoint = {};
        Object.assign(datapoint, stripUsefulFromUser(user), stripUsefulFromSubmission(submission));
        console.log("Saving id: " + id);
        return database.saveDatapoint(datapoint);
    })
}

function repeat() {
    let id = frontpage.getLastSubmissionID();
    id.then((lastNumber) => {
        return saveLastSubmissions(lastNumber);
    }).then((datapoints) => {
        console.log("Quittin successfully...");
    }).catch((err) => {
        console.log("Something wrong: " + err);
    }).finally(() => {
        database.disconnect()
            .catch((err) => {
                console.log("Database disconnection foked");
            });
    });
}

module.exports.repeat = repeat;

