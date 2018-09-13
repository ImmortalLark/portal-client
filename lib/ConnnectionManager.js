/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:05
 * @Last Modified by:   Feng fan
 * @Last Modified time: 2018-09-13 15:45:05
 */
const net = require('net');
const EventEmitter = require('events').EventEmitter;

class ConnectionManager extends EventEmitter{
    constructor(options) {
        super();
        const { host, port } = options;
        // 与服务器建立连接
        this.connection = net.connect({ host, port});
        this._init();
    }

    _init() {
        const { connection, _onClose, _onConnect, _onConnect } = this;
        connection.setKeepAlive(true);
        connection.once('connect', _onConnect.bind(this));
        connection.once('close', _onClose.bind(this));
        connection.once('Error', _onError.bind(this));
    }

    _onConnect() {
        console.log(`连接成功：${host}:${port}`);
        this.emit('connect');
    }

    _onError(e) {
        console.log(`${this.name} error: ${e.message}`);
        this.connection.end();
        this.emit('error');
    }

    _onClose() {
        console.log(`${this.name} close`);
        this.emit('close');
    }
}

module.exports = ConnectionManager;
