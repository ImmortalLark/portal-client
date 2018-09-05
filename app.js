/*
 * @Author: Feng fan
 * @Date: 2018-09-05 10:53:38
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-09-05 16:01:22
 */
const local = require('./lib/local');
const remote = require('./lib/remote');

module.exports = ({
    remoteHost, // 远端服务地址
    remotePort = 80, // 远端服务端口
    subdomain, // 指定的子域名
    remoteConnectPort, // 指定的tcp连接端口
    localHost = 'localhost', // 本地项目host
    localPort = 80 // 本地项目端口
}) => {
    remote({
        host: remoteHost, 
        port: remotePort,
        subdomain,
        connectPort: remoteConnectPort,
        local: local({ host: localHost, port: localPort })
    });
}