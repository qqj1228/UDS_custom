'use strict';

const ipc = require('electron').ipcRenderer;
const Sortable = require('sortablejs');
const sql = require('mssql');
const fs = require('fs');

let config = {};

fs.readFile('./config.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    config = JSON.parse(data);
});

sql.on('error', (err) => {
    console.error(err);
});

function menuItemActive(e) {
    $(e.target).addClass('active').closest('.ui.menu').find('.item')
        .not($(e.target))
        .removeClass('active');
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

    $('.menu .item').on('click', menuItemActive);

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
    });

    $('#apply-btn').on('click', () => {
        sql.connect(config).then(() => {
            sql.query('select * from VehicleInfo');
        }).then((result) => {
            console.dir(result);
        }).catch((err) => {
            console.error(err);
        });
    });

    const ECUDone = document.getElementById('ECU-done');
    const ECUAlter = document.getElementById('ECU-alter');
    const ECUDoneSortable = Sortable.create(ECUDone, {
        group: 'ECU',
        animation: 100,
        scroll: true,
        handle: '.icon',
    });
    const ECUAlterSortable = Sortable.create(ECUAlter, {
        group: 'ECU',
        animation: 100,
        scroll: true,
        handle: '.icon',
    });
});
