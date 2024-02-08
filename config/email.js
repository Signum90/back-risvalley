const nodemailer = require('nodemailer');
const fs = require('fs');

const config = require('../config/config');


let emailTransport = nodemailer.createTransport(config.email.smtp);

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

module.exports = { emailTransport, readHTMLFile }