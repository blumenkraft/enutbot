#!/usr/bin/env node

'use strict';

const pnut = require('pnut-butter');
pnut.token = ''; 

const charge = (post) => {
  post.bookmarkScore = post.counts.bookmarks * 10;
  post.replyScore = post.counts.replies * 20;
  post.repostScore = post.counts.reposts * 15;

  post.score = post.bookmarkScore + post.replyScore + post.replyScore;

  return post;
}

const repost = (postId) => {
  pnut.custom(`/posts/'${postId}/repost`, 'PUT').then(res => {
    console.log(res);
  }, err => {
    console.log(err);
  })
}

const fetchPost = () => {
  return new Promise((resolve, reject) => {
    pnut.custom('/posts/streams/explore/trending').then((res) => {

      const scorePool = [];
      res.data.forEach(post => {

        let scoredPost = charge(post);
        scorePool.push(scoredPost);
      })

      let winner = scorePool.sort((a, b) => b.score - a.score)[0];

      resolve(winner)
    }).catch(e => {
      reject(e);
    });
  })
}

setInterval(() => {
  fetchPost().then(post => {
    if (!post.you_reposted) {
      let id = post.id;
      console.log(`Reposting ${id}`);
      repost(id);
    } else {
      console.log('Skipping…');
    }
  }).catch(err => {
    console.log(err);
  });
}, 900000); // Every 15 min