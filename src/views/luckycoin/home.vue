<template>
  <div class="body">
      <div v-if="activityStatusInfo&&!activityStatusInfo.isjoin" class="activitybackground">
        <!--未参团-->
        <div @click="createActivity" class="open"></div>
      </div>
      <div  class="activitybg flex-center" v-else-if="activityStatusInfo&&activityDetailInfo">
        <!--已参团-->
        <div class="record flex-center">
          <img class="lantern" src="//files.eyee.com/activity/luckycoin/lantern.png">
          <img class="activitydetailuplogo" src="//files.eyee.com/activity/luckycoin/roof.png">
          <img class="record-rules" @click="getRule" src="//files.eyee.com/activity/luckycoin/rules.png">

        <div style="left:0;top:0">
          <div class="activity-top">
            <div class="activityUpFlower"></div>
            <div class="activityBgPink" style="text-align:center">
              <div style="text-align:center;">
          <img class="peopleheadurl" :src="activityDetailInfo.leader.headurl">

              </div>
              <div>
                <img
                  style="width:20vw;margin-left:5vw"
                  src="//files.eyee.com/activity/luckycoin/red envelope1.png"
                >
                <div class="packet-text">
                  <p>人人有份！</p>
                  <span>最高可瓜分</span>
                  <span style="font-size:25px;color:red">￥100</span>
                </div>
              </div>
              <div v-html="countDown" style="margin:4vw"></div>
              <div>
                <div class="btn">

              <div style=" width:100%"  @click="drawActivity">{{activityBtnDesc}}</div>
              <div style="font-size:8px; width:100%" v-if="activityStatus==4">
                  （邀请更多好友参与活动）
              </div>
            </div>
            <div style="font-size:10px;margin:4vw">仅限新用户参与瓜分·每人限领一次·红包微信发放</div>
          </div>
        </div>
        <div class="bgPink"></div>
        </div>
          <div class="link-img">
            <img style="float:left;margin-left:10vw" src="//files.eyee.com/activity/luckycoin/link.png">
            <img style="float:right;margin-right:7vw" src="//files.eyee.com/activity/luckycoin/link.png">
          </div>

        <!--中奖记录-->
        <div class="activity-record">
           <div class="activityUpFlower"></div>
 <div class="activityBgPink activityrecord">
           <div class="flex-center" style="height:21vw">
                <img class="record-img" src="//files.eyee.com/activity/luckycoin/records.png">
              </div>
          <div style="margin:-6vw 4vw 0px 3vw; font-size:13px" v-for="(member,index) in activityDetailInfo.members" :key="'ac'+index">
              <div style="clear:both;float:left;width:27vw;">
               <div style="height:17vw;">
                    <img
                      v-bind:src="member.headurl"
                      style="border-radius:50%;width:10vw;height:10vw">
                    <p style="margin-top:-8vw;width:16vw;margin-left:10vw;text-align:center">{{member.username}}</p>
                  </div>
                </div>
                <div
                  style="float:right;width:160px;text-align:right;margin-top:3vw"
                  v-if="member.isregister">
                  <div>成功瓜分￥{{member.money}}现金</div>
                  <div>+520元新人大礼包</div>
                </div>
                <div style="float:right;width:160px;text-align:right;margin-top:3vw" v-else>参与中</div>
          </div>
            </div>
            <div class="bgPink"></div>
          </div>
          <div class="link-img-two">
            <img
              style="float:left;margin-left:10vw"
              src="//files.eyee.com/activity/luckycoin/link.png"
            >
            <img
              style="float:right;margin-right:7vw"
              src="//files.eyee.com/activity/luckycoin/link.png"
            >
          </div>
          <div class="activitydetaildownlogo">
            <!-- <div class="activityUpFlower"></div> -->
            <div class="activityUpFlower"></div>
            <div class="activityBgPink activityrecord">
              <img
                style="width:50vw;margin-top:0vw;margin-left:15vw;"
                src="//files.eyee.com/activity/luckycoin/logo.png"
              >
              <div class="bottom-rules">
                <img src="//files.eyee.com/activity/luckycoin/icon1.png">
                <p>商家认证，双重鉴定，正品保障</p>
              </div>
              <div class="bottom-rules">
                <img src="//files.eyee.com/activity/luckycoin/icon2.png">
                <p>潮流单品低价买卖，免手续费</p>
              </div>
              <div class="bottom-rules">
                <img src="//files.eyee.com/activity/luckycoin/icon3.png">
                <p>最真实有趣的球鞋社区</p>
              </div>
              <div class="bottom-rules">
                <img src="//files.eyee.com/activity/luckycoin/icon4.png">
                <p>最全的潮流信息资讯平台</p>
              </div>
            </div>
            <img class="shose" src="//files.eyee.com/activity/luckycoin/shoes.png">
            <div class="bgPink"></div>
          </div>
        </div>
      </div>
      </div>
      <img class="flower" src="//files.eyee.com/activity/luckycoin/flower.png">
      <!--绑定微信-->
      <div v-show="!isBindWeiXin" class="flex-center dialog" @touchmove.prevent>
        <div class="confirm-content bind dialog-wechat">
          <div style="margin-top:5vw;line-height:8vw">红包将发放至微信账号，请先</div>
          <div  style="line-height:8vw">绑定微信账号</div>
          <div class="flex-between">
            <div style="margin-top:6vw;" class="close-btn" @click="isBindWeiXin=true">我在想想</div>
            <div style="margin-top:6vw;" class="submit-btn" @click="bindWeiXin()">前去绑定</div>
          </div>
        </div>
      </div>
      <!--分享-->
    <div v-show="isShare" class="flex-col flex-center dialog" @touchmove.prevent>
      <div class="confirm-content share dialog-toFriend">
        <div style="margin-top:23vw">
          <span style="font-size:22px;font-weight:600">最高瓜分</span>
          <span style="color:#f00;font-size:20px;font-weight:600">￥100</span>
          <span style="font-size:13px;">(保底5元)</span>
        </div>
        <div style="font-size:14px;line-height:13vw;">快邀请好友一起瓜分吧</div>
        <div class="flex-between" style="width:63vw;margin-left: 7vw;margin-top: 3vw;">
          <div class="confirm-btn bgwx"  @click="share(2)">
            <img style="width:12vw;height:12vw;" src="//files.eyee.com/activity/luckycoin/wx.png">
            <p style="margin-top:-3vw">微信</p>
          </div>
          <div class="confirm-btn bgpyq" @click="share(1)">
            <img style="width:12vw;height:12vw;" src="//files.eyee.com/activity/luckycoin/pyq.png">
            <p style="margin-top:-3vw">朋友圈</p>
          </div>
        </div>
      </div>
      <div class="close" @click="isShare=false"></div>
    </div>
      <!--团长分享-->
    <div v-show="!hasLeaderOpenId" class="flex-col flex-center dialog" @touchmove.prevent>
      <div class="confirm-content bind dialog-wechat">
        <div style="margin-top: 5vw;">
          <span style="font-size:14px;line-height:8vw">请先在微信点击你分享的红包链接</span>
        </div>
        <div style="font-size:14px;line-height:8vw">获取微信授权信息，红包才能顺利发放</div>
        <div class="flex-center">
          <div class="know-btn" @click="hasLeaderOpenId=true">知道了</div>
        </div>
      </div>
      <div class="close" @click="hasLeaderOpenId=true"></div>
    </div>
      <!--微信红包-->
    <div v-show="successGet" class="flex-col flex-center dialog" @touchmove.prevent>
      <div class="confirm-content joinSuccess">
        <p style="font-size:22px;font-weight:600;color:#FFFDEA;text-align: center;">
          恭喜成功瓜分一份
          <span>{{successTotalMoney}}</span>红包
        </p>
        <div style="margin-top:20vw;text-align:center;flex-wrap:wrap" class="flex-center">
          <div class="packet-money">
            <p style="font-fize:16px;">￥{{successGetMoney}}</p>
          </div>
          <!-- <img style="width:12vw;height:17vw;" src="//files.eyee.com/activity/luckycoin/red envelope2.png"/> -->
          <span style="line-height:8vw">你瓜分到其中￥{{successGetMoney}}</span>
          现金
          <span style="line-height:8vw">（请到微信服务通知窗口领取）</span>
          <br>
          <div class="know-btn" @click="successGet=false">我知道了</div>
        </div>
      </div>
      <div class="close" @click="successGet=false"></div>
    </div>
      <!--芝麻认证-->
    <div v-show="!isIdentify" class="flex-col flex-center dialog" @touchmove.prevent>
      <div class="confirm-content dialog-wechat">
        <p style="margin-top：5vw;line-height:10vw;margin-top:5vw;">每位用户限参与1次，为防止重复</p>
        <p style="margin-top：5vw;line-height:10vw">领取，请进行实名验证</p>
        <div class="flex-btwn" style="margin-top:-7vw;">
          <div class="close-btn" @click="isIdentify=true">我再想想</div>
          <div class="submit-btn" @click="aliAppIdentify()">一步验证</div>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <div v-show="ruleShow" class="flex-col flex-center dialog" @touchmove.prevent>
      <div class="confirm-content dialog-rules">
        <p style="font-size:40px;text-align:right;margin:1vw;" @click="ruleShow=false">×</p>
        <p style="font-size:16px;text-align:center;margin-top: -7vw">活动规则</p>
        <div class="rules-text" style="font-size:13px;text-align:left;padding: 5vw 3vw;">
          <p>1、现金红包由5元、10元、20元、 100元四种不同面额组成;</p>
          <p>2、团长领取分享现金红包任务后，在24小时内可邀请4名用户来参与瓜分;</p>
          <p>3、参与用户成功瓜分现金红包后，红包将在斗牛DoNew微信服务号发送给用户;</p>
          <p>4、团长在成功邀请4名用户后可领取最后一份瓜分的现金红包;</p>
          <p>5、同一用户只可领取一次现金红包，不可重复参与;</p>
          <p>6、邀请仅限新用户，(未注册过 斗牛app账号的用户)，同设备、微信号、手机号等均视为同用户;</p>
          <p>7、若发现用户存在恶意刷红包、虚假邀请等违规行为，平台有权利判定邀请无效，活动最终解释权归斗牛APP所有。</p>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
// var vConsole = new VConsole();
import { mapGetters } from "vuex";
import {
  MillionRedLotteryActivityStatus,
  MillionRedLotteryJoin,
  MillionRedLotteryActivityDetail,
  MillionRedLotteryDraw,
  MillionLeaderOpen,
  MillionMembersOpen,
  MillionShare
} from "@/utils/api/activities";
import shareModel from "@/components/templates/h5ShareModel";
import { DateDiff } from "../../common/util";


export default {
  components: {
    shareModel
  },
  data() {
    return {
      activityStatusInfo:null,
      activityDetailInfo:null,
      activityStatus:-1,
      activityBtnDesc:'',
      activityBtnDetailDesc:'',
      selfMoney:"0",
      countDown:"0",
      timeRun: null,
      isBindWeiXin:true,
      isShare:false,
      hasLeaderOpenId:true,
      successGet:false,
      successGetMoney:0,
      successTotalMoney:0,
      isIdentify:true,
      deviceid:'',
      v:0,
      ruleShow:false,
    };
  },
  mounted() {
    let _ = this;
    console.log("地址栏携带参数", _.$route.query);
    _.getQueryParamUser().then(({param:p,user})=>{
        console.log("aaaa",p);
         _.deviceid=p.deviceid;
        console.log(p.version);
         _.v= parseInt(p.version.replace(/\./g, ""));
         _.userActivityStatus();
    }).catch(err => {
      console.error("获取token失败===>");
      console.error(err);
      switch (err.code) {
            case 0: // 不在APP
              _.confirm({
                msg: "请在斗牛APP中参与活动~",
                okText: "立即前往",
                cancelText: "我再想想",
                ok: _.openAppClient
              });
              break;
            case 1: // 无参
            case 2: // 处理参数异常
              console.error("deal url query param error: ", e);
              _.toast("获取版本信息异常~ 请退出重进试试~");
              break;
            case 3: // 自动登录异常
              _.toast("获取登录信息异常~ 请退出重进试试~");
              break;
          }
    });

    window._callAppBindThirdAccount = function(res, via) {
      console.log("APP绑定微信结果：" + res + "，渠道：" + via);
      if (Number(res) === 1) {
        _.getQueryParamUser().then(res=>{
            console.error("登录" + res);
        }).catch(err => {
            console.error("登录失败" + res);
        });

      }else{
        _.toast("APP绑定微信失败");
      }
      _.isBindWeiXin=true;
    };
    window._callAppIdentifyAccount = function(res, via) {
      console.log("APP芝麻认证结果：" + res + "，渠道：" + via);
      //0：认证失败，1：认证成功"
      if (Number(res) === 1) {
        _.successGet=true;
        //认证成功获取红包金额
        var req={activityid:_.activityStatusInfo.activityid,deviceid:_.deviceid,mobile:_.userInfo.mobile};
          MillionMembersOpen(req).then(res=>{
            console.log("领取红包===>", res,_.activityStatusInfo);
            _.successGetMoney=res.getmoney;
            _.successTotalMoney=res.redmoney;
            //刷新活动详情
            
            _.getActivityDetailInfo(_.activityStatusInfo.activityid);
          }).catch(err => {
              console.error("领取红包失败===>", err);
            if(err.code==1511446){
              _.toast("活动已结束");
            }
          });
        
      }else{
        _.toast("芝麻认证失败");
      }
      _.isIdentify=true;
  };
  },
  watch:{
    /**活动状态 */
    activityStatus:function(newValue, oldValue){
      let _ = this;
      if(_.activityStatus==1){
        _.activityBtnDesc="邀请4名好友 一起瓜分现金红包";
      }else if(_.activityStatus==2){
        _.activityBtnDesc="人数已满 立即领取";
      }else if(_.activityStatus==3){
        _.activityBtnDesc="任务超时！领取新的红包";
      }else if(_.activityStatus==4){
        _.activityBtnDesc="你瓜分到了"+_.selfMoney+"元";
      }else if(_.activityStatus==5){
        _.activityBtnDesc="立即领取";
      }
    },
  },
 computed:{
    ...mapGetters({ baseValue: "baseValue", userInfo: "userInfo" }),
  },
  methods: {
    //分享
    getShare:function(){
      return new Promise((resolve,reject)=>{
        MillionShare()
          .then(res => {
            console.log("获取分享详情===>", res);
            return resolve(res);
          })
          .catch(err => {
            console.error("获取分享详情失败===>", err);
            return reject(null);
          });
        });
    },
    /*
    获取活动状态，用户参团状态
     */
    userActivityStatus:function(){
      let _ = this;
      if(_.v<323){
        _.toast("请将斗牛APP更新到最新版V3.2.3参与活动~");
        return;
      }
      
      MillionRedLotteryActivityStatus()
        .then(res => {
          console.log("获取用户参团状态===>", res);
          if(!res.isopen){
            _.toast("活动已结束");
            return;
          }
          _.activityStatusInfo=res;
          //已参团
          if(_.activityStatusInfo.isjoin){
              //获取活动详情
              _.getActivityDetailInfo(_.activityStatusInfo.activityid);
          }
        })
        .catch(err => {
          console.error("获取用户参团状态失败===>", err);
          if(err.code==1511446){
             _.toast("活动已结束");
          }
        });
    },
    /*
    获取活动详情
     */
    getActivityDetailInfo:function(activityid){
      let _ = this;
      
      MillionRedLotteryActivityDetail(activityid)
        .then(res => {
          console.log("获取活动详情===>", res);
          var leader={};
          var members=[];
          var self={};
          //成功参团人数
          var successJoinNum=0;
          for(var i=0;i<res.list.length;i++){
            var d=res.list[i];
            if(d.isopen){
              successJoinNum++;
            }
            //当前用户
            if(d.userid==_.userInfo.uid){
              self.money=d.money;
              self.userid=d.userid;
              self.isget=d.issend;
            }

            if(d.isleader){
              //团长
              leader.headurl=d.headurl;
              leader.username=d.username;
              leader.userid=d.userid;
              leader.isget=d.issend;
            }else{
              //其他成员
              members.push({headurl:d.headurl,username:d.username,money:d.money,isregister:d.isregister,isget:d.issend});
            }
          }
          _.activityDetailInfo={};
          _.activityDetailInfo.leader=leader;
          _.activityDetailInfo.members=members;
          _.activityDetailInfo.status=res.status;
          _.activityDetailInfo.expiretime=res.expiretime;
          _.activityDetailInfo.self=self;
          _.selfMoney=self.money;

          var isleadSlef=_.userInfo.uid==leader.userid?true:false;

          if(_.activityDetailInfo.status==1){//团超时
            console.log("团超时");
            console.log(isleadSlef,leader.isget);
            if(isleadSlef&&!leader.isget){//团长且未领取红包，为超时
              _.activityStatus=3;
            }else{
              _.activityStatus=4;//显示领取到的红包金额
              _.selfMoney=self.money;
            }
          }else{//进行中的团
              
              if(isleadSlef)//团长
              {
                if(successJoinNum>=4){
                  if(!self.isget){
                    _.activityStatus=2;//人数已满 立即领取
                  }else{
                    _.activityStatus=4;//显示领取到的红包金额
                    _.selfMoney=self.money;
                  }
                }else{
                  _.activityStatus=1;//邀请好友一起瓜分现在红包
                }
              }else{
                  if(!self.isget){
                    _.activityStatus=5;//立即领取
                  }else{
                    _.activityStatus=4;//显示领取到的红包金额
                    _.selfMoney=self.money;
                  }
              }
            }
          //倒计时
          _.countdownTime();
        })
        .catch(err => {
          console.error("获取活动详情失败===>", err);
          if(err.code==1511446){
             _.toast("活动已结束");
          }
          
        });
    },
    //剩余时间
    countdownTime() {
      var _ = this;
      var ts = DateDiff({
        destination:_.activityDetailInfo.expiretime,
        type: "H"
      });
      if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) {
       //超时,刷新团详情
        _.getActivityDetailInfo(_.activityStatusInfo.activityid);
        _.countDown="<span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span>";
        return;
      }
      let H = ts.H < 10 ? "0" + ts.H : ts.H;
      let M = ts.m < 10 ? "0" + ts.m : ts.m;
      let S = ts.s < 10 ? "0" + ts.s : ts.s;
      _.countDown ="<span class='t time'>"+H +"</span><span class='t timesplitor'>:</span><span class='t time'>"+ M +"</span><span class='t timesplitor'>:</span><span class='t time'>"+S+"</span>";
      // console.log(ts)
      if (ts.H === 0 && ts.m === 0 && ts.s === 1) {
        _.countDown = null;
        //超时,刷新团详情
        _.getActivityDetailInfo(_.activityStatusInfo.activityid);
        clearTimeout(_.timeRun);
      } else {
        _.timeRun = setTimeout(() => {
          _.countdownTime();
        }, 1000);
      }
    },
    share(platform){
      var _ = this;
      if (_.$root.ISAPP) {
          _.getShare().then(res=>{
            console.log("分享",res);
            if(res){
              _.javascriptBridge({
                name: "callAppDirectlyShare",
                params: {
                  shareurl:res.shareurl+ "?userid="+_.userInfo.uid+"&activityid="+_.activityStatusInfo.activityid,
                  sharetitle:res.sharetitle,
                  sharecontent:res.sharecontent,
                  sharepicurl:res.sharepicurl,
                  type: 2,
                  platform: platform
                }
              });
            }
          });
        
      } else _.toast("请在斗牛APP中参与活动~");
    },
    //app交互绑定微信
    bindWeiXin(){
      let _ = this;
      if (_.$root.ISAPP) {
          let wxlogin={};
          //未绑定微信
          _.isBindWeiXin=false;
          wxlogin.callbackname="_callAppBindThirdAccount";
          wxlogin.platform=1;//平台类型1：微信，2：QQ，3：微博
          _.javascriptBridge({
            name: "callAppBindThirdAccount",
            params: { ...wxlogin }
          });
      }
    },
    //支付宝芝麻认证
    aliAppIdentify(){
      let _ = this;
      if (_.$root.ISAPP) {
          let appIdentify={};
          appIdentify.callbackname="_callAppIdentifyAccount";
          appIdentify.platform=1;//平台类型int 1：支付宝
          _.javascriptBridge({
            name: "callAppIdentifyAccount",
            params: { ...appIdentify }
          });
      }
    },
    //开团
    createActivity(){
        let _ = this;
        if(_.v<323){
          _.toast("请将斗牛APP更新到最新版V3.2.3参与活动~");
          return;
        }
        MillionRedLotteryJoin()
            .then(res=>{
            console.log("开团详情===>", res);
            //活动详情
            _.activityStatusInfo.activityid=res.activityid;
            _.activityStatusInfo.isjoin=true;
            _.getActivityDetailInfo(res.activityid);
            _.isShare=true; //分享
          }).catch(err => {
            console.error("开团详情失败===>", err);
            if(err.code==1511446){
             _.toast("活动已结束");
            }else if(err.code==1511802 ||err.code==1511890){
              _.toast("今日份现金红包已经被抢完啦，明天再来抢哦！");
            }else if(err.code==1511504){
               //_.toast("红包将发放至微信，请先绑定微信账号");
               _.isBindWeiXin=false;
            }
        });
    },
    //微信领取红包
    drawActivity(){
      var _ = this;
      if(_.$root.ISAPP){
        if(_.activityStatus==1||_.activityStatus==4)
        {
          _.isShare=true; //分享
        }else if(_.activityStatus==3){
          //未领取超时，回到拆红包页面
          _.activityStatusInfo.isjoin=false;
        }else{
          //未认证
          if(_.activityStatus==2||_.activityStatus==5){
              //_.isIdentify=false;
              _.openRedPacket();
          }
        }
      }else{
        _.toast("请前往app参与活动");
      }
    },
    getRule(){
      var _ = this;
      _.ruleShow=true;
    },
    //拆红包
    openRedPacket(){
      var _ = this;
      var req={activityid:_.activityStatusInfo.activityid,deviceid:_.deviceid,mobile:_.userInfo.mobile};
      if(_.activityStatus==2){//团长领取红包
          _.hasLeaderOpenId=true;
          MillionLeaderOpen(req).then(res=>{
            console.log("团长拆红包===>", res);
            _.successGetMoney=res.getmoney;
            _.successTotalMoney=res.redmoney;
          }).catch(err => {
              console.error("团长拆红包失败===>", err);
              if(err.code==1511446){
                 _.toast("活动已结束");
              }else if(err.code==1511533){
                _.hasLeaderOpenId=false;//团长没有openid
              }else if(err.code==1511911){//没有芝麻信用授权
                _.isIdentify=false;
              }
          });
        }else if(_.activityStatus==5){//非团长领取红包
            MillionMembersOpen(req).then(res=>{
            console.log("团员领取红包===>", res);
            _.successGetMoney=res.getmoney;
            _.successTotalMoney=res.redmoney;
          }).catch(err => {
              console.error("团员领取红包失败===>", err);
            if(err.code==1511446){
              _.toast("活动已结束");
            }else if(err.code==1511911){//没有芝麻信用授权
              //_.toast("每位用户限参与一次，为防止重复领取，请进行实名认证");
              _.isIdentify=false;
            }
          });
      }
    }
  }
};
</script>
<style>
.body {
  width: 100%;
  height: 100%;
  background-color: #bc302e;
}
.open{
  background: url("//files.eyee.com/activity/luckycoin/chai.png") no-repeat;
   -moz-background-size: 100% 100%;
   width: 68vw;
  height: 15vw;
  background-size: 100% 100%;
  position: absolute;
  left: 16%;
  top: 80%;

}
.activitybackground{
  background: url("//files.eyee.com/activity/luckycoin/home.png") no-repeat;
  background-size: 100% 100%; 
  -moz-background-size: 100% 100%;
    height: 100vh;
  width: 100vw;
}
.record {
  width: 96%;
  border: 3px solid #cf6462;
  flex-wrap: wrap;
}
.activitybg {
  width: 100%;
  /* margin-top: 3vw; */
  /* background: url("//files.eyee.com/activity/luckycoin/bg.png");
  background-size: 100% 100%; */
  /* -moz-background-size: 100% 100%;
  overflow: hidden;
  background-repeat: repeat-y; */
}
.lantern {
  width: 19vw;
  height: 25vw;
  position: absolute;
  left: 0vw;
  top: 0vw;
  z-index: 3;
}
.activitydetailuplogo {
  max-width: 100vw;
  position: absolute;
  top: -4vw;
}
.record-rules {
  position: absolute;
  z-index: 7;
  float: right;
  top: 27vw;
  height: 8vw;
  right: -2.7vw;
}
.bgPink {
  background: url("//files.eyee.com/activity/luckycoin/bg_pink2.png");
  background-size: 100% 100%;
  /* -moz-background-size: 100% 100%; */
  height: 20px;
}
.link-img {
  margin-top: -7vw;
  z-index: 20;
}
.link-img img {
  width: 4vw;
}
.activity-record {
  width: 90vw;
  margin-top: -21vw;
}
.record-img {
  width: 65vw;
  z-index: 7;
  margin-top: -8vw;
}
.activity-top {
  width: 90vw;
  margin-top: -4vw;
}
.activityUpFlower {
  background: url("https://files.eyee.com/activity/luckycoin/topborder.png") center center no-repeat;
  background-size: 100% 100%;
  height: 10vw;
  margin-top: 25vw;
  width: 90vw;
}

.activityBgPink {
  background: url("//files.eyee.com/activity/luckycoin/bg_pink1.png");
  background-size: 100% 100%;
  overflow: hidden;
  background-repeat: repeat-y;
  width: 90vw;
  z-index: -10;
}
.peopleheadurl {
  height: 17vw;
  width: 17vw;
  border-radius: 50%;
  border: 5px solid #fdf1f0;
  position: absolute;
  top: 16vw;
  left: 42vw;
}
.packet-text {
  margin-right: 13vw;
  margin-top: 5vw;
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  float: right;
}
.activityrecord {
  padding: 0 20px;
}
.activitydetaildownlogo {
  margin-top: -21vw;
}
.link-img-two {
  margin-top: -9vw;
  z-index: 7;
}
.link-img-two img {
  width: 4vw;
  /* position: relative; */
}
.btn {
  border-radius: 7vw;
  padding: 5px 0;
  color: red;
  width: 80%;
  font-weight: bold;
  margin: 3vw auto;
  background: linear-gradient(
    180deg,
    rgba(255, 217, 83, 1) 0%,
    rgba(250, 197, 83, 1) 100%
  );
  box-shadow: 0px -2px 9px 0px rgba(247, 151, 79, 1);
  height: 11vw;
  line-height: 9vw;
}
.bottom-rules {
  height: 15vw;
}
.bottom-rules img {
  width: 12vw;
  height: 12vw;
}
.bottom-rules p {
  margin-left: 15vw;
  margin-top: -13vw;
  line-height: 14vw;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
}
.shose {
  width: 23vw;
  height: 14vw;
  z-index: 29;
  float: right;
  margin-top: -13vw;
}
.flower {
  margin-top: -27vw;
  margin-bottom: 0;
  z-index: 4;
}
.dialog-wechat {
  height: 50vw;
  width: 85vw;
  background: url("https://files.eyee.com/activity/luckycoin/bg_info.png") center
    center no-repeat;
  background-size: 100% 100%;
  text-align: center;
}
.close-btn {
  margin: 10vw 3vw;
  border: 1px solid #999999;
  width: 30vw;
  height: 10vw;
  line-height: 9vw;
  border-radius: 2vw;
  color: #999999;
}
.submit-btn {
  margin: 10vw 3vw;
  width: 30vw;
  height: 10vw;
  line-height: 9vw;
  border-radius: 2vw;
  background-color: #ffd47b;
  color: #ff3b34;
}
.dialog-toFriend {
  height: 81vw;
  width: 80vw;
  background: url("https://files.eyee.com/activity/luckycoin/bg_share.png") center
    center no-repeat;
  background-size: 100% 100%;
  text-align: center;
}
.know-btn {
  width: 55vw;
  color: red;
  background-color: #ffd47b;
  border-radius: 5vw;
  line-height: 10vw;
  margin-top: 5vw;
  text-align: center;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
}
.packet-money {
  margin-top: -10vw;
  width: 100vw;
  height: 35vw;
  background: url("https://files.eyee.com/activity/luckycoin/red envelope2.png")
    no-repeat center center;
  background-size: 32% 100%;
  text-align: center;
}
.packet-money p {
  margin-top: 5vw;
  font-size: 36px;
  font-weight: 600;
  color: #ef3f39;
}
.dialog-rules {
  height: 130vw;
  width: 80vw;
  background: url("https://files.eyee.com/activity/luckycoin/rules_bg.png") center center no-repeat;
  background-size: 100% 100%;
  text-align: center;
}
.rules-text {
  font-size: 14px;
  text-align: left;
  padding: 5vw 3vw;
}
.rules-text p {
  line-height: 6vw;
}
.dialog-login {
  height: 80vw;
  width: 80vw;
  background: url("https://files.eyee.com/activity/luckycoin/bg_phone.png") center center no-repeat;
  background-size: 100% 100%;
  text-align: center;
}
.login-input input {
  padding: 3px 5px;
  outline: none;
  border: 0;
  list-style: none;
  background: none;
  border-bottom: 1px #000;
  border-style: solid;
}
.login-code {
  width: 24vw;
  margin-left: 4vw;
  float: right;
  border: 1px solid #000;
  line-height: 7vw;
  border-radius: 4vw;
  font-size: 12px;
}
.t {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
}
.time {
  background-color: #000;
  color: #fff;
}
.timesplitor {
  color: #000;
  font-weight: bold;
}
.registerBindMobile {
  background: url("https://files.eyee.com/activity/luckycoin/bg_phone.png");
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 300px;
}
.bgRegister {
  background-color: #000;
  opacity: 0.3;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.Success-money {
  height: 78vw;
  background: url("https://files.eyee.com/activity/luckycoin/bg_success.png");
  background-size: 100% 100%;
}
.success-text {
  margin-top: 2vw;
  font-size: 20px;
  color: red;
  line-height: 8vw;
  width: 100vw;
}
.success-text span {
  color: #000;
  font-size: 17px;
}
.joinSuccess {
  height: 100vw;
  background: url("https://files.eyee.com/activity/luckycoin/bg_money.png");
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}
.dialog .confirm-content {
  width: 85vw;
  /* height: 46.6667vw; */
  border-radius: 2.1333vw;
  padding: 5.3333vw 3.2vw 3.2vw;
}
.confirm-name {
  width: 100%;
  text-align: center;
  font-size: 4.2667vw;
  line-height: 5.8667vw;
  font-weight: 500;
}
.confirm-info {
  width: 100%;
  text-align: center;
  line-height: 5.3333vw;
  margin: 7.2vw 0 9.6vw;
  font-size: 3.7333vw;
}
.confirm-btn {
  width: 48%;
  height: 10.1333vw;
  text-align: center;
  font-size: 4.2667vw;
  border-radius: 5.0667vw;
  line-height: 10.1333vw;
}
.confirm-close {
  border: 1px solid #707afc;
  color: #707afc;
}
.confirm-sure {
  color: #fff;
  background-color: #707afc;
}
.close {
  background: url("https://files.eyee.com/activity/luckycoin/close.png");
  background-size: 100% 100%;
  height: 10vw;
  width: 10vw;
  margin-top: 10vw;
}
</style>

