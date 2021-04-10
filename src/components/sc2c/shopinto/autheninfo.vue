<template>
    <div>
       <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>商家入驻</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="baozhengjin">
           <span>实名认证—</span>支付保证金
        </div>
        <div class="info">
            <label for="">姓名:</label>
            <input type="text" placeholder="请输入您的姓名" v-model="shopintoinfo.name">
        </div>
        <div class="info">
            <label for="">身份证:</label>
            <input type="text" placeholder="请输入您的身份证号" v-model="shopintoinfo.idcard">
        </div>
        <div class="introduce">
          <p class="title">*以上信息为隐私，不对外展示</p>
          <div class="house-rules">
            <p>1. 入驻商家可享受 “0佣金” 优惠规则  </p>
            <p>2. 商家入驻后合理出价，不必每次缴纳保证金</p>
            <p>3. 入驻商家可方便快捷的管理商品价格</p>
          </div>
        </div>
        <!-- 认证失败弹框 -->
         <div class="autheninfofail" v-if="autheninfofail">
           <img src="/static/img/certificate_pop up_error.png" alt="">
           <h4>认证失败！</h4>
           <p>您提供的身份信息与当前登录账户实名信息不一致，请确认后重新提交</p>
           <div @click.stop="reset" class="reset">重新认证</div>
         </div>
        <!-- 协议 -->
        <div class="bg" v-if="merchantsdealShow||autheninfofail" @click.stop="close"></div>
        <div class="merchantsdealShow" v-if="merchantsdealShow" @click.stop="close">
            <em>X</em>
            <p class="title">商家协议</p>
            <p class="clause">甲、乙双方经友好协商，由甲方指定乙方为“”系列产品在地区独家销售全权代表。双方根据本协议所列的条款和条件，缔结和履行产品销售合同及其他涉及产品销售的相关事宜。</p>
               <span>第一条 乙方权限</span>
              <p> 乙方负责甲方所生产的系列产品在 地区的营销管理，权限包括：</p>
              <p>(一）指定分经销人、建立营销网络；</p>
              <p>(二）进行广告宣传和其他促销活动； </p>
              <p>(三）参加本地区各展览会和交易会； </p>
              <p>(四）乙方在地区内销售产品有权代表甲方签署销售合同，并协助甲方履行所有的销售合同； </p>
              <p>(五）乙方负责地区的市场调查、客户意见反馈等市场信息工作,并定期向甲方报告； </p>
              <p>(六）乙方负责产品的售后服务，向消费者提供因质量问题而带来的更换事宜，处理产品质量引起的纠纷； </p>
              <p>(七）其他由甲方授权乙方从事经销的权限。 </p>
              <span>第二条 乙方专营权 </span>
              <p>(一）在本协议有效期内，甲方不得指定其他任何人为其在地区的产品销售。 </p>
              <p>(二）乙方在本协议有效期内，不得转让地区总经销权。 </p>
              <p>(三）乙方在本协议有效期内，不得销售与甲方相竞争的厂商代理相同或相近似的产品。</p>
        </div>
        <div class="next" :class="{'nextbg':bg}" @click.stop="next">
          <span @click.stop="merchantsdeal"><em :class="{'selected':iconselected}" @click.stop="iconClassSelected"></em> 同意《商家协议》</span>
          实名认证
        </div>
    </div>
</template>
<script>
import { Checking, getUrlParam } from "../../../common/util";
import { identityToMerchant } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var dom = document;
export default {
  data() {
    return {
      shopintoinfo: {
        name: "张三军",
        idcard: "411481198908062433"
      },
      autheninfofail: false, // 认证失败弹框
      iconselected: true, // radio 选中
      merchantsdealShow: false // 商家协议弹框
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    }),
    bg() {
      if (this.shopintoinfo.name && this.shopintoinfo.idcard) {
        return true;
      } else return false;
    }
  },
  mounted() {
    let param = getUrlParam("biz_content");
    param = JSON.parse(decodeURIComponent(param));
  },
  methods: {
    next() {
      if (this.shopintoinfo.name && this.shopintoinfo.idcard) {
        if (reg.test(this.shopintoinfo.idcard) === false) {
          this.toast("请输入合法的身份证号");
        } else if (!this.iconselected) {
          this.toast("请阅读商家协议");
        } else {
          if (!this.userInfo.token) {
            this.$router.push("/login");
          } else if (this.$root.ISWX) {
            this.toast("请在浏览器内完成认证");
          }
          // this.$router.push("/autheninfocode");
          let option = {
            username: this.shopintoinfo.name,
            identitycard: this.shopintoinfo.idcard,
            returnurl: window.location.href
          };
          console.log(option);
          identityToMerchant(option)
            .then(res => {
              if (res && res.url) {
                window.location.href = res.url;
              }
            })
            .catch(err => {
              console.error(err);
            });
        }
      } else {
        if (!this.shopintoinfo.name) {
          this.toast("请输入姓名");
        } else if (!this.shopintoinfo.idcard) {
          this.toast("请输入身份证号");
        } else this.toast("请完善信息");
      }
    },
    iconClassSelected() {
      this.iconselected = !this.iconselected;
    },
    merchantsdeal() {
      this.merchantsdealShow = true;
    },
    close() {
      this.merchantsdealShow = false;
      this.autheninfofail = false;
    }
  }
};
</script>
<style scoped>
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 101;
}
.autheninfofail {
  position: fixed;
  width: 73vw;
  left: 13vw;
  right: 13vw;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  z-index: 102;
  border-radius: 10px;
  text-align: center;
  font-family: "PingFangSC";
  padding: 15px;
}
.autheninfofail img {
  width: 40%;
  display: block;
  margin: 20px auto;
}
.autheninfofail h4 {
  font-size: 16px;
  color: #f02323;
  margin-bottom: 20px;
}
.autheninfofail p {
  font-size: 12px;
  color: #f02323;
}
.autheninfofail .reset {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #333;
  font-size: 16px;
  background: #ffc700;
  border-radius: 5px;
  margin-top: 20px;
}
.merchantsdealShow {
  position: fixed;
  top: 16vw;
  background: #fff;
  left: 2.7vw;
  right: 2.7vw;
  z-index: 102;
  bottom: 15vw;
  font-size: 12px;
  color: #333;
  border-radius: 10px;
  padding: 15px;
  font-family: "PingFangSC";
  line-height: 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
.merchantsdealShow em {
  position: absolute;
  width: 12px;
  height: 12px;
  color: #999;
  font-size: 16px;
  right: 10px;
  top: 10px;
}
.merchantsdealShow span {
  display: block;
  padding: 30px 0;
}
.clause {
  margin-top: 20px;
}
.merchantsdealShow .title {
  height: 72px;
  line-height: 72px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  border-bottom: 1px dashed #ccc;
}
.baozhengjin {
  height: 50px;
  line-height: 50px;
  background: #f5f5f5;
  padding-left: 15px;
  color: #ccc;
}
.baozhengjin span {
  color: #333;
  padding-right: 10px;
}
.info {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 2px;
}
.info label {
  color: #333;
  font-weight: bold;
  width: 20%;
  display: inline-block;
}
.info input {
  width: 70%;
  height: 98%;
  outline-style: none;
  list-style: none;
  padding: 0;
}
.info.code {
  /* border: 0; */
  position: relative;
}
.info.code span {
  position: absolute;
  right: 10px;
  top: 13px;
  background: #333;
  color: #fff;
  padding: 0 15px;
  line-height: 26px;
  border-radius: 3px;
}
.next {
  background: #cccccc;
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  text-align: center;
  /* margin: 30px 15px; */
  /* border-radius: 3px; */
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.next span {
  position: absolute;
  top: -60px;
  font-size: 12px;
  color: #333;
}
.next span em {
  width: 14px;
  height: 14px;
  background: url("/static/img/d_apply_choose1.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  border-radius: 50%;
  left: -20px;
  top: 14px;
}
.next span em.selected {
  background: url("/static/img/d_apply_choose2.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.next.nextbg {
  background: #333;
}
.introduce {
  margin: 15px;
}
.introduce .title {
  font-size: 11px;
  color: #666666;
  margin-bottom: 20px;
}
.introduce .house-rules {
  font-size: 14px;
  color: #333;
}
</style>



