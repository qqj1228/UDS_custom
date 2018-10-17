'use strict';

const mssql = require('mssql');
const fs = require('fs');

let config = {};

fs.readFile('./config.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    config = JSON.parse(data);
});

// 连接数据库
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

// 写sql语句自由查询
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
                console.log(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            });
        });
    });
}

// 查询该表所有符合条件的数据并可以指定前几个
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
        console.log(sql);
        ps.prepare(sql, (err) => {
            if (err) {
                console.log(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            });
        });
    });
}

// 查询该表所有数据
function selectAll(tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        const sql = `select * from ${tableName} `;
        ps.prepare(sql, (err) => {
            if (err) {
                console.log(err);
            }
            ps.execute('', (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            });
        });
    });
}

// 添加数据
function add(addObj, tableName, callBack) {
    getConnection((connection) => {
        const ps = new mssql.PreparedStatement(connection);
        let sql = `insert into ${tableName} (`;
        if (addObj !== '') {
            Object.keys(addObj).forEach((el) => {
                if (typeof addObj[el] === 'number') {
                    ps.input(el, mssql.Int);
                } else if (typeof addObj[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                }
                sql += `${el},`;
            });
            sql = `${sql.substring(0, sql.length - 1)}) values (`;
            Object.keys(addObj).forEach((el) => {
                if (typeof addObj[el] === 'number') {
                    sql += `${addObj[el]},`;
                } else if (typeof addObj[el] === 'string') {
                    sql += `'${addObj[el]}',`;
                }
            });
        }
        sql = `${sql.substring(0, sql.length - 1)})`;
        ps.prepare(sql, (err) => {
            if (err) {
                console.log(err);
            }
            ps.execute(addObj, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            });
        });
    });
}

// 更新数据
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
                    sql += `el = ${whereObj[el]} and `;
                } else if (typeof whereObj[el] === 'string') {
                    ps.input(el, mssql.NVarChar);
                    sql += `el = '${whereObj[el]}' and `;
                }
            });
        }
        sql = sql.substring(0, sql.length - 5);
        ps.prepare(sql, (err) => {
            if (err) {
                console.log(err);
            }
            ps.execute(updateObj, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
                    }
                });
            });
        });
    });
}

// 删除数据
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
        ps.prepare(sql, (err) => {
            if (err) {
                console.log(err);
            }
            ps.execute(params, (err1, recordset) => {
                callBack(err1, recordset);
                ps.unprepare((err2) => {
                    if (err2) {
                        console.log(err2);
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
    add,
};
