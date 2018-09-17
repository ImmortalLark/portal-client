/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:05
 * @Last Modified by: Feng fan
 * @Last Modified time: 2018-09-17 14:50:57
 */
const net = require('net');
const EventEmitter = require('events').EventEmitter;

class ConnectionManager extends EventEmitter {
    constructor(options) {
        super();
        const { host, port } = options;
        Object.assign(this, options);
        // 与服务器建立连接
        this.connection = net.connect({ host, port});
        this._init();
    }

    _init() {
        const { connection, _onClose, _onConnect, _onError } = this;
        connection.setKeepAlive(true);
        connection.once('connect', _onConnect.bind(this));
        connection.once('close', _onClose.bind(this));
        connection.once('error', _onError.bind(this));
    }

    _onConnect() {
        this.emit('connect');
    }

    _onError(e) {
        this.connection.end();
        this.emit('error', e);
    }

    _onClose(hasError) {
        this.emit('close', hasError);
    }
}

module.exports = ConnectionManager;
