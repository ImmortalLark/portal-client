/*
 * @Author: Feng fan
 * @Date: 2018-11-23 15:21:39
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-11-23 16:43:16
 */
const http = require('http');

module.exports = (req, {
  hostname,
  port
}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port,
      path: req.path,
      method: req.method,
      headers: req.headers
    }
    const request = http.request(options, (res)=> {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          headers: res.headers,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body
        });
      });
    });
    request.end();
  })
}