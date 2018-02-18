const mongoose = require('mongoose');

let DatapointSchema = new mongoose.Schema({
    submission_id: Number,

    queried_OneDay: {type: Boolean, default: false},
    queried_OneWeek: {type: Boolean, default: false},

    views: Number,
    views_OneDay: Number,
    views_OneWeek: Number,

    comments: Number,
    comments_OneDay: Number,
    comments_OneWeek: Number,

    favorites: Number,
    favorites_OneDay: Number,
    favorites_OneWeek: Number,

    user_pageviews: Number,
    user_pageviews_OneDay: Number,
    user_pageviews_OneWeek: Number,

    user_comments_given: Number,
    user_comments_given_OneDay: Number,
    user_comments_given_OneWeek: Number,

    user_comments_recieved: Number,
    user_comments_recieved_OneDay: Number,
    user_comments_recieved_OneWeek: Number,

    user_favorites: Number,
    user_favorites_OneDay: Number,
    user_favorites_OneWeek: Number,

    user_journals: Number,
    user_journals_OneDay: Number,
    user_journals_OneWeek: Number,

    user_submissions: Number,
    user_submissions_OneDay: Number,
    user_submissions_OneWeek: Number,

    user_watcher_count: Number,
    user_watcher_count_OneDay: Number,
    user_watcher_count_OneWeek: Number,

    user_watching_count: Number,
    user_watching_count_OneDay: Number,
    user_watching_count_OneWeek: Number,

    gender: String,
    keywords: [String],
    posted_at: Date,
    rating: String,
    species: String,
    theme: String,
    category: String,

    user: String,
    user_current_mood: String,
    user_registred_at: Date,

});

module.exports = mongoose.model('Datapoint', DatapointSchema);
