var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  console.log('Handling ', req.method, ' request: ',req.url);

  if (req.method === "GET") {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, path.join(archive.paths.siteAssets,'index.html'));
    } else if (req.url === '/loading.html') { 
      httpHelpers.serveAssets(res, path.join(archive.paths.siteAssets,'loading.html'));
    } else {
      httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
    }
  } else if (req.method === "POST") {
    var data = '';
    req.on('data', function(chunks) {
      data += chunks;
    });
    req.on('end', function(){
      var url = data.split('=')[1];
      // var url = JSON.parse(data).url;
      archive.isUrlInList(url, function(isInList) {
        if (isInList) {
          res.writeHead(302,{'Location':'http://127.0.0.1:8080/'+url});
          res.end();
        } else {
          res.writeHead(302,{'Location':'http://127.0.0.1:8080/'+'loading.html'});
          res.end();
          archive.addUrlToList(url);
        }
      });
    });
  }    
};
