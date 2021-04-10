<template>
  <!-- <div class="online" v-show="!(JSON.stringify(shareInfo) == '{}')"> -->
  <div class="online">
    <div class="share-banner">
      <img src="/static/img/assemble/shaer-banner.png" alt="">
      <!-- 中间分享信息 -->
      <div class="share">
        <div class="flex-center share-master">
          <div class="share-avator">
            <img :src="shareInfo.userimage" alt="">
          </div>
          <div class="share-tip">我有一双球鞋想要在斗牛APP 进行在线鉴定，求帮忙助力～</div>
        </div>
        <div class="flex-btwn share-user-list">
          <div class="share-user-item" v-for="item in shareInfo.helper" :key="item.helpername">
            <div class="share-user-img" :class="item.helpertype != -1 ? 'share-user-yellow':'share-user-gray'">
              <img :src="item.helperimage" alt="">
            </div>
            <div class="share-user-name">{{item.helpername}}</div>
            <div class="share-user-tip" v-if="(item.helpertype == -1)&&userInfo&&userInfo.unionid&&(userInfo.unionid == item.unionid)">请在APP<br>微信授权及注册</div>
            <div class="share-user-tip" v-else-if="(item.helpertype == -1)&&userInfo&&userInfo.unionid&&(userInfo.unionid != item.unionid)">未在APP<br>微信授权及注册</div>
          </div>
          <div class="share-user-item" v-for="i in helpNum" v-show="helpNum>0">
            <div class="share-user-img share-user-question"></div>
            <div class="share-user-name">???</div>
          </div>
        </div>
        <div class="share-btn" @click="nowHelp()">立即帮TA助力</div>
      </div>
    </div>
    <div class="share-introduce">
      <img src="/static/img/assemble/share-info.png" alt="">
    </div>
    <div class="flex-center share-footer">
      <img src="/static/img/assemble/logo.png" alt="">
    </div>

    <!-- 确认提示框 -->
    <transition name="isConfirm">
      <div v-show="isConfirm" class="flex-center dialog" @touchmove.prevent>
        <div class="confirm-content">
          <div class="confirm-name">确认提示</div>
          <div class="confirm-info">立即跳转至斗牛APP？</div>
          <div class="flex-btwn">
            <div class="confirm-btn confirm-close" @click="isConfirm=false">取消</div>
            <div class="confirm-btn confirm-sure" @click="toApp()">确认</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import MintUi from 'mint-ui'
import { weixinApp } from "../../common/api/oauthAPI"
import { WXRegisterAuth } from '../../common/api/user'
import { OnlineHelper,OnlineShare } from '../../common/api/shareUndertake'
Vue.use(MintUi)

const toast = (msg)=>{
  MintUi.Toast({
    message: msg,
    position: 'middle', 
    duration: 3000
  })
}
export default {
  data(){
    return{
      shareInfo:{},
      helpNum:3,
      userInfo:{},
      curuserid:'',
      isConfirm:false
    }
  },
  created(){
    console.log('********created*******')
  },
  mounted(){
    let _ = this
    console.log('地址栏携带参数',_.shareInfo,_.$route.params,_.$root)
    _.curuserid = _.$route.params.id
    if (window.location.href.indexOf('code') > 0) {
      var weixincode = window.location.href.split('code=')[1].split('&state')[0]
      // var weixincode = '061Zwd2A01ojGe10fY1A0gxq2A0Zwd21'
      console.log('地址栏解析的code ===>',weixincode)
      console.log('当前地址',window.location.href)
      WXRegisterAuth({
        WXCode: weixincode
      }).then(res => {
        _.userInfo = res
        if(res&&res.unionid){
          _.getShareInfo(res.unionid)
        }
        console.log('WXRegisterAuth微信授权之后获取到的res====>',res, _.userInfo)
      }).catch(err => {
        console.log('WXRegisterAuth微信授权解析失败err====>',err)
      })
    } else {
      var doPath = window.location.origin + window.location.pathname;
      // var doPath = 'https://qzone.eyee.com' + window.location.pathname;
      var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      // if (window.confirm("跳转的链接：" + link)) 
      console.log('无code ===>',link)
      window.location = link;
      return;
    }
  },
  methods:{
    // 微信授权后页面展示信息
    getShareInfo(unionid){
      let _ = this,opts={
        userid:_.curuserid,
        unionid:unionid
      }
      console.log('微信授权入参uid,unionid ===>',opts)
      OnlineHelper(opts).then(res=>{
        console.log('页面信息 ===>',res,_.helpNum)
        _.shareInfo = res
        if(_.shareInfo&&_.shareInfo.helper&&_.shareInfo.helper.length>0){
          _.helpNum = 3 - _.shareInfo.helper.length
        }else{
          _.helpNum = 3
        }
        console.log('页面信息 ===>',res,_.helpNum)
      }).catch(err=>{
        console.error('助力者微信授权后看到的界面获取失败 ===>',err)
      })
    },
    // 点击立即助理
    nowHelp(){
      let _ = this,opts = {
        userid:_.curuserid,
        unionid:_.userInfo.unionid,
        weixinname:_.userInfo.nickname,
        weixinheadpic:_.userInfo.headimgurl
      }
      console.log('点击立即助力',opts)
      OnlineShare(opts).then(res=>{
        toast('前往APP助力 （请使用微信登录）')
        setTimeout(()=> {
          if(_.$root.ISIOS){
            setTimeout(function () {
              window.location = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
            }, 10)
          }else{
            _.isConfirm = true
          }
        },3000)
      }).catch(err=>{
        console.error('点击立即助力失败 ===>',err)
        if(err&&err.code){
          if(err.code.toString().length == 7){
            if(err&&err.msg){
              let isSuccess = false
              if(_.shareInfo&&_.shareInfo.helper){
                _.shareInfo.helper.map(i=>{
                  if(i.unionid == _.userInfo.unionid){
                    if(i.helpertype == -1){
                      isSuccess = false
                    }else{
                      isSuccess = true
                    }
                  }
                  return i
                })
              }
              if(err.code == 1511446&&!isSuccess){
                // 已经帮忙助力过的再次点击助力，“您已经助力过该用户”；(可能成功  可能不成功)
                toast('请在APP微信授权并注册')
              }else{
                toast(err.msg)
              }
              setTimeout(()=> {
                if(_.$root.ISIOS){
                  setTimeout(function () {
                    window.location = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
                  }, 10)
                }else{
                  _.isConfirm = true
                }
              },3000)
            }
          }else{
            toast('网络错误，请退出重试！')
          }
        }
      })
    },
    toApp(){
      let _ = this
      _.isConfirm = false
      // if(_.$root.ISIOS){
      //   setTimeout(function () {
      //     window.location = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
      //   }, 10)
      // }else{
        _.openAppClient()
      // }
    }
  }
}
</script>
<style scoped>
.online{
  background-color:#1A0A40;
  /* padding: 13.3333vw 0; */
}
.share-banner{
  width: 100%;
  position: relative;
}
.share{
  width: 94%;
  /* height: 62.1333vw; */
  background-color: #fff;
  border-radius: 2.1333vw;
  box-shadow:0px 6px 30px 0px rgba(51,26,100,1);
  position: absolute;
  top: 62vw;
  left: 3%;
  padding: 9vw 0 8.8vw;
  z-index: 1;
}
.share .share-master{
  padding: 0 9.3333vw;
}
.share .share-avator{
  width: 10.6667vw;
  height: 10.6667vw;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 5.3333vw;
}
.share .share-avator img{
  width: 100%;
  height: 100%;
}
.share .share-tip{
  flex: 1;
  background-color: #F2F2F2;
  color: #333;
  font-size: 3.2vw;
  line-height:4.5333vw;
  border-radius:4vw;
  margin: 0 auto;
  position: relative;
  padding: 2vw 5.3333vw;
}
.share .share-tip::before{
  content: '';
  display:block;
  position: absolute;
  left: -1.6667vw;
  margin-top:-1.6667vw ;
  top: 50%;
  width:0;
  height:0;
  border-width:1.6667vw 1.6667vw 1.6667vw 0;
  border-style:solid;
  border-color:transparent #F2F2F2 transparent transparent;/*透明 透明  黄*/
}
.share-user-list{
  padding: 0 4vw;
  margin-top: 8vw;
}
.share-user-item{
  width: 32%;
  align-items: flex-start;
}
.share-user-item .share-user-img{
  width: 14.4vw;
  height: 14.4vw;
  padding: 0.5333vw;
  margin: 0 auto;
}
.share-user-item .share-user-img.share-user-gray{
  background: url('/static/img/assemble/share-user-gray.png') no-repeat;
  background-size: 100% 100%;
}
.share-user-item .share-user-img.share-user-question{
  background: url('/static/img/assemble/share-user-question.png') no-repeat;
  background-size: 100% 100%;
}
.share-user-item .share-user-img.share-user-yellow{
  background: url('/static/img/assemble/share-user-yellow.png') no-repeat;
  background-size: 100% 100%;
}
.share-user-item .share-user-img img{
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  overflow: hidden;
}
.share-user-item .share-user-name{
  width: 100%;
  height: 5.0667vw;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 2vw;
  line-height: 5.0667vw;
  color: #333;
  font-size: 3.7333vw;
  /* background-color: #F2F2F2; */
  /* border-radius: 2.5333vw; */
  margin-top: 3.4667vw;
}
.share-user-item .share-user-tip{
  margin-top: 1.6vw;
  font-size: 2vw;
  color: #999;
  width: 100%;
  text-align: center;
}
.share-btn{
  background: url('/static/img/assemble/share-btn.png') no-repeat;
  background-size: 100% 100%;
  height: 13.3333vw;
  color: #fff;
  font-size: 4.2667vw;
  text-align: center;
  width: 86%;
  line-height: 12vw;
  position: absolute;
  bottom: -6.6667vw;
  left: 7%;
  z-index: 5;
}
.share-introduce{
  margin-top: 12vw;
}
.share-footer{
  width: 100%;
  height: 14.4vw;
}
.share-footer img{
  width: 32vw;
  height: auto;
}
.isConfirm-enter-active, .isConfirm-leave-active {
  transition: all .5s;
}
.isConfirm-enter, .isConfirm-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.dialog{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 6;
}
.dialog .confirm-content{
  width: 75%;
  /* height: 46.6667vw; */
  background-color: #fff;
  border-radius: 2.1333vw;
  padding: 5.3333vw 3.2vw 3.2vw;
}
.confirm-name{
  width: 100%;
  text-align: center;
  font-size: 4.2667vw;
  line-height: 5.8667vw;
  font-weight: 500;
}
.confirm-info{
  width: 100%;
  text-align: center;
  line-height: 5.3333vw;
  margin: 7.2vw 0 9.6vw;
  font-size: 3.7333vw;
}
.confirm-btn{
  width: 48%;
  height: 10.1333vw;
  text-align: center;
  font-size: 4.2667vw;
  border-radius: 5.0667vw;
  line-height: 10.1333vw;
}
.confirm-close{
  border: 1px solid #707AFC;
  color: #707AFC;
}
.confirm-sure{
  color: #fff;
  background-color: #707AFC;
}
</style>
