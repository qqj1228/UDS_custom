'use strict';

const ipc = require('electron').ipcRenderer;
const Sortable = require('sortablejs');
const db = require('./db');
// ECU配置页使用
// {ECU名称: 全部的检测项目列表}
const {testInfo} = require('./testInfo');

// 车型配置页使用
// {车型号: ECU配置}
let vehicleTypeObj = {};

// 车型配置页使用
// {ECU的ID: ECU名称}
let ECUNameObj = {};

// ECU配置页使用
// {ECU名称: 检测项目配置}
let ECUObj = {};

function showError(err) {
    $('.error.message').find('li').remove();
    $('.error.message').find('.list').append(`<li>${err}</li>`);
    $('.error.message').removeClass('hiden');
}

function menuItemActive(e) {
    $(e.target).addClass('active').closest('.ui.menu').find('.item')
        .not($(e.target))
        .removeClass('active');
    $('#ECU-done').children().remove();
    $('#ECU-alter').children().remove();
    let item = '';
    Object.keys(ECUNameObj).forEach((el) => {
        item = `<div class="item" data="${el}"><i class="bars icon handle"></i><div class="content">${ECUNameObj[el]}</div></div>`;
        $('#ECU-alter').append(item);
    });
    if (vehicleTypeObj[$(e.target).text()]) {
        vehicleTypeObj[$(e.target).text()].forEach((el) => {
            item = `<div class="item" data="${el}"><i class="bars icon handle"></i><div class="content">${ECUNameObj[el]}</div></div>`;
            $('#ECU-done').append(item);
            $('#ECU-alter').children(`:contains('${ECUNameObj[el]}')`).remove();
        });
    }
}

function ECUItemActive(e) {
    $(e.target).addClass('active').closest('.ui.menu').find('.item')
        .not($(e.target))
        .removeClass('active');
    $('#test-done').children().remove();
    $('#test-alter').children().remove();
    let item = '';
    const ECUName = $(e.target).text();
    if (testInfo[ECUName]) {
        const {length} = testInfo[ECUName];
        for (let i = 0; i < length; i++) {
            item = `<div class="item" data="${i + 1}"><i class="bars icon handle"></i><div class="content">${testInfo[ECUName][i]}</div></div>`;
            $('#test-alter').append(item);
        }
    }
    if (ECUObj[ECUName]) {
        ECUObj[ECUName].forEach((el) => {
            item = `<div class="item" data="${el}"><i class="bars icon handle"></i><div class="content">${testInfo[ECUName][el - 1]}</div></div>`;
            $('#test-done').append(item);
            $('#test-alter').children(`:contains('${el}')`).remove();
        });
    }
}

function initUI() {
    db.selectAll('ECU', (err, result) => {
        if (err) {
            showError(err);
            return;
        }
        ECUNameObj = {};
        (result.recordset).forEach((el) => {
            ECUNameObj[el.ID] = el.ECUName;
        });
        db.selectAll('VehicleType', (err1, result1) => {
            if (err1) {
                showError(err1);
                return;
            }
            const current = $('#vehicle-list').find('.item.active').text();
            $('#vehicle-list').children().remove();
            vehicleTypeObj = {};
            (result1.recordset).forEach((el) => {
                $('#vehicle-list').append(`<a class="item">${el.VehicleType}</a>`);
                $('#vehicle-list .item:last').on('click', menuItemActive);
                const l = [];
                el.ECUConfig.split(',').forEach((item) => {
                    if (item) {
                        l.push(+item);
                    }
                });
                vehicleTypeObj[el.VehicleType] = l;
            });
            if (current) {
                $('#vehicle-list').find(`:contains("${current}")`).addClass('active');
            }
            $('#init-btn').removeClass('loading');
            $('#apply-btn').removeClass('loading');
        });
    });
}

function initECU() {
    db.selectAll('ECU', (err, result) => {
        if (err) {
            showError(err);
            return;
        }
        ECUObj = {};
        (result.recordset).forEach((el) => {
            const l = [];
            el.TestConfig.split(',').forEach((item) => {
                if (item) {
                    l.push(+item);
                }
            });
            ECUObj[el.ECUName] = l;
        });
        const current = $('#ECU-list').find('.item.active').text();
        $('#ECU-list').children().remove();
        Object.keys(ECUObj).forEach((el) => {
            $('#ECU-list').append(`<a class="item">${el}</a>`);
            $('#ECU-list .item:last').on('click', ECUItemActive);
        });
        if (current) {
            $('#ECU-list').find(`:contains("${current}")`).addClass('active');
        }
        $('#init-ECU-btn').removeClass('loading');
        $('#apply-ECU-btn').removeClass('loading');
    });
}

$(() => {
    // 初始化页面背景色
    ipc.send('get-background-color');
    ipc.on('return-background-color', (event, arg) => {
        document.body.style.backgroundColor = arg;
    });

    $('#vehicle-menu').on('click', () => {
        $.tab('change tab', 'vehicle-tab');
        $('#ECU-menu').removeClass('active');
        $('#vehicle-menu').addClass('active');
    });
    $('#ECU-menu').on('click', () => {
        $.tab('change tab', 'ECU-tab');
        $('#vehicle-menu').removeClass('active');
        $('#ECU-menu').addClass('active');
    });

    $('.message .close').on('click', (e) => {
        $(e.target).closest('.message').transition('fade');
    });

    $('#add-btn').on('click', () => {
        const vehicleType = $('[data-tab="vehicle-tab"] input').val();
        const l = [];
        $('#vehicle-list').children().each((index, el) => {
            l.push($(el).text());
        });
        if (vehicleType === '' || l.indexOf(vehicleType) >= 0) {
            return;
        }
        $('#vehicle-list').append(`<a class="item">${vehicleType}</a>`);
        $('#vehicle-list .item:last').on('click', menuItemActive);
    });

    $('#del-btn').on('click', () => {
        const vehicleType = $('[data-tab="vehicle-tab"] input').val();
        const item = $('#vehicle-list').find(`:contains("${vehicleType}")`);
        if (vehicleType === '' || $(item).length < 1) {
            return;
        }
        $('#vehicle-list').find(`:contains("${vehicleType}")`).remove();
        $('#ECU-done').children().remove();
        $('#ECU-alter').children().remove();
        db.del('where VehicleType = @VT', {VT: vehicleType}, 'VehicleType', (err) => {
            if (err) {
                showError(err);
            }
        });
    });

    $('#init-btn').on('click', () => {
        $('#init-btn').addClass('loading');
        initUI();
    });

    $('#init-ECU-btn').on('click', () => {
        $('#init-ECU-btn').addClass('loading');
        initECU();
    });

    $('#apply-btn').on('click', () => {
        const current = $('#vehicle-list').find('.item.active').text();
        if (current === '') {
            return;
        }
        $('#apply-btn').addClass('loading');
        const ecuDone = [];
        $('#ECU-done').children().each((index, el) => {
            ecuDone.push(+$(el).attr('data'));
        });
        if (current in vehicleTypeObj) {
            db.update({ECUConfig: ecuDone.join(',')}, {VehicleType: current}, 'VehicleType', (err) => {
                if (err) {
                    showError(err);
                    return;
                }
                initUI();
            });
        } else {
            db.insert({VehicleType: current, ECUConfig: ecuDone.join(',')}, 'VehicleType', (err) => {
                if (err) {
                    showError(err);
                    return;
                }
                initUI();
            });
        }
    });

    $('#apply-ECU-btn').on('click', () => {
        const current = $('#ECU-list').find('.item.active').text();
        if (current === '') {
            return;
        }
        $('#apply-ECU-btn').addClass('loading');
        const testDone = [];
        $('#test-done').children().each((index, el) => {
            testDone.push(+$(el).attr('data'));
        });
        if (current in ECUObj) {
            db.update({TestConfig: testDone.join(',')}, {ECUName: current}, 'ECU', (err) => {
                if (err) {
                    showError(err);
                    return;
                }
                initECU();
            });
        } else {
            db.insert({ECUName: current, TestConfig: testDone.join(',')}, 'ECU', (err) => {
                if (err) {
                    showError(err);
                    return;
                }
                initECU();
            });
        }
    });

    Sortable.create(document.getElementById('ECU-done'), {
        group: 'ECU',
        animation: 150,
        scroll: true,
        handle: '.icon',
    });
    Sortable.create(document.getElementById('ECU-alter'), {
        group: 'ECU',
        animation: 150,
        scroll: true,
        handle: '.icon',
    });

    Sortable.create(document.getElementById('test-done'), {
        group: 'test',
        animation: 150,
        scroll: true,
        handle: '.icon',
    });
    Sortable.create(document.getElementById('test-alter'), {
        group: 'test',
        animation: 150,
        scroll: true,
        handle: '.icon',
    });
});
