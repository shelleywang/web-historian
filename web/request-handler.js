var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  console.log('Handling ', req.method, ' request: ',req.url);

  if (req.url === '/') {
    httpHelpers.serveAssets(res,path.join(archive.paths.siteAssets,'index.html'));
  } else {
    console.log(req.url);
    httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
  }  
};
