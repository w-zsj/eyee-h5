<template>
  <div class="big-content">
    <!-- 精选好物 -->
    <div class="recd">
      <!-- <div class="tabs" v-if="productParams.themetype === 0 || productParams.themetype === 2">
            <swiper :options="TabsOpt" v-if="categorylist&&categorylist.length>0">
                <swiper-slide v-for="(item,index) in categorylist" :key="'tab'+index">
                  <div @click="Tabstrigger(item,index)" class="flex-center">
                      <span class="txt " :class="{'act':actIdx==index}">{{item.name}}</span>
                  </div>
                </swiper-slide>
            </swiper>
      </div>-->
      <div class="racd-product">
        <v-list
          :load-handle="()=>{}"
          :more-handle="searchloadmore"
          :more-handling="loading"
          :isend="isend"
          v-if="RecommendProductList&&RecommendProductList.length>0"
        >
          <div class="plist-dbl flex-wrap rcd-list" :style="lgBg">
            <product-cell
              v-for="(item, idx) in RecommendProductList"
              :key="'list'+idx"
              :cell-data="item"
              col="triple"
              txt-color="#333"
              bg-color="#fff"
              :pcinfoBg="true"
              :category="productParams.category"
              :category-name="categoryName"
              :name-line="2"
              bor-color="2px solid #D03F47"
              class="itemlist"
            >
              <template slot="price">
                <div class="font-price item-price flex-between" @click.stop="openItems(item)">
                  <div class="flex-aic">
                    <span class="price-type">抢购价:</span>
                    <span class="pro-pri">￥{{item.price}}</span>
                  </div>
                  <div class="cart flex-center">
                    <img src="https://files.eyee.com/eyeeh5/img/cart-icon.png" alt>
                  </div>
                </div>
              </template>
            </product-cell>
          </div>
        </v-list>
      </div>
    </div>
    <v-delay
      delay="300"
      class="foot flex-center"
      :style="'background:'+typeColor"
      v-if="RecommendProductList&&RecommendProductList.length>0"
    >
      <img v-lazy="'https://files.eyee.com/activity/2019618/foot.png'" alt>
    </v-delay>

    <!-- 购物车组件 -->
    <product-items :show="showItems" :product-info="currProduct" @close="itemsClose"></product-items>
    <!-- 登录组件 -->
    <!-- <com-login-util :isShow="loginModel" :IsmainOrsub="false" @close="loginModel=false"></com-login-util> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ProductCell from "@/comps/ProductCell";
import ProductItems from "@/comps/ProductItems";
// import comLoginUtil from "@/comps/comLoginUtil";
import { Add as CartAdd } from "@/common/api/cart";
import {
  BigCategorymessage,
  BigPlatProductlist
} from "../../../utils/api/activities";
export default {
  components: { ProductCell, ProductItems }, // , comLoginUtil
  data() {
    return {
      TabsOpt: {
        roundLengths: true,
        scrollbarHide: true,
        slidesPerView: 5
      },
      actIdx: 0,
      loading: false,
      isend: false,
      categoryName: "",
      pageindex: 1,
      categorylist: [],
      activitytype: 10,
      productParams: {
        activitytype: 10,
        themetype: 0, //会场类型
        // category: null, //商品分类
        page: 1,
        size: 21
      },
      RecommendProductList: [],
      showItems: false
      // loginModel: false
    };
  },
  mounted() {
    let _ = this;
    _.productParams.themetype = _.queryThemeType;
    _.camessage();
    setTimeout(function() {
      _.getRecommend();
    }, 200);

    window._loginCallBack = json => {
      var result;
      if (json) result = JSON.parse(decodeURIComponent(json));
      _.$store.dispatch("setUserInfo", result);
      window.location.reload();
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    queryThemeType() {
      let { $route } = this;
      return +($route.query.themetype || $route.params.themetype || 0);
    },
    typeColor() {
      let color = "";
      switch (this.queryThemeType) {
        case 0:
          color = "fc0039";
          break;
        case 1:
          color = "285c8f";
          break;
        case 2:
          color = "d82842";
          break;
        case 3:
          color = "deb027";
          break;
      }
      return "#" + color;
    },
    lgBg() {
      if (this.queryThemeType != 0)
        return `background:linear-gradient(0deg, #fff, ${
          this.typeColor
        }) no-repeat;background-size:100vw 47.2vw;`;
    }
  },
  methods: {
    camessage() {
      let _ = this,
        activitytype = _.activitytype,
        themetype = _.productParams.themetype;
      BigCategorymessage({ themetype, activitytype })
        .then(res => {
          // if (res.category && res.category.length > 0) {
          //   _.categorylist = res.category;
          //   if (
          //     _.productParams.themetype === 0 ||
          //     _.productParams.themetype === 2
          //   ) {
          //     _.productParams.category = _.categorylist[0].id;
          //   } else {
          //     _.productParams.category = null;
          //   }
          // }

          if (res.banner || res.title) {
            _.$emit("banner", {
              banner: res.banner || "",
              title: res.title || ""
            });
          }
          if (res.title)
            _.setToolBar({
              title: res.title,
              bgcolor: _.typeColor,
              textcolor: "#fcf7ea",
              showshoppingcarticon: true
            });
          if (res.share) {
            let info = res.share;
            if (_.$root.ISAPP) {
              _.javascriptBridge({
                name: "getAppActivityShareContent",
                params: {
                  sharetitle: info.title,
                  sharecontent: info.content,
                  sharepicurl: info.icon,
                  shareurl: info.url,
                  hideshareicon: false
                }
              });
            } else {
              _.initShare({
                type: 2,
                info: {
                  title: info.title,
                  url: info.url,
                  img: info.icon,
                  desc: info.content
                }
              });
            }
          }
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    reset() {
      let _ = this;
      _.loading = false;
      _.isend = false;
      _.pageindex = 1;
      _.RecommendProductList = [];
    },
    Tabstrigger(item, index) {
      let _ = this;
      this.actIdx = index;
      _.productParams.category = item.id;
      _.categoryName = item.name;
      if (!_.$root.isdebug)
        window.gio("track", "H5PlatCateClick", { channelTitle: item.name });
      _.reset();
      _.getRecommend();
    },
    getRecommend() {
      let _ = this,
        productParams = _.productParams;
      productParams.page = _.pageindex;
      _.loading = true;

      BigPlatProductlist({ ...productParams })
        .then(res => {
          console.log("RecommendProductList", res.list);
          if (res && res.list && res.list.length) {
            if (_.pageindex === 1) {
              _.RecommendProductList = res.list;
            } else {
              _.RecommendProductList = _.RecommendProductList.concat(res.list);
            }
            if (_.RecommendProductList.length > 0) {
              _.RecommendProductList = _.RecommendProductList.map(i => {
                i.imgUrl = i.pic;
                i.id = i.productid;
                i.delprice = 0;
                i.price = i.nowprice;
                return i;
              });
              _.isend =
                res.page * res.size >= res.total &&
                _.RecommendProductList.length > 0;
            } else {
              _.isend = true;
            }
            _.loading = false;
          }
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    searchloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.pageindex++;
        _.getRecommend();
      }
    },
    itemsClose(item) {
      let _ = this;
      if (item)
        CartAdd(item)
          .then(res => {
            console.log("✔购物车添加成功", res);
            _.toast("已成功添加到您的购物车!");
          })
          .catch(e => {
            console.error("✖购物车添加失败", e);
            _.toast("购物车添加失败");
          });

      _.showItems = false;
    },
    openItems(pi) {
      // console.log("openItems--->", pi);
      let _ = this;
      if (_.user.token) {
        _.currProduct = {
          id: pi.id,
          productid: pi.id,
          mainpic: pi.imgUrl,
          name: pi.name,
          salprice: pi.price,
          specialprice: 0
        };
        _.showItems = true;
      } else {
        if (_.$root.ISAPP)
          _.javascriptBridge({
            name: "callAppLoginPage",
            params: { callbackname: "_loginCallBack" }
          });
        else _.$router.push("/login");
      }
      // else _.loginModel = true;
    }
  }
};
</script>
<style lang="scss" scoped>
img {
  display: block;
  width: 100%;
}
.tabs {
  color: #131313;
  font-size: 16px;
  font-weight: bold;
  padding: 4.66vw 0;
  position: sticky;
  top: -2px;
  background: #fff;
  z-index: 5;
  border: 0;
  .txt {
    padding-bottom: 2px;
    border-bottom: 2px solid #fff;
    &.act {
      border-bottom: 2px solid #3b00fa;
    }
  }
}
/* 组件样式调整 */

.item-price {
  background: #d03f47;
  height: 8vw;
  padding: 0 3px;
}
.item-price .price-type {
  font-size: 12px;
  color: #fbf9ea;
}
.item-price .pro-pri {
  font-size: 12px;
  font-weight: bold;
  font-family: PINGFANG;
  color: #fbf9ea;
}
.font-price .cart {
  width: 5.2vw;
  height: 5.2vw;
  // background: #412696;
  border-radius: 50%;
}
</style>
<style lang="scss">
.recd {
  .racd-product {
    min-height: 160px;
  }
  .pc-show {
    border-bottom: 0 !important;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
  }
  /deep/ .pc-img {
    min-height: 90px;
    background: #f2f2f2;
  }
  .rcd-list {
    align-items: center;

    .itemlist {
      border-radius: 6px;
    }
  }
  .pc-info {
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    overflow: hidden;

    .pc-name {
      line-height: 16px;
      margin-bottom: 4px;
      padding: 0 5px !important;
    }
    .pc-brand {
      line-height: 16px;
      margin-bottom: 4px;
      padding: 0 5px !important;
      font-size: 13px;
    }
    .item-price {
      padding: 0 5px;
    }
  }
}

.foot {
  width: 100%;
  height: 22.4vw;

  img {
    width: 33.867vw;
  }
}
</style>



