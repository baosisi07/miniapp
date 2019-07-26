export default function(url) {
    try {
        // 小程序分享默认会加密一次
        url = decodeURIComponent(decodeURIComponent(url));
    } catch (error) {
        console.error(error);
    }

    return url;
}
