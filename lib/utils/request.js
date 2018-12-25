/*
 * @Author: Feng fan
 * @Date: 2018-11-23 15:21:39
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-12-25 11:14:31
 */
const http = require('http');
const https = require('https');
const zlib = require('zlib');

module.exports = (req, {
  hostname,
  port
}, enableHttps) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port,
      path: req.path,
      method: req.method,
      headers: req.headers
    }
    options.headers.referer = options.headers.referer ? options.headers.referer.replace(options.headers.host, hostname) : '';
    options.headers.host = hostname;
    options.timeout = 3000;
    const requestCallback = (res)=> {
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      res.on('end', () => {
        const encoding = res.headers['content-encoding'];
        const data = {
          headers: res.headers,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
        };
        body = Buffer.concat(body);
        if (encoding === 'gzip') {
          zlib.gunzip(body, function(err, decoded) {
            resolve({
              ...data,
              body: decoded ? decoded.toString() : ''
            });
          })
        } else if (encoding == 'deflate') {
          zlib.inflate(body, function(err, decoded) {
            resolve({
              ...data,
              body: decoded ? decoded.toString() : ''
            });
          })
        } else {
          resolve({
            ...data,
            body: body.toString()
          });
        }
      });
      res.on('error', (e) => {
        reject(e);
      })
    };
    const request = enableHttps ? https.request(options, requestCallback) : http.request(options, requestCallback);
    req.method === "POST" && request.write(JSON.stringify(req.body));
    request.end();
    request.on('error', e => reject(e));
  });
}