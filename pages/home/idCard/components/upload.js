// pages/home/idCard/components/upload.js

import api from '../../../../common/api';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tip: {
      type: String,
      value: ''
    },
    index: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    file_url: '',
    uploading: false,
    progress: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onClickFile() {
      let vm = this;

      if (this.data.file_url) {
        return;
      }

      try {
        const image = await this.chooseFile();
        const uploadedImage = await this.uploadImage(image.path);

        this.setData({
          file_url: image.path
        });

        this.triggerEvent('success', { ...uploadedImage,
          index: this.data.index
        });
      } catch (e) {
        wx.showToast({
          icon: 'none',
          title: '上传出错请重新上传',
        });
        this.triggerEvent('error', {
          index: this.data.index
        });
      }

    },
    onClickClear() {
      this.setData({
        file_url: ''
      });
      this.triggerEvent('remove', {
        index: this.data.index
      });
    },
    chooseFile() {
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          success({
            tempFiles: [file]
          }) {
            resolve(file);
          },
          fail(e) {
            reject(e);
          }
        });
      });
    },
    uploadImage(filePath) {
      return api.uploadImage(filePath, {}, () => {
        this.setData({
          progress: 0
        });
      }, ({
        progress
      }) => {
        if (progress === 100) {
          this.setData({
            progress: 0
          });
          return;
        }

        this.setData({
          progress
        });
      });
    }
  }
})