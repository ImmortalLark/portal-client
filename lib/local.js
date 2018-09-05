/*
 * @Author: Feng fan
 * @Date: 2018-09-05 10:53:41
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-09-05 16:31:32
 */
const http = require('http');
const iconv = require('iconv-lite');

module.exports = ({
    host,
    port
}) => {
    return {
        request: (data) => {
            const { req, body } = data;
            const options = {
                host,
                port,
                method: req.method,
                path: req.url,
                headers: req.header
            }
            return new Promise((resolve) => {
                const localReq = http.request(options, (res) => {
                    let body = [];
                    let size = 0;
                    res.on('data',(chunk) => {
                        body.push(chunk);
                        size += chunk.length;
                    });
                    res.on('end', () => {
                        let buf = Buffer.concat(body, size);
                        body = iconv.decode(buf, 'utf8');
                        resolve({
                            headers: res.headers,
                            body
                        })
                    })
                });
                req.method.toLowerCase() === "post" && localReq.write(body);
                localReq.end();
            });
        }
    }
}