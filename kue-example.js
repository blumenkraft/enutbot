const kue = require('kue');

const jobs = kue.createQueue();

function newJob() {
  let job = jobs.create('queue_identifier');
  job.save();
}

// Process queue
jobs.process('queue_identifier', function(job, done) {
  console.log('Job', job.id, 'is done…');
  done && done();
});

// Create a new job every 3 seconds
setInterval(newJob, 3000);

// Run express frontend
const port = 3000;
kue.app.listen(port);