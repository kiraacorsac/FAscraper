const console = require('console');
const database = require('./mongoose-storage');
const frontpage = require('./frontpage-scraper');
const api = require('./faexport');
const bluebird = require('bluebird');
const minimist = require('minimist');

function stripUsefulFromSubmission(submission) {
    return {
        category: submission.category,
        comments: submission.comments,
        favorites: submission.favorites,
        gender: submission.gender,
        keywords: submission.keywords,
        user: submission.profile_name,
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

function stripForSecondPass(datapoint) {
    return {}
}

function stripForThirdPass(datapoint) {

}


function saveLastSubmissions(lastId) {
    const submissionsToSave = 10;
    let lastSubmissionsSaved = lastId - submissionsToSave;
    let promises = [];
    for (let i = lastId; i > lastSubmissionsSaved; i--) {
        promises.push(processNewSubmission(i));
    }
    return Promise.all(promises);
}

function processNewSubmission(id) {
    console.log("Scraping submission");
    return api.submission(id).then((body) => {
        let submission = JSON.parse(body);
        console.log("Scraping user");
        return Promise.all([api.user(submission.profile_name), submission, id]);
    }).then(([userbody, submission, id]) => {
        let user = JSON.parse(userbody);
        let datapoint = {};
        Object.assign(datapoint, stripUsefulFromUser(user), stripUsefulFromSubmission(submission));
        datapoint.submission_id = id;
        console.log("Saving id: " + id);
        return database.saveDatapoint(datapoint);
    }).catch((err) => console.log(id + " - new submission failed: " + err));
}

function setup() {
    return database.connect();
}

function oneDayProcessSubmission(datapoint) {
    return Promise.all([api.submission(datapoint.submission_id), api.user(datapoint.user)])
        .then(([submissionJson, userJson]) => {
            submission = JSON.parse(submissionJson);
            user = JSON.parse(userJson);

            datapoint.views_OneDay = submission.views;
            datapoint.comments_OneDay = submission.comments;
            datapoint.favorites_OneDay = submission.favorites;
            datapoint.user_pageviews_OneDay = user.pageviews;
            datapoint.user_comments_given_OneDay = user.comments_given;
            datapoint.user_comments_recieved_OneDay = user.comments_received;
            datapoint.user_favorites_OneDay = user.favorites;
            datapoint.user_journals_OneDay = user.journals;
            datapoint.user_submissions_OneDay = user.submissions;
            datapoint.user_watcher_count_OneDay = user.watchers.count;
            datapoint.user_watching_count_OneDay = user.watching.count;

            datapoint.queried_OneDay = true;

            return datapoint.save();
        }).then((datapoint) => console.log(datapoint.submission_id + " modified after 1 day."))
        .catch((err) => console.log("One day stock failed: " + err));
}

function oneWeekProcessSubmission(datapoint) {
    return Promise.all([api.submission(datapoint.submission_id), api.user(datapoint.user)])
        .then(([submissionJson, userJson]) => {
            submission = JSON.parse(submissionJson);
            user = JSON.parse(userJson);

            datapoint.views_OneWeek = submission.views;
            datapoint.comments_OneWeek = submission.comments;
            datapoint.favorites_OneWeek = submission.favorites;
            datapoint.user_pageviews_OneWeek = user.pageviews;
            datapoint.user_comments_given_OneWeek = user.comments_given;
            datapoint.user_comments_recieved_OneWeek = user.comments_received;
            datapoint.user_favorites_OneWeek = user.favorites;
            datapoint.user_journals_OneWeek = user.journals;
            datapoint.user_submissions_OneWeek = user.submissions;
            datapoint.user_watcher_count_OneWeek = user.watchers.count;
            datapoint.user_watching_count_OneWeek = user.watching.count;

            datapoint.queried_OneWeek = true;

            return datapoint.save();
        }).then((datapoint) => console.log(datapoint.submission_id + " modified after 1 week."))
        .catch((err) => console.log("One week stock failed: " + err));
}


function repeat() {
    let args = minimist(process.argv.slice(2),
        {
            unknown: ()=>{console.log("Bad arguments")},
            boolean: ["dayOld", "weekOld", "new"]
        }
    );

    let promises = [];

    if(args.new) {
        console.log("Scraping front page...");
        let id = frontpage.getLastSubmissionID();
        promises.push(id
            .then((lastNumber) => {
                console.log("Got front page, getting submissions...");
                return saveLastSubmissions(lastNumber);
            }).catch((err) => {
                console.log("Something wrong with new posts: " + err);
            }).finally(() => true));
    }

    if(args.dayOld){
        promises.push(database.oneDayStock()
            .then((stock) => {
                let datapoints = [];
                stock.forEach((dp) => {
                    datapoints.push(oneDayProcessSubmission(dp));
                });
                return Promise.all(datapoints);
            }).then(() => {
                return console.log("Updated one day olds.");
            }).catch((err) => {
                console.log("Something wrong with one day stock: " + err);
            }).finally(() => true))
    }

    if(args.weekOld){
        promises.push(database.oneWeekStock()
            .then((stock) => {
                let datapoints = [];
                stock.forEach((dp) => {
                    datapoints.push(oneWeekProcessSubmission(dp));
                });
                return Promise.all(datapoints);
            }).then(() => {
                return console.log("Updated one week olds.");
            }).catch((err) => {
                console.log("Something wrong with seven day stock: " + err);
            }).finally(() => true));
    }

    return Promise.all(promises)
        .then(() => {
            return database.disconnect()
                .then(() => {
                    console.log("Database disconnected")
                })

        }).catch((err) => {
            console.log("Database disconnection foked");
        });
}

module.exports.setup = setup;
module.exports.repeat = repeat;

