<template>
  <div class="crop_box">
    <!-- 遮罩层 -->
    <!--crop_round 截取圆圈   crop_square截取正方-->
    <div class="container" :class="{crop_round:seletype==0,crop_square:seletype==1}" v-show="panel">
      <div>
        <img id="image" v-if="seletype==0" :src="url" alt="Picture" />
      </div>
      <div>
        <img id="image2" v-if="seletype==1" :src="url" alt="Picture" />
      </div>
      <button class="confirm-btn" type="button" id="button" @click="crop">确定</button>
      <button class="cancel-btn" type="button" id="cancelBtn" @click="panel = 0">取消</button>
    </div>
    <!--内容  -->
    <div class="show_box">
      <div class="show">
        <div
          class="picture"
          :class="{'modification':upimg,dft:unupload}"
          v-if="seletype==0"
          :style="'backgroundImage:url('+headerImage+')'"
        ></div>
        <div class="picture" v-if="seletype==1" :style="'backgroundImage:url('+headerImage2+')'"></div>
      </div>
      <div class="input_img">
        <input type="file" id="change" accept="image" @change="change" />
        <label for="change"></label>
      </div>
    </div>
  </div>
</template>
<script>
import Cropper from "cropperjs";
import { mapGetters } from "vuex";
import { Upload, UpdateInfo } from "../../../common/api/user";
export default {
  props: {
    seletype: { type: Number, default: 0 }, // 0默认是圆裁剪 1是正方裁剪
    UpgradeImg: { type: String }, // 修改默认图片
    unupload: Boolean
  },
  data() {
    return {
      headerImage: "",
      headerImage2: "",
      picValue: "",
      cropper: "",
      croppable: false,
      panel: false,
      url: "",
      fileSize: 0,
      defaultImg: "http://files.eyee.com/eyeeh5/img/default_user_bg.png",
      cropper2: "",
      basImg: null,
      upimg: ""
    };
  },
  mounted() {
    this.headerImage = this.headerImage2 = this.defaultImg;
    if (this.localUserInfos) {
      // 背景
      if (this.localUserInfos.themeurl) {
        this.headerImage2 = this.localUserInfos.themeurl;
      }
      // 用户logo
      if (this.localUserInfos.imageurl) {
        this.headerImage = this.localUserInfos.imageurl;
      }
      // 修改默认图片
      this.upimg = this.UpgradeImg;
      if (this.upimg) this.headerImage = this.upimg;
    }
    // 初始化这个裁剪框
    this.init();
  },
  computed: {
    ...mapGetters({ localUserInfos: "userInfo" })
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
  },
  watch: {
    panel() {
      var c = document.querySelector(".uer_info");
      if (c && this.seletype == 1) {
        if (this.panel) {
          c.style.opacity = 0;
        } else {
          c.style.opacity = 1;
        }
      }
    }
  },
  methods: {
    init() {
      var self = this;
      var image = document.getElementById("image");
      var image2 = document.getElementById("image2");
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false,
        ready: function() {
          self.croppable = true;
        }
      });
      if (image2) {
        this.cropper2 = new Cropper(image2, {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          zoomable: false,
          ready: function() {
            self.croppable = true;
          }
        });
      }
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    change(e) {
      var a = document.querySelector(".crop_round .cropper-container");
      var b = document.querySelector(".crop_square .cropper-container");

      if (a) {
        if (this.seletype == 0) {
          a.style.display = "none";
        } else {
          a.style.display = "block";
        }
      }
      if (b) {
        if (this.seletype == 1) {
          b.style.display = "none";
        } else {
          b.style.display = "block";
        }
      }
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.panel = true;
      this.picValue = files[0];
      this.url = this.getObjectURL(this.picValue);
      // 每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      if (this.cropper2) {
        this.cropper2.replace(this.url);
      }

      this.panel = true;
      this.fileSize = e.target.files[0].size / 1024;
    },
    crop() {
      if(!this.unupload) this.toast("图片处理中，请稍等！");
      var croppedCanvas;
      var roundedCanvas;
      var croppedCanvas2;
      var roundedCanvas2;
      if (!this.croppable) {
        return;
      }
      // Crop
      croppedCanvas = this.cropper.getCroppedCanvas();
      if (this.cropper2) {
        croppedCanvas2 = this.cropper2.getCroppedCanvas();
        roundedCanvas2 = this.getRoundedCanvas(croppedCanvas2);
      }
      // Round
      roundedCanvas = this.getRoundedCanvas(croppedCanvas);
      this.headerImage = roundedCanvas.toDataURL("image/jpeg", 0.5);
      if (this.headerImage2 && roundedCanvas2) {
        this.headerImage2 = roundedCanvas2.toDataURL("image/jpeg", 0.5);
      }
      this.upimg = "";
      this.postImg();
    },
    getRoundedCanvas(sourceCanvas) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      var width = sourceCanvas.width;
      var height = sourceCanvas.height;

      canvas.width = width;
      canvas.height = height;

      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      if (this.seletype == 0) {
        context.arc(
          width / 2,
          height / 2,
          Math.min(width, height) / 2,
          0,
          2 * Math.PI,
          true
        );
      }
      context.fill();

      return canvas;
    },
    postImg() {
      let _ = this,
        { seletype, headerImage, headerImage2, unupload } = _,
        base64 = seletype == 1 ? headerImage2 : headerImage;

      var op = {
        stream: base64.split(",")[1]
      };
      var options = {};
      // console.log(op);
      if (seletype != 1 && unupload) {
        _.basImg = base64;
        _.$emit("upload", base64);
        _.panel = false;
      } else {
        Upload(op)
          .then(res => {
            _.basImg = res;
            if (_.seletype == 1) {
              // 背景
              options = {
                themeurl: _.basImg
              };
              console.log("提交参数", options);
              UpdateInfo({ themeurl: options.themeurl.url })
                .then(res => {
                  console.log("背景", res);
                  _.toast("更新背景成功");
                  // localStorage.setItem('currentUser', JSON.stringify(res))
                  _.$store.dispatch("setUserInfo", res);
                })
                .catch(err => {
                  console.log("err", err);
                });
            } else {
              var option = {
                imageurl: _.basImg
              };
              console.log("修改用户Log", option);
              UpdateInfo({ imageurl: option.imageurl.url })
                .then(res => {
                  console.log("logo", res);
                  _.toast("更新头像成功");
                  // localStorage.setItem('currentUser', JSON.stringify(res))
                  _.$store.dispatch("setUserInfo", res);
                })
                .catch(err => {
                  console.log("err", err);
                });
            }
            _.panel = false;
          })
          .catch(err => {
            console.log("转变出错", err);
          });
      }

      // 这边写图片的上传
    }
  }
};
</script>

<style>
.crop_box .confirm-btn,
.crop_box .cancel-btn {
  position: absolute;
  top: 2.667vw;
  width: 21.333vw;
  height: 10.667vw;
  border: none;
  border-radius: 1.333vw;
  font-size: 3.733vw;
}
.crop_box .confirm-btn {
  right: 2.667vw;
  background: #fff;
}
.crop_box .cancel-btn {
  right: 26.667vw;
  background: #999;
  color: #ddd;
}

.crop_box .show_box,
.crop_box .show {
  width: 100%;
  height: 100%;
  /* width: 100px; */
  /* height: 100px; */
  /* overflow: hidden; */
  position: relative;
  z-index: 0;
  /* border-radius: 50%; */
  /* border: 1px solid #d5d5d5; */
}

.input_img,
.input_img input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.input_img input {
  opacity: 0;
}

.picture {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
.picture.dft::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/static/img/login/camera.png") no-repeat;
  background-size: 40% auto;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.6);
}
.modification {
  background-size: 40% 40%;
}
.container {
  z-index: 9999;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
}

#image {
  max-width: 100%;
}
/*变化截取的圆  正方  */

.crop_round .cropper-view-box,
.crop_round .cropper-face {
  border-radius: 50%;
}

.crop_square .cropper-view-box,
.crop_square .cropper-face {
  border-radius: 0%;
}
/*!
 * Cropper.js v1.0.0-rc
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-03-25T12:02:21.062Z
 */

.cropper-container {
  font-size: 0;
  line-height: 0;

  position: relative;

  -webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;

  direction: ltr;
  -ms-touch-action: none;
  touch-action: none;
}

.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg;
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: 0.5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;

  width: 100%;
  height: 100%;

  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;

  display: block;

  opacity: 0.5;
  border: 0 dashed #eee;
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;

  display: block;

  width: 0;
  height: 0;

  opacity: 0.75;
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: " ";
  background-color: #eee;
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px;
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px;
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;

  display: block;

  width: 100%;
  height: 100%;

  opacity: 0.1;
}

.cropper-face {
  top: 0;
  left: 0;

  background-color: #fff;
}

.cropper-line {
  background-color: #39f;
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}

.cropper-point {
  width: 5px;
  height: 5px;

  opacity: 0.75;
  background-color: #39f;
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1;
}

@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px;
  }
}

@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px;
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: 0.75;
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: " ";
  opacity: 0;
  background-color: #39f;
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}

.cropper-hide {
  position: absolute;

  display: block;

  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>
