/*
 * @Author: Feng fan
 * @Date: 2018-11-22 17:09:39
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-12-25 11:16:33
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
    this.socket = SocketClient(`http://${remoteHost}:${remoteConnectPort}/socket/${subdomain}`);
    this.socket.on('connect', this.connect.bind(this));
    this.socket.on('portal-request', this.requestLocal.bind(this));
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
  requestLocal(req, callback) {
    logger.info('request local application');
    this.request(req, {
      hostname: this.localHost,
      port: this.localPort
    }).then((res) => {
      if (res.body === '404' && this.fallback) {
        this.requestFallback(req, callback);
      } else {
        callback(res);
      }
    }).catch((error) => {
      callback(error);
    });
  }

  requestFallback(req, callback) {
    const fallback = this.fallback;
    logger.info('request fallback application');
    let hostname;
    if (typeof fallback === "string") {
      hostname = fallback
    } else {
      // 根据配置的api选择对应的fallback环境
      Object.keys(fallback).some((key) => {
        if (!!~req.path.indexOf(key)) {
          hostname=fallback[key];
          return true;
        }
        return false;
      });
    }
    
    if (hostname) {
      this.request(req, {
        hostname,
        port: 80
      }).then((res) => {
        callback(res);
      }).catch((error) => {
        callback(error);
      });
    } else {
      callback({
        statusCode: 404,
        statusMessage: 'not found'
      })
    }
  }

  request(req, options, enableHttps) {
    return new Promise((resolve, reject) => {
      request(req, options, enableHttps).then((res) => {
        if (res.statusCode === 301) {
          const location = res.headers.location;
          const locationArr = location.split("://");
          const protocal = locationArr[0];
          const path = locationArr[1].split(options.hostname)[1];
          req.path = path;
          options.port = 443;
          return this.request(req, options, protocal === "https");
        }
        return res;
      }).then((res) => {
        resolve(res);
      }).catch((error) => {
        logger.error(error);
        reject({
          body: {
            code: '500',
            msg: 'error'
          }
        });
      });
    });
  }

  onError(e) {
    logger.info('error');
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