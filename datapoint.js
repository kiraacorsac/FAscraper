const mongoose = require('mongoose');

let DatapointSchema = new mongoose.Schema({
    category: String,
    comments: Number,
    favorites: Number,
    gender: String,
    keywords: [String],
    user: String,
    posted_at: Date,
    rating: String,
    species: String,
    theme: String,
    views: Number,
    user_comments_given: Number,
    user_comments_recieved: Number,
    user_current_mood: String,
    user_favorites: Number,
    user_journals: Number,
    user_pageviews: Number,
    user_registred_at: Date,
    user_submissions: Number,
    user_watcher_count: Number,
    user_watching_count: Number
});

module.exports = mongoose.model('Datapoint', DatapointSchema);
