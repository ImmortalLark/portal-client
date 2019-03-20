/*
 * @Author: ImmortalLark
 * @Date: 2018-11-23 15:21:42
 * @Last Modified by: ImmortalLark
 * @Last Modified time: 2019-03-20 11:19:02
 */
const log4js = require('log4js');
const logger = log4js.getLogger('client');
logger.level = 'debug';
module.exports = logger;