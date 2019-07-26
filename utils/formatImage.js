/**
 * 处理逻辑与helper.wxs内image方法严格一致
 * 保证wx.previewImage时链接于wxs生成的链接相同
 */
let regExpWidth = RegExp('{width}', 'g');
let regExpHeight = RegExp('{height}', 'g');
let regExpMode = RegExp('{mode}', 'g');
let regExpQg = RegExp('/q/d+', 'g');
let regExpQ = RegExp('/q/d+');
let regExpQuality = RegExp('/quality/d+');
let regExpQualityg = RegExp('/quality/d+', 'g');
let regExpImageView = RegExp('imageView');
let regExpImageMogr = RegExp('imageMogr');

let defaultQuality = 75;

function image(imgUrl, w, h, mode, q) {
    let urls,
        query,
        url;

    let params = {
        w: w,
        h: h,
        mode: mode || 2,
        q: q || defaultQuality
    };

    if (imgUrl && (typeof imgUrl === 'string')) {
        urls = imgUrl.split('?');
        query = urls[1] || '';
        url = urls[0];

        if (url.indexOf('http:') === 0) {
            url = url.replace('http:', 'https:');
        }

        if (!query || query === 'imageslim') {
            url += params.q === defaultQuality ? '?imageslim' : '?imageView2/0/interlace/1/q/' + params.q;
            imgUrl = url;
        } else {
            imgUrl = imgUrl.replace(regExpWidth, params.w)
                .replace(regExpHeight, params.h)
                .replace(regExpMode, (params.mode));

            if (regExpImageView.test(query)) { // imageView2 || imageView
                if (!regExpQ.test(query)) {
                    imgUrl += '/q/' + params.q;
                } else {
                    imgUrl = imgUrl.replace(regExpQg, '/q/' + params.q);
                }
            } else if (regExpImageMogr.test(query)) {
                if (!regExpQuality.test(query)) {
                    imgUrl += '/quality/' + params.q;
                } else {
                    imgUrl = imgUrl.replace(regExpQualityg, '/quality/' + params.q);
                }
            }
        }
        return imgUrl;
    } else {
        return '';
    }
}

module.exports = {
    image: image
};
