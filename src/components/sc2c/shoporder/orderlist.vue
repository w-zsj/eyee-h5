<template>
    <div>
        <div class="orderlist">
            <div class="productwrap">
                <!-- <div class="salestatus"><em></em> 出售中</div> -->
                <div class="flex-between productorder" @click.stop="goDetail()">
                    <div class="productimg">
                        <img :src="info.productimageurl" alt="">
                    </div>
                    <div class="productinfo flex-col ">
                      <div class="productname">
                        {{info.productname}}
                      </div>
                    </div>
                </div>
                <div class="colorsize flex-between flex-wrap">
                    <div>{{info.productcolor}},{{info.productsize}},X{{info.count}}</div>
                    <div class="productprice">￥{{info.payprice | tofixed}}</div>
                </div>
                <!-- 已发货 -->
                <div v-if="shopType===2&&failedreson" class="shipped">{{failedreson}}</div>
                <div :class="shopType===0&&statusVal != 1&&statusVal != 4?'flex-between':'flex-end'">
                  <div class="alerm" v-show="shopType===0&&statusVal != 1&&statusVal != 4"><img src="/static/img/alerm.png">账户冻结中！</div>
                  <div class="flex">
                    <div class="nosale flex-center" @click.stop="model(1)" v-if="shopType===0">我不卖了</div>
                    <!-- &&$root.ISWX -->
                    <div class="nosale flex-center" :class="statusVal != 1&&statusVal != 4 ?'':'yelloeColor'" @click.stop="model(3)" v-if="shopType===0&&$root.ISWX">喊人来买</div>
                    <div v-if="shopType===1&&failedreson" class="toastColor nosale">
                      {{failedreson}}
                    </div>

                    <div class="nosale flex-center" @click.stop="model(2)" v-if="shopType===2">订单跟踪</div>
                    <div class="nosale flex-center" @click.stop="confirmGoods(info.sellorderno)" v-if=" shopType===2&&info.status===16 " >确认收货</div>
                  </div>


                </div>
                <div class="flex-end" style="border-top:1px solid #f7f7f7" v-if="shopType===1">
                  <div  v-if="info.aftersale ==1 || info.aftersale == 3 || info.aftersale == 5" class="nosale flex-center" @click.stop="model(2)">填写物流单号</div>
                  <div  v-if="info.aftersale ==2 || info.aftersale == 4"  class="nosale flex-center" @click.stop="goDetail()">查看详情</div>
                </div>
                <div v-if="shopType===4" class="shipped" style="color:#333;">{{info.message}}</div>
              </div>
        </div>
         <!-- //分享 -->
        <div class="h5share" v-if="h5share" @click.stop="close">
          <img src="/static/img/h5shareIcon.png" alt="">
          <img src="/static/img/h5shareiconknow.png" alt="">
        </div>
    </div>
</template>
<script>
import { lowerFrame ,ConfirmGoods} from "../../../common/api/snekc2c.js";
import { DateDiff, _getDate } from "../../../common/util";
// hasdata:
//  1 待发货 填写物流单号
//  2 待发货 超时未发货
//  3. 虚假发货
//  4. 出售中
//    已发货状态
//  5. 正常状态
//  6 买家取消订单
//  7. 已发货 瑕疵问题 买家拒绝发货 商品寄回
//  8.鉴定未通过
//    交易成功
//  5. 正常状态
//  9 有瑕疵 但交易成功
//    交易失败
//  6 买家取消订单
//  7. 已发货 瑕疵问题 买家拒绝发货 商品寄回
//  8.鉴定未通过
export default {
  data() {
    return {
      // lookmore: false, // 收起折叠 切换
      orderlist: [],
      failedmessage: "",
      h5share: false,
      colorsizeItem: [],
      timeData: {D:"0", H: "00", m: "00", s: "00" }
    };
  },
  computed: {
    failedreson() {
      switch (this.info.status) {
        case 2:
          this.setentime(this.info.overtime, "H");
          if(this.timeData.H == '00' && this.timeData.m == '00' &&this.timeData.s == '00' ){
            this.failedmessage = this.info.message
          }else{
            var day = this.timeData.D>0 ? this.timeData.D + "天 " : ""
            this.failedmessage = "请在" + day + this.timeData.H + ":" + this.timeData.m + ":" + this.timeData.s + '发货';
          }

          break;
        default:
          this.failedmessage = this.info.message
      }
      return this.failedmessage;
    }
  },
  props: {
    shopType: Number,
    info: { type: Object },
    statusVal: { type: Number,default:1 },
    snealist: Array,
    curVal:Number
  },
  mounted() {
    console.log('this.statusVal 用户状态',this.statusVal)
  },
  methods: {
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      let t = this.timeData
      if (
        this.timeData.H <= 0 &&
        this.timeData.m <= 0 &&
        this.timeData.s <= 0
      ) {
        clearInterval(this.clearTime);
        t.H = t.m = t.s = "00";

        return;
      }
      if(t.H > 24){
       t.D =Math.floor(t.H/24)
      }
      var hours = t.H%24
      t.H = hours < 10 ? "0" +hours : hours;
      t.m = t.m < 10 ? "0" + t.m : t.m;
      t.s = t.s < 10 ? "0" + t.s : t.s;

    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(function() {
        _.countdownTime(time, type);
      }, 1000);
    },
    close() {
      this.h5share = false;
    },
    goDetail() {
      // 出售中的商品 不能进去详情
      // console.log('this.info',this.info)
       if(this.statusVal != 1&&this.statusVal != 4) return
      let t = this.shopType;
      let info = this.info;
      this.$router.push(
        "/shoporderdetail/" +
          (t === 0 ? info.sneakerssalesid : info.sellorderno)
      );
    },
    model(type) {
      if(this.shopType == 0&&this.statusVal != 1&&this.statusVal != 4) return
      let option = {
        title: "",
        okText: "我再想想",
        cancelText: "确定",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        msg: "商品出售信息将从平台上删除,<br>用户和自己将不再看到。",
        cancel: () => {
          // this.toast("删除成功");
          // @params  sneakerssalesid  status 1: 正在出售, 2: 等待付款（个人卖），3：下架
          let option = {
            sneakerssalesid: this.info.sneakerssalesid,
            status: 3
          };
          lowerFrame(option) // 我不卖了
            .then(res => {
              this.toast(res.message);
              this.$emit("del", 1); // 删除成功 重新调一下接口
            })
            .catch(err => {
              this.toast(err)
              console.error(err);
            });
        }
      };
      if (type == 1) {
        this.confirm(option);
      } else if (type === 3) {
        if (this.$root.ISWX) {
          this.h5share = true;
          this.initShare({
            info: {
              title: this.info.title,
              img: this.info.icon + "!c30",
              desc: this.info.content,
              url: this.info.url
            }
          });
        } else {
          this.toast("快去分享给好友吧~");
        }
      } else if (type === 2) {
        this.$router.push("/logistics/" + this.info.sellorderno + "/1?producttype="+this.info.producttype); // 1 是卖家 2 买家
      }
    },
    // 确认收货
    confirmGoods(orderno){
      let _ = this
      console.log('订单编号：',orderno,_.snealist,_.curVal)
      let option = {
        title: "",
        okText: "我再想想",
        cancelText: "确定",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        msg: "您确定是否要收货？",
        cancel: () => {
          ConfirmGoods({orderno:orderno}).then( res => {
            _.snealist.splice(_.curVal,1)
            _.toast('收货成功')
          }).catch( err => {
            if(err&&err.msg){
              _.toast(err.msg)
            }
            console.log('卖家确认收货接口：',err)
          })
        }
      };
      _.confirm(option);

    }
  }
};
</script>
<style scoped>
img {
  width: 100%;
  height: auto;
}
/* .morelist-enter-active,
.morelist-leave-active {
  transition: all 0.3s;
  opacity: 0;
  transform: translateY(20px);
}
.morelist-enter,
.morelist-leave-to {
  transform: translateY(-20px);
  opacity: 1;
} */
.productwrap {
  margin: 15px;
  box-shadow: 0 0 5px #ccc;
  border-radius: 5px;
  /* margin-bottom: 0; */
}
.salestatus {
  font-size: 13px;
  color: #333;
  line-height: 40px;
  border-bottom: 1px solid #f5f5f5;
  padding-left: 40px;
  position: relative;
}
.salestatus em {
  position: absolute;
  width: 17px;
  height: 17px;
  left: 15px;
  top: 11px;
  background: url("//files.eyee.com/mcdn/static/img/order-service-exchange.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.productorder {
  padding: 15px;
}
.productimg {
  width: 18.7%;
}
.productimg img {
  display: block;
}
.productinfo {
  width: 80%;
  margin-left: 3%;
  font-size: 12px;
  margin-top: 0px;
}
.productinfo .productname {
  line-height: 20px;
}
.productprice {
  font-size: 16px;
  color: #333;
  /* padding-top: 10px; */
  font-weight: bold;
  /* line-height: 24px; */
}
.paddtop {
  padding-top: 15px;
}
.colorsize {
  font-size: 12px;
  color: #333;
  padding-left: 5px;
  /* box-shadow: 0 3px 4px #ccc; */
  border-bottom: 1px solid #f7f7f7;
  border-top: 1px solid #f7f7f7;
  padding: 15px;
  /* border-radius: 5px; */
}

/* .nomargin {
  margin: 0;
  box-shadow: 0 3px 4px #ccc;
} */
.nosale {
  padding: 0 10px;
  line-height: 26px;
  /* width: 75px; */
  text-align: center;
  height: 26px;
  margin: 15px 15px 15px 0;
  font-size: 3.2vw;
  /* font-size: 12px; */
  color: #666;
  border: 1px solid #999;
  border-radius: 3px;
}
.shipped {
  color: #eb3e3e;
  /* height: 26px; */
  padding: 15px;
  border-bottom: 1px solid #f7f7f7;
  font-size: 12px;
  text-align: right;
}
.toastColor {
  color: #eb3e3e;
  border: 0;
  padding-right: 0;
  position: relative;
}
/* .toastColor::before {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid #eb3e3e;
  left: -10px;
  top: 7px;
} */
/* .toastColor::after {
  content: "";
  position: absolute;
  height: 5px;
  width: 5px;
  left: -5px;
  top: 10px;
  border-left: 1px solid #eb3e3e;
  border-bottom: 1px solid #eb3e3e;
} */
.toastColor span {
  display: inline-block;
  width: 50px;
  padding-right: 15px;
  font-weight: bold;
  font-family: "PingFang";
}
.yelloeColor {
  color: #ffc700;
  border-color: #ffc700;
}
/* .shadownone,
.shadowntwo {
  width: 85%;
  background: #f5f5f5;
  height: 20px;
  margin: 0 auto;
  position: relative;
  z-index: -1;
  border-radius: 3px;
  box-shadow: 0 0 5px #ccc;
}
.shadowntwo {
  width: 80%;
  z-index: -2;
} */
.lookmore {
  width: 100%;
  text-align: center;
  /* padding: 25px;
  padding-bottom: 10px; */
  font-size: 12px;
  color: #333;
}
.lookmore img {
  width: 20px;
  height: auto;
  display: block;
  margin: 0 auto;
}
.shouqi {
  /* padding: 15px; */
}
.h5share {
  position: fixed;
  text-align: right;
  width: 100vw;
  left: 0;
  bottom: 0;
  top: 0;
  padding-top: 50px;
  background: rgba(0, 0, 0, 0.5);
  padding-right: 6.1%;
  z-index: 105;
}
.h5share img {
  width: 50%;
}
.alerm {
  font-size: 12px;
  color: #EF0000;
}
.alerm img {
  margin: 0 5px 0 15px;
  height: 15px;
  width: 16px;
  transform: translate(0, 2.6px);
}
</style>


