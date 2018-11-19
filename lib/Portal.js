/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:11
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-11-19 17:13:03
 */
const { Transform } = require('stream');
const axios = require('axios');
const ConnectionManager = require('./ConnnectionManager');


class Portal {
    constructor(options) {
        Object.assign(this, options);
        this.connectionCount = 0;
    }
    
    async init({ maxConnectionCount }) {
        this.maxConnectionCount = maxConnectionCount;
        const response = await this._getAddress();
        // 分配的子域名
        this.subdomain = response.data.subdomain;
        // 分配的连接端口
        this.remoteConnectPort = response.data.port;
        for(let i = 0; i< maxConnectionCount; i++) {
            this._connect();
        }
    }

    // 取得远程连接的相关信息
    _getAddress() {
        const { remoteHost, remotePort, subdomain = '', remoteConnectPort = ''} = this;
        const url = `http://${remoteHost}:${remotePort}/portal/connect?subdomain=${subdomain}&port=${remoteConnectPort}`;
        return axios.get(url);
    }

    _connect() {
        const { 
            remoteHost, remotePort, remoteConnectPort, 
            localHost, localPort, subdomain
        } = this;
        // 替换host
        const HeadHostTransform = new Transform({
            transform(chunk, encoding, callback) {
                let pattern = `${subdomain}.${remoteHost}`;
                remotePort !== 80 && (pattern += `:${remotePort}`);
                // chunk = chunk.toString().replace(new RegExp(pattern, 'g'), function(match) {
                //     let replaceText = localHost;
                //     localPort !== 80 && (replaceText += `:${localPort}`);
                //     return replaceText;
                // });
                callback(null, chunk);
            }
        });
        // 连接服务
        const remote = new ConnectionManager({ 
            host: remoteHost,
            port: remoteConnectPort
        });
        remote.once('connect', () => {
            this.connectionCount++;
            if (this.connectionCount >= this.maxConnectionCount) {
                console.log(`已连接远端服务: 可访问${subdomain}.${remoteHost}:${remotePort} 连接数：${this.connectionCount}`);
            }
            // 连接本地项目
            const local = new ConnectionManager({
                host: localHost,
                port: localPort
            });
            local.once('connect', () => {
                remote.connection.pipe(HeadHostTransform).pipe(local.connection).pipe(remote.connection);
            });
            local.once('error', (e) => {
                console.log("local error:", e.message);
            });
        });
        remote.once('close', (hasError) => {
            this.connectionCount--;
            if (!hasError) {
                // 维持连接数量
                this._connect();
            }
        });
        remote.once('error', (e) => {
            console.log("remote error:", e.message);
        });
    }
}

module.exports = Portal;