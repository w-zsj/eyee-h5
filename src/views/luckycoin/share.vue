<template>
  <div class="body">
    <div class="activitybg flex-center" v-if="activityDetailInfo&&activityStatus!=-1">
        <div class="record flex-center">
          <img class="lantern" src="//files.eyee.com/activity/luckycoin/lantern.png">
          <img class="activitydetailuplogo" src="//files.eyee.com/activity/luckycoin/roof.png">
          <img class="record-rules"  @click="getRule" src="//files.eyee.com/activity/luckycoin/rules.png">

        <div style="left:0;top:0">
          <div class="activity-top">
            <div class="activityUpFlower"></div>
            <div class="activityBgPink" style="text-align:center">
              <div style="text-align:center;">
          <img class="peopleheadurl" :src="activityDetailInfo.leader.headurl">

              </div>
              <div>
                <img style="width:20vw;margin-left:5vw" src="//files.eyee.com/activity/luckycoin/red envelope1.png">
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
                    <div style="font-size:8px; width:100%" v-if="activityStatus==2||activityStatus==3||activityStatus==5">
                        （请前往APP领取新的分享红包）
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
                    <img v-bind:src="member.headurl" style="border-radius:50%;width:10vw;height:10vw">
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
        <!--注册-->
        <div v-show="registerDisplay" class="flex-col flex-center dialog" @touchmove.prevent>
          <div class="confirm-content dialog-login">
            <div style="margin-top:20vw;text-align:center;flex-wrap:wrap" class="flex-center">
              <div class="login-input" style="height:12vw;">
                手机号：
                <input type="text" v-model="loginParms.mobile"/>
              </div>
              <div class="login-input" style="height:12vw;">
                验证码：
                <input style="width:20vw;" type="text"  v-model="loginParms.validCode">
                <div class="login-code"  @click.stop="getValiCode">{{loginParms.validDesc}}</div>
              </div>
              <div class="know-btn" style="margin-top:3vw;" @click="loginRegist">立刻瓜分现金红包</div>
            </div>
          </div>
          <div class="close" @click="registerDisplay=false"></div>
        </div>

        <!--瓜分成功-->
          <div v-show="successJoin" class="flex-col flex-center dialog" @touchmove.prevent>
          <div class="confirm-content Success-money">
            <div style="margin-top:20vw;text-align:center;flex-wrap:wrap" class="flex-center">
              <p class="success-text">
                ￥{{successJoinMoney}}
                <span>现金红包</span>
              </p>
              <p class="success-text">
                ￥188
                <span>新人大礼包</span>
              </p>
              <div class="know-btn" @click="getMoneySuccess()">请前往斗牛App领取</div>
            </div>
          </div>
          <div class="close" @click="successJoin=false"></div>
        </div>
         <!--跳转到app-->
        <div v-show="isConfirm" class="flex-center dialog" @touchmove.prevent>
          <div class="confirm-content goapp-dialog">
            <div style="line-height:8vw">即将离开微信</div>
            <div  style="line-height:8vw">打开"APP Store"</div>
            <div class="flex-between">
              <div class="noallow" @click="isConfirm=false">取消</div>
              <div class="allow" @click="toApp()">允许</div>
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
//var vConsole = new VConsole();
import { weixinApp } from "../../common/api/oauthAPI"
import { WXRegisterAuth } from '../../common/api/user'
import { mapGetters } from "vuex";
import { AntiBrush } from "../../common/anti-brush";
import * as api from "../../common/api/user";
import {
  MillionRedLotteryActivityStatus,
  MillionRedLotteryJoin,
  MillionRedLotteryActivityDetail,
  MillionRedLotteryDraw,
  MillionAuth,
  MillionRegActivity
} from "@/utils/api/activities";
import { MD5, Checking } from "../../common/util";
import { DateDiff } from "../../common/util";

export default {
  components: {

  },
  data() {
    return {
      activityStatusInfo:null,
      activityDetailInfo: null,
      activityStatus:-1,
      activityBtnDesc:'',
      activityBtnDetailDesc:'',
      countDown:"<span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span>",
      timeRun: null,
      isOlderUser:true,
      registerDisplay:false,
      isLeader:false,
      loginParms:{
        mobile:'',
        validCode:'',
        validDesc:'获取验证码'
      },
      validTimeRun:null,
      successJoin:false,
      successJoinMoney:0,
      isConfirm:false,
      authinfo:{},
      userId:'',
      activityid:'',
      ruleShow:false,
    };
  },
  mounted() {
    let _ = this
    console.log('地址栏携带参数',_.$route.query)
    _.curuserid = _.$route.query.userid
    _.curactivityid = _.$route.query.activityid
    if (window.location.href.indexOf('code') > 0) {
      var weixincode = window.location.href.split('code=')[1].split('&state')[0]
      WXRegisterAuth({
        WXCode: weixincode
      }).then((res) => {
        console.log('WXRegisterAuth微信授权之后获取到的res====>',res)
        if(res&&res.unionid){
          _.getWxAuth(res)
          _.authinfo=res;
        }
      }).catch((err) => {
        console.log('WXRegisterAuth微信授权解析失败err====>',err)
      })
    }else{
      console.log(window)
      // var doPath = window.location.origin + window.location.pathname + window.location.search;
      var doPath = window.location.href;
      // var doPath = 'https://qzone.eyee.com' + window.location.pathname;
      var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      // if (window.confirm("跳转的链接：" + link))
      window.location = link;
      return
    }
  },
  watch:{
    /**活动状态 */
    activityStatus:function(newValue, oldValue){
      let _ = this;
      if(_.activityStatus==1){
        _.activityBtnDesc="瓜分现金红包";
      }else if(_.activityStatus==2){
        _.activityBtnDesc="该红包已瓜分完毕";//
      }else if(_.activityStatus==3){
        _.activityBtnDesc="该红包已超时";//
      }else if(_.activityStatus==4){
        _.activityBtnDesc="你已经瓜分过红包了哦";
      }else if(_.activityStatus==5){
        _.activityBtnDesc="仅限新用户参与瓜分";//
      }else if(_.activityStatus==6){
        _.activityBtnDesc="你已成功瓜分，前往APP领取";//
      }


     // if((_.activityStatus==1&&_.isLeader)||_.activityStatus==2||_.activityStatus==3||_.activityStatus==5||_.activityStatus==6)
    },
  },
  computed:{
    ...mapGetters({  userinfo: "userInfo" }),

  },
  methods: {
    toApp(){
      let _ = this
        _.isConfirm = false
        _.successJoin=false;
        _.openAppClient()
    },
    //微信授权
    getWxAuth(info){
      let _ = this
      // 关联微信用户
      let opts = {
        shareuserid:_.curuserid,
        unionid:info.unionid,
        nickname:info.nickname,
        headimgurl:info.headimgurl,
        openid:info.openid,
        activityid:_.curactivityid
      };

      console.log('关联微信用户入参===>',opts)
      MillionAuth(opts.unionid,opts.openid,opts.nickname,opts.headimgurl,opts.activityid,opts.shareuserid).then( res => {
        console.log('**********微信关联用户成功**********',res.netuserid)
        _.isOlderUser=res.isolduser;
        _.userId=res.netuserid;
        _.activityid=res.activityid;
        _.getActivityDetailInfo(_.curactivityid);
      }).catch( error => {
        console.error('关联微信用户失败 ===>',error);
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
          //成功参团人数
          var successJoinNum=0;
          for(var i=0;i<res.list.length;i++){
            var d=res.list[i];
            if(d.isopen){
              successJoinNum++;
            }
            if(d.isleader){
              //团长
              leader.headurl=d.headurl;
              leader.username=d.username;
              leader.userid=d.userid;
              leader.unionid=d.unionid
            }else{
              //其他成员
              members.push({headurl:d.headurl,username:d.username,money:d.money,isregister:d.isregister,userid:d.userid,unionid:d.unionid});
            }
          }
           _.activityDetailInfo={};
          _.activityDetailInfo.leader=leader;
          _.activityDetailInfo.members=members;
          _.activityDetailInfo.status=res.status;
          _.activityDetailInfo.expiretime=res.expiretime;
          _.selfMoney=self.money;
          if(_.activityid!=activityid)
          {
            _.activityStatus=4;//不可重复参与
          }else{
            if(_.activityDetailInfo.status==1){
              //团超时
              _.activityStatus=3;
              //unionid存在于领取红包的人中，显示6，否则显示2
              /*
              var flag=false;
              if(leader.unionid==_.authinfo.unionid){
                flag=true;
              }else{
                for(var i=0;i<members.length;i++){
                  var d=members[i];
                  if(d.unionid==_.authinfo.unionid){
                    flag=true;
                    break;
                  }
                }
                if(flag){
                  _.activityStatus=flag?6:1;
                }else{
                  if(successJoinNum>=4)//已满
                  {
                    _.activityStatus=2;
                  }else{
                    _.activityStatus=1;
                  }
                }
              }*/
              
            }else{//进行中的团
              if(_.userId){//已登录
                  if(!_.isOlderUser){
                    //是否有中奖记录
                    var flag=false;
                    //未满
                    if(_.activityDetailInfo.leader.userid==_.userId)//团长
                    {
                      _.isLeader=true;
                      flag=true;
                    }else{//非团长
                      
                      for(var i=0;i<_.activityDetailInfo.members.length;i++){
                        var d=_.activityDetailInfo.members[i];
                        if(d.userid==_.userId){
                          flag=true;
                          break;
                        }
                      }
                    }

                    if(flag){
                      if(_.isLeader){
                        _.activityStatus=1;
                      }else{
                          _.activityStatus=6;
                      }
                    }else{
                      if(successJoinNum>=4)//已满
                      {
                        _.activityStatus=2;
                      }else{
                        _.activityStatus=1;
                      }
                    }
                  }else{
                      _.activityStatus=5;//老用户
                  }
              }else{//未登录
                  _.activityStatus=1;
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
    //倒计时
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
      let H =_.decpadleft(ts.H);
      let M =_.decpadleft(ts.m);
      let S =_.decpadleft(ts.s);
      _.countDown ="<span class='t time'>"+H +"</span><span class='t timesplitor'>:</span><span class='t time'>"+ M +"</span><span class='t timesplitor'>:</span><span class='t time'>"+S+"</span>";
      // console.log(ts)
      if (ts.H === 0 && ts.m === 0 && ts.s === 1) {
        _.countDown="<span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span><span class='t timesplitor'>:</span><span class='t time'>00</span>";
        //超时,刷新团详情
        _.getActivityDetailInfo(_.activityStatusInfo.activityid);
        clearTimeout(_.timeRun);
      } else {
        _.timeRun = setTimeout(() => {
          _.countdownTime();
        }, 1000);
      }
    },
    //注册
     loginRegist() {
      let _ = this;
       var mobile="+86-" + _.loginParms.mobile;
      if (!Checking(mobile, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
     
      let sin = MD5(mobile + "3111.2.7.1511");
      let option = {
        code: _.loginParms.validCode,
        mobile: mobile,
        nonceStr: sin
      };
      api
        .postUserRegister(option)
        .then(res => {
         window.localStorage.setItem("currentUser", JSON.stringify(res));
         if(!res.bindweixin){
            api.BindOpen({id:_.authinfo.unionid, registertype: 0})
                .then(res => {
                  //第三方登录
                  if (res) {
                   this.$store.dispatch("setUserInfo", res);
                    if (res.mobile == "" ||res.mobile == null ||res.mobile == undefined) {
                      _.toast("登录失败");
                     // _.registerDisplay=true;
                    } else {
                        _.toast("登录成功");
                        _.userId=_.userinfo.uid;
                        //h5注册
                        var req={unionid:_.authinfo.unionid,activityid:_.curactivityid};
                        console.log("h5注册参数");
                        console.log(req);
                        MillionRegActivity(req).then(res=>{
                            if(res.isopengroup){//true已经参加过,false
                              _.activityStatus=1;
                            }else{
                              _.successJoinMoney=res.msg;
                            }
                            _.successJoin=true;
                            //刷新活动
                            _.getActivityDetailInfo(_.curactivityid);

                        }).catch(err => {
                          // 获取用户信息失败，新用户注册
                          console.error(err);
                          console.log("瓜分红包失败");
                          if(err.code==1511446){
                            _.toast("活动已结束");
                          }else{
                            _.toast("瓜分红包失败");
                          }

                        });
                    }
                  }
                })
                .catch(err => {
                  //绑定用户
                  console.error(err);
                  console.error("绑定失败"+err);
                  if(e.code==1511630){
                    _.toast("绑定失败，已存在");
                  }
                });
              _.registerDisplay=false;
         }else{
            //h5注册
            var req={unionid:_.authinfo.unionid,activityid:_.curactivityid};
            console.log("h5注册参数");
            console.log(req);
            MillionRegActivity(req).then(res=>{
                if(res.isopengroup){//true已经参加过,false
                  _.activityStatus=1;
                }else{
                  _.successJoinMoney=res.msg;
                }
                _.successJoin=false;
                //刷新活动
                _.getActivityDetailInfo(_.curactivityid);

            }).catch(err => {
              // 获取用户信息失败，新用户注册
              console.error(err);
              console.log("瓜分红包失败");
              if(err.code==1511446){
                _.toast("活动已结束");
              }else{
                _.toast("瓜分红包失败");
              }

            });
         }
        })
        .catch(e => {
          console.error(e);
          console.error("注册失败");
        });
    },
    //验证码
    getValiCode() {
      // 验证手机号
      let _ = this;
      if (!Checking(_.loginParms.mobile, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      let option = {
        checktype: 1,
        mobile: "+86-" + _.loginParms.mobile
      };
      AntiBrush(option, res => {
        if (res) {
          api
            .ValidSendCaptcha(res)
            .then(res => {
              // 发送验证码
              if (!res) {
                var timeSecs = 60;
                _.toast("发送成功");
                _.validTimeRun = setInterval(() => {
                  if (timeSecs > 1) {
                    timeSecs--;
                    _.loginParms.validDesc = "已发送" + _.decpadleft(timeSecs) + "s";
                  } else {
                    _.loginParms.validDesc = "再次发送";
                    clearInterval(_.validTimeRun);
                    _.validTimeRun = null;
                  }
                }, 1000);
              }
            })
            .catch(e => {
              if (e && e.code == 1511531) {
                _.toast("验证码发送频繁,请60s之后再试");
              } else if (e && e.code == 1511543) {
                _.toast = "未注册号码";
                // _.toast('未注册号码')
              } else if (e && e.code == 1511544) {
                _.toast = "账号已被注册";
                // _.toast('账号已被注册')
              } else _.toast("验证码发送失败");
            });
        } else {_.toast("验证失败了~");}
      });
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    //瓜分
    drawActivity() {
      let _ = this;
      //(_.activityStatus==1&&_.isLeader)
      console.log(_.activityStatus,_.isLeader);
      if((_.activityStatus==1&&_.isLeader)||_.activityStatus>=2)
      {
        //引导下载app
        _.isConfirm=true;
      }else{
        //未注册
        if(!_.userId){
          _.registerDisplay=true;
        }else{
          //引导下载app
          _.isConfirm=true;
        }
      }
    },
    getRule(){
      var _ = this;
      _.ruleShow=true;
    },
    getMoneySuccess(){
      let _ = this
        _.isConfirm = true
        _.successJoin=false;
        _.openAppClient()
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
  background: url("https://files.eyee.com/activity/luckycoin/bg_pink2.png");
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
  background: url("https://files.eyee.com/activity/luckycoin/bg_pink1.png");
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
  background: url("https://files.eyee.com/activity/luckycoin/bg_phone.png") center
    center no-repeat;
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
.goapp-dialog{
  width: 85vw;
  height: 40vw;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.allow{
  margin-top: 5vw;
  height: 12vw;
  line-height: 12vw;
  border-top: 1px solid #eee;
   border-left: 1px solid #eee;
  width: 50%;
}
.noallow{
    margin-top: 5vw;
  height: 12vw;
  line-height: 12vw;
  border-top: 1px solid #eee;
  width: 50%;
}
</style>
