<template>
  <div class="user_settings">
    <div class="setting_fix" :class="{labelNav:showTitle}">
      <router-link to="/user/account" tag="span" class="ico-setting"></router-link>
      <label v-if="showTitle">
        <img :src="localUserInfos.imageurl|https" alt>
        <span>{{localUserInfos.username}}</span>
      </label>
    </div>
    <div class="user_head">
      <UserImage class="user_box" :seletype="1"></UserImage>
    </div>
    <div class="user_infobox">
      <div class="user_infos">
        <UserImage class="user_logo" :seletype="0"></UserImage>
      </div>
      <router-link to="/user/account" tag="div" class="user_name">{{localUserInfos.username}}</router-link>
      <!-- <div class="user_name">{{localUserInfos.username}}</div> -->
      <!-- <div class="user_level flex-center"><span>蜜蜂 LV.{{localUserInfos.rankname?localUserInfos.rankname.substr(1):0}}</span></div> -->
      <img
        class="user_level"
        :src="`/static/img/user/level_${localUserInfos.rankname?localUserInfos.rankname.substr(1):0}.png`"
        alt
      >
      <div class="option">
        <ul class="user_items clearfix">
          <li v-for="(itemP,indexP) in userItems" :key="itemP.name">
            <router-link tag="div" :to="itemP.toLink">
              <img :src="itemP.ico|https" alt>
              <p>{{itemP.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="orderbox">
      <div class="title">我的订单
        <router-link to="/user/order">
          全部订单
          <img src="/static/img/right_arrow.png" style="width:3.33vw">
        </router-link>
      </div>

      <div class="btnbox">
        <ul class="user_items clearfix">
          <li v-for="(itemP,indexP) in orderItems" :key="itemP.name">
            <div @click="goOrder(itemP.type)">
              <img :src="itemP.ico" alt>
              <p>{{itemP.name}}</p>
            </div>
            <i v-if="itemP.count>=1">{{itemP.count}}</i>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex-around c2c-enter">
      <div class="account flex-between" @click.stop="loadModal">
        <div class="flex-col left">
          <span>账户余额</span>
          <span>￥{{getAcountNumber.balance||0|tofixed}}</span>
        </div>
        <div class="right">
          <img src="/static/img/moneyicon.png" alt>
        </div>
      </div>
      <div class="account flex-between" @click.stop="loadModal">
        <div class="flex-col left">
          <span>
            <!-- 球鞋出售 -->
            我的出售
            <i
              v-if="getAcountNumber.waitsendnum>0"
            >待发货 {{getAcountNumber.waitsendnum <= 99 ? getAcountNumber.waitsendnum : '99+'}}</i>
          </span>
          <span>在售{{getAcountNumber.salesvolume||0}}双</span>
        </div>
        <div class="right accountimg">
          <img class="imgstyle" src="/static/img/mine_bg_icon.png" alt>
        </div>
      </div>
    </div>
    <div class="recobox">
      <div class="recotitle">━ 为您推荐 ━</div>
      <v-list
        class="recolist"
        :load-handle="()=>{}"
        :more-handle="loadmore"
        :more-handling="loading"
        :isend="isend"
      >
        <ProductUnit
          v-for="(item,index) in recoPros"
          :key="index+item.id"
          :productItem="item"
          :productType="5"
          :isFindSim="1"
        ></ProductUnit>
      </v-list>
    </div>
  </div>
</template>
<script>
import UserImage from "../templates/user/UserImage";
import ProductUnit from "../templates/ProductUnit";
import { mapGetters } from "vuex";
import { ProdSearch } from "../../common/api/product";
import {
  getAcountNumber,
  getBuyerOrderForStatus
} from "../../common/api/snekc2c";
export default {
  data() {
    return {
      userItems: [
        { name: "购物车", ico: "/static/img/user/u_cart.png", toLink: "/cart" },
        {
          name: "收藏",
          ico: "/static/img/user/u_collection.png",
          toLink: "/user/collection"
        },
        {
          name: "红包卡券",
          ico: "/static/img/user/u_newcoupon.png",
          toLink: "/user/coupon"
        },
        // {
        //   name: "牛币商城",
        //   ico: "/static/img/user/u_honey.png",
        //   toLink: "/user/honey"
        // }
      ],
      orderItems: [
        { name: "待付款", ico: "/static/img/user/u_pay.png", type: 1 },
        { name: "待发货", ico: "/static/img/user/u_ship.png", type: 2 },
        { name: "待收货", ico: "/static/img/user/u_receipt.png", type: 3 },
        { name: "已完成", ico: "/static/img/user/u_return.png", type: 4 }
      ],
      showTitle: false,
      scrollWatch: true,
      postData: { issearchall: 1, sorttype: 2, pageindex: 1, isc2c: true }, // issearchall:0有条件1是无条件
      recoPros: [],
      getAcountNumber: {},

      loading: false,
      isend: false
      // saleSneakersCount: 130
    };
  },
  created() {
    this.buyyerNum(this.localUserInfos.uid);
  },
  mounted() {
    var ug = document.querySelector(".user_infos");
    var screenWidth = screen.width;
    if (ug) {
      var ug_width = ug.clientWidth;
      var l = (screenWidth - ug_width) / 2;
    }

    window.addEventListener("scroll", () => {
      if (this.scrollWatch) {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        if (scrollTop > 1) {
          this.showTitle = true;
        } else {
          this.showTitle = false;
        }
      }
    });
    this.getRecomtPro();
    this.getAcount();
  },
  methods: {
    buyyerNum(uid) {
      getBuyerOrderForStatus(uid)
        .then(res => {
          let _ = this;
          let buynum = res;

          for (let i in buynum) {
            // console.log("================>", item);
            if (i != 4 && i != 3) {
              _.orderItems[i].count = buynum[i];
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    goOrder(index) {
      this.$store.dispatch("setOrderState", index);
      this.$router.push("/user/order");
    },
    loadModal() {
      this.loadApp(-1);
    },
    // sneakers() {
    //   this.$router.push("/shopcenter");
    // },
    getAcount() {
      getAcountNumber()
        .then(res => {
          // console.log(res,'res')
          if (res) this.getAcountNumber = res;
        })
        .catch(e => {
          console.error(e);
        });
    },
    loadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.postData.pageindex++;
        _.getRecomtPro();
      }
    },
    getRecomtPro() {
      let _ = this,
        { postData } = _;
      _.loading = true;
      ProdSearch(postData)
        .then(res => {
          if (res && res.list && res.list.length) {
            if (postData.pageindex === 1) _.recoPros = res.list;
            else _.recoPros = _.recoPros.concat(res.list);
            _.isend =
              res.pageindex * res.pagesize >= res.sumcount &&
              _.recoPros.length > 0;
          } else _.isend = true;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    }
  },
  components: { UserImage, ProductUnit },
  computed: {
    ...mapGetters({ localUserInfos: "userInfo" })
  }
};
</script>
<style scoped>
.c2c-enter {
  width: 95%;
  margin: 0 auto;
  position: relative;
  top: -14vw;
}
.c2c-enter .account {
  width: 45%;
  height: 21.6vw;
  padding-left: 4.6vw;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  font-size: 12px;
  color: #666;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  border-radius: 4px;
  position: relative;
}
.c2c-enter .account .left {
  width: 60%;
}
.c2c-enter .account .left span:nth-child(1) {
  color: #333;
  font-weight: bold;
  font-family: "PingFangSC";
  line-height: 24px;
}
.c2c-enter .account .left i {
  position: absolute;
  top: 6%;
  /* top: 16%; */
  /* right: 15%; */
  font-size: 10px;
  font-weight: normal;
  background: #ff0808;
  padding: 3px 5px;
  text-align: center;
  line-height: 13px;
  font-style: normal;
  color: #fff;
  border-radius: 10px;
}
.c2c-enter .account .right {
  width: 40%;
}
.c2c-enter .account .accountimg {
  padding-top: 15px;
}
.c2c-enter .account img,
.c2c-enter .sneakers img {
  width: 80%;
}
.user_settings {
  background-color: #fff;
}
.user_head {
  width: 100%;
  height: 35vw;
  position: relative;
  background: #242424;
  overflow: hidden;
}
.setting_fix {
  position: fixed;
  width: 100%;
  height: 46px;
  text-align: center;
  line-height: 46px;
  top: 0;
  background: transparent;
  z-index: 5;
}
.setting_fix.labelNav {
  background: #191919;
  color: #fff;
}
.setting_fix label img {
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  vertical-align: middle;
}
.user_box {
  width: 100%;
  height: 225px;
}
.ico-setting {
  display: inline-block;
  position: absolute;
  left: 20px;
  top: 7px;
  width: 32px;
  height: 32px;
  background: url(//files.eyee.com/mcdn/static/img/user/setup.png) no-repeat
    center;
  background-size: cover;
  border-radius: 50%;
  background-color: rgba(0,0,0,.3);
}
.user_infobox {
  background: #fff;
  width: 90vw;
  height: 45vw;
  margin: 0 auto;
  position: relative;
  top: -22vw;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.user_infos {
  position: absolute;
  width: 46px;
  left: 5vw;
  top: 5vw;
}
.user_logo {
  width: 100%;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
}
.user_name {
  color: #666;
  font-size: 14px;
  position: absolute;
  top: 6vw;
  left: 21vw;
}
.user_level {
  width: 17.07vw;
  /* height: 4vw; */
  position: absolute;
  left: 21vw;
  top: 12vw;
  /* background-image: url("/static/img/bee-bg.png");
  background-size: 17.07vw 4vw; */
  font-size: 10px;
  color: #fff;
}
.option {
  position: absolute;
  width: 90vw;
  height: 17vw;
  padding: 0 2vw;
  bottom: 5vw;
}
.user_items li {
  float: left;
  width: 25%;
  text-align: center;
  margin-bottom: 10px;
  position: relative;
}
.option .user_items li {
  margin-left: 6%;
}
.user_items li img {
  width: 30px;
  margin-bottom: 3px;
}
.user_items li p {
  font-size: 12px;
  color: #666;
}
.user_items li i {
  position: absolute;
  top: 0;
  right: 25%;
  font-size: 10px;
  background: #ef0000;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  font-style: normal;
  color: #fff;
  border-radius: 50%;
}
.orderbox {
  background: #fff;
  width: 90vw;
  height: 32.5vw;
  margin: 0 auto;
  position: relative;
  top: -18vw;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.orderbox .title {
  padding: 0 5vw;
  font-size: 14px;
  font-weight: bold;
  line-height: 12vw;
}
.orderbox .title a {
  float: right;
  font-weight: normal;
  font-size: 3.2vw;
  color: #999;
  display: flex;
  align-items: center;
}
.orderbox .btnbox {
  padding-top: 1vw;
}
.recobox {
  position: relative;
  top: -11vw;
}
.recotitle {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.recolist {
  padding-top: 4vw;
}
.recolist /deep/ .productItem {
  display: inline-block;
  width: 50%;
  padding: 0px 5px;
  margin-bottom: 5vw;
}
</style>
