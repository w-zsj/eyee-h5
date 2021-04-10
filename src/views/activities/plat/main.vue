<template>
  <div class="plat-main">
    <div class="mainimg_box">
      <img src="https://files.eyee.com/mcdn/img/plat/main14.png" alt />
      <div class="get_coupon" @click="getCoupon"></div>
    </div>
    <div class="adds_box">
      <img src="https://files.eyee.com/mcdn/img/plat/main08.png" alt />
      <div class="block-adds">
        <div class="second-adds flex-center">
          <div class="left-side flex-col">
            <router-link to="/active/cec1a5d65aa44e1188ceab710704bbae" tag="div">
              <img src="https://files.eyee.com/mcdn/img/plat/main12.png" alt />
            </router-link>
            <div>
              <!-- @click="goGift" -->
              <img src="https://files.eyee.com/mcdn/img/plat/main11.png?c=2" alt @click="goGift" />
            </div>
          </div>
          <router-link to="/plat/session" tag="div" class="right-side">
            <img src="https://files.eyee.com/mcdn/img/plat/main10.png" alt />
          </router-link>
        </div>
      </div>
      <div class="unit_reco shoes_reco" v-if="shoesList&&shoesList.length">
        <!-- <div class="reco_title"></div> -->
        <router-link to="/active/cc1bdb3337564f6590eade123096ce18" tag="div" class="reco_title"></router-link>
        <div class="block-adds">
          <div class="second-adds flex-wrap flex-between">
            <template v-for="item in shoesList">
              <prodUnit :key="item.productid" :infos="item" type="shoes"></prodUnit>
            </template>
          </div>
        </div>
      </div>
      <div class="unit_reco skirt_reco" v-if="skirtsList&&skirtsList.length">
        <!-- <div class="reco_title"></div> -->
        <router-link
          to="/platformActivity/5030b213a644478ea7956b4ee2a85b30"
          tag="div"
          class="reco_title"
        ></router-link>
        <div class="block-adds">
          <div class="second-adds flex-wrap flex-between">
            <template v-for="item in skirtsList">
              <prodUnit :key="item.productid" :infos="item"></prodUnit>
            </template>
          </div>
        </div>
      </div>
      <div class="unit_reco trous_reco" v-if="trousList&&trousList.length">
        <!-- <div class="reco_title"></div> -->
        <router-link
          to="/platformActivity/1a633cabad1b43e48c71bf176a8c65a2"
          tag="div"
          class="reco_title"
        ></router-link>
        <div class="block-adds">
          <div class="second-adds flex-wrap flex-between">
            <template v-for="item in trousList">
              <prodUnit :key="item.productid" :infos="item"></prodUnit>
            </template>
          </div>
        </div>
      </div>
      <div class="unit_reco fashionlife_reco" v-if="fashionlifeList&&fashionlifeList.length">
        <!-- <div class="reco_title"></div> -->
        <router-link
          to="/platformActivity/05c3a143f6ab44b184382a6786ea76dd"
          tag="div"
          class="reco_title"
        ></router-link>
        <div class="block-adds">
          <div class="second-adds flex-wrap flex-between">
            <template v-for="item in fashionlifeList">
              <prodUnit :key="item.productid" :infos="item"></prodUnit>
            </template>
          </div>
        </div>
      </div>
      <div class="logo-donow">
        <img src="https://files.eyee.com/mcdn/img/plat/main01.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const productIds = {
  shoes: [
    "F4bprDFP",
    "DojC90wT",
    "wJ6YkWBF",
    "esauR335",
    "wK2vQ9U9",
    "sbRlwG0f"
  ],
  skirts: [
    "1aefcd4b585047f4a28ca90cbf431776",
    "82966f13424040b788ed3af32018c10c",
    "e9e16e9f9cf246f798434d1aafdee6df",
    "828efff583c6446bbee16884b8bc2b3d",
    "472c5681b3f64d6883516e3a83e5ba8d",
    "1c6446a10414407da9e86c6bb03f16e3"
  ],
  trous: [
    "b14fcc0ef4374e58918dade5c192c2b3",
    "77f2678954584319b2a5b6c5dcc5abe3",
    "634a0f8cb84041bf96fc1ca3b79b5876",
    "e49a01eea25f45edbcde938777314b35",
    "5e90535ae2774bccbda08b020866d4c5",
    "ca287217a30c4b2ebe87e9994dc6fe8e"
  ],
  fashionlife: [
    "d362f8ca0a114b4bb09e828a09cd8743",
    "8c1c8f4b90f043bda1373a7e5266e0f1",
    // "ee82c92a7494453a85c8c568a09a3787",
    "6120d56b02ae4bb4a9a6eca5f7a9353a",
    // "339b3f85005d45608544f7219bb82e19",
    "54c7ee13be014cc583ccee054ba226d0",
    "1irbdBJ5",
    // "030b80eb27a049baa4a29c95ed9e30de",
    "35eb49c858784872bd95058d4c135280"
  ]
};
import { CargoList } from "@/common/api/active.js";
import { GetCouponByCdKey } from "@/common/api/marketing";
export default {
  data() {
    return {
      shoesList: [],
      skirtsList: [],
      trousList: [],
      fashionlifeList: []
    };
  },
  beforeCreate: function() {
    document.body.classList.add("add_bg");
  },
  beforeDestroy: function() {
    document.body.classList.remove("add_bg");
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
    }
  },
  components: {
    prodUnit: {
      template: `<div class="prod_unit" @click='todetail'>
        <img class="prod_img" :src="infos.mainpic | firstImg" />
        <div class="prod_name ellipsis-2">{{infos.productname}}</div>
        <div class="prod_price flex-col flex-ctr-start"><div class="sales_price">特惠价:<span>￥</span><span class="font-price">{{infos.price == 0 ? infos.delprice :infos.price}}</span></div>
        <div class="old_price" v-if="(infos.price && infos.price != 0) && (infos.price != infos.delprice)">原价:<span>￥</span><span class="font-price">{{infos.delprice}}</span></div></div>
      </div>`,
      props: {
        infos: {
          type: Object
        },
        type: String
      },
      methods: {
        todetail() {
          let _ = this,
            productid = _.infos.productid;
          if (_.$root.ISAPP) {
            let apptype =
              _.type === "shoes" || _.infos.productid === "1irbdBJ5"
                ? "gotoAppSneakerDetailPage"
                : "gotoAppProductDetailPage";
            _.javascriptBridge({
              name: apptype,
              params: { productid }
            });
          } else {
            let url =
              (_.type === "shoes" || _.infos.productid === "1irbdBJ5"
                ? `/sneaker/detail/`
                : `/productDetail/`) + productid;
            _.$router.push(url);
          }
        }
      }
    }
  },
  mounted() {
    let _ = this;
    let domain = _.$root.isdebug
      ? "http://qzone.eyee.com/"
      : "http://m.eyee.com/";
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          sharecontent:
            "1211斗牛周年庆，抢满2000-1211元周年庆神券，原价抽TS x AJ6，专享潮品6折封顶！",
          sharepicurl: "https://files.eyee.com/mcdn/img/plat/main_share.png",
          shareurl: domain + `plat/main`,
          sharetitle: "斗牛周年庆，专享潮品6折封顶！",
          callbackname: "",
          hideshareicon: false
        }
      });
    } else {
      _.initShare({
        info: {
          title: "斗牛周年庆，专享潮品6折封顶！",
          desc:
            "1211斗牛周年庆，抢满2000-1211元周年庆神券，原价抽TS x AJ6，专享潮品6折封顶！",
          img: "https://files.eyee.com/mcdn/img/plat/main_share.png",
          url: domain + `plat/main`
        }
      });
    }

    if (_.$root.loging) {
      _.$root.loging
        .then($ => {})
        .catch(e => {
          console.error("query prams auto login error:", e);
        });
    }
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.goGift();
        });
      } else _.toast("登录失败~");
    };
    return this.getList("shoes", productIds.shoes.join(","))
      .then(skirts => {
        return this.getList("skirts", productIds.skirts.join(","));
      })
      .then(trous => {
        return this.getList("trous", productIds.trous.join(","));
      })
      .then(fashionlife => {
        return this.getList("fashionlife", productIds.fashionlife.join(","));
      })
      .catch(() => {
        console.log("获取列表失败");
      });
  },
  methods: {
    getCoupon() {
      let _ = this;
      _.checkLogin(() => {
        GetCouponByCdKey({ cdkey: "A6mzrn" })
          .then(res => _.toast("领取成功"))
          .catch(e => {
            _.toast((e && e.msg) || "");
          });
      });
    },
    getList(type, ids) {
      return new Promise((resolve, reject) => {
        CargoList({ ids: ids })
          .then(res => {
            console.log(type + "--->>", res);
            resolve(res);
            if (type == "shoes") {
              this.shoesList = res;
            } else if (type == "skirts") {
              this.skirtsList = res;
            } else if (type == "trous") {
              this.trousList = res;
            } else if (type == "fashionlife") {
              this.fashionlifeList = res;
            }
          })
          .catch(err => {
            reject(err);
            console.log(err);
          });
      });
    },
    goGift() {
      this.checkLogin(() => {
        this.$router.push("/plat/gift");
      });
    },
    checkLogin(call) {
      let _ = this;
      if (_.uid) {
        call();
      } else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            if (ENV.ua.eyee) {
              _.javascriptBridge({
                name: "callAppLoginPage",
                params: { callbackname: "_appLoginCallback" }
              });
            } else _.$router.push("/login");
          }
        });
      }
    }
  }
};
</script>
<style>
.add_bg {
  background: #02878b;
}
.plat-main {
  overflow-x: hidden;
  overflow-y: auto;
}
.mainimg_box {
  position: relative;
  margin-bottom: 2.6vw;
}
.mainimg_box > img {
  display: block;
}
.mainimg_box .get_coupon {
  position: absolute;
  width: 168px;
  height: 50px;
  left: 50%;
  margin-left: -84px;
  margin-top: -120px;
  background: url("https://files.eyee.com/mcdn/img/plat/main13.png") no-repeat
    center;
  background-size: 100%;
  z-index: 9;
}
.plat-main .prod_unit > img {
  display: block;
  /* width: 100%;
    height: 30.67vw; */
  width: 38.4vw;
  height: 38.4vw;
}
.plat-main .prod_unit .prod_name {
  height: 10.67vw;
  padding: 0.8vw 4.27vw 0.8vw;
  background-color: #033c3e;
  border-color: #02878b;
  border-style: solid;
  border-width: 0 1px 0;
  line-height: 4.8vw;
  color: #fff;
  overflow: hidden;
  font-size: 12px;
}
.plat-main .prod_unit .prod_price {
  height: 13.33vw;
  background: url("https://files.eyee.com/mcdn/img/plat/main09.png") no-repeat
    bottom right;
  padding: 0.53vw 2.67vw;
  background-size: 28%;
  border: 0.53vw solid transparent;
}
.plat-main .prod_unit .prod_price .sales_price {
  white-space: nowrap;
  font-size: 16px;
  color: #ffe777;
  font-weight: 600;
}
.plat-main .prod_unit .prod_price .old_price {
  color: #f0e4d3;
  font-size: 11px;
  font-weight: 600;
  text-decoration: line-through;
}
</style>
<style scoped>
.prod_unit {
  border-radius: 2.67vw;
  /* height: 54.67vw; */
  width: 38.4vw;
  background-color: #02878b;
  margin-bottom: 3.2vw;
  overflow: hidden;
}
.prod_unit:nth-child(5),
.prod_unit:nth-child(6) {
  margin-bottom: 0px;
}
.plat-main {
  background-color: #02878b;
}
.plat-main > img {
  display: block;
  width: 100%;
}
.adds_box {
  position: relative;
  /* padding: 0 19px; */
}
.adds_box > img {
  position: absolute;
  left: 0;
  top: -8vw;
  z-index: 9;
}
.block-adds {
  width: 89.87vw;
  margin: 0 auto 5.33vw;
  background-color: #007275;
  box-shadow: 1px 5px 9px 0px rgba(0, 44, 45, 0.7),
    -6px 1px 12px 0px rgba(20, 184, 189, 0.7),
    5px -3px 12px 0px rgba(20, 184, 189, 0.7),
    -1px -7px 18px 0px rgba(9, 106, 109, 1);
  border-radius: 15px;
  padding: 1.07vw 1.87vw 1.6vw;
}
.unit_reco .block-adds {
  padding: 3.04vw 1.6vw;
}
.second-adds {
  background-color: #034c4e;
  border-radius: 4vw;
  padding: 8vw 2.4vw 4vw;
}
.unit_reco .second-adds {
  padding: 2.93vw 3.07vw;
}
.second-adds .left-side > div {
  width: 37.6vw;
  height: 18.93vw;
  border-radius: 2.67vw;
  background-color: #ff835d;
}
.second-adds .left-side > div:first-child {
  margin-bottom: 1.6vw;
}
.right-side {
  margin-left: 1.6vw;
  width: 42.13vw;
  height: 39.47vw;
  border-radius: 2.67vw;
  background-color: #ff835d;
}
.reco_title {
  position: relative;
  width: 88vw;
  height: 16vw;
  margin: 0 auto 0.48vw;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
}
.reco_title::after,
.reco_title::before {
  content: "";
  position: absolute;
  top: 16.8vw;
  width: 0.533vw;
  height: 0.533vw;
  border-radius: 50%;
  /* background-color: red; */
  background-color: rgba(111, 223, 226, 0.17);
}
.reco_title::after {
  left: -38.67vw;
}
.reco_title::before {
  right: -38.67vw;
}
.unit_reco .block-adds {
  position: relative;
  margin-top: 5.34vw;
}
.unit_reco .block-adds::after {
  content: "";
  position: absolute;
  width: 78vw;
  height: 9.33vw;
  left: 50%;
  top: -6.33vw;
  margin-left: -39vw;
  background: url("https://files.eyee.com/mcdn/img/plat/main04.png") no-repeat
    center;
  background-size: 100%;
}
.shoes_reco .reco_title {
  background-image: url("https://files.eyee.com/mcdn/img/plat/main03.png");
}
.skirt_reco .reco_title {
  background-image: url("https://files.eyee.com/mcdn/img/plat/main06.png");
}
.trous_reco .reco_title {
  background-image: url("https://files.eyee.com/mcdn/img/plat/main05.png");
}
.fashionlife_reco .reco_title {
  background-image: url("https://files.eyee.com/mcdn/img/plat/main02.png");
}
.logo-donow {
  padding: 6.67vw 15.46vw;
}
.unit_reco {
  position: relative;
}
.adds_box::after,
.adds_box::before,
.shoes_reco::after,
.shoes_reco::before,
.skirt_reco::after,
.skirt_reco::before,
.trous_reco::after,
.trous_reco::before,
.fashionlife_reco::after,
.fashionlife_reco::before {
  content: "";
  position: absolute;
  width: 0.53vw;
  height: 199.73vw;
  background-color: rgba(111, 223, 226, 0.17);
}
.adds_box::after {
  top: 0;
  left: 2vw;
}
.adds_box::before {
  top: 1.47vw;
  right: 2vw;
}
.shoes_reco::after,
.skirt_reco::after,
.trous_reco::after,
.fashionlife_reco::after {
  top: 20.8vw;
  left: 2vw;
}
.shoes_reco::before,
.skirt_reco::before,
.trous_reco::before,
.fashionlife_reco::before {
  top: 20.8vw;
  right: 2vw;
}
</style>