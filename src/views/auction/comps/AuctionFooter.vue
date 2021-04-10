<template>
  <div class="auc-footer">
    <div class="footer-col" v-for="(item,index) in icon" :key="'footer'+index" @click.stop="pageto(index)">
      <img :src=" curselect==index?item.acticon:item.icon" alt />
      <span :class="{'act':curselect==index}">{{item.txt}}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GetIsauctions, Cooperativeseller } from "@/utils/api/auction";
export default {
  data() {
    return {
      icon: [
        {
          icon: "//files.eyee.com/mcdn/img/auction/icon_unselected_1.png",
          acticon: "//files.eyee.com/mcdn/img/auction/icon_selected_1.png",
          txt: "拍卖主页"
        },
        {
          icon: "//files.eyee.com/mcdn/img/auction/icon_unselected_2.png",
          acticon: "//files.eyee.com/mcdn/img/auction/icon_selected_2.png",
          txt: "立即发布"
        },
        {
          icon: "//files.eyee.com/mcdn/img/auction/icon_unselected_3.png",
          acticon: "//files.eyee.com/mcdn/img/auction/icon_selected_3.png",
          txt: "我的拍卖"
        }
      ],
      auctionid: "", //活动id
      isshowsellbtn: false, // 活动是否存在
      iscooperativeseller: 0 // 是否合作卖家 0-否 1-是"
    };
  },
  props: {
    curselect: {
      type: Number,
      default: 0
    }
  },
  // watch: {
  //   loged: function(newval, oldval) {
  //     let _ = this;
  //     if (newval) _.iscopsell();
  //   }
  // },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    loged() {
      return !!(this.user && this.user.uid);
    }
  },
  mounted() {
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          // this.iscopsell();
        });
      } else _.toast("登录失败~");
    };
    this.GetIsIcon();
  },
  methods: {
    pageto(index) {
      let _ = this;
      if (!_.isshowsellbtn) {
        _.toast("暂无拍卖活动");
        return;
      }
      _.checkLogin(() => {
        if (index == 0) {
          // if (_.$root.ISAPP) {
          //   _.$router.push(`/auction/${this.auctionid}`);
          // } else if (ENV.ua.mini) {
          //   wx.miniProgram.navigateTo({
          //     url: `/pages/auction/home?auctionid=${this.auctionid}`
          //   });
          // }
          _.$router.push(`/auction/${this.auctionid}`);
        } else if (index == 1) {
          // console.log(_.iscooperativeseller, "是否是合作卖家");
          // && !_.iscooperativeseller
          if (_.isshowsellbtn) {
            if (ENV.ua.mini) {
              // $log({
              //   e: "click_ag_pub_btn"
              // });
              if (_.$route.query.param) {
                let pa = JSON.parse(decodeURIComponent(_.$route.query.param));
                if (pa.token)
                  wx.miniProgram.navigateTo({
                    url: "/pages/auction/publish/prodlist"
                  });
                else
                  wx.miniProgram.navigateTo({
                    url: "/pages/home/bind"
                  });
              } else {
                wx.miniProgram.navigateTo({
                  url: "/pages/auction/publish/prodlist"
                });
              }
            } else {
              this.javascriptBridge({
                name: "gotoAppSearchAuctionProductPage",
                params: {}
              });
            }
          }
        } else {
          _.$router.push(`/auction/joined`);
        }
      });
    },
    checkLogin(call) {
      let _ = this;
      if (_.loged) call();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    },
    GetIsIcon() {
      GetIsauctions()
        .then(res => {
          this.isshowsellbtn = res.isauction || 0;
          this.auctionid = res.auctionid;
          // if (this.loged) this.iscopsell();
        })
        .catch(e => {
          console.error("IsSshowBtn Error", e);
          this.isshowsellbtn = 0;
        });
    },
    iscopsell() {
      let _ = this;
      Cooperativeseller()
        .then(res => {
          _.iscooperativeseller = res.iscooperativeseller || 0;
        })
        .catch(e => {
          console.error("判断是否是合作卖家 ERROR", e);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.auc-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #969696;
  font-size: 2.667vw;
  font-weight: 600;
  .footer-col {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  img {
    width: 6.933vw;
    height: 6.933vw;
    display: block;
    margin-bottom: 0.8vw;
  }
  span {
    transform: scale(0.9166);
    &.act {
      color: #C8AF6E;
      font-weight: bold;
    }
  }
}
</style>
