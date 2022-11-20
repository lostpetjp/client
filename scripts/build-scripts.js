const buildJs = require('./utils').buildJs;

Promise.all([
  buildJs({
    src: process.argv[2],
    minify: true,
  }),
  buildJs({
    src: process.argv[2],
    minify: false,
  }),
]).catch(console.error);