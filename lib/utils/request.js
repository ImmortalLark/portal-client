/*
 * @Author: ImmortalLark
 * @Date: 2018-11-23 15:21:39
 * @Last Modified by: ImmortalLark
 * @Last Modified time: 2019-01-11 16:32:05
 */
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const querystring = require('querystring');

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
        if (encoding === 'gzip') { // 处理编码为gzip的数据
          zlib.gunzip(body, function(err, decoded) {
            resolve({
              ...data,
              body: decoded ? decoded.toString() : ''
            });
          })
        } else if (encoding == 'deflate') { // 处理编码为deflate的数据
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
    if (req.method === "POST" && req.headers['content-type']) {
      request.write(req.headers['content-type'].includes('json') ? JSON.stringify(req.body) : querystring.stringify(req.body));
    }
    request.end();
    request.on('error', e => reject(e));
  });
}