<template>
  <div class="recommend-container">
    <v-headerscopy v-if="!$root.ISAPP && !$root.ISMP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">新品推荐</h3>
      </div>
    </v-headerscopy>
    <div class="banner-container">
      <img :src="banner" width="100%" height="auto" alt="最新潮流单品推荐" />
    </div>
    <div v-if="isNew" class="red-packet">
      <span class="get-btn" @click="getRedpacket">立即领取</span>
      <img :src="newRedpacket" width="100%" height="auto" alt="新人见面礼" />
    </div>
    <div id="searchBar">
      <div
        :class="searchBarFixed ? 'isFixed' : ''"
        class="recommend-tab-container"
      >
        <div id="recommend-tab" class="recommend-tab flex">
          <div
            :id="'tab-' + index"
            class="tab-item"
            v-if="item.isShowTab"
            v-for="(item, index) in tabList"
            :key="index"
            @click="tabChange(item, '#anchor-' + index)"
          >
            <div
              class="tab-info"
              :class="{ selected: currTab === item.categoryid }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div :class="searchBarFixed ? 'recommend-top' : ''">
        <div
          :id="'anchor-' + index"
          v-for="(item, index) in tabList"
          :key="index"
          v-if="item.isShowTab"
        >
          <img
            class="tab-main-pic"
            v-lazy="https(item.imgurl)"
            alt=""
            @load="imgLoad"
          />
          <div class="sku-list flex-btwn flex-wrap">
            <div
              class="sku-item"
              v-for="(pro, idx) in item.list"
              :key="idx"
              @click="goAppDetail(pro.id)"
            >
              <img
                class="main-img"
                @load="imgLoad"
                v-lazy="https(pro.mainpic)"
                alt=""
              />
              <div class="sku-info">
                <div style="-webkit-box-orient: vertical" class="name">
                  {{ pro.name }}
                </div>
                <div class="flex-between">
                  <div class="price">
                    <span class="rmb">¥</span>{{ pro.saleprice }}
                  </div>
                  <div class="member">{{ pro.sumcount }}人付款</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.list.length && item.ifMore"
            class="sku-more flex-center"
            @click="getProductListMore(item)"
          >
            查看更多<span class="icon-more"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from "@/utils/util";
import { searchPro } from "@/utils/api/search";
import { NewRecommendTab, isReceive, couponPackage } from "@/common/api/active";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      currTab: "",
      isNew: false,
      newRedpacket: "/static/imgs/new_recommend/new_redpacket.png",
      banner: "https://files.eyee.com//h5/new/banner.png",
      tabList: [],
      searchBarFixed: false,
      shareinfo: {},
    };
  },
  mounted() {
    this.setToolBar({
      title: "新品推荐",
      bgcolor: "#f5f5f5",
      textcolor: "#323232",
    });
    this.init();
    const _ = this;
    window.callbacklogin = (json) => {
      if (json) {
        _.toast("登录成功~");
        _.getQueryParamUser(json);
      } else _.toast("获取登录信息失败~");
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    loged() {
      return !!(this.userInfo && this.userInfo.uid);
    },
  },
  methods: {
    init() {
      let _ = this;
      console.log("3333");
      if (_.$root.loging) {
        _.$root.loging
          .then(($) => {
            _.initApi();
          })
          .catch((e) => {
            _.initApi();
            console.error("query prams auto login error:", e);
          });
      } else {
        _.initApi();
      }
    },
    initApi() {
      let _ = this;
      _.apiGetCategoryList();
      _.isReceiveFun();
    },
    // 是否领取新人大礼包
    isReceiveFun() {
      const _ = this;
      isReceive()
        .then((res) => {
          _.isNew = !res.isreceive;
          console.log("是否领取新人大礼包结果 ===>", res);
        })
        .catch((err) => {
          console.error("是否领取新人大礼包 ===>", err);
        });
    },
    apiGetCategoryList() {
      let _ = this;
      let { toast } = _;
      NewRecommendTab()
        .then((res) => {
          _.tabList = res;
          _.currTab = res[0].categoryid;
          window.addEventListener("scroll", this.handleScroll);
          _.tabList.forEach((item) => {
            item.page = 1;
            item.pagesize = 20;
            _.$set(item, "list", []);
            _.$set(item, "ifMore", false);
            _.$set(item, "isShowTab", true);
            _.apiGetSignProductList(item);
          });
          _.$nextTick(() => {
            _.tabList.forEach((item, index) => {
              if (document.querySelector("#tab-" + index)) {
                item.offsetLeft = document.querySelector(
                  "#tab-" + index
                ).offsetLeft;
              }
            });
          });

          let domain = _.$root.isdebug
            ? "http://qzone.eyee.com/"
            : "http://m.eyee.com/";
          _.shareInfo = {
            title: "斗牛DoNew-新品榜",
            content: "最新潮流单品推荐",
            img: "https://files.eyee.com//h5/new/banner.png",
            url: `${domain}/activity/newrecommend`,
          };

          if (_.$root.ISAPP) {
            console.log("enter app -->", _.shareInfo);
            _.javascriptBridge({
              name: "getAppActivityShareContent",
              params: {
                sharecontent: _.shareInfo.content,
                sharetitle: _.shareInfo.title,
                shareurl: _.shareInfo.url,
                sharepicurl: _.shareInfo.img,
                hideshareicon: false,
              },
            });
          } else if (_.$root.ISMP) {
            let data = {
              sharetitle: _.shareInfo.title,
              sharecontent: _.shareinfo.content,
              xcxurl: `/pages/home/web?url=${encodeURIComponent(
                _.shareInfo.url
              )}`,
              xcxicon: _.shareInfo.img,
            };
            wx.miniProgram.postMessage({ data: { share: data } });
          } else {
            _.initShare({
              info: {
                title: _.shareinfo.title,
                desc: _.shareinfo.content,
              },
            });
          }
        })
        .catch((err) => {
          toast(err.msg, "error");
        });
    },
    getProductListMore(item) {
      item.page++;
      this.apiGetSignProductList(item);
    },
    apiGetSignProductList(item) {
      let _ = this;
      let { toast } = _;
      const params = {
        page: item.page,
        pagesize: item.pagesize,
        beginprice: 9,
        sorttype: 3,
        categoryid: item.categoryid,
        isc2c: 1,
      };
      searchPro(params)
        .then((res) => {
          item.list = item.list.concat(res.list);
          item.ifMore = res.pageindex * res.pagesize < res.sumcount;
          item.isShowTab = !!item.list.length;
        })
        .catch((err) => {
          toast(err.msg, "error");
        });
    },
    tabChange(item, selector) {
      if (this.currTab === item.categoryid) {
        return;
      }
      let anchor = this.$el.querySelector(selector);
      const total = anchor.offsetTop - 44;
      document.body.scrollTop = total;
      document.documentElement.scrollTop = total;
      this.currTab = item.categoryid;
    },
    handleScroll() {
      this.$nextTick(() => {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        this.searchBarFixed = scrollTop > this.offsetTop;
        if (
          this.tabList.length &&
          this.tabList[0].offsetTop &&
          scrollTop > this.tabList[0].offsetTop
        ) {
          const minTopList = this.tabList.filter(
            (item) => item.offsetTop <= scrollTop + 44
          );
          const minTop = minTopList[minTopList.length - 1];
          this.currTab = minTop.categoryid;
          const clientWidth = document.body.clientWidth;
          if (minTop.offsetLeft > clientWidth) {
            document.getElementById("recommend-tab").scrollLeft =
              minTop.offsetLeft - clientWidth;
          } else {
            document.getElementById("recommend-tab").scrollLeft = 0;
          }
        }
      });
    },
    imgLoad: debounce(function () {
      this.$nextTick(() => {
        if (document.querySelector("#searchBar")) {
          this.offsetTop = document.querySelector("#searchBar").offsetTop;
        }
        this.tabList.forEach((item, index) => {
          if (document.querySelector("#anchor-" + index)) {
            item.offsetTop = document.querySelector(
              "#anchor-" + index
            ).offsetTop;
          }
        });
      });
    }, 50),
    goAppDetail(id) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid: id },
        });
      } else if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/sneaker/detail?id=" + id,
        });
      } else {
        _.$router.push("/sneaker/detail/" + id);
      }
    },
    // 领取新人大礼包
    getRedpacket() {
      const _ = this;
      console.log("是否登录", _.loged);
      if (!_.loged) {
        if (_.$root.ISAPP) {
          // IOS
          _.GoAppLogin();
        } else if (_.$root.ISMP) {
          // 小程序
          wx.miniProgram.navigateTo({
            url: "/pages/home/bind",
          });
        } else {
          // h5
          this.$router.push("/login");
        }
        return;
      }
      couponPackage()
        .then((res) => {
          _.toast("领取成功");
          _.isNew = false;
        })
        .catch((err) => {
          _.toast(err.msg);
          console.error("领取新人大礼包", err);
        });
    },
    // app 登录
    GoAppLogin() {
      let _ = this;
      let callAppLoginPageParams = {
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" },
      };
      _.javascriptBridge(callAppLoginPageParams);
    },
  },
};
</script>
<style lang="scss" scoped>
.recommend-container {
  background-color: #4b84a6;
  img {
    display: block;
  }
}
.isFixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.red-packet {
  position: relative;

  .get-btn {
    display: flex;
    position: absolute;
    right: 4%;
    bottom: 8%;
    left: 4%;
    height: 16%;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }
}
.recommend-tab-container {
  overflow: hidden;
  height: 11.7333vw;
  padding-left: 2.1333vw;
  background: #195a73;
}
.recommend-tab {
  height: 14.4vw;
  overflow-x: scroll;
  .tab-item {
    flex-shrink: 0;
    color: #fff;
    font-size: 4.2666vw;
  }
  .tab-info {
    padding: 2.9333vw 5.3333vw 2.9333vw 0;
    opacity: 0.5;
  }
  .selected {
    font-weight: 600;
    opacity: 1;
  }
}
.tab-main-pic {
  width: 100%;
  display: block;
}
.sku-list {
  padding: 3.7333vw 2.6666vw 1.6vw;
}
.sku-more {
  font-size: 4.2666vw;
  font-weight: 600;
  color: #000;
  padding-bottom: 3.7333vw;
  .icon-more {
    width: 2.6vw;
    height: 2.6vw;
    border-top: 2px solid #000;
    border-right: 2px solid #000;
    transform: rotate(45deg);
  }
}
.sku-item {
  width: 46.4vw;
  position: relative;
  background: #fff;
  margin-bottom: 2.1333vw;
  .main-img {
    width: 46.4vw;
    height: 46.4vw;
    display: block;
  }
  .sku-info {
    padding: 1.6vw 2.6666vw 2.6666vw;
    .name {
      color: #232323;
      font-size: 3.4666vw;
      height: 9.6vw;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 1.6vw;
    }
    .rmb {
      font-size: 3.2vw;
      margin-right: 1px;
    }
    .price {
      font-size: 4vw;
      font-weight: bold;
      color: #000;
      font-family: "OswaldBold";
    }
    .member {
      font-size: 3.4666vw;
      color: #969696;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 46.4vw;
    height: 46.4vw;
    background: rgba(0, 0, 0, 0.05);
    z-index: 1;
  }
}
</style>
