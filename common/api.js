import wx from '../utils/wx';
import config from './config';
import udid from './udid';
import {
  HmacSHA256,
  MD5
} from '../vendors/crypto';
import {
  stringify
} from '../vendors/query-stringify';

export const verify = {
  verifyMethod: 'resources.simple.pice',
  update() {
    return api.get({ // eslint-disable-line
      data: {
        method: this.verifyMethod
      }
    }).then(result => {
      if (result && result.code === 200 && result.data && result.data.sk) {
        wx.setStorageSync('verifyKey', result.data.sk);
      }

      return result;
    });
  },
  gen() {
    const self = this;
    let maxTryTimes = 3;

    function update() {
      return self.update().then(result => {
        if (result && result.code === 200 && result.data && result.data.sk) {
          return result.data.sk;
        } else if (maxTryTimes) {
          maxTryTimes--;

          return update();
        } else {
          return '';
        }
      });
    }

    return update();
  },
  get() {
    const verifyKey = wx.getStorageSync('verifyKey');

    if (!verifyKey) {
      this.gen(); // 异步更新
    }

    return verifyKey || '';
  },
  sign(data, encode = false) {
    const verifyKey = this.get();

    if (!verifyKey) {
      return '';
    }

    data = stringify(data, {
      encode: encode
    });

    return HmacSHA256(data, verifyKey).toString();
  },
  computeSecret(data, encode = false) {
    const newData = {
      private_key: config.apiParams.private_key
    };

    Object.keys(data).sort().forEach(key => {
      newData[key] = String(data[key]).trim();
    });

    newData.client_secret = MD5(stringify(newData, {
      encode: encode
    })).toString();
    delete newData.private_key;

    return newData;
  }
};

const api = {
  request(params) {
    const app = getApp();

    // 公有参数
    params.data = this.addParams(params.data);
    params = this.addSessionKey(params);

    // client_secret
    params.data = verify.computeSecret(params.data);

    // 接口验签
    if (!params.header['x-yoho-verify'] && params.data.method !== verify.verifyMethod) {
      params.header['x-yoho-verify'] = verify.sign(params.data);
    }
    
    return wx.request(params).then(result => {
      if (result.statusCode === 200) {
        const resultData = result && result.data || {};

        delete result.data;
        resultData.result = result;

        if (resultData.code === 508) {
          verify.gen();
        }

        if (resultData.code && resultData.code === params.code) {
          return resultData.data || {};
        }

        return resultData;
      } else if (result.statusCode === 401) {
        app&app.clearUserSession();
      } else {
        console.error('api statusCode:', result.statusCode);
        return {
          result
        };
      }
    }).catch(err => {
      console.error(err);
      return {};
    });
  },
  // addSessionKey(params) {
  //   const app = getApp();

  //   params = Object.assign({}, params);
  //   if (app && app.globalData && app.globalData.sessionKey) {
  //     params.data.session_key = app.globalData.sessionKey;
  //     params.data.uid = app.globalData.userInfo.uid;
  //     params.header['Cookies'] = `JSESSIONID=${app.globalData.sessionKey}`;
  //   }
  //   return params;
  // },
  addSessionKey(params) {
    let app = getApp();
    let uid = app && app.getUid();
    let sessionKey = app && app.globalData && app.globalData.sessionKey;

    params = Object.assign({}, params);

    if (uid && sessionKey) {
      params.data.session_key = sessionKey;
      params.data.uid = uid;
      params.header.Cookies = `JSESSIONID=${sessionKey}`;
    }

    return params;
  },
  addParams(params) {
    return Object.assign({
      client_type: config.apiParams.client_type,
      app_version: config.apiParams.app_version,
      miniapp_version: config.apiParams.miniapp_version,
      source_type: config.apiParams.source_type,
      udid: udid.get(),
      business_line: config.apiParams.business_line
    }, params);
  },
  // addParams(params) {
  //   return Object.assign({
  //     business_line: config.apiParams.business_line,
  //     client_type: config.apiParams.client_type,
  //     app_version: config.apiParams.app_version,
  //     union_type: config.unionType, // 渠道号
  //     udid: udid.get()
  //   }, params);
  // },
  get(params) {
    // 默认值
    params = Object.assign({
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json'
    }, params, {
      url: config.domains[params.api || 'api'] + (params.url || ''),
    });

    // 构造好参数再请求
    return this.request(params);
  },
  post(params) {
    // 默认值
    params = Object.assign({
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json'
    }, params, {
      url: config.domains[params.api || 'api'] + (params.url || ''),
    });

    // 构造好参数再请求
    return this.request(params);
  },

  getUploadImgAbsoluteUrl(url, bucket) {
    if (!url) {
      return null;
    }

    let urlArr = url.split('/'),
      stag = urlArr[urlArr.length - 1].substr(0, 2),
      domain = `//yhgidcard.static.yhbimg.com/${bucket}`;

    url = domain + url;
    return url;
  },

  uploadImage(filePath, formData = {}, okCb = null, progressCb = null) {
    const app = getApp();
    const self = this;

    return new Promise((resolve, reject) => {
      let uploadTask = wx.uploadFile({
        url: config.domains['api'],
        filePath,
        name: 'file',
        formData: Object.assign({}, {
          method: 'yoho.fileupload',
          userId: app.globalData.userInfo.uid,
          bucket: 'yohocard'
        }, formData),
        success({
          data: result
        }) {
          try {
            result = JSON.parse(result || '{}');

            if (result.code === 200) {
              // result.data = self.getUploadImgAbsoluteUrl(result.data, 'yohocard')
              resolve(result);
              return;
            }

            reject(result);
          } catch {
            reject(result);
          }
        },
        fail(e) {
          reject(e);
        }
      });

      uploadTask.onProgressUpdate((res) => {
        progressCb && progressCb(res);
      });

      uploadTask.onHeadersReceived((res) => {
        okCb && okCb(res);
      });
    });
  }
};

export default api;