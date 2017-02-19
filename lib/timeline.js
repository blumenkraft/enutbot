'use strict';

const MongoClient = require('mongodb');
const assert = require('assert');
const pnut = require('pnut-butter');
const co = require('co');

const url = 'mongodb://localhost:27017/enutbot';

/**
 * Fetch current posts from the global timeline
 */
exports.fetch = function () {
  co(function* () {
    try {
      const db = yield MongoClient.connect(url);
      const posts = yield pnut.global();
      const calls = [];

      posts.data.forEach(post => {
        // TODO: Refactor to make use of bulk write operations
        let call = db.collection('posts').replaceOne({ id: post.id }, post, { upsert: true });
        calls.push(call);
      });

      yield calls;
      yield db.close();
    } catch (err) {
      console.error(err.message);
    }
  })
}

/**
 * Return posts with score additions
 */
exports.posts = function () {
  return new Promise((resolve, reject) => {
    let allPosts = [];

    MongoClient.connect(url, (err, db) => {
      db.collection('posts').find({}).toArray((err, posts) => {
        if (err) {
          reject(err);
        }

        posts.forEach(post => allPosts.push(charge(post)));
        db.close();
        resolve(allPosts);
      })
    })
  })
}

/**
 * Add score values to a post object
 */
function charge(post) {
  post.bookmarkScore = post.counts.bookmarks * 10;
  post.replyScore = post.counts.replies * 20;
  post.repostScore = post.counts.reposts * 15;

  post.score = post.bookmarkScore + post.replyScore + post.replyScore;

  return post;
}
