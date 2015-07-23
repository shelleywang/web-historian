var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'binary', function(err, data) {
    if (err) throw err;
    var urlArray = data.split('\n');
    if (callback) callback(urlArray);
  });
};

exports.isUrlInList = function(site, callback) {
  exports.readListOfUrls(function(urlArray) {
    var ifInList = urlArray.indexOf(site) !== -1;
    if (callback) callback(ifInList);
  });
};

exports.addUrlToList = function(site, callback) {
  var newLineInSites = site+'\n';
  fs.appendFile(exports.paths.list, newLineInSites, function(err) {
    if (err) throw err;
    if (callback) callback();
  });
};

exports.isUrlArchived = function(site, callback) {
  var archivePath = path.join(exports.paths.archivedSites, site);
  fs.readFile(archivePath, function(err, data) {
    if (err) {
      if (callback) callback(false);
    } 
    else {
      if (callback) callback(true);
    } 
  });
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (!exists) {
        httpRequest.get(url, function (err, res) {
          if (err) throw err; 
          var archivedFileName = path.join(exports.paths.archivedSites, url);
          fs.writeFile(archivedFileName, res.buffer.toString(),function(err) {
            if (err) throw err;
            exports.addUrlToList(url);
          });
           // console.log(res.code, res.headers);
        });
      } 
    });
  });
};
