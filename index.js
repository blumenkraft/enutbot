'use strict';

const timeline = require('./lib/timeline');

// timeline.fetch();

timeline.posts().then(posts => {
  posts.forEach(post => {
    console.log(`${post.user.username} with post ${post.id} has a score of ${post.score}`);
  })
})
