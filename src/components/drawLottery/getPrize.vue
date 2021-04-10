<template>
    <div class="main">
        <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>领取奖品</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="title">{{getShowPrizeList.winningtext}}</div>
        <div class="flex-between product">
            <div class="product-img">
                <img :src="getShowPrizeList.prizepic" alt="">
            </div>
            <div class="flex-col product-jeishao">
                <div class="flex-aic"><span class="ellipsis name">{{getShowPrizeList.name}} {{getShowPrizeList.sku}}</span></div>
                <div class="flex-between price">
                    <span>¥{{getShowPrizeList.drawprize}} <i>原价¥{{getShowPrizeList.saleprice}}</i></span>
                    <!-- <span>{{getShowPrizeList.size}}码</span> -->
                </div>
            </div>
        </div>
         <!-- 领奖信息 -->
        <div class="info">
            <p class="info-title">请先完善您的领取信息哦~</p>
            <input type="text" v-model="sunmit.name" placeholder="姓名"/>
            <input type="text" v-model="sunmit.phone" placeholder="手机号"/> 
            <input type="text" v-model="sunmit.address" placeholder="收货地址"/> 
    
            <div class="get active" @click="submitaddress">领取</div>
        </div>
        <!-- 领取成功 分享弹框 -->
        <div class="share-model" v-if="getSuccess" @click.stop="close">
            <div class="content">
                <p>领取信息登记完成，请耐心等待奖品哦~</p>
                <p class="prize-info">奖品将于领取之后的7个工作日内为您邮寄，若有任何疑问可联系我们的客服小姐姐哦~</p>
                <div class="share-btn" @click.stop="share">炫耀一下</div>  
                <span class="close">X</span>     
            </div>
            
        </div>
         <!-- h5 分享 -->
        <shareModel @closeShareModel='shareClose' v-if="closeShareModel" :shareContent="shareContent"></shareModel>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import UserAddressUint from "../templates/user/UserAddressUnit";
import shareModel from "../templates/h5ShareModel";
// import { Checking } from "../../common/util";
import { submitaddress, getShowPrize } from "../../common/api/lotter.js";
const rgxMobile = /^1[3,5,7,8]\d{9}$/;
export default {
  components: {
    UserAddressUint,
    shareModel
  },
  data() {
    return {
      shareContent: "好友参与抽奖后 你可以额外获得一张抽奖码,传递好运获得更多抽奖码",
      getSuccess: false,
      closeShareModel: false,
      sunmit: {},
      getShowPrizeList: {}
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    let _ = this;
    _.sunmit.id = _.$route.params.id;
    _.ShowPrize();
  },
  methods: {
    ShowPrize() {
      let _ = this;
      getShowPrize({ id: this.sunmit.id })
        .then(res => {
          if (res) {
            _.getShowPrizeList = res;
            console.log("领取奖品数据", _.getShowPrizeList);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    submitaddress() {
      let _ = this;
      let opt = { ..._.sunmit };
      // opt.phone = "+86-" + opt.phone;
      if (!opt.name) {
        _.toast("请输入姓名!");
        return false;
      } else if (!rgxMobile.test(opt.phone)) {
        _.toast("请输入合法的手机号!");
        return false;
      } else if (!opt.address) {
        _.toast("请填写收货地址!");
        return false;
      } else if (!opt.id) {
        _.toast("抽奖id不存在!");
        return false;
      }
      opt.phone = _.sunmit.phone
      submitaddress(opt)
        .then(res => {
          _.toast("领取成功");
          _.getSuccess = true;
        })
        .catch(e => {
          console.error(e);
        });
    },
    close() {
      this.getSuccess = false;
    },
    shareClose() {
      this.closeShareModel = false;
    },
    share() {
      // alert(12)
      this.getSuccess = false;
      this.closeShareModel = true;
    }
  }
};
</script>
<style scoped>
.main {
  padding: 20px 15px;
}
.title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}
.product {
  border: 1px solid #979797;
  border-radius: 5px;
  padding: 15px 10px;
}
.product-img {
  width: 20%;
  border: 1px solid #ccc;
  margin-right: 10px;
}
.product-img img {
  width: 100%;
  height: 100%;
  display: block;
}
.product-jeishao {
  width: 80%;
  font-size: 12px;
  color: #3f3f3f;
}
.price {
  margin-top: 22px;
  font-size: 14px;
}
.price span i {
  font-style: normal;
  font-size: 10px;
  color: #979797;
  text-decoration: line-through;
}
.info-title {
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: bold;
  margin: 70px auto 20px;
}
.info input {
  outline-style: none;
  list-style: none;
  background: #eaeaea;
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #999;
  border-radius: 5px;
}
.get {
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: #b5b5b5;
  text-align: center;
  font-size: 18px;
  border-radius: 5px;
  margin-top: 20px;
}
.get.active {
  background: #333;
}
.share-model {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.close {
  position: absolute;
  width: 15px;
  height: 15px;
  top: 10px;
  right: 10px;
}
.share-model .content {
  position: absolute;
  width: 90%;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  padding: 10% 8.5%;
  font-size: 14px;
  color: #333;
}
.prize-info {
  color: #979797;
  font-size: 11px;
  margin: 17px;
}
.share-btn {
  height: 40px;
  background: #333;
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  margin-top: 50px;
}
.addr {
  position: relative;
  height: 40px;
  overflow: hidden;
}
.UserAddressUint {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
}
</style>


