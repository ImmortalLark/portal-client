/*
 * @Author: Feng fan
 * @Date: 2018-11-22 17:09:39
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-11-26 11:10:36
 */
const EventEmitter = require('events').EventEmitter;
const SocketClient = require('socket.io-client');
const logger = require('./utils/logger');
const request = require('./utils/request');
/**
 * 管理websocket连接
 * @class Connection
 * @extends {EventEmitter}
 */
class Connection extends EventEmitter {
  constructor(options) {
    super();
    Object.assign(this, options)
    const { remoteHost, remoteConnectPort, subdomain } = this;
    this.socket = SocketClient(`http://${remoteHost}/socket/${subdomain}`);
    this.socket.on('connect', this.connect.bind(this));
    this.socket.on('portal-request', this.request.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    this.socket.on('error', this.onError.bind(this));
  }

  connect() {
    logger.info('connect');
    this.emit('connect');
  }

  /**
   * 向本地项目发起请求并回传响应数据到服务端
   * @param {Object} req http请求对象
   * @param {Function} callback websocket事件回调函数
   * @memberof Connection
   */
  request(req, callback) {
    logger.info('request local application');
    request(req, {
      hostname: this.localHost,
      port: this.localPort
    }).then((res) => {
      callback(res);
    }).catch((error) => {
      logger.error(error);
    });
  }

  onError(e) {
    logger.error(e);
    this.socket.close();
  }

  disconnect() {
    logger.info('disconnect');
    delete this.socket;
    this.emit('disconnect');
  }

}
module.exports = Connection;