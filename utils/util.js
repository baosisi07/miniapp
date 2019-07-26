'use strict';

/* eslint-disable */
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}


function getDeviceInfo(wx) {
    let res = wx.getSystemInfoSync(),
        windowWidth;

    windowWidth = res.windowWidth;
    return { windowWidth };
}

function shouldDiscardTap(currentTimeStamp, lastTimeStamp) {
    if (lastTimeStamp !== 0 && currentTimeStamp - lastTimeStamp < 250) {
        return true;
    }

    return false;
}

function formatImgUrl(json) {
    json.data && json.data.map(item => {
        let replaceStr = '{width}';
        let url = item.src;

        url = url.replace(new RegExp('{width}'), windowWidth * 2).replace(new RegExp('{height}'), 100).replace(new RegExp('{mode}'), '2');
        item.src = url;
    });
    return json;
}

function getImageUrl(url, windowWidth, height) {
    if (!url) {
        return '';
    }
    return url.replace(new RegExp('{width}'), windowWidth * 2).replace(new RegExp('{height}'), height ? height : 100).replace(new RegExp('{mode}'), '2');
}

// 自动识别 2倍 3倍图
function getImageUrlWithWH(image_url, image_width, image_height) {
    let app = getApp();
    const screenWidth = app.globalData.systemInfo.screenWidth;
    const pixelRatio = app.globalData.systemInfo.pixelRatio;
    const DEVICE_WIDTH_RATIO = screenWidth / 375.0;

    if (!image_url) {
        return '';
    }
    return image_url.replace(/{width}/g, parseInt(image_width * DEVICE_WIDTH_RATIO * pixelRatio)).replace(/{height}/g, parseInt(image_height * DEVICE_WIDTH_RATIO * pixelRatio)).replace('{mode}', 2);
}

function getBrandID(url) {
    let params = url.split('openby:yohobuy=');

    if (params.length === 2) {
        let jsonParam = JSON.parse(params[1]);

        return jsonParam.params.brand_id;
    }
    return null;
}

function isStringEmpty(str) {
    if (str === undefined || str === null || str === '') {
        return true;
    } else {
        return false;
    }
}

function getGoodDetailParam(url) {
    let params = url.split('openby:yohobuy=');

    if (params.length === 2) {
        let jsonParam = JSON.parse(params[1]);

        return JSON.stringify(jsonParam.params);
    }
    return null;
}

function formatDateTime(inputTime) {
    let date = new Date();

    date.setTime(inputTime * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;

    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();

    d = d < 10 ? ('0' + d) : d;
    return y + '.' + m + '.' + d;
}

function formateTimestamp(start, end) {
    let startTime = formatDateTime(start);
    let endTime = formatDateTime(end);

    return startTime + '-' + endTime;
}

module.exports = {
    formatTime: formatTime,
    getDeviceInfo: getDeviceInfo,
    shouldDiscardTap,
    formatImgUrl,
    getBrandID,
    getGoodDetailParam,
    getImageUrl,
    formateTimestamp,
    getImageUrlWithWH,
    isStringEmpty,
};


