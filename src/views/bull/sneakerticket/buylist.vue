<template>
  <div class="box">
    <div class="buyListBox" v-if="hasdata == 1">
      <div class="tabs">
        <swiper :options="tab" ref="tabSwiper" class="list">
          <swiper-slide v-for="(item,ind) in weeks" :key="ind" class="flex-center">
            <div
              class="item"
              :class="{'active':ind==currentIndex}"
              @click="changeTab(ind)"
            >{{item.title}}
              <span class="line"></span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="swiper">
        <swiper :options="hb" ref="hbSwiper" class="swiperBox">
          <swiper-slide v-for="(item,index) in weeks" :key="index">
            <div class="swiperItem" v-if="currentIndex == 0">
              <div class="buyListEnd" v-if="history && history.length > 0">
                <div class="head">已结束</div>
                <v-cutlist class="history_list" :more-handle="loadmore" :more-handling="isLoading" :isend="isEnd">
                  <div class="endItem" v-for="(endItem,endIndex) in history" :key="endIndex" @click="go(endItem)">
                    <div class="itemLeft">
                      <img :src="endItem.image" alt="">
                    </div>
                    <div class="itemCenter">
                      <div class="info ellipsis-2" style="-webkit-box-orient: vertical;">[{{endItem.size}}码]{{endItem.productname}}</div>
                      <div class="priceBox">
                          <div class="price">最新价￥{{endItem.saleprice>0?endItem.saleprice:'--'}}</div>
                          <div class="price">发售价￥{{endItem.price>0?endItem.price:'--'}}</div>
                      </div>
                    </div>
                    <div class="itemRight">
                      <div class="pricerate gray" v-if="endItem.pricerate == 0">0.00<span class="fu">%</span></div>
                      <div v-else class="pricerate green" :class="{'red':endItem.pricerate>0}">
                          <span class="fu" v-if="endItem.pricerate > 0">+</span>{{endItem.pricerate}}<span>%</span>
                      </div>
                      <div class="pricechange" v-if="endItem.pricerate == 0">--</div>
                      <div class="pricechange" v-else>
                          <div class="val" v-if="endItem.pricerate > 0">上涨￥{{endItem.pricechange}}</div>
                          <div class="val" v-else>下跌￥{{-endItem.pricechange}}</div>
                      </div>
                    </div>
                  </div>
                </v-cutlist>
              </div>
            </div>
            <div class="swiperItem" v-else>
              <v-list class="listBox" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
                <div class="bannerBox" v-if="bannerurl" @click="gotobannerurl(link)">
                  <img :src="bannerurl" alt="">
                </div>
                <div class="buyListNotOver" v-if="notendlist && notendlist.length > 0">
                  <div class="time">{{saletimeS}}</div>
                  <div class="buyItem" v-for="(buyItem,buyIndex) in notendlist" :key="buyIndex">
                    <div class="buyItemTop" @click="goDetail(buyItem)">
                        <img :src="buyItem.coverurl" />
                        <div class="status" :class="{'over':buyItem.status == 2}"></div>
                        <div class="priceBox" v-if="buyItem.status == 0">
                            <div class="price"><span class="rmb"></span><span class="num">{{buyItem.price}}</span><span class="qi" v-if="buyItem.issameprice != 1"></span></div>
                        </div>
                        <div class="priceBox" v-else>
                            <div class="price" v-if="buyItem.showprice"><span class="rmb"></span><span class="num">{{buyItem.price}}</span><span class="qi" v-if="buyItem.issameprice != 1"></span></div>
                            <div class="price" v-else><span class="rmb"></span><span class="wen"></span></div>
                        </div>
                    </div>
                    <div class="buyItemBottom">
                      <div class="want">{{buyItem.wantcount?buyItem.wantcount:0}}人想要</div>
                      <div class="issetpush" @click="setPushFun(buyItem)" v-if="buyItem.status == 2">
                        <div class="push" v-if="buyItem.issetpush"><i></i><span>已设提醒</span></div>
                        <div class="push red" v-else><i></i><span>开始提醒我</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="buyListEnd historyBox" v-if="endlist && endlist.length > 0">
                  <div class="head">已结束</div>
                  <div class="endItem" v-for="(endItem,endIndex) in endlist" :key="endIndex" @click="go(endItem)">
                    <div class="itemLeft">
                        <img :src="endItem.image" alt="">
                      </div>
                      <div class="itemCenter">
                        <div class="info ellipsis-2" style="-webkit-box-orient: vertical;">[{{endItem.size}}码]{{endItem.productname}}</div>
                        <div class="priceBox">
                            <div class="price">最新价￥{{endItem.saleprice>0?endItem.saleprice:'--'}}</div>
                            <div class="price">发售价￥{{endItem.price>0?endItem.price:'--'}}</div>
                        </div>
                      </div>
                      <div class="itemRight">
                        <div class="pricerate gray" v-if="endItem.pricerate == 0">0.00<span class="fu">%</span></div>
                        <div v-else class="pricerate green" :class="{'red':endItem.pricerate>0}">
                            <span class="fu" v-if="endItem.pricerate > 0">+</span>{{endItem.pricerate}}<span>%</span>
                        </div>
                        <div class="pricechange" v-if="endItem.pricerate == 0">--</div>
                        <div class="pricechange" v-else>
                            <div class="val" v-if="endItem.pricerate > 0">上涨￥{{endItem.pricechange}}</div>
                            <div class="val" v-else>下跌￥{{-endItem.pricechange}}</div>
                        </div>
                      </div>
                  </div>
                </div>
              </v-list>
              
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  Activityhistorylistv2,
  Couponsalelistv356,
  Couponsaletablist,
  Setpush
} from "../../../common/api/bull";

export default {
  components: {},
  data() {
    return {
      hasdata: 2,
      weeks: [], // tab
      currentIndex: 0, // 当前tab索引
      history: [], // 往期回顾 (历史)
      bannerurl: '', // 广告图
      link: '', // 广告位跳转链接
      notendlist: [], // 即将开始和进行中活动列表
      endlist: [], // 已结束活动列表
      saletimeS: '', //展示的日期
      isend: false,
      page: 1,
      size: 10,
      isLoading: false,
      isEnd: false,
      is_on_msg: false, // 是否打开消息通知 false 未打开 true 已打开
      tab: {
        spaceBetween: 10,
        slidesPerView: 5
        // onSlideChangeStart: s => {
        //   this.changeTab(s.activeIndex);
        // }
      },
      hb: {
        spaceBetween: 10,
        slidesPerView: 1,
        centeredSlides: true,
        // initialSlide: this.currentIndex,
        // onSlideChangeStart: swiper => {
        //   console.log("swiper------",swiper);
        //   this.onSlideChange(swiper.activeIndex);
        // },
        onTouchEnd: swiper => {
          console.log('测试', swiper)
          setTimeout(() => {
              this.onSlideChange(swiper.activeIndex);
          }, 300);
        }
      }

      
    };
  },
  beforeDestroy() {
    document.body.classList.remove("lock");
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    },
    tabSwiper() {
      return this.$refs.tabSwiper.swiper;
    },
    hbSwiper() {
      return this.$refs.hbSwiper.swiper;
    }
  },
  mounted() {
    let _ = this;
    window.callbackNotificationStatus = (result, via) => {
      // result 0：未打开，1：已打开  
      if(result) {
        _.is_on_msg = true
      } else {
        _.is_on_msg = false
      }
    }
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json).then( res => {
          _.tabFun()
        })
      } else _.toast("获取登录信息失败~");
    };
    if (_.$root.ISAPP) {
      // 获取app通知的开关状态 action: 0 最开始查询app是否打开消息通知要传的参数 ,1 是通知APP打开通知设置界面
      _.javascriptBridge({
        name: "getAppNotificationStatus",
        params: { 
          callbackname: "callbackNotificationStatus",
          action: 0
        }
      });
      _.getQueryParamUser()
        .then(res => _.tabFun()) // 登录成功 处理事件
        .catch(err => _.tabFun());
    } else if (_.uid) {
      _.tabFun()
    } else {
      _.tabFun()
    }
    
  },
  methods: {
    onSlideChange(i) {
      console.log("滚动索引---》", i);
      let _ = this, uid = _.user.uid
      if(i == _.currentIndex) return
      console.log("继续走 ==》", i);
      _.currentIndex = i;
      _.isEnd = false
      if (_.currentIndex == 0) {
          // 往期回顾
          _.historyFun()
      } else {
          // 预售列表
          _.listFun(_.weeks[_.currentIndex].saletime, uid)
      }
      _.tabSwiper.slideTo(_.currentIndex, 100, false);
    },
    changeTab(index) {
      let _ = this, uid = _.user.uid
      // 切换类目
      _.currentIndex = index;
      _.isEnd = false
      if (_.currentIndex == 0) {
          // 往期回顾
          _.historyFun()
      } else {
          // 预售列表
          _.listFun(_.weeks[_.currentIndex].saletime, uid)
      }
      _.hbSwiper.slideTo(_.currentIndex, 500, false);
    },
    // tab 信息
    tabFun(){
      let _ = this, uid = _.user.uid
      Couponsaletablist().then( res => {
        _.weeks = res
        _.weeks.unshift({ title: '历史', isaim: false })
        console.log('weeks ==>', _.weeks)
        _.hasdata = 1
        _.currentIndex = _.weeks.findIndex(val => val.isaim == true)
        _.isEnd = false
        
        if (_.currentIndex > 0) {
            _.listFun(_.weeks[_.currentIndex].saletime, uid)
            
        } else {
            _.currentIndex = 0
            _.historyFun()
        }
      }).catch( e => {

      })
    },
    // 发售列表
    listFun(saletime, uid) {
      let _ = this
      _.isLoading = true
      window.scrollTo(0, 0);
      Couponsalelistv356({ saletime, uid }).then(res => {
          _.bannerurl = res.bannerurl
          _.link = res.link
          _.notendlist = res.notendlist
          // 系统消息通知没有打开 notendlist列表里的issetpush 都要改为0
          if(!_.is_on_msg) {
            if(_.notendlist && _.notendlist.length > 0) {
              _.notendlist.forEach(val => {
                val.issetpush = 0
              });
            }
          }
          _.endlist = res.endlist
          _.saletimeS = res.saletime
          _.isEnd = true
          _.isLoading = false
          // 滚到对应的位置
          _.hbSwiper.slideTo(_.currentIndex, 500, false);
          _.tabSwiper.slideTo(_.currentIndex, 100, false);
      })
    },
    // 往期回顾
    historyFun() {
      let _ = this, page = _.page, size = _.size
      _.isLoading = true
      window.scrollTo(0, 0);
      Activityhistorylistv2({page, size}).then(res => {
          if (res && res.list && res.list.length > 0) {
            if (res.page == 1) _.history = []
            if (res && res.list && res.list.length > 0) {
                _.history = _.history.concat(res.list)
            } else {
              _.isEnd = true
            }
            if (res.page * res.size >= res.total) {
                _.isEnd = true
            }
            _.isLoading = false
          }
      }).catch(e => {

      })
    },
    reload() {
      let _ = this, uid = _.user.uid
      if (_.$root.ISAPP) {
        // 获取app通知的开关状态 action: 0 最开始查询app是否打开消息通知要传的参数 ,1 是通知APP打开通知设置界面
        _.javascriptBridge({
          name: "getAppNotificationStatus",
          params: { 
            callbackname: "callbackNotificationStatus",
            action: 0
          }
        });
      }
      _.listFun(_.weeks[_.currentIndex].saletime, uid)
    },
    loadmore() {
      let _ = this
      if (_.isEnd === true) {
        _.toast('已无更多')
      } else {
        if(_.currentIndex == 0) {
          _.page += 1
          _.historyFun()
        } else {
          _.isEnd = true
        }
        
      }
    },
    // 打开消息通知
    goOpenMsg() {
      let _ = this
      // 获取app通知的开关状态 action: 0 最开始查询app是否打开消息通知要传的参数 ,1 是通知APP打开通知设置界面
      _.javascriptBridge({
        name: "getAppNotificationStatus",
        params: { 
          callbackname: "callbackNotificationStatus",
          action: 1
        }
      });
    },
    // 去预售详情
    goDetail(item) {
      let _ = this
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppWebview",
          params: {
            url: item.activityurl
          }
        });
      } else {
        _.$router.push(`/sneakerticket/detail?activityid=${item.activityid}`)
      }
    },
    // 去交易区
    go(endItem) {
      let _ = this
      if(_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppCouponTradePage",
          params: {
            productid: endItem.productid,
            size: endItem.size
          }
        });
      } else {
        _.confirm({
          title: "确认提示",
          msg: "立即跳转至斗牛APP？",
          okText: "跳转",
          ok: () => {
            _.openAppClient()
          },
          cancelText: "取消",
          cancel: () => {
          }
        })
      }

    },
    // 设置消息提醒
    // 先判断消息通知是否打开
    // （1）未打开 点击（开始提醒我）时 直接跳往设置-通知开启的地方（走app交互）返回
    // 再次 点击（开始提醒我）时 走接口 单场活动设置提醒  变为 （已设提醒）
    // （2）打开 点击（已设提醒（根据接口返回的字段判断是否设置提醒））时 直接走接口 不用走交互
    setPushFun(buyItem) {
      let _ = this, activityid = buyItem.activityid, uid = _.user.uid, token = _.user.token
      if(_.$root.ISAPP) {
        
        if (_.notloged) _.callAppLogin();
        else {
          if(!_.is_on_msg) {
            _.goOpenMsg()
          } else {
            Setpush({activityid, token}).then( res => {
              _.listFun(_.weeks[_.currentIndex].saletime, uid)
            }).catch( e => {
            })
          }
        }
        
      } else {
        _.confirm({
          title: "确认提示",
          msg: "立即跳转至斗牛APP？",
          okText: "跳转",
          ok: () => {
            _.openAppClient()
          },
          cancelText: "取消",
          cancel: () => {
          }
        })
      }
    },
    callAppLogin() {
      this.javascriptBridge({
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" }
      });
    },
    // 跳专题页
    gotobannerurl(link) {
      let _ = this
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppWebview",
          params: {
            url: link
          }
        });
      } else {
        window.location.href = link
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.buyListBox{
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 65px;
}
.tabs{
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 44px;
    overflow: hidden;
    white-space: nowrap;
    z-index: 3;
    .list{
      height: 100%;
      .item{
        display: block;
        width: 100%;
        height: 100%;
        line-height: 44px;
        position: relative;
        font-size: 16px;
        color: #969696;
        &.active{
          color: #D0021B;
          .line{
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -12px;
            width: 24px;
            height: 3px;
            background: #FA2337;
          }
        }
      }
    }
}
.swiperItem{
  text-align: left;
  min-height: 100vh;
}
.buyListEnd{
  padding: 0 15px 15px;
  .head{
    height:25px;
    font-size:18px;
    font-weight:600;
    color:#333333;
    line-height:25px;
    margin-bottom: 15px;
    padding-left: 5px;
  }
  .endItem{
    width: 100%;
    height: 90px;
    background:#fff;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin-bottom: 10px;
  }
}
.history_list{
  background: transparent;
}
.itemLeft{
    margin-right: 8px;
    width: 80px;
    height: 80px;
    position: relative;
    img{
      display: block;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      z-index: 2;
  }
}
.itemCenter{
    flex: 1;
    .info{
      line-height: 18px;
      height: 36px;
      color: #232323;
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 6px;
      overflow: hidden;
      word-break: break-all;
    }
    .priceBox{
      height: 16px;
      display: flex;
      .price{
        flex: 1;
        height: 16px;
        line-height: 16px;
        color: #646464;
        font-size: 11px;
        font-weight: 400;
      }
    }
}
.itemRight{
  width: 80px;
  text-align: right;
  .pricerate{
    font-size: 16px;
    font-family: 'OswaldBold';
    &.green{
      color: #0AB978;
    }
    &.red{
      color: #FA2337;
    }
    &.gray{
      color: #969696;
    }
    .fu{
      font-size: 12px;
    }
  }
  .pricechange{
    font-size: 12px;
    color: #969696;
    font-weight: bold;
  }
}
.bannerBox{
    margin-bottom: 20px;
    padding: 0 15px;
    img{
      display: block;
      width: 100%;
    }
}
.buyListNotOver{
  padding: 0 15px 30px;
  .time{
    padding-left: 5px;
    height: 25px;
    font-size:18px;
    font-weight:600;
    color:#333333;
    line-height: 25px;
  }
}
.buyItem{
    background: transparent;
    margin-bottom: 10px;
}
.buyItemTop{
   position: relative; 
   img{
    display: block;
    width: 100%;
    height: 30.67vw;
  }
  .status{
    width: 14.933vw;
    height: 14.933vw;
    background: url('//files.eyee.com/eyeeh5/img/crunchies/jb_01.png') 0 0 no-repeat;
    background-size: cover;
    position: absolute;
    left: -2px;
    top: 10px;
    z-index: 2;
    &.over{
      background: url('//files.eyee.com/eyeeh5/img/crunchies/jb_02.png') 0 0 no-repeat;
      background-size: cover;
    }
  }
  .priceBox{
    height: 51px;
    position: absolute;
    left: 5.06667vw;
    top: 11.5vw;
    width: 200px;
    .price{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      .rmb{
        width: 7.2vw;
        height: 8.533vw;
        background: url('//files.eyee.com/eyeeh5/img/crunchies/RMB.png') 0 0 no-repeat;
        background-size: cover;
      }
      .num{
        font-family: OswaldBold;
        font-size: 56px; 
        color: #fff;
        position: relative;
        top: 2.9333333vw;
        left: -1px;
        font-style: italic;
        margin-right: 3px;
      }
      .qi{
        width: 3.733vw;
        height: 3.733vw;
        background: url('//files.eyee.com/eyeeh5/img/crunchies/qi_list.png') 0 0 no-repeat;
        background-size: cover;
      }
      .wen{
        width: 25.067vw;
        height: 10.4vw;
        background: url('//files.eyee.com/eyeeh5/img/crunchies/ques_mark2.png') 0 0 no-repeat;
        background-size: cover;
        position: relative;
        left: 3px;
      }
    }
  }
}
.buyItemBottom{
    height: 40px;
    background: #fff;
    box-shadow:0px 2px 10px 0px rgba(0,0,0,0.05);
    border-radius:0px 0px 6px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .want{
      padding-left: 15px;
      color: #969696;
      font-size: 14px;
      font-weight: bold;
    }
    .issetpush{
      padding-right: 10px;
      .push{
        display: flex;
        justify-content: center;
        align-items: center;
        i{
          width: 5.867vw;
          height: 5.867vw;
          background: url('//files.eyee.com/eyeeh5/img/crunchies/isset_1.png') 0 0 no-repeat;
          background-size: cover;
          margin-right: 5px;
        }
        span{
          font-size: 12px;
          color: #969696;
          font-weight: bold;
        }
        &.red{
          i{
            background: url('//files.eyee.com/eyeeh5/img/crunchies/isset_2.png') 0 0 no-repeat;
            background-size: cover;
          }
          span{
            color: #FA2337;
          }
        }
      }
    }
}
.listBox {
  background: transparent !important;
}
</style>
