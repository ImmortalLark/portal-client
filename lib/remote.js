/*
 * @Author: Feng fan
 * @Date: 2018-09-05 10:53:34
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-09-05 18:29:58
 */
const net = require('net');
const http = require('http');
const iconv = require('iconv-lite');

module.exports = ({ 
    host,
    port,
    subdomain,
    connectPort,
    local
}) => {
    const options = {
        host,
        port,
        path: `/portal/connect?subdomain=${subdomain ? subdomain : ''}&port=${connectPort ? connectPort : ''}`
    };
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            chunk = JSON.parse(chunk);
            connectPort = chunk.port;
            subdomain = chunk.subdomain;
        });
        res.on('end', async () => {
            const socket = new net.Socket();
            socket.setKeepAlive(true);
            socket.connect(connectPort, host, () => {
                console.log(`已连接远端服务: 可访问${subdomain}.${host}:${port}`);
                socket.on('data', async (data) => {
                   data = await local.request(JSON.parse(data.toString()));
                    const buffer = new Buffer(JSON.stringify(data), 'utf8');
                    socket.write(buffer);
                });
            })
        });
    });
    req.end();
}