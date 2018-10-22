'use strict';

const mssql = require('mssql');
const fs = require('fs');

// 默认数据库配置文件
let config = {
    user: 'sa',
    password: 'sh49',
    server: '127.0.0.1',
    database: 'JAC_UDS',
    port: 1433,
    options: {encrypt: false},
};
// 读取./config/db.json文件
const path = `${__dirname}/config/db.json`;
if (fs.existsSync(path)) {
    config = JSON.parse(fs.readFileSync(path, 'utf8'));
} else {
    console.warn('Can not find ./config/db.json, using default database setting.');
}

/**
 * 连接数据库
 * @callback callback 执行完成后的回调函数
 */
function getConnection(callback) {
    const con = new mssql.ConnectionPool(config, (err) => {
        if (err) {
            throw err;
        }
        if (callback) {
            callback(con);
        }
    });
}

/**
 * 写sql语句自由查询
 * @param {string} sql T-SQL语句
 * @param {Object} params 输入参数对象，key: 输入参数名，value: 输入参数值
 * @callback callBack 执行完成后的回调函数
 */
function querySql(sql, params, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        if (params !== '') {
            Object.keys(params).forEach((el) => {
                if (typeof params[el] === 'number') {
                    ps.input(el, mssql.Int);
                } else if (typeof params[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                }
            });
        }
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

/**
 * 查询该表所有符合条件的数据并可以指定前几个
 * @param {string} tableName 要操作的表名
 * @param {Number} topNumber 前几个数量
 * @param {string} whereSql where T-SQL语句
 * @param {Object} params 参数对象，key: 输入参数名，value: 输入参数值
 * @param {string} orderSql order T-SQL语句
 * @callback callBack 执行完成后的回调函数
 */
function select(tableName, topNumber, whereSql, params, orderSql, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        let sql = `select * from ${tableName} `;
        if (topNumber !== '') {
            sql = `select top(${topNumber}) * from ${tableName} `;
        }
        sql += `${whereSql} `;
        if (params !== '') {
            Object.keys(params).forEach((el) => {
                if (typeof params[el] === 'number') {
                    ps.input(el, mssql.Int);
                } else if (typeof params[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                }
            });
        }
        sql += orderSql;
        console.info(sql);
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

/**
 * 查询该表所有数据
 * @param {string} tableName 要操作的表名
 * @callback callBack 执行完成后的回调函数
 */
function selectAll(tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        const sql = `select * from ${tableName} `;
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute('', (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

/**
 * 插入数据
 * @param {object} insertObj 要插入的内容对象，key: 字段名，value: 字段值
 * @param {string} tableName 要操作的表名
 * @callback callBack 执行完成后的回调函数
 */
function insert(insertObj, tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        let sql = `insert into ${tableName} (`;
        if (insertObj !== '') {
            Object.keys(insertObj).forEach((el) => {
                if (typeof insertObj[el] === 'number') {
                    ps.input(el, mssql.Int);
                } else if (typeof insertObj[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                }
                sql += `${el},`;
            });
            sql = `${sql.substring(0, sql.length - 1)}) values (`;
            Object.keys(insertObj).forEach((el) => {
                if (typeof insertObj[el] === 'number') {
                    sql += `${insertObj[el]},`;
                } else if (typeof insertObj[el] === 'string') {
                    sql += `'${insertObj[el]}',`;
                }
            });
        }
        sql = `${sql.substring(0, sql.length - 1)})`;
        console.info(sql);
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute(insertObj, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

/**
 * 更新数据
 * @param {object} updateObj 要更新的内容对象，key: 字段名，value: 字段值
 * @param {object} whereObj where条件对象，key: 字段名，value: 字段值
 * @param {string} tableName 要操作的表名
 * @callback callBack 执行完成后的回调函数
 */
function update(updateObj, whereObj, tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        let sql = `update ${tableName} set `;
        if (updateObj !== '') {
            Object.keys(updateObj).forEach((el) => {
                if (typeof updateObj[el] === 'number') {
                    ps.input(el, mssql.Int);
                    sql += `${el} = ${updateObj[el]},`;
                } else if (typeof updateObj[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                    sql += `${el} = '${updateObj[el]}',`;
                }
            });
        }
        sql = `${sql.substring(0, sql.length - 1)} where `;
        if (whereObj !== '') {
            Object.keys(whereObj).forEach((el) => {
                if (typeof whereObj[el] === 'number') {
                    ps.input(el, mssql.Int);
                    sql += `${el} = ${whereObj[el]} and `;
                } else if (typeof whereObj[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                    sql += `${el} = '${whereObj[el]}' and `;
                }
            });
        }
        sql = sql.substring(0, sql.length - 5);
        console.info(sql);
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute(updateObj, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

/**
 * 删除数据
 * @param {string} whereSql where T-SQL语句
 * @param {object} params 参数对象，key: 输入参数名, 需要与whereSql中的@参数一致，value: 输入参数值
 * @param {string} tableName 要操作的表名
 * @callback callBack 执行完成后的回调函数
 */
function del(whereSql, params, tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        let sql = `delete from ${tableName} `;
        if (params !== '') {
            Object.keys(params).forEach((el) => {
                if (typeof params[el] === 'number') {
                    ps.input(el, mssql.Int);
                } else if (typeof params[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                }
            });
        }
        sql += whereSql;
        console.info(sql);
        ps.prepare(sql, (err) => {
            if (err) {
                console.error(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.error(err2);
                    }
                });
            });
        });
    });
}

module.exports = {
    config,
    del,
    select,
    selectAll,
    update,
    querySql,
    insert,
};
