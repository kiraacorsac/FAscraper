const cheerio = require('cheerio');
const request = require('request-promise');

function scrapeLastSubmissionID(body) {
    const $ = cheerio.load(body);
    return $("#gallery-browse").find('a').first().attr('href');
}

function pasrseLastSubissionID(href) {
    return href.match(/\d+/)[0];
}

function getLastSubmissionID() {
    return request('https://www.furaffinity.net/browse')
        .then((res) => {
            let scraped = scrapeLastSubmissionID(res);
            return pasrseLastSubissionID(scraped);
        })
}


module.exports.getLastSubmissionID = getLastSubmissionID;