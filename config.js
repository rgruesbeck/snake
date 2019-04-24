var fs = require('fs');

var kojiConfig = require('./.koji/resources/scripts/buildConfig.js');
var koji = kojiConfig();

fs.writeFileSync('config.json', koji);

var kojiManifest = require('./.koji/resources/scripts/manifest.js');
var manifest = kojiManifest();

fs.writeFileSync('manifest.webmanifest', manifest);
