/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:11
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-12-14 18:00:38
 */
const { Transform } = require('stream');
const axios = require('axios');
const Connection = require('./connection');
const logger = require('./utils/logger');

class Portal {
  constructor(options) {
    Object.assign(this, options);
  }
  
  async init({ maxConnectionCount }) {
    this.maxConnectionCount = maxConnectionCount;
    const response = await this._getAddress();
    // 分配的子域名
    this.subdomain = response.data.subdomain;
    logger.info('已获取:', this.subdomain)
    this._connect();
  }

  // 取得远程连接的相关信息
  _getAddress() {
    const { remoteHost, remotePort, subdomain = ''} = this;
    const url = `http://${remoteHost}:${remotePort}/portal/connect?subdomain=${subdomain}`;
    return axios.get(url);
  }

  _connect() {
    const { 
      remoteHost, remoteConnectPort, 
      localHost, localPort, subdomain,
      fallback
    } = this;
    this.connection = new Connection({
      remoteHost, remoteConnectPort, 
      localHost, localPort, subdomain,
      fallback
    });
    this.connection.on('connect', () => {
      logger.info(`可访问${subdomain}.${remoteHost}`);
    });
    this.connection.on('disconnet', () => {
      // 退出程序
      process.exit();
    });
  }
}

module.exports = Portal;