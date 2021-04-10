<template>
  <div style="background: #333;">
    <div v-if="show" class="coubgc" @click="getCouponList"></div>
    <div class="couponShow" :class="{ couponShowNext: show }">
      <div class="coupon-title">店铺优惠券</div>
      <CouponUnit
        v-for="c in coupons"
        :key="c.id"
        :cous="c"
        :couType="3"
        :show-period="true"
      ></CouponUnit>
      <p class="no-more">已经到底啦~~</p>
    </div>
    <div class="shop-detail">
      <v-headerscopy :bg="dark" style="background: #333;">
        <div class="nav-tab2"></div>
        <!-- <v-cart :isdark='false' :isshow="true" class="car"></v-cart> -->
        <v-cart :isshow="true" class="car"></v-cart>
      </v-headerscopy>
      <div class="s-infos">
        <div class="s-infos-left">
          <img
            class="img"
            v-lazy="https(info.headportraiturl)"
            @click="goInfo"
            alt=""
          />
        </div>
        <div class="s-infos-right">
          <p class="s-name">{{ info.businessname }}</p>
          <div class="descWrapper">
            <p
              @click="goInfo"
              ref="ht"
              class="s-desc txt-over-2"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              "
            >
              {{ info.desc }}
            </p>
            <!-- <span class="all" @click="goInfo" v-if="heihgt >= 40">...全部</span> -->
          </div>
          <!-- <div :class="{right:!info.isfavor,right1:info.isfavor}">
            <p class="s-img" v-if="!info.isfavor"><img src="../../../assets/img/star.png" style="width:1.5rem"></p>
            <p class="s-img" v-if="info.isfavor"><img src="../../../assets/img/icon_selected.png" style="width:1.5rem"></p>
            <p class="s-like" @click="favShop">{{info.isfavor?'已':''}}收藏</p>
          </div> -->
          <div class="s-footer">
            <div class="left">
              <!-- <p class="s-buy"> -->
                <!-- {{
                  info.type === 1
                    ? "官方店"
                    : info.type === 2
                    ? "买手店"
                    : "专营店"
                }} -->
                <!-- <p></p> -->
                <img v-if="info.type === 2" src="../../../assets/img/1@2x.png" style="width:42px;height:18px">
                <img v-if="info.type === 3" src="../../../assets/img/2@2x.png" style="width:42px;height:18px">
                <img v-if="info.type === 1" src="../../../assets/img/3@2x.png" style="width:42px;height:18px">
              <!-- </p> -->
              <p class="s-fans">
                {{ info.favorcount > 999 ? "999+" : info.favorcount }}粉丝
              </p>
            </div>
            <div :class="{ right: !info.isfavor, right1: info.isfavor }">
              <p class="s-img" v-if="!info.isfavor">
                <img
                  src="../../../assets/img/star.png"
                  style="width: 1.5rem;"
                />
              </p>
              <p class="s-img" v-if="info.isfavor">
                <img
                  src="../../../assets/img/icon_selected.png"
                  style="width: 1.5rem;"
                />
              </p>
              <p :class="{'s-like':info.isfavor,'s-likes':!info.isfavor}" @click="favShop">
                {{ info.isfavor ? "已" : "" }}收藏
              </p>
            </div>
          </div>
        </div>

        <!-- <img v-lazy="https(info.logourl)" alt=""> -->
        <!-- <div class="s-show"> -->
        <!-- <div class="s-vdo" v-if='info.videourl'>
          <video id="shopVideo" preload="auto" :class="{play:playing}" controls webkit-playsinline playsinline :src="info.videourl|https"></video>
          <i class="ico-vdo-play" @click="playVdo"></i>
        </div> -->
        <!-- <div class="s-info flex-between">
          <div class="s-info-l flex">
            <img v-lazy="https(info.headportraiturl)" @click='goInfo' alt="">
            <div>
              <p class="ellipsis">{{info.businessname}}</p>
              <p>
                <i class="ico-sp-glb tilt" v-if="info.isglobalpurchase"></i>
                <i :class="info.icoClass" class="tilt"></i>
              </p>
            </div>
          </div>
          <div class="s-info-r" @click="favShop">
            <div>
              <i :class="{'ico-fav-white':!info.isfavor,'ico-fav-white-act':info.isfavor}"></i>
              <span>{{info.isfavor?'已':''}}收藏</span>
            </div>
            <p class="font-price">{{info.favorcount>999?'999+':info.favorcount}}
              <span>粉丝</span>
            </p>
          </div>
        </div> -->
        <!-- </div> -->
      </div>
      <!-- <div v-if="show" class="couponShow" :class="{couponShowNext: show}">
      <div class="coupon-title">店铺优惠券</div>
      <CouponUnit v-for="c in coupons" :key="c.id" :cous="c" :couType="3" :show-period='true'></CouponUnit>
      <p class='no-more'>已经到底啦~~</p>
    </div> -->
      <div class="s-coupons" v-show="coupons.length">
        <!-- <div style="display:flex;width:80%;"> -->
          <div
          class="s-cou-infos"
          v-for="(item, index) in couponsList"
          :key="index"
          @click="getCouponList"
        >
          <div class="base-one-circle"></div>
          <div class="s-coupon-right">
            <p>{{ item.title }}</p>
            <img src="../../../assets/img/1@3x.png" style="height: 3vh;" />
            <p>领取</p>
          </div>
        <!-- </div> -->
        </div>
        <div class="s-cou-more" @click="getCouponList">
          <div class="s-right">
            <p>{{ coupons.length }}个优惠</p>
            <!-- <p style="margin-left: 11px; font-size: 3vw;">></p> -->
            <img src="../../../assets/img/icon_more_right@3x.png">
          </div>
        </div>
      </div>
      <nav-bar :bars="bars" :iseq="false" :toggle="toggle"></nav-bar>
      <section
        class="s-index"
        v-show="barId == 'index'"
        v-if="info.homecontenturl"
      >
        <v-active :isin="true" :id="info.id"></v-active>
      </section>
      <section class="s-list" v-if="barId == 'list'">
        <ProductSearchList :styleType="1"> </ProductSearchList>
      </section>
      <section
        class="s-newpublish flex-wrap"
        style="padding: 1vw;"
        v-show="barId == 'newpublish'"
      >
        <div v-for="item in newpublish" :key="item.id">
          <product-unit
            :product-item="item"
            :product-type="7"
            :qzone="insq"
            :showimgTop = "1"
          ></product-unit>
        </div>
        <p class="no-more">已经到底啦~~</p>
      </section>
      <section class="s-discount" v-if="barId == 'discount'">
        <shop-discount></shop-discount>
      </section>
      <section class="s-coupon" v-if="barId == 'coupon'">
        <!-- <CouponUnit v-for="c in coupons" :key="c.id" :cous="c" :couType="3" :show-period='true'></CouponUnit> -->
        <!-- <p class='no-more'>已经到底啦~~</p> -->
      </section>
    </div>
  </div>
</template>
<script>
import { APP } from "../../../common/util";
import { BusinessDetail, GetCoupon } from "../../../common/api/business";
import { FavorBusiness } from "../../../common/api/userFavor";
import NavBar from "@/comps/NavBar";
import ProductSearchList from "../../templates/ProductSearchListNew";
import ProductUnit from "../../templates/ProductUnit";
import CouponUnit from "../../templates/CouponUnit";
import ShopDiscount from "./ShopDiscount";
import Active from "../../Active";
import { mapGetters } from "vuex";

var fullScreen = false;
export default {
  components: {
    NavBar,
    ProductSearchList,
    ProductUnit,
    CouponUnit,
    ShopDiscount,
    "v-active": Active,
  },
  data() {
    return {
      dark: "#333",
      showimgTop: true,
      barId: "",
      bars: [],
      info: {},
      newpublish: [],
      coupons: [],
      couponsList: [],
      playing: false,
      couponCenter: false,
      show: false,
      heihgt: null,
    };
  },
  mounted() {
    let _ = this;
    _.$store.state.mall.isShopSearchPage = false;
    // this.$store.dispatch('resetOption', 3)
    _.$store.dispatch("setFilteType", 3);
    _.$store.dispatch("setShopFixedMenu", false);
    _.$store.dispatch("setShopTopNavi", false);
    // 这个id是给shopfilter用的s
    _.$store.state.product.shopRouteId = _.$route.params.id;
    if (_.$route.query.couponCenter) _.couponCenter = true;
    else _.couponCenter = false;
    _.getShop();
    this.getCoupon();
  },
  computed: {
    ...mapGetters({ insq: "insq", user: "userInfo" }),
  },
  methods: {
    getCouponList() {
      this.show = !this.show;
      // this.getCoupon()
    },
    getShop() {
      let _ = this;
      let businessid = _.$route.params.id;
      BusinessDetail({ businessid })
        .then((res) => {
          console.log("BusinessDetail res", res);
          if (res && res.info) {
            let info = res.info;
            switch (info.type) {
              case 1: // 官方店
                info.icoClass = "ico-sp-official";
                break;
              case 2: // 买手店
                info.icoClass = "ico-sp-buy";
                break;
              case 3: // 专营店
                info.icoClass = "ico-sp-store";
                break;
            }

            _.info = info;
            // info.isfavor = !info.isfavor
            _.initShare({
              type: res.share.type,
              info: {
                title: res.share.title || info.businessname,
                img: res.share.icon || info.logourl,
                desc: res.share.content || APP.shareData.shopDetail.desc,
              },
            });

            let bars = [];
            if (info.homecontenturl) bars.push({ title: "首页", id: "index" });
            bars.push({ title: "全部", id: "list" });
            if (res.newpublish && res.newpublish.length > 0) {
              bars.push({ title: "新品", id: "newpublish" });
              _.newpublish = res.newpublish;
            }
            if (res.isdiscount) bars.push({ title: "折扣", id: "discount" });
            // if (res.iscoupon) {
            //   bars.push({ title: '优惠券', id: 'coupon', Active: !!_.couponCenter })
            // }
            // if (res.coupons && res.coupons.length > 0) {
            //   bars.push({ title: '优惠券', id: 'coupon' })
            //   _.coupons = res.coupons
            // }
            _.bars = bars;
            _.barId = bars[0].id;
            _.$nextTick(() => {
              _.heihgt = _.$refs.ht.offsetHeight;
            });
          } else _.toast("店铺信息加载失败");
        })
        .catch((e) => {
          _.toast("数据加载失败：" + e.msg);
          console.error("BusinessDetail req error", e);
        });
    },
    favShop() {
      let _ = this;
      if (!_.user.token) {
        _.$router.push("/login");
        return;
      }
      let isfav = _.info.isfavor;
      let businessid = _.$route.params.id;
      FavorBusiness({ businessid })
        .then((res) => {
          _.toast(`${isfav ? "取消" : ""}收藏成功`);
          _.info.isfavor = !isfav;
          isfav ? _.info.favorcount-- : _.info.favorcount++;
        })
        .catch((e) => {
          _.toast(`${isfav ? "取消" : ""}收藏失败：` + e.msg);
          console.error("FavorBusiness error", e);
        });
    },
    goInfo() {
      // console.log('go info')
      let _ = this;
      window.localStorage.setItem("SHOP_INFO", JSON.stringify(_.info));
      _.$router.push("/shop/info/" + _.info.id);
    },
    getCoupon() {
      let _ = this;
      let businessid = _.$route.params.id;
      GetCoupon(businessid)
        .then((res) => {
          _.coupons = res.coupons || [];
          // let arr = res.coupons
          this.couponsList = _.coupons.slice(0, 2);
          if (!_.coupons.length) return;
        })
        .catch((e) => {
          _.toast("优惠券加载失败：" + e.msg);
          console.log("GetCoupon error", e);
        });
    },
    toggle(i, idx) {
      // console.log('toggle nav bar', i, idx)
      window.scrollTo(0, 0);
      let _ = this;
      _.barId = i.id;
      switch (i.id) {
        case "coupon":
          if (!(_.coupons && _.coupons.length > 0)) _.getCoupon();
          break;
      }
    },
    playVdo() {
      let _ = this;
      let video = window.document.getElementById("shopVideo");
      video.play();
      _.playing = true;

      const fullscreenchange = () => {
        fullScreen = !fullScreen;
        if (!fullScreen && video.paused) _.playing = false;
      };
      [
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "fullscreenchange",
        "MSFullscreenChange",
      ].forEach((i) => {
        video["on" + i] = fullscreenchange;
      });

      video.onpause = () => {
        // for (const k in video) {
        //   const i = video[k]
        //   console.log(k, i)
        // }
        if (!fullScreen) _.playing = false;
      };
    }
  }
};
</script>
<style scoped>
.s-index {
  /* background: #191919;
  padding: 3%; */
}
.nav-top {
  background: #333 !important;
}
.shop-detail {
  margin-top: 0 !important;
}
.base-one-circle {
  width: .5rem;
  /* height: 32.47px; */
  background: rgba(200, 175, 110, 0.15);
  border: 1.2px solid rgba(200, 175, 110, 0.6);
  border-right: none;
  border-top-left-radius: 0.4rem;
  border-bottom-left-radius: 0.4rem;
  position: relative;
  /* width: 20px;
  height: 32px;
  position: relative;
  background: radial-gradient(circle at 0px 16px, transparent 10px, rgba(200,175,110,.15) 0) top */
}
.base-one-circle::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #333;
  border: 1.2px solid rgba(200, 175, 110, 0.6);
  clip: rect(0px 10px 10px 5px);
  position: absolute;
  left: -6.15px;
  top: 8px;
  /* clip: rect(0px 100px 100px 50px) */
}
.coubgc {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 110;
  background: #3c3c3c;
  opacity: 0.5;
}
.coupon-title {
  color: #ffffff;
  /* width: 70px; */
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  line-height: 20px;
  margin: 1rem auto;
}
.s-newpublish {
  padding: 0;
  width: 94%;
  margin: 1rem auto 0 auto;
  /* border-radius: 1rem; */
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  padding: 1.7vw;
  /* justify-content: space-around; */
}
.s-newpublish > div {
  width: 47%;
  /* padding-left: 5px; */
  /* padding-right: 5px; */
  margin:.5rem 4px;
}
.car {
  display: flex;
  align-items: center;
}
.s-coupon {
  color: #fff;
}
.s-infos {
  position: relative;
  min-height: 35vw;
  display: flex;
  justify-content: space-between;
  padding: 2.67vw 5.3vw;
}
.s-infos-left .img {
  width: 32vw;
  height: 32vw;
  display: inline-block;
  border-radius: 50%;
  /* border: 4px solid #333c53; */
}
.s-right {
  width: 5.2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.s-infos-right {
  flex: 1;
  margin-left: 5.3vw;
  color: #ffffff;
  /* border: 1px solid red; */
}
.s-infos-right-title {
  /* width: 8%; */
  /* border: 1px solid red; */
  position: absolute;
  /* float: right; */
  color: #fff;
  font-size: 11px;
  top: 14.4vw;
  right: -21px;
}
.s-name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
}
.couponShow {
  width: 0;
  height: 0;
  position: fixed;
  overflow: hidden;
  bottom: 0;
}
.couponShowNext {
  transition: height ease-in 0.5s;
  padding: 2rem 1rem;
  width: 100%;
  overflow: auto;
  border-radius: 2rem 2rem 0 0;
  position: fixed;
  background: #282828;
  /* top: 20rem; */
  height: 58vh;
  z-index: 111;
}
.s-buy {
  background: linear-gradient(#879bb9, #46557d);
  text-align: center;
  border-radius: 0.2rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.5rem;
}
.s-fans {
  font-size: 0.65rem;
  width: 100%;
  margin-top: 1.4vw;
}
.s-img {
  margin-top: 0.6rem;
}
.s-like,.s-likes {
  font-size: 16px;
  margin-left: 0.2rem;
  /* color: #969696; */
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
}
.s-like {
  color: #969696;
}
.s-likes {
  color: #333;
}
.left {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.right,
.right1 {
  text-align: center;
  height: 2.2rem;
  width: 5.5rem;
  justify-content: center;
  line-height: 2.3rem;
  border-radius: 1.8rem;
  display: flex;
  align-items: center;
}
.right {
  background: linear-gradient(#f5e6aa, #876e37);
}
.right1 {
  background: #000000;
  color: #969696;
}
.s-cou-infos {
  display: flex;
  /* margin-right: 0.6rem; */
  /* width: 35vw */
}
/* .s-cou-infos:first-child {
  margin-right: 0.6rem;
}
.s-cou-infos:nth-child(2) {
  margin-left: .2rem;
} */
.s-cou-more {
  display: flex;
  /* font-size: .6rem; */
  align-items: center;
  margin-left: 0.4rem;
}
.s-cou-more p {
  font-size: 3vw;
  color: #969696;
}
.s-cou-more img {
  width: 20px;
  height: 20px;
}
.s-footer {
  display: flex;
  justify-content: space-between;
}
.s-coupons {
  width: 94vw;
  height: 4vh;
  /* border: 1px solid red; */
  display: flex;
  margin: 0.4rem auto 0.8rem auto;
  justify-content: space-around;
}
.s-coupon-right {
  border-right: 1.2px solid rgba(200, 175, 110, 0.6);
  border-top: 1.2px solid rgba(200, 175, 110, 0.6);
  border-bottom: 1.2px solid rgba(200, 175, 110, 0.6);
  width: 32vw;
  background: rgba(200, 175, 110, 0.15);
  display: flex;
  align-items: center;
  color: #c8af6e;
  border-top-right-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
  font-size: 0.7rem;
  padding: 0 .3rem 0 0;
  justify-content: space-around;
}
.s-coupon-right img {
  height: 3vh;
  /* margin: 0 0.15rem; */
}

.txt-over-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.descWrapper {
  width: 100%;
  font-size: 3.73vw;
  position: relative;
}

.descWrapper .all {
  font-size: 3.73vw;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #333;
}

.s-desc {
  margin: 0.6rem 0;
}

.s-infos > img {
  display: block;
}
.s-show {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.s-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 5px;
  color: #fff;
}
.s-info-l {
  max-width: 72%;
  padding-left: 20px;
}
.s-info-l > img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}
.s-info-l .ellipsis {
  max-width: 170px;
  font-weight: 600;
}
.s-info-r {
  width: 70px;
  text-align: center;
  font-size: 12px;
}
.s-info-r > div {
  background-color: rgba(255, 199, 0, 0.8);
  border-radius: 12px 0 0 0;
  line-height: 22px;
}
.s-info-r > p {
  background-color: rgba(51, 51, 51, 0.8);
  line-height: 16px;
  font-size: 13px;
}
.s-info-r > p span {
  font-size: 10px;
}

.s-vdo {
  width: 45px;
  height: 45px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -23px 0 0 -23px;
}
.s-vdo video {
  width: 0;
  height: 0;
  visibility: hidden;
}
.s-vdo video.play {
  z-index: 999;
  visibility: visible;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-color: #000;
}
.s-vdo .ico-vdo-play {
  position: absolute;
  top: 0;
}
</style>
