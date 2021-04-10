<template>
    <div>
        <div class="sellingdetaillist">
          <div class="productwrap">
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
                </div>
            <div class="productwrap">
                <div class="colorsize flex-between flex-wrap">
                    <div>{{info.productsize}}码, 数量X{{info.count}}</div>
                    <div class="productprice">￥{{info.payprice | tofixed}}</div>
                </div>
                
                <div class="flex-end">
                  <div class="nosale flex-center" @click.stop="model(1)">我不卖了</div>
                  <div class="nosale yelloeColor flex-center" @click.stop="model(3)" v-if="$root.ISWX">喊人来买</div>      
                </div>  
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
import { lowerFrame } from "../../../common/api/snekc2c.js";
import { DateDiff, _getDate } from "../../../common/util";

export default {
  data() {
    return {
      sellingdetaillist: [],
      h5share: false
    };
  },
  computed: {
  },
  props: {
    info: { type: Object }
  },
  mounted() {
  
  },
  methods: {
    
    close() {
      this.h5share = false;
    },
    goDetail() {
      let info = this.info;
      this.$router.push("/shoporderdetail/" + info.sneakerssalesid);
    },
    model(type) {
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
        this.$router.push("/logistics/" + this.info.sellorderno + "/1"); // 1 是卖家 2 买家
      }
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
  background:  url("//files.eyee.com/mcdn/static/img/order-service-exchange.png") 0 0 no-repeat;
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
  color: #ffc700;
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
  margin: 15px;
  font-size: 12px;
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
.toastColor::before {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid #eb3e3e;
  left: -10px;
  top: 7px;
}
.toastColor::after {
  content: "";
  position: absolute;
  height: 5px;
  width: 5px;
  left: -5px;
  top: 10px;
  border-left: 1px solid #eb3e3e;
  border-bottom: 1px solid #eb3e3e;
}
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
.flex-wrap, .flex-end {
  height: 12vw;
}
</style>


