import path from 'path';
import express from 'express';
import PrettyError from 'pretty-error';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes
// if the user agent is not known.
// ----------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Middlewares
// ----------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
// TODO cookie parser
// TODO body parser

if (!isProduction) {
  app.enable('trust proxy');
}

// Error handling
// ----------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((error, req, res, next) => {
  console.error(pe.render(err));
  res.status(err.status || 500);
  res.send(err);
});

app.listen(8888, () => {
  // meet the convention in tools/startServer.js
  console.log('Server started on http://localhost:8888/');
});

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
});
