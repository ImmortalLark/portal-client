/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:11
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-09-13 15:59:47
 */
const axios = require('axios');
const ConnectionManager = require('./ConnnectionManager');

class Portal {
    constructor(options) {
        Object.assign(this, options);
        this.connectionCount = 0;
    }
    
    init({ maxConnectionCount }) {
        this._getAddress();
        for(let i = 0; i< maxConnectionCount; i++) {
            this.connectionCount++;
            this._connect();
        }
    }

    // 取得远程连接的相关信息
    async _getAddress() {
        const { remoteHost, remotePort, subdomain = '', remoteConnectPort = ''} = this;
        const url = `http://${remoteHost}:${remotePort}/portal/connect?subdomain=${subdomain}&port=${connectPort}`;
        const response = await axios.get(url);
        // 分配的子域名
        this.subdomain = response.data.subdomain;
        // 分配的连接端口
        this.remoteConnectPort = response.data.port;
    }

    _connect() {
        const { 
            remoteHost, remotePort, remoteConnectPort, 
            localHost, localPort, subdomain,
            connectionCount
         } = this;
        // 连接服务
        const remote = new ConnectionManager({ 
            host: remoteHost,
            port: remoteConnectPort
        });
        remote.once('connect', () => {
            console.log(`已连接远端服务: 可访问${subdomain}.${remoteHost}:${remotePort} 连接数：${connectionCount}`);
            // 连接本地项目
            const local = new ConnectionManager({
                host: localHost,
                port: localPort
            });
            local.once('connect', () => {
                remote.connection.pipe(local.connection).pipe(remote.connection);
            })
        });
        remote.once('close', () => {
            this.connectionCount--;
            // 维持连接数量
            this._connect();
        })
    }
}

module.exports = Portal;