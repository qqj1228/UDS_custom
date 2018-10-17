'use strict';

const ipc = require('electron').ipcRenderer;
const Sortable = require('sortablejs');
const db = require('./db');

let vehicleTypeList = {};
let ECUList = {};

function menuItemActive(e) {
    $(e.target).addClass('active').closest('.ui.menu').find('.item')
        .not($(e.target))
        .removeClass('active');
    $('#ECU-done').children().remove();
    $('#ECU-alter').children().remove();
    Object.keys(ECUList).forEach((el) => {
        $('#ECU-alter').append(`<div class="item"><i class="bars icon handle"></i><div class="content">${ECUList[el]}</div></div>`);
    });
    if (vehicleTypeList[$(e.target).text()]) {
        vehicleTypeList[$(e.target).text()].forEach((el) => {
            $('#ECU-done').append(`<div class="item"><i class="bars icon handle"></i><div class="content">${ECUList[el]}</div></div>`);
            $('#ECU-alter').children(`:contains('${ECUList[el]}')`).remove();
        });
    }
}

function initUI() {
    db.selectAll('ECU', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        ECUList = {};
        (result.recordset).forEach((el) => {
            ECUList[el.ID] = el.ECUName;
        });
    });
    db.selectAll('VehicleType', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        $('#vehicle-list').children().remove();
        vehicleTypeList = {};
        (result.recordset).forEach((el) => {
            $('#vehicle-list').append(`<a class="item">${el.VehicleType}</a>`);
            $('#vehicle-list .item:last').on('click', menuItemActive);
            const l = [];
            el.ECUConfig.split(',').forEach((item) => {
                l.push(+item);
            });
            vehicleTypeList[el.VehicleType] = l;
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

    // $('.menu .item').on('click', menuItemActive);

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
        if (vehicleType === '') {
            return;
        }
        $('#vehicle-list').find(`:contains("${vehicleType}")`).remove();
        $('#ECU-done').children().remove();
        $('#ECU-alter').children().remove();
    });

    $('#init-btn').on('click', () => {
        initUI();
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
