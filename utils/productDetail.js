'use strict';
/* eslint-disable */
function getGoodInfo(data) {
    let newData = [];
    let idElement = '编号: ' + data.erpProductId;

    newData.push(idElement);
    newData.push('颜色: ' + data.colorName);
    let gender = '';

    if (data.gender == 1) {
        gender = '男款';
    } else if (data.gender == 2) {
        gender = '女款';
    } else if (data.gender == 3) {
        gender = '通用';
    }
    if (gender) {
        newData.push('性别: ' + gender);
    }

    data && data.standardBos.map((item, index) => {
        let newItem = item.standardName + ': ' + item.standardVal;

        newData.push(newItem);
    });
    return newData;
}

function getGoodSize(data) {
    let titleList = ['吊牌尺码'];

    data && data.sizeAttributeBos.map((item, index) => {
        let newItem = item.attributeName;

        titleList.push(newItem);
    });

    let sizeList = [];

    data && data.sizeBoList.map((item, index) => {
        let itemList = [];

        itemList.push(item.sizeName);
        item.sortAttributes.map((subItem, subIndex)=>{
            itemList.push(subItem.sizeValue);
        });
        sizeList.push(itemList);
    });
    return {titleList, sizeList};
}

function getGoodImages(data, listImageWidth, listImageHeight) {
    let imageList = [];

    data && data.map((item, index) => {
        item = item.image_url.replace(/{width}/g, listImageWidth).replace(/{height}/g, listImageHeight).replace('{mode}', 2);
        imageList.push(item);
    });
    return imageList;
}

function getModelList(data) {
    let modelList = [];
    let model = {};

    data && data.map((item, index) => {
        model.name = item.modelName;
        model.height = item.height;
        model.weight = item.weight;
        model.vital = item.vitalStatistics;
        model.size = item.fitModelBo.fit_size;
        model.feel = item.fitModelBo.feel;
        modelList.push(item);
    });

    return modelList;
}

module.exports = {
    getGoodInfo,
    getGoodSize,
    getGoodImages,
    getModelList,
};
