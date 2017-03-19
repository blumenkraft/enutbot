#!/usr/bin/env node

'use strict';

const pnut = require('pnut-butter');
pnut.token = process.env.PNUT_TOKEN || '';

function getTrendingPosts() {
  return pnut.custom('/posts/streams/explore/trending');
}

function repost(post) {
  return pnut.custom(`/posts/${post.id}/repost`, 'PUT')
}

function charge(post) {
  post.bookmarkScore = post.counts.bookmarks * 10;
  post.replyScore = post.counts.replies * 20;
  post.repostScore = post.counts.reposts * 15;

  post.score = post.bookmarkScore + post.replyScore + post.replyScore;

  return post;
}

function run() {
  getTrendingPosts().then(posts => {
    posts = posts.data.map(post => charge(post));
    posts = posts.sort((a, b) => b.score - a.score);
    let winner = posts[0];

    return winner;
  }).then(winner => {
    if (!winner.you_reposted) {
      console.log(new Date(), `Reposting ${winner.id}`);
      return repost(winner);
    } else {
      console.log(new Date(), `Already reposted ${winner.id}`);
      return winner;
    }
  }).then(result => {
    setTimeout(run, 3600000);
  }).catch(err => {
    console.error(new Date(), err);
  })
}

run();