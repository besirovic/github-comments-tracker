const http = require('http');
const { App, createNodeMiddleware } = require('octokit');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore')

require('dotenv').config();

const { config } = require('./config');

const github = new App(config.github);
const firebase = initializeApp(config.firebase);
const db = getFirestore(firebase);

github.webhooks.on(
  [
    'discussion_comment.created',
    'pull_request_review_comment.created',
    'issue_comment.created',
    'commit_comment.created'
  ],
  ({ payload }) => {
    console.log('payload', payload)

    addDoc(collection(db, "github_events"), payload).then(() => {
      console.log('Document added');
    }).catch((error) => {
      console.log('Unable to write to Firebase Database. Check for more details: ', error);
    });
  }
);

github.webhooks.onError((error) => {
  if (error.name === 'AggregateError') {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

http.createServer(createNodeMiddleware(github)).listen(config.port, () => {
  console.log('Server is up and running...');
});
