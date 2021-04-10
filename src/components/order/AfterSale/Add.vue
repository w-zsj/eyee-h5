<template>
  <div class="head" v-scroll='menuScroll'>
    <v-header style="background-color:rgba(0,0,0,0);" id="transition">
      <div class="nav-tab2">
        <h3>{{title}}</h3>
      </div>
      <v-server :click="QiyuProd"></v-server>
    </v-header>
    <div class="list_huan">
      <div class="list_img">
        <div class="product-img">
          <img :src="info.productimg|https">
          <div class="product-description">
            <p>{{info.brandname}}</p>
            <p>{{info.productname}}</p>
          </div>
        </div>
        <div :class="presubmit">
          <p>{{statustitle}}</p>
        </div>
      </div>
      <div>
        <!-- 公共退款/退货原因弹出层 -->
        <div class="tuikuan-tuihuo" v-show="changeL" @click.stop="closeRefend()"> </div>
        <transition name="fadeTuihuo">
          <ul class="select" v-show="changeL">
            <li class="sel_item">
              <span>退款原因</span>
            </li>
            <li v-for="(i,index) in waitSentShop" @click.stop="resList(i)" class="sel_item" :key="index">
              {{i.reason}}
              <span :class="changeListIndex==i.reasonid?'curr':'defacurr'"></span>
            </li>
            <li class="sel_item" @click.stop="closeRefend()">
              <span>关闭</span>
            </li>
          </ul>
        </transition>
        <!-- 商品申请退款 -->
        <div v-if="refundtype==1">
          <div class="content">
            <div class="content_left_l" @click="selectRest()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">退款原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{causereason}}</div>
                  <i :class="(rotate1?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red" style="visibility: hidden;">*</span>
                  <p class="change-res">商品退款</p>
                </div>
                <div class="content_r">
                  <div class="secd1">
                    <span>{{info.refundmoney | filMoney}} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money">
            <img src="../../../../static/img/after-sale.png" alt=""> 
            {{info.refunddescribe}}
          </p>
          <div class="explain" ref="c">
            <div class="content_left" @click="addblur()">
              <div class="content_right_r">
                <p class="description">备注说明</p>
                <div class="maxnum" v-text="(placeHolder?'最多500字':'')">{{placeHolder}}</div>
              </div>
            </div>
            <textarea class="remark" @input="descInput" v-model="remark" maxlength="500" placeholder="请输入备注" v-show="isShowRemark" @blur="focusstate=false" v-focus="focusstate"></textarea>
          </div>
          <div v-show="err" class="error">
            <span class="error-x">x</span>
            <p>最多只能输入500个字</p>
          </div>
        </div>
        <!-- 退款退货页面 -->
        <div v-else-if="refundtype==2">
          <div class="content">
            <div class="content_left_l"@click="selectRest()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">退款原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{causereason}}</div>
                  <i :class="(rotate1?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red" style="visibility: hidden;">*</span>
                  <p class="change-res">商品退款</p>
                </div>
                <div class="content_r">
                  <div class="secd1">
                    <span>{{info.refundmoney | filMoney}} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money" >
            <img src="../../../../static/img/after-sale.png" alt=""> 
            {{info.refunddescribe}}
          </p>
          <div class="explain" ref="c">
            <div class="content_left" @click="addblur()">
              <div class="content_right_r">
                <p class="description">备注说明</p>
                <div class="maxnum" v-text="(placeHolder?'最多500字':'')">{{placeHolder}}</div>
              </div>
            </div>
            <textarea class="remark" @input="descInput" v-model="remark" maxlength="500" placeholder="请输入备注" v-show="isShowRemark" @blur="focusstate=false" v-focus="focusstate"></textarea>
          </div>
          <div v-show="err" class="error">
            <span class="error-x">x</span>
            <p>最多只能输入500个字</p>
          </div>
          <div class="evidence">
            <ul class="flex-wrap">
              <li v-for="(item,idx) in evidences" :key='idx'>
                <div class="flex-center">
                  <img :src="item" alt="">
                </div>
                <div class="flex-center remove" @click.stop="removePic(idx)">
                  <i class="ico-X "></i>
                </div>
              </li>
              <li class="flex-center upload" v-if="!(evidences&&evidences.length>=6)">
                <label for="uploadFiles" class="flex-col flex-center">
                  <span>+</span>
                  <span>上传凭证</span>
                  <span>(最多六张)</span>
                </label>
                <input type="file" ref='inputVal' name="uploadFiles" id="uploadFiles" accept="image/*" hidden @change="fileChange">
              </li>
            </ul>
            <p class="hint">温馨提示：服饰类商品请拍摄吊牌，鞋履类请拍摄鞋底以及鞋舌标照片</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 提交申请 -->
    <div class="submit" :class="submitBg" @click="Submit()">提交申请</div>
  </div>
</template>
<script>
import { QiyuProd } from "../../../common/api/WyQiyu";
import {
  getApplyInfo,
  afterSaleSubmit,
  uploadFile,
  modifyApply
} from "../../../common/api/order";
export default {
  data() {
    return {
      info: {},
      presubmit: "order-service-refund-lg", // 不同状态下待提交的背景图
      statustitle: "待提交",
      placeHolder: true,
      changeL: false,
      rotate1: false,
      title: "申请退款",
      err: false,
      isShowRemark: false,
      focusstate: false,
      changeListIndex: "",
      waitSentShop: [],
      subBg: "",
      remark: "",
      refundreasonid: "",
      causereason: "请选择",
      evidenceUrls: [],
      evidences: [],
      orderno: "",
      refundtype: "",
      refundid: ""
    };
  },
  computed: {
    submitBg() {
      if (this.refundtype == 1 || this.refundtype == 2) {
        if (this.causereason != "请选择") {
          this.subBg = "subBg";
        } else this.subBg = "";
      }
      return this.subBg;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.menuScroll);
    let _ = this;
    _.refundid = Number(this.$route.query.refundid);
    _.orderno = this.$route.query.orderno;
    _.refundtype = Number(this.$route.query.refundtype);
    console.log(
      `传过来的数据订单号:${_.orderno}和退款类型:${_.refundtype}和售后id：${
        _.refundid
      }`
    );
    if (_.refundtype == 1) {
      _.title = "申请退款";
    } else if (_.refundtype == 2) {
      _.title = "退货并退款";
    }
    let parameter = {
      orderno: _.orderno,
      refundtype: _.refundtype
    };
    getApplyInfo(parameter)
      .then(res => {
        if (res) {
          _.info = res;
          console.log("res", _.info.refundmoney);
          _.waitSentShop = res.refundreason;
          if (!!res.lastreason) {
            _.causereason = res.lastreason.reason; //上次退款原因
            _.refundreasonid = res.lastreason.reasonid; //上次退款原因
            _.changeListIndex = res.lastreason.reasonid;
          }
          _.remark = res.remark;
          if (!!res.imgsevidence) {
            _.evidenceUrls = res.imgsevidence.split("|").filter(pic => pic);
            _.evidences = res.imgsevidence.split("|").filter(pic => pic);
          }
          if (!!_.remark) {
            _.addblur();
          }
        }
      })
      .catch(err => {
        this.toast("加载失败");
      });
  },
  directives: {
    focus: {
      update: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  filters: {
    filMoney(val) {
      let monVal;
      if (val < 0) {
        monVal = "-￥" + Math.abs(val).toFixed(2);
      } else if (val >= 0) {
        monVal = "￥" + val.toFixed(2);
      }
      return monVal;
    }
  },
  methods: {
    fileChange(e) {
      let _ = this;
      // console.log('test',this.$refs)
      // console.log('fileChange1', e)
      let files = e.target.files || e.srcElement.files || e.dataTransfer.files;
      if (!files.length) return;
      var reader = new FileReader();
      reader.onload = (function(file) {
        return function(e) {
          let dataUrl = (e.currentTarget || e.target || e.srcElement).result;
          console.log("base64", dataUrl.split(",")[1]);
          uploadFile({ path: "aftersale", stream: dataUrl.split(",")[1] })
            .then(res => {
              _.evidenceUrls.push(dataUrl);
              _.evidences.push(res.picurl);
              _.$refs.inputVal.value = null;
              console.log(_.evidenceUrls);
            })
            .catch(e => {
              console.error("上传凭证失败：", e);
            });
          // if (!_.evidenceUrls.includes(dataUrl)) {

          // }else{
          //   _.toast('该图片已上传！')
          // }
        };
      })(files[0]);
      reader.readAsDataURL(files[0]);
    },
    removePic(index) {
      let _ = this;
      _.evidenceUrls = _.evidenceUrls.filter((i, idx) => idx !== index);
      _.evidences = _.evidences.filter((i, idx) => idx !== index);
    },
    menuScroll() {
      // 头部背景显示
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 100) {
        document.getElementById("transition").style.background =
          "rgba(255,255,255,0.95)";
      } else if (scrollTop > 70) {
        document.getElementById("transition").style.background =
          "rgba(255,255,255,0.8)";
      } else if (scrollTop > 20) {
        document.getElementById("transition").style.background =
          "rgba(255,255,255,0.3)";
      } else {
        document.getElementById("transition").style.background = "transparent";
      }
    },
    addblur() {
      this.focusstate = true;
      this.placeHolder = !this.placeHolder;
      this.isShowRemark = !this.isShowRemark;
    },
    QiyuProd() {
      QiyuProd.call(this)
      console.log("打开客服");
    },
    closeRefend() {
      this.changeL = false;
      this.rotate1 = false;
    },
    resList(item) {
      this.causereason = item.reason;
      this.refundreasonid = item.reasonid;
      this.changeListIndex = item.reasonid;
      this.changeL = false;
      this.rotate1 = false;
      if (this.causereason != "请选择") {
        this.subBg = "subBg";
      } else this.subBg = "";
    },
    selectRest() {
      this.changeL = !this.changeL;
      this.rotate1 = !this.rotate1;
    },
    descInput() {
      if (this.remark) {
        var a = this.remark.length;
        if (a >= 500) {
          this.err = true;
          this.$refs.c.style.background = "#ffb9b9";
        } else {
          this.err = false;
          this.$refs.c.style.background = "#fff";
        }
      }
    },
    Submit() {
      let _ = this;
      if (_.causereason == "请选择") {
        _.toast("请选择换货原因");
        return;
      }
      if (_.info.refundmoney <= 0) {
        _.toast("售后金额异常，请联系客服");
        return;
      }
      if (_.remark == "") {
        _.focusstate = false;
      }
      let picsList = "";
      if (_.evidences.length > 0) {
        picsList = _.evidences.join("|");
      } else picsList = "";
      if (!!_.refundid) {
        let ops = {
          refundid: _.refundid,
          refundreasonid: _.refundreasonid,
          memo: _.remark,
          pics: picsList
        };
        modifyApply(ops)
          .then(res => {
            console.log("修改传参的refundid:", _.refundid);
            _.$router.replace(`/order/AfterSale/info/${_.refundid}`);
          })
          .catch(e => {
            _.toast(e.message);
          });
      } else {
        let params = {
          orderno: _.orderno,
          refundtype: _.refundtype,
          refundreasonid: _.refundreasonid,
          memo: _.remark,
          pics: picsList
        };
        console.log("提交修改参数", params);
        afterSaleSubmit(params)
          .then(res => {
            console.log("提交成功获取到的refundid:", res.refundid);
            _.$router.replace(`/order/AfterSale/info/${res.refundid}`);
          })
          .catch(e => {
            if (e.code != 1511630) {
              _.toast(e.message);
            }
          });
      }
    }
  }
};
</script>
<style scoped>
.evidence {
  margin: 15px 0;
}
.evidence li {
  position: relative;
  width: 90px;
  width: 26vw;
  height: 90px;
  height: 26vw;
  padding: 3px;
  margin: 0 4% 10px 0;
  color: #999;
  border: 1px solid;
}
.evidence li div:first-of-type {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.evidence .remove {
  position: absolute;
  right: -8px;
  top: -8px;
  padding: 4px;
  background-color: #e90707;
  border-radius: 50%;
}
.evidence .remove .ico-X {
  width: 14px;
  height: 14px;
  color: #fff;
}
.evidence .upload {
  border: 1px dashed;
  border-radius: 8%;
  font-size: 13px;
}
.evidence .upload span:first-of-type {
  font-size: 36px;
  font-weight: 600;
}
.evidence .hint {
  color: #999;
  font-size: 12px;
}
.fadeTuihuo-enter-active,
.fadeTuihuo-leave-active {
  transition: all 0.5s;
}
.fadeTuihuo-enter,
.fadeTuihuo-leave-to {
  transform: translateY(500px);
  /* opacity: 0; */
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.head {
  background-image: linear-gradient(-180deg, #ffc700 0%, #fcfd62 100%);
  background-size: 100% 160px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
}

.list_huan {
  width: 100%;
  position: absolute;
  top: 48px;
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 100px;
}
.list_img {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 8px;
  height: 160px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
.list_img img:nth-of-type(1) {
  display: block;
  width: 100px;
  height: 100px;
  margin-top: 15px;
  margin-left: 20px;
}
.list_img div:nth-of-type(2) {
  width: 140px;
  height: 120px;
  position: relative;
  padding-top: 20px;
}
.list_img div:nth-of-type(2).order-service-refund-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-refund-lg.png")
    no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2).order-service-return-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-return-lg.png")
    no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2).order-service-exchange-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-exchange-lg.png")
    no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2) p {
  position: absolute;
  left: 26px;
  bottom: 27px;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  line-height: 30px;
  text-align: center;
  font-weight: bolder;
}
.production-img {
  display: flex;
  flex-direction: column;
}
.product-img p {
  font-size: 10px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}
.product-description {
  width: 112px;
  margin-top: 8px;
  text-align: center;
  font-size: 10px;
  color: #333;
  height: 28px;
  margin-left: 15px;
}
.product-description p {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.product-description p:nth-of-type(2) {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box; */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #999;
}
.content {
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
}
.content_l {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.content_r {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
}
.content_c {
  display: flex;
  align-items: center;
}
i {
  font-style: normal;
}
.red {
  display: block;
  width: 14px;
  height: 20px;
  text-align: center;
  line-height: 25px;
  font-size: 14px;
  color: #e90707;
}
.content_left {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 8px;
}
.content_left_l {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
.specificationColorSub {
  background: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  font-size: 14px;
  color: #111111;
  text-align: center;
  z-index: 11;
}
.specificationColorSub .title {
  margin: 26px 0;
}
.specificationColorSub .guanbi {
  line-height: 42px;
  background: #424242;
  color: #fff;
  text-align: center;
  font-size: 14px;
}
.specificationColorSub i {
  font-style: normal;
  font-size: 12px;
  color: #666;
}
.specificationColorSub .conColFlex {
  overflow: hidden;
  margin-bottom: 40px;
}

.specificationColorSub .conColFlex span {
  float: left;
  /* padding: 0 20px; */
  width: 20%;
}
.specificationColorSub .conColFlex dl {
  float: left;
  overflow: hidden;
  width: 80%;
  /* display: flex; */
}
.specificationColorSub .conColFlex dl dd {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  line-height: 14px;
  text-align: center;
  border: 1px solid #999;
  float: left;
  padding: 0 10px;
  line-height: 28px;
  margin-right: 10px;
  margin-bottom: 10px;
  /* flex: 1; */
}
.specificationColorSub .conColFlex.conColFlexNumbe dl dd {
  margin-right: 0;
}
.specificationColorSub .conColFlex.conColFlexNumbe dl dd:nth-child(2) {
  border-right: 0;
  border-left: 0;
  padding: 0 50px;
}
.content_right_r {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.change-res {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 13px;
}
.select {
  width: 100%;
  position: relative;
  height: 0;
  z-index: 11;
}
.select_1 {
  width: 100%;
  overflow: hidden;
}
.select_2 {
  height: 420px;
  width: 100%;
  position: relative;
  height: 0;
  z-index: 5;
}
.tuikuan-tuihuo {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.select {
  position: fixed;
  height: auto;
  width: 100%;
  bottom: -2px;
  left: 0;
  background: #fff;
}
.sel_item {
  /* box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5); */
  border-bottom: 1px solid #eee;
  background: #ffffff;
  height: 42px;
  padding-left: 22px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #111111;
  letter-spacing: 1px;
  line-height: 13px;
  position: relative;
}
.sel_item:nth-child(1) {
  margin: 10px 0;
  margin-bottom: 0;
  border: 0;
  text-align: center;
  padding: 0;
}
.sel_item:nth-child(1) span,
.sel_item:last-child span {
  display: block;
  width: 100%;
  text-align: center;
}
.sel_item:last-child {
  color: #fff;
  background: #424242;
  font-size: 16px;
  line-height: 50px;
  height: 50px;
  padding: 0;
}
.sel_item .curr,
.defacurr {
  position: absolute;
  right: 20px;
  border-radius: 50%;
  top: 10px;
  width: 20px;
  height: 20px;
  background: url("/static/imgs/cart_choose.png") 0 0
    no-repeat;
  background-size: cover;
}
.defacurr {
  background: url("//files.eyee.com/mcdn/static/img/cart_no.png") 0 0 no-repeat;
  background-size: cover;
}
.secd {
  font-size: 12px;
  color: #333;
  letter-spacing: 0.86px;
  line-height: 13px;
  text-align: left;
}
.secd1 input {
  padding: 0;
  color: #ffc700;
  background: rgba(0, 0, 0, 0);
}
.secd1 span {
  padding: 0;
  color: #ffc700;
  background: rgba(0, 0, 0, 0);
  display: inline-block;
  /* margin-top: 12px; */
}
.secd1.unit input {
  padding-left: 10px;
}
.secd1 {
  color: #ffc700;
  letter-spacing: 0.86px;
  line-height: 13px;
  text-align: left;
}
.unit {
  position: relative;
}
.unit:before {
  content: "¥";
  position: absolute;
  transform: scale(0.8);
}
.product-money {
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  padding: 0 8px;
  margin-top: 10px;
  line-height: 16px;
}
.product-money img {
  height: 12px;
  width: 12px;
  float: left;
  margin-top: 2px;
  margin-right: 8px;
}
.product-money span {
  color: #333;
  font-size: 13px;
  font-weight: 900;
}
.error {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.error p {
  font-size: 12px;
  color: #e90707;
  letter-spacing: 0;
  line-height: 12px;
  text-align: left;
  margin-left: 8px;
}
.error-x {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e90707;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  color: #fff;
  font-weight: 100;
}
.maxnum {
  border: 0;
  padding: 0;
  margin-left: 29px;
  opacity: 0.5;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 13px;
}
.explain {
  margin-top: 15px;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.description {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 13px;
  margin-left: 14px;
}
.remark {
  width: 100%;
  resize: none;
  margin: 0 22px 9px;
  padding: 0;
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
  line-height: 16px;
  text-align: left;
  height: 80px;
  background: rgba(0, 0, 0, 0);
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ccc;
  height: 50px;
  color: #fff;
}
.subBg {
  background: #333;
}
</style>
