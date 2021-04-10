<template>
  <div class="box">
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>
    <div class="couponsalelistBox" v-if="hasdata == 1 && couponsaleInfo.isshow">
      <!--活动开始提醒我 消息通知打开提醒 -->
      <div class="msg_notify_open" v-if="!is_on_msg" @click="goOpenMsg">
        <p class="info">开启消息通知，及时获取下一场抢购信息</p>
        <p class="btn">开启</p>
      </div>
      <div v-if="!isEmp">
        <v-list class="couponsalelistItem_BOX" :load-handle="reload" :more-handle="loadmore" :more-handling="isLoading" :isend="isEnd">
              
          <div class="couponsalelistItem" v-for="(item, index) in couponsaleInfo.list" :key="index" @click="skip(item)">
            <div class="img_box">
              <img :src="item.coverurl" alt="">
              <div class="status_box" :class="{'act': item.status != 0}"></div>
            </div>
            <div class="nameBox">
              <p>{{item.productname}}</p>
            </div>
          </div>
          <div class="couponsalelistItem couponsalelistItem_last" v-if="couponsaleInfo.inleturl && couponsaleInfo.inletimg" @click="otherSkip()">
            <div class="img_box">
              <img :src="couponsaleInfo.inletimg" alt="">
            </div>
          </div>
        </v-list>
        
      </div>
      
    </div>
    
    <div class="empty" v-if="(isEmp && couponsaleInfo.detailimg) || !couponsaleInfo.isshow">
      <img :src="couponsaleInfo.detailimg" alt="">
    </div>

  </div>
</template>
<script>
import {
  Couponsalelist
} from "../../../common/api/bull";

export default {
  components: {},
  data() {
    return {
      title: "预售券发售列表",
      hasdata: 2,
      couponsaleInfo: {}, //预售券发售 信息
      is_on_msg: false, // 是否打开消息通知 false 未打开 true 已打开

      isLoading: false,
      isEnd: false,

      isEmp: false // 发售列表为空时为true
    };
  },
  computed: {
  },
  beforeDestroy() {
    document.body.classList.remove("lock");
  },
  mounted() {
    let _ = this;
    _.setToolBar({ title: _.title });
    _.handleInit()

    window.callbackNotificationStatus = (result, via) => {
      console.log("callbackNotificationStatus res------>>>", result, via);
      // result 0：未打开，1：已打开  
      if(result) {
        _.is_on_msg = true
      } else {
        _.is_on_msg = false
      }
    }
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
  },
  methods: {
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
    handleInit() {
      let _ = this
      _.isLoading = true
      Couponsalelist().then( res => {
        _.couponsaleInfo = res
        if(res.list && res.list.length > 0) {
          _.hasdata = 1
          _.isEmp = false
        } else {
          _.isEmp = true
        }
        _.isEnd = true
        _.isLoading = false
      })
    },
    reload() {
      this.handleInit()
    },
    loadmore() {
      let _ = this
      if (_.isEnd === true) {
        _.toast('已无更多')
      }
    },
    skip(item) {
      let _ = this
      // 截取活动id
      let activityid = item.activityurl.match(/activityid=(\S*)/)[1]
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppWebview",
          params: {
            url: item.activityurl
          }
        });
      } else {
        _.$router.push(`/sneakerticket/detail?activityid=${activityid}`)
      }
    },
    // 跳专题页
    otherSkip() {
      let _ = this
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppWebview",
          params: {
            url: _.couponsaleInfo.inleturl
          }
        });
      } else {
        window.location.href = _.couponsaleInfo.inleturl
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.couponsalelistBox{
  background: #EBEBEB;
  padding: 10px 4vw 0 2.933vw;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}
.couponsalelistItem_BOX{
  background: #EBEBEB;
  min-height: 100vh;
}
.couponsalelistItem{
  margin-bottom: 4vw;
  padding-left: 1.067vw;
  .img_box{
    position: relative;
    width: 100%;
    height: 73.6vw;
    background: #C8C8C8;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    img{
      display: block;
      width: 100%;
      height: 73.6vw;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .status_box{
      position: absolute;
      left: -1.067vw;
      top: 20px;
      height: 9.87vw;
      width: 21.33vw;
      line-height: 36px;
      text-align: center;
      color: #fbfbfb;
      font-size: 16px;
      background: url('https://files.eyee.com/eyeeh5/img/monitor/status_2.png') center center no-repeat;
      background-size: cover;
      z-index: 2;
      &.act{
        background: url('https://files.eyee.com/eyeeh5/img/monitor/status_1.png') center center no-repeat;
        background-size: cover;
      }
    }
  }
  .nameBox{
    background: #fff;
    padding: 0 15px 20px;
    background: #fff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    p{
      padding: 20px 5px 0;
      line-height: 24px;
      font-size: 16px;
      color: #232323;
      font-weight: bold;
      word-wrap:break-word;
    }
  }
  &.couponsalelistItem_last{
    .img_box{
      width: 100%;
      height: 36.8vw;
      border-radius: 8px;
      img{
        display: block;
        width: 100%;
        height: 36.8vw;
        border-radius: 8px;
      }
    }
  }
}
.msg_notify_open{
  height: 34px;
  line-height: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 15px;
  margin-bottom: 12px;
  border-radius: 17px;
  margin-left: 1.067vw;
  .info{
    color: #646464;
    font-size: 12px;
  }
  .btn{
    width:34px;
    height:20px;
    line-height: 20px;
    border-radius:2px;
    border:1px solid rgba(205,205,205,1);
    font-size:12px;
    font-weight:400;
    color:#646464;
    text-align: center;
  }
}
.empty {
  min-height: 100vh;
  img{
    display: block;
    width: 100%;
  }
}

</style>
