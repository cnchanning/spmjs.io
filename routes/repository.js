var Project = require('../models/project');
var Package = require('../models/package');
var crypto = require('crypto');

exports.index = function(req, res) {
  res.send("respond with a resource");
};

exports.project = {
  get: function(req, res) {
    res.send("respond with a resource");
  },
  delete: function(req, res) {
    res.send(200, {
      status: 'info',
      message: 'Project is deleted.'
    });
  }
};

exports.package = {
  get: function(req, res) {
    res.send("respond with a resource");
  },
  post: function(req, res) {
    var data = req.body;
    project = new Project(data);
    project.update(data);
    res.send(200);
  },
  put: function(req, res) {
    var data = req.body;
    var package = new Package(data);
    if (!package) {
      abortify(res, {
        code: 404,
        message: 'Package not found.'
      });
      return;
    }
    uploadPackage(package, req, res);
  },
  delete: function(req, res) {
    res.send(200, {
      status: 'info',
      message: 'Project is deleted.'
    });
  }
};

function uploadPackage(package, req, res) {
  var encoding = req.headers['content-encoding'];
  var ctype = req.headers['content-type'];
  if (ctype == 'application/x-tar' && encoding == 'gzip') {
    ctype = 'application/x-tar-gz'
  }
  if (ctype !== 'application/x-tar-gz' && ctype !== 'application/x-tgz') {
    abortify(res, {
      code: 415,
      message: 'Only gziped tar file is allowed.'
    });
  }

  package.md5 = crypto.createHash('md5').update(req.body).digest('hex');
  var md5 = req.headers['x-package-md5'];
  if (md5 && md5 !== package.md5) {
    abortify(res, {
      code: 400,
      message: 'MD5 does not match.'
    });
  }

  res.send(200);
}

function abortify(res, options) {
  code = options.code || 401;
  status = options.status || 'error';

  var msgs = {
    400: 'Bad request.',
    401: 'Authorization required.',
    403: 'Permission denied.',
    404: 'Not found.',
    406: 'Not acceptable.',
    415: 'Unsupported media type.',
    426: 'Upgrade required.',
    444: 'Force option required.'
  };
  message = options.message || msgs[code];
  res.send(code, {
    status: status,
    message: message
  });
}

// TODO:
//   1. auth
//   2. force
//   3. remove
//   4. publisher
