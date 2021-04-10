<template>
    <div>
        <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>商家信息</h3>
            </div>
            
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="business">
           <div class="flex-between userinfo">
              <div class="flex-aic" style="width:70%;">
                <img :src="businessSellMess.userimageurl" alt="">
                {{businessSellMess.username}}
              </div>
              <div class="intoinfo"  @click.stop="exit">退出入驻</div>
           </div>
           <div class="business-info">
             <!-- <div class="flex-between business-info-show">
                <label for="">姓名:</label>
                <input type="text" :value="businessSellMess.username" readonly>
              </div> -->
              <div class="business-info-show">
                <label for="">手机:</label>
                <input type="text" :value="businessSellMess.mobile" readonly>
              </div>
              <!-- <div class="flex-between business-info-show">
                <label for="">身份证号:</label>
                <input type="text" :value="businessSellMess.identityCard" readonly>
              </div> -->
           </div>
           
        </div>
        <model confirmText='联系客服' @confirm='QiyuProd' v-show="showmodel">
          <img class="close_btn" src="/static/img/gray_close.png" @click="close()">
          <div class='model-content'>
            <p>您的账户目前处于冻结状态，退出入驻请联系客服。</P>
          </div>
        </model>
    </div>
</template>
<script>
import {
  businessSellMessage,
  businessExit
} from "../../../common/api/snekc2c.js";
import { StatusCode } from "../../../common/enum";
import { mapGetters } from "vuex";
import Model from "../../sneaker/Model";
import { QiyuProd } from '../../../common/api/WyQiyu';
export default {
  data() {
    return {
      businessSellMess: {},
      showmodel: 0,
    };
  },
  components: {
    Model
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    this.businessSellInfo();
    // document.addEventListener(
    //   "backbutton",
    //   function() {
    //     alert(123);
    //   },
    //   false
    // );
  },
  methods: {
    exit() {
      let option = {
        title: "退出后不能同时出售多双鞋子！",
        msg: "剩余保证金将退回您的斗牛APP账户余额!",
        okText: "我再想想",
        cancelText: "退出入驻",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        cancel: () => {
          businessExit()
            .then(res => {
              this.toast("申请退出入驻成功 返回出售页面...");
              setTimeout(() => {
                this.$router.push("/shopcenter");
              }, 800);
            })
            .catch(e => {
              console.error(e);       
              if(e&&e.code==StatusCode.exsuccess){
                this.showmodel = 1;
              }else{
                this.toast(e.msg);
              }
            });
        }
      };
      this.confirm(option);
    },
    businessSellInfo() {
      businessSellMessage()
        .then(res => {
          let b = res, uinfo = this.userInfo;
          b.userimageurl = b.userimageurl || uinfo.imageurl;
          b.username = b.username || uinfo.username;
          this.businessSellMess = b;
          console.log("入驻信息", this.businessSellMess);
        })
        .catch(e => {
          this.toast(e);
          console.error(e);
        });
    },
    close() {
      this.showmodel = 0;
    },
    QiyuProd() {
      QiyuProd.call(this)
      console.log('打开客服')
    },
  }
};
</script>
<style scoped>
.intoinfo {
  width: 30%;
  line-height: 48px;
  font-size: 14px;
  color: #ccc;
  text-align: center;
  margin-left: 30%;
}
.business {
  margin: 15px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}
.userinfo {
  width: 100%;
  height: 60px;
  background: #333;
  color: #fff;
  padding-left: 15px;
  font-size: 15px;
  border-radius: 5px 5px 0 0;
}
.userinfo img {
  width: 20%;
  border-radius: 50%;
  margin-right: 5px;
}
.business-info {
  padding: 15px 0;
}
.business-info-show {
  font-size: 15px;
  color: #333;
  line-height: 30px;
}
.business-info-show label {
  padding-left: 25px;
}
.model-content {
  font-size: 13px;
  margin-top: 4vw;
  margin-bottom: 9.0667vw;
}
.close_btn {
  position: absolute;
  top: 3.3333vw;
  right: 3.8667vw;
  height: 15px;
}
.model-content p {
  color: #333;
  font-size: 14px;
  margin: 10vw 2.4vw 0 2.4vw;
}
</style>


