var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  console.log('Handling ', req.method, ' request: ',req.url);

  if (req.method === "GET") {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, path.join(archive.paths.siteAssets,'index.html'));
    } else {
      httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
    }
  } else if (req.method === "POST") {
    var data = '';
    req.on('data', function(chunks) {
      data += chunks;
    });
    req.on('end', function(){
      // var url = data.split('=')[1];
      var url = JSON.parse(data).url;
      archive.addUrlToList(url);
      res.writeHead(302);
      res.end();
    });
  }    
};
