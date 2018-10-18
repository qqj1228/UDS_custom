'use strict';

const ipc = require('electron').ipcRenderer;
const Sortable = require('sortablejs');
const db = require('./db');

let vehicleTypeList = {};
let ECUList = {};

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
    Object.keys(ECUList).forEach((el) => {
        item = `<div class="item" data="${el}"><i class="bars icon handle"></i><div class="content">${ECUList[el]}</div></div>`;
        $('#ECU-alter').append(item);
    });
    if (vehicleTypeList[$(e.target).text()]) {
        vehicleTypeList[$(e.target).text()].forEach((el) => {
            item = `<div class="item" data="${el}"><i class="bars icon handle"></i><div class="content">${ECUList[el]}</div></div>`;
            $('#ECU-done').append(item);
            $('#ECU-alter').children(`:contains('${ECUList[el]}')`).remove();
        });
    }
}

function initUI() {
    db.selectAll('ECU', (err, result) => {
        if (err) {
            showError(err);
            return;
        }
        ECUList = {};
        (result.recordset).forEach((el) => {
            ECUList[el.ID] = el.ECUName;
        });
        db.selectAll('VehicleType', (err1, result1) => {
            if (err1) {
                showError(err1);
                return;
            }
            const current = $('#vehicle-list').find('.item.active').text();
            $('#vehicle-list').children().remove();
            vehicleTypeList = {};
            (result1.recordset).forEach((el) => {
                $('#vehicle-list').append(`<a class="item">${el.VehicleType}</a>`);
                $('#vehicle-list .item:last').on('click', menuItemActive);
                const l = [];
                el.ECUConfig.split(',').forEach((item) => {
                    l.push(+item);
                });
                vehicleTypeList[el.VehicleType] = l;
            });
            $('#init-btn').removeClass('loading');
            $('#apply-btn').removeClass('loading');
            if (current) {
                $('#vehicle-list').find(`:contains("${current}")`).addClass('active');
            }
        });
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
        const vehicleType = $('input').val();
        if (vehicleType === '') {
            return;
        }
        $('#vehicle-list').append(`<a class="item">${vehicleType}</a>`);
        $('#vehicle-list .item:last').on('click', menuItemActive);
    });

    $('#del-btn').on('click', () => {
        const vehicleType = $('input').val();
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

    $('#apply-btn').on('click', () => {
        $('#apply-btn').addClass('loading');
        const current = $('#vehicle-list').find('.item.active').text();
        const ecuDone = [];
        $('#ECU-done').children().each((index, el) => {
            ecuDone.push(+$(el).attr('data'));
        });
        if (current in vehicleTypeList) {
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
});
