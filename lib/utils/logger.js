/*
 * @Author: Feng fan
 * @Date: 2018-11-23 15:21:42
 * @Last Modified by: Feng fan
 * @Last Modified time: 2019-01-28 10:56:37
 */
const log4js = require('log4js');
const logger = log4js.getLogger('client');
logger.level = 'debug';
module.exports = logger;