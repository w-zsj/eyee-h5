<template>
    <div class="">
        <div class="big-content">
            <!-- 推荐商品 -->
            <div class="recd">
                <div class="tabs">
                    <swiper :options="TabsOpt" v-if="categorylist&&categorylist.length>0">
                        <swiper-slide v-for="(item,index) in categorylist" :key="'tab'+index">
                        <div @click="Tabstrigger(item,index)" class="flex-center">
                           <span class="txt " :class="{'act':actIdx==index}">{{item.name}}</span>
                        </div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="racd-product">
                      <v-list
                        :load-handle="()=>{}"
                        :more-handle="searchloadmore"
                        :more-handling="loading"
                        :isend="isend"
                        v-if="RecommendProductList.length>0"
                        >
                        <div class="plist-dbl flex-wrap rcd-list">
                            <product-cell
                                v-for="(item, idx) in RecommendProductList"
                                :key="'list'+idx"
                                :cell-data="item"
                                col='triple'
                                txt-color="#333"
                                bg-color="#fff"
                                :pcinfoBg='true'
                                :category ="productParams.category"
                                :category-name="categoryName"
                                bor-color="1px solid #94F40A"
                                class="itemlist">
                                <template slot="price">
                                    <div class="font-price item-price flex-between" @click.stop="openItems(item)">
                                        <div class="flex-aic">
                                            <span class="price-type">抢购价:</span>
                                            <span class="pro-pri">￥{{item.price}}</span>
                                        </div>
                                        <div class="cart flex-center">
                                            <img src="https://files.eyee.com/eyeeh5/img/ico-cart.png" alt="">
                                        </div>
                                    </div>
                                </template>
                            </product-cell>
                        </div>
                    </v-list>
                </div>
            </div>
            <div class="footer">
                <img src="https://files.eyee.com/eyeeh5/img/footer.png" alt="">
            </div>
           <!-- 购物车组件 -->
        <product-items :show="showItems"  :product-info="currProduct"  @close="itemsClose" >
        </product-items>
        <!-- 登录组件 -->
        <com-login-util :isShow="loginModel" :IsmainOrsub="false" @close="loginModel=false"></com-login-util>
         <!-- 悬浮按钮 -->
        <div class="modelBg" :class="{'act':isnavigShow}"  @click.stop="navigation"></div>
        <div class="suspend-btn" :class="{'act':isnavigShow}">
            <div class="content" :class="{'act':isnavigShow}">
                    <div>
                        <div class="room-list flex-center" 
                            v-for="(item,inx) in themelist" :key="inx" 
                            :class="{'act':actNavi==inx}" @click.stop="goto(item,inx)"> 
                            {{item.themename}}
                        </div>
                    </div>
                    <div class="icon" @click.stop="navigation" :class="{'act':isnavigShow}">
                    <img :src="`https://files.eyee.com/eyeeh5/img/show-icon${isnavigShow?`-act`:``}.png`" alt="">
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  BigCategorymessage,
  BigPlatProductlist
} from "../../../utils/api/activities";
import ProductCell from "@/comps/ProductCell";
import ProductItems from "@/comps/ProductItems";
import comLoginUtil from "@/comps/comLogin";
import { Add as CartAdd } from "@/common/api/cart";
import { stringify } from "querystring";
export default {
  components: { ProductCell, ProductItems, comLoginUtil },
  data() {
    return {
      categorylist: [],
      actIdx: 0,
      TabsOpt: {
        roundLengths: true,
        scrollbarHide: true,
        // spaceBetween: 10,
        slidesPerView: 5.5
      },

      showItems: false,
      currProduct: {},
      loginModel: false,

      themelist: [],
      isnavigShow: false,
      actNavi: 0,

      productParams: {
        themetype: 0, //会场类型
        category: null, //商品分类
        page: 1,
        size: 21
      },
      categoryName:'',
      loading: false,
      isend: false,
      pageindex: 1,
      RecommendProductList: [],
    };
  },
  props: {
    themetype: { type: Number, default: 0 }
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    themty() {
      let _ = this,
        t = Number(_.$route.query.themetype) || _.themetype;
      return t;
    }
  },
  mounted() {
    let _ = this;
    _.productParams.themetype = _.themty;
    _.camessage();
  },
  watch: {
    isnavigShow: function(n, o) {
      if (n) document.body.classList.add("lock");
      else document.body.classList.remove("lock");
    }
  },
  methods: {
    goto(item, index) {
      let _ = this;
      // if (_.actNavi == index) return;
      _.actNavi = index;
      _.isnavigShow = !_.isnavigShow;
      document.body.classList.remove("lock");
      if (item.themetype == 0) {
        _.$router.replace(`/platform/activity?themetype=0`);
      } else if (item.themetype == 4) {
        _.$router.push(`/active/21422fca8b2b48029cffaecbfde63d67`);
      } else {
        _.$router.replace(`/platform/subplace?themetype=${item.themetype}`);
        _.productParams.themetype = item.themetype;
        _.camessage();
      }
    },
    navigation() {
      let _ = this;
      _.isnavigShow = !_.isnavigShow;
    },
    Tabstrigger(item, index) {
      let _ = this;
      _.actIdx = index;
      _.productParams.category = item.id;
      _.categoryName = item.name
      if(!_.$root.isdebug)  window.gio("track", "H5PlatCateClick",{'channelTitle':item.name});
      _.$nextTick(() => {
        setTimeout(() => {
          _.getStickyTop();
        }, 200);
      });

      _.reset();
      _.getRecommend();
    },
    camessage() {
      let _ = this,
        categorylist = _.categorylist,
        themetype = Number(_.themty);
      BigCategorymessage({ themetype })
        .then(res => {
          if (res) {
            if (res.category && res.category.length > 0) {
              _.categorylist = res.category;
              // console.log("_.categorylist", _.categorylist[0].id);
              if (_.categorylist && _.categorylist[0]) {
                _.productParams.category = _.categorylist[0].id;
                _.categoryName = _.categorylist[0].name
                _.reset();
                _.getRecommend();
              }
            }
            if (res.themelist && res.themelist.length > 0) {
              _.themelist = res.themelist;
              _.actNavi = _.themelist.findIndex(i => i.themetype == _.themty);
            }

            if (res.banner) {
              _.$emit("banner", res.banner);
            }
            if (res.title) _.setToolBar({ title: res.title });
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
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    getRecommend() {
      let _ = this,
        productParams = _.productParams;
      productParams.page = _.pageindex;
      _.loading = true;
      BigPlatProductlist({ ...productParams })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (_.pageindex === 1) _.RecommendProductList = res.list;
            else
              _.RecommendProductList = _.RecommendProductList.concat(res.list);
            if (_.RecommendProductList.length > 0) {
              _.RecommendProductList = _.RecommendProductList.map(i => {
                i.imgUrl = i.pic;
                i.id = i.productid;
                i.delprice = 0;
                i.price = i.nowprice;
                return i;
              });
            }
            _.isend =
              res.page * res.size >= res.total &&
              _.RecommendProductList.length > 0;
          } else _.isend = true;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
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
      // console.log("itemsClose: ", item);
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
      } else _.loginModel = true;
    },
    reset() {
      let _ = this;
      _.loading = false;
      _.isend = false;
      _.pageindex = 1;
      _.RecommendProductList = [];
    },
    getStickyTop() {
      let _ = this;
      let $tab = document.querySelector(".tabs");
      let top = $tab.getBoundingClientRect().y;
      if (top < 280) {
        window.scrollTo(0, 0);
        top = $tab.getBoundingClientRect().y;
        window.scrollTo(0, top);
      }
      _.tabTop = top;
    }
  }
};
</script>
<style scoped>
img {
  display: block;
  width: 100%;
}
.modelBg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  pointer-events: none;
  background: transparent;
  transition: background 0.3s ease-in;
}
.modelBg.act {
  pointer-events: unset;
  background: rgba(0, 0, 0, 0.5);
}
.suspend-btn {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translate(31vw, -50%);
  background: #131313;
  padding: 4.8vw 2.133vw 4.8vw 2.93vw;
  border: 3px solid #00ffde;
  transition: transform 0.2s ease-in;
  z-index: 10;
}

.suspend-btn.act {
  transform: translate(0, -50%);
}
.suspend-btn .content .room-list {
  width: 24.4vw;
  height: 8vw;
  color: #b6b6b6;
  font-size: 15px;
  font-family: PINGFANG;
  background: url("https://files.eyee.com/eyeeh5/img/defau-bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
}
.suspend-btn .content .room-list.act {
  background: url("https://files.eyee.com/eyeeh5/img/select-bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
.suspend-btn .content .room-list:last-child {
  margin-bottom: 0;
}
.suspend-btn .icon {
  position: absolute;
  right: 31vw;
  top: 50%;
  width: 6.7vw;
  transform: translateY(-50%);
  z-index: 10;
}
.recd .tabs {
  color: #131313;
  font-size: 14px;
  font-weight: 500;
  padding: 4.66vw 0;
  font-family: PINGFANG;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  border: 0;
}
.recd .tabs .txt {
  padding-bottom: 2px;
  border-bottom: 2px solid #fff;
}
.recd .tabs .txt.act {
  border-bottom: 2px solid #95f40a;
}

/* 组件样式调整 */
.item-price {
  background: linear-gradient(to bottom, #cbf40a, #94f40a); /* 标准的语法 */
  height: 8vw;
  padding: 0 3px;
}
.item-price .price-type {
  font-size: 12px;
  color: #131313;
}
.item-price .pro-pri {
  font-size: 12px;
  font-weight: bold;
  font-family: PINGFANG;
  color: #131313;
}
.font-price .cart {
  width: 5.2vw;
  height: 5.2vw;
}
</style>


