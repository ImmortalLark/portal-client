/*
 * @Author: Feng fan
 * @Date: 2018-09-05 10:53:38
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-12-17 16:04:48
 */
const Portal = require('./lib/Portal');

module.exports = ({
    remoteHost, // 远端服务地址
    remotePort = 80, // 远端http服务端口
    subdomain, // 指定的子域名,为空则随机分配
    remoteConnectPort = 2000, // 远端websocket连接端口
    localHost = 'localhost', // 本地项目host
    localPort = 80, // 本地项目端口
    maxConnectionCount = 10, // 最大连接数
    fallback // 备用请求地址
}) => {
    const portal = new Portal({
        remoteHost, 
        remotePort, 
        subdomain, 
        remoteConnectPort, 
        localHost,
        localPort,
        fallback
    });
    portal.init({ maxConnectionCount });
}