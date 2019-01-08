const redis = require('redis');
const db = redis.createClient();

class Entry {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key]
        }
    }

    save(cb) {
        const entryJSON = JSON.stringify(this);
        db.lpush('entries', entryJSON, (err) => err ? cb(err) : cb())
    }

    static getRange(from, to, cb) {
        db.lrange('entries', from, to, (err, items) => {
            if(err) return cb(err);

            let entries = [];
            items.forEach((item) => { entries.push(JSON.parse(item)) })
            cb(null, entries)
        })
    }

    static count(cb) {
        db.llen('entries', cb);
    }
}

module.exports = Entry;