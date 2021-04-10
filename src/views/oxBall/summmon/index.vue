<template>
    <div class="summon-new">
        <div class="tab-summmon flex-center">
            <div v-for="(item,index) in tabList" :key="item.title" :class=" index == currTab ?'selected':''" @click="changeTab(index)">{{item.title}}</div>
        </div>
        <mt-loadmore
            top-pull-text="下拉刷新"
            top-drop-text="释放加载"
            top-loading-text
            :top-distance="50"
            :top-method="pageload"
            ref="loadmore"
        >
            <div :class="currTab == 0 ?'tab_newerpage' :'tab_olderpage'">
                <div class="checkball_box">
                    <div class="button-ball">
                        <span class="animation " @click="gotoOxMall">查看牛丸奖励</span>
                        <img v-if="newInfos.exchangecash && currTab == 0" src="/static/imgs/ball/red_cash.png?c=1" alt="">
                        <img v-if="oldInfos.exchangecash && currTab == 1" src="/static/imgs/ball/blue_cash.png?c=1" alt="">
                    </div>
                    <div class="tiger-list">
                        <div class="tiger_box" :class="{'no-prise': currTab == 0 && newInfos.rounds && newInfos.round==6}">
                            <div>你已邀请:<span class="font-price">{{currTab == 0? newInfos.invited : oldInfos.awoken}}</span>位{{currTab == 0? '新用户':'老友'}}</div>
                            <div v-if="currTab == 0 && newInfos.rounds && newInfos.round<6">当前邀请奖励：{{newInfos.round > 0 ? newInfos.rounds[newInfos.round-1].unitamount : newInfos.rounds[0].unitamount}}牛丸/位</div>
                        </div>
                        <div class="redpaceket_rules">
                            <div class="redpacket-box">
                                <div class="list_detl flex-aic">
                                    <span class="invite_butn" @click="gotoList">邀请列表</span>
                                    <span>有{{currTab == 0 ? newInfos.requirelogin : oldInfos.requirelogin}}位用户等你提醒登录</span>
                                </div>
                                <ul class="redpacekt-list flex-center flex-wrap">
                                    <li class="flex-col flex-center" v-for="(item,index) in (currTab == 0?newInfos.rounds : oldInfos.extras)" :key="index" :class="{'arrow_yellow':index == 0 || index == 1 || index == 3}">
                                        <img v-if="currTab == 0 && newInfos.round<6 && (newInfos.round >0 ? index == newInfos.round-1 : index == 0)" class="curr_interval" src="/static/imgs/ball/curr_Interval.png?c=1" alt="">
                                        <div class="packet_img" :class="((index < newInfos.round && currTab == 0) || (currTab == 1 && item.status == 2))?'red_open':''">{{item.unitamount}}<br>牛丸{{currTab == 0 ?'/位':''}}</div>
                                        <div v-if="currTab == 0" class="list_name">邀第{{item.min}}-{{item.max}}位</div>
                                        <div v-if="currTab == 1" class="list_name grey-b flex-center">邀{{item.count}}位额外奖励</div>
                                        <div v-if="currTab == 1" class="grey-butn" :class="{'red-butn':item.status == 1, 'black-butn':item.status == 0}" @click="getExtra(item)">{{item.status | oldStatusText}}</div>
                                        <img v-if="index == 0 || index == 1 || index == 3" class="arrow_img" src="/static/imgs/ball/yellow_shape.png?c=1" alt="">
                                    </li>
                                </ul>
                                <div class="red_rules flex-center" @click="closeToast(1)">
                                    <span>活动规则</span>
                                    <img :src="currTab == 1 ?'/static/imgs/ball/purple_arrow.png?c=1':'/static/imgs/ball/yellow-arrow.png?c=1'" alt="">
                                </div>
                                <div class="get_oxball flex-center">
                                    你已通过{{currTab == 0 ?'邀新':'唤醒老友'}}累计获得牛丸:<span class="font-price">{{currTab == 0 ? newInfos.invitedamount : oldInfos.awokenamount}}</span>牛丸
                                </div>
                            </div>
                            <div class="rules_box">
                                <div class="text_tips">
                                    <div class="words_para">{{currTab == 0? '1.邀请你身边的人成功率更高。' : '分享到你现在或曾经的球鞋交流群、潮流信息交流群成功率更高！'}}</div>
                                    <div class="words_para" v-if="currTab == 0">2.分享到微信群、QQ群成功率更高。 </div>
                                    <img :src="currTab == 0 ? '/static/imgs/ball/red_share.png?c=1' : '/static/imgs/ball/blue_share.png?c=1'" alt="">
                                    <div class="describ_word">
                                        <span>{{currTab == 0 ? '好友的登录账号必须是未注册斗牛APP的手机号，好友注册后的7天内累计登录APP并活跃3天，你就能获得全部牛丸奖励。' : '老友的登录账号必须是已经注册过斗牛app的手机号，且近30天内未登录过斗牛APP。唤醒后的7天内累计登录APP并活跃3天，你就能获得全部牛丸奖励。'}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </mt-loadmore>
        <div class="share_butns flex-around">
            <div class="flex-center flex-col">
                <img src="/static/imgs/ball/wechat.png?c=1" alt="" @click="setShare(2)">
                <div>分享到微信</div>
            </div>
            <div class="flex-center flex-col">
                <img src="/static/imgs/ball/friend_circle.png?c=1" alt="" @click="setShare(1)">
                <div>分享到朋友圈</div>
            </div>
            <div class="flex-center flex-col">
                <img src="/static/imgs/ball/qq.png?c=1" alt="" @click="setShare(3)">
                <div>分享到QQ</div>
            </div>
        </div>
        <div class="rules_toast flex_center" :class="showToast?'show_toast':''">
            <div class="layer_opacity"></div>
            <div class="main_rules">
                <div class="title_rules">邀请{{currTab == 0?'新人':'老友'}}规则
                    <span class="close_butn" @click="closeToast(0)"></span>
                </div>
                <div class="detl_rule">
                    <div v-for="(item,index) in RuleList" :class="{'paragh_rules':item.para,'paragh_img':item.title}" :key="index">
                        {{item.para}}{{item.title}}
                        <img v-if="item.img" :src="item.img" alt=""/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { BallSommmonNew, BallSommmonOld, BallExtraAwake }  from "@/utils/api/oxball";
var loader;
export default {
    data() {
        return {
            currTab:0,
            tabList:[
                {title:'邀请新人'},{title:'唤醒老友'}
            ],
            RuleList:[],
            newerRules:[
                {para:'1、邀请新人越多，单次邀请奖励越高'},
                {para:'2、每邀请一位新人，奖励分三次发放。被邀请人每天完成任意3个牛丸每日任务的活跃要求，你就能获得奖励！邀请后7天内活跃3天，你就能获得全部奖励！（注册后超过7天再活跃，未发放的奖励不再发放）'},
                {title:'邀请1-3位奖励488牛丸时：',img:'/static/imgs/ball/redrule_01.png?c=1'},
                {title:'邀请4-20位奖励588牛丸时：',img:'/static/imgs/ball/redrule_02.png?c=1'},
                {title:'邀请21-40位奖励688牛丸时：',img:'/static/imgs/ball/redrule_03.png?c=1'},
                {title:'邀请41-85位奖励988牛丸时：',img:'/static/imgs/ball/redrule_04.png?c=1'},
                {para:'3、邀请的新用户需为未注册斗牛APP的用户，已被邀请的用户不能重复邀请。'},
                {para:'4、活动最终解释权归斗牛APP所有，对于活动中存在的非正常邀请行为，斗牛APP有权扣除相应奖励。'},
            ],
            olderRules:[
                {para:'1、唤醒近1个月以上，3个月以下未登录的老用户，奖励300牛丸。唤醒近3个月以上未登录的老用户，奖励588牛丸。'},
                {para:'2、每唤醒一位老友，奖励分三次发放。被邀请人每天完成任意3个牛丸每日任务的活跃要求，你就能获得奖励！邀请后7天内活跃3天，你就能获得全部奖励！（唤醒以后超过7天再活跃，未发放的奖励不再发放）'},
                {title:'邀请1位奖励488牛丸时：',img:'/static/imgs/ball/bluerule_01.png?c=1'},
                {title:'邀请3位奖励588牛丸时：',img:'/static/imgs/ball/bluerule_02.png?c=1'},
                {para:'3、唤醒老友活动需邀请已注册斗牛APP但长时间未登录的用户，已被邀请的用户不能重复邀请。'},
                {para:'4、活动最终解释权归斗牛APP所有，对于活动中存在的非正常邀请行为，斗牛APP有权扣除相应奖励。'},
            ],
            showToast:false,
            appShare: {},
            newInfos:{},
            oldInfos:{}
        }
    },
    filters:{
        oldStatusText(val){
            switch(val){
                case 0 :
                    return '待领取'
                    break
                case 1 :
                    return '领取'
                    break
                case 2 :
                    return '已领取'
                    break
            }
        }
    },
    computed: {
        ...mapGetters({
        user: "userInfo"
        }),
        uid() {
            return !!(this.user && this.user.uid);
        }
    },
    mounted(){
        let _ = this;
        _.RuleList = _.newerRules
        setTimeout(() => {
            if (_.$root.loging) {
                _.$root.loging.then($ => {
                    _.getInfos();
                }).catch(e => {
                    console.error(e);
                });
            } else {
                _.checkLogin(() => {
                    _.getInfos();
                });
            }
        }, 300);

        // 登录回调
        window._appLoginCallback = function(json) {
        if (json) {
            _.getQueryParamUser(json).then(res => {
            _.getInfos();
            });
        } else _.toast("登录失败~");
        };
        
        if (!_.$root.ISAPP) {
            _.confirm({
                msg: "请在【斗牛DoNew】APP内操作?",
                okText: "立即前往",
                cancelBtn: 1,
                ok: () => {
                _.openAppClient();
                setTimeout(() => {
                    _.$router.replace("/loadapp");
                }, 800);
                }
            });
        }
    },
    methods:{
        getExtra(item){
            if(item.status == 1){
                BallExtraAwake({number:item.extra}).then(res=>{
                    this.toast('领取成功');
                    this.getInfos()
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        checkLogin(call) {
            let _ = this;
            if (_.uid) call();
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
        getInfos(){
            if(this.currTab == 0){
                BallSommmonNew().then(res=>{
                    console.log(res)
                    this.newInfos = res
                }).catch(err =>{
                    console.log(err)
                })
            }else{
                BallSommmonOld().then(res=>{
                    console.log(res)
                    this.oldInfos = res
                }).catch(err =>{
                    console.log(err)
                })
            }
        },
        pageload(event) {
            console.log('pull load')
            this.$refs.loadmore.onTopLoaded();
            this.getInfos();
        },
        changeTab(index){
            console.log(index)
            this.currTab = index
            this.RuleList = index == 0 ? this.newerRules :this.olderRules
            this.getInfos()
        },
        closeToast(type){
            console.log(type)
            if(type == 1)
                document.getElementsByTagName("body")[0].className = "lock";
            else
                document.body.removeAttribute("class", "lock");
            this.showToast = type == 1 ?true:false
        },
        gotoList(){
            this.$router.push('/ball/list?type='+(this.currTab+1))
        },
        gotoOxMall(){
            this.$router.push('/oxballdetail/market')
        },
        setShare(type){
            /** type : 1)分享到微信   2）分享到朋友圈 3）分享到qq */
            let _ = this,shareInfo = _.newInfos.share || _.oldInfos.share
            if (_.$root.ISAPP ) {
                if(type == 1 || type ==2){
                    loader = _.$loader("正在调起微信分享···");
                    setTimeout(() => {
                        loader.close();
                    }, 3000);
                }
                _.javascriptBridge({
                    name: "callAppDirectlyShare",
                    params: {
                        shareurl: shareInfo.url,
                        sharetitle: shareInfo.title,
                        sharecontent: shareInfo.content,
                        sharepicurl: shareInfo.icon,
                        type: 2,
                        platform: type
                    }
                });
            } else _.toast("请在斗牛APP中参与活动~");
        }
    }
}
</script>
<style >
    .mint-loadmore-top{
        background-color: transparent;
    }
</style>
<style scoped>
    .summon-new{
        position: relative;
        font-size: 14px;
        color: #fff;
        padding-bottom: 20.27vw;
    }

    .mint-loadmore{
        background: transparent;
         color: #333 !important;
    }
    .rules_toast{
        position: fixed;
        left: 0;
        top: -100%;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #010724;
        transition: top 2s;
        z-index: 29;
    }
    .layer_opacity{
        position: fixed;
        left: 0;
        top:-100%;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
        z-index: 9;
    }
    .rules_toast.show_toast{
        top:0;
        transition: top .1s;
    }
    .rules_toast.show_toast .layer_opacity{
        top:0;
    }
    .rules_toast .main_rules{
        position: absolute;
        background-color: #fff;
        border-radius: 1.6vw;
        width: 92vw;
        left: 50%;
        margin-left: -46vw;
        height: 140vw;
        top:-100%;
        margin-top: -70vw;
        text-align: center;
        padding: 4vw 4vw 0;
        transition: all 1s;
        z-index: 10;
    }
    .rules_toast.show_toast .main_rules{
        top: 50%;
    }
    .main_rules .title_rules{
        position: relative;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4vw;
    }
    .main_rules .detl_rule{
        height: 122vw;
        overflow-y: auto;
    }
    .close_butn {
        position: absolute;
        right: 1vw;
        top: 2vw;
        /* right: 7vw;
        top: 26.33vw; */
        display: inline-block;
        width: 5.33vw;
        height: 0.533vw;
        background: #838383;
        line-height: 0;
        font-size: 0;
        vertical-align: middle;
        transform: rotate(45deg);
        z-index: 12;
        transition: all 3s;
    }
    .close_butn:after {
        content: "/";
        display: block;
        width: 20px;
        height: 2px;
        background: #838383;
        transform: rotate(-90deg);
        transition: all 3s;
    }
    .main_rules .paragh_rules{
        margin-bottom: 5.33vw;
        line-height: 5.33vw;
        text-align: left;
    }
    .main_rules .paragh_img{
        text-align: left;
        font-weight: 600;
    }
    .main_rules .paragh_img >img{
        display: block;
        margin: 2.67vw auto 5.33vw;
    }
    .tab-summmon{
        position: fixed;
        width: 100%;
        z-index: 9;
    }
    .tab-summmon > div{
        display: inline-block;
        width: 50%;
        height: 13.33vw ;
        line-height: 13.33vw;
        text-align: center;
        font-size: 15px;
    }
    .tab-summmon > div:first-child{
       background-color: #F7624A;
    }
    .tab-summmon > div:last-child{
        background-color: #0E2DE9;
    }
    .tab-summmon > div.selected{
        font-weight: 600;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100%;
    }
    .tab-summmon > div:first-child.selected{
        background-image: url('/static/imgs/ball/sommmon_tab01.png?c=1');
    }
    .tab-summmon > div:last-child.selected{
        background-image: url('/static/imgs/ball/sommmon_tab02.png?c=1');
    }
    .tab_newerpage{
        background-color: #fa3a1f ;
        background-image: linear-gradient(#ed3923, #fa3a1f);
        margin-top: 13.33vw ;
        padding-bottom: 8vw;
    }
    .tab_olderpage{
        background-color: #050D3E ;
        background-image: linear-gradient(#050D3E, #050D3E);
        margin-top: 13.33vw ;
        padding-bottom: 8vw;
    }
    .tab_newerpage .checkball_box,.tab_olderpage .checkball_box{
        padding-top: 56.27vw;
        text-align: center;
        background-repeat: no-repeat;
        background-position: top center;
        background-size: 100%;
    }
    .tab_newerpage .checkball_box{
        background-image: url('/static/imgs/ball/red_top.jpg');
    }
    .tab_olderpage .checkball_box{
        background-image: url('/static/imgs/ball/blue_top.jpg');
    }
    .button-ball {
        position: relative;
        width: 26.67vw;
        height: 8.53vw;
        margin: 0 auto;
        font-weight: 600;
        line-height: 8.53vw;
    }
    .button-ball >span{
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 8.53vw;
        background: url('/static/imgs/ball/red_button.png?c=1') no-repeat center;
        background-size: 100%; 
        animation: big-to-small 0.5s linear infinite alternate;
    }
    @keyframes big-to-small {
        0% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
        }
    }
    .button-ball >img{
        position: absolute;
        width:15.2vw;
        top: -6.4vw;
        right: -16.53vw;
    }
    .tab_newerpage .tiger-list,.tab_olderpage .tiger-list{
        background-repeat: no-repeat,no-repeat;
        background-position:left 6vw, right 16vw; 
        background-size: 36.4%, 22.27%;
    }
    .tab_newerpage .tiger-list{
        background-image: url('/static/imgs/ball/clound_01.png?c=1'),url('/static/imgs/ball/clound_02.png?c=1');
    }
    .tab_olderpage .tiger-list{
        background-image: url('/static/imgs/ball/clound_05.png?c=1'),url('/static/imgs/ball/clound_06.png?c=1');
    }
    .tab_newerpage .tiger_box,.tab_olderpage .tiger_box{
        margin: 8vw auto 0;
        width: 85.73vw;
        height: 26.4vw;
        text-align: center;
        background-repeat: no-repeat;
        background-position: top center;
        background-size: 100%; 
        font-size: 13px;
    }
    .tab_newerpage .tiger_box{
        background-image: url('/static/imgs/ball/red_tigerbox.png?c=1');
        color: #240202;
        padding: 4.02vw 0 0;
    }
    .tab_newerpage .tiger_box.no-prise{
        padding: 8.02vw 0 0;
    }
    .tab_olderpage .tiger_box{
        background-image: url('/static/imgs/ball/blue_tigerbox.png?c=1');
        color: #fff;
        padding: 8.02vw 0 0;
    }
    .tiger_box >div{
        line-height: 4.8vw; 
        margin-top: 2.67vw;
    }
    .tiger_box >div:first-child{
        font-size: 15px;
        font-weight: 600;
        line-height: 6.13vw;
    }
    .tiger_box >div span{
        color: #ED3E23;
        display: inline-block;
        margin: 0 1.35vw;
    }
    .tab_newerpage .redpaceket_rules,.tab_olderpage .redpaceket_rules{
        position: relative;
        background-repeat: no-repeat,no-repeat;
        background-size: 94.4%, 24.4%, 28.27%;
    }
    .tab_newerpage .redpaceket_rules{
        background-image: url('/static/imgs/ball/red_quote.png?c=1'), url('/static/imgs/ball/clound_03.png?c=1'),url('/static/imgs/ball/clound_04.png?c=1');
        background-position: 2.933vw 128vw, left 156.53vw, right 166.07vw; 
    }
    .tab_olderpage .redpaceket_rules{
        background-image: url('/static/imgs/ball/blue_quote.png?c=1'), url('/static/imgs/ball/clound_07.png?c=1'),url('/static/imgs/ball/clound_08.png?c=1');
        background-position: 2.933vw 140vw, left 156.53vw, right 173.07vw; 
    }
    .tab_newerpage .redpacket-box,.tab_olderpage .redpacket-box{
        text-align: center;
        width: 88.93vw;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-repeat: no-repeat;
        background-position: top center;
        background-size: 100%; 
        padding-bottom: 2.67vw;
    }
    .tab_newerpage .redpacket-box{
        background-image: url('/static/imgs/ball/red_box02.png?c=1');
        color: #010724;
    }
    .tab_olderpage .redpacket-box{
        background-image: url('/static/imgs/ball/blue_box02.png?c=1');
        color: #fff;
    }
    .redpacket-box .list_detl{
        width: 60vw;
        padding: 0 2.67vw;
        margin: 0 auto;
        height: 15.67vw;
        line-height: 15.67vw;
        font-size:12px;
        color: #fff;
    }
    .redpacket-box .list_detl .invite_butn{
        display: inline-block;
        width: 14.67vw;
        height: 7.47vw;
        line-height: 7.47vw;
        font-weight: 600;
        background: url('/static/imgs/ball/small_butn.png?c=1') no-repeat center;
        background-size: 100%;
        margin-right: 3px;
    }
    .tab_newerpage .redpacekt-list{
        padding-top: 20vw;
        color: #010724FF;
    }
    .tab_olderpage .redpacekt-list{
        padding-top: 13vw;
        color: #fFF;
    }
    .redpacekt-list li{
        position: relative;
        text-align: center;
        padding-bottom: 8vw;
    }
    .redpacekt-list li.arrow_yellow{
        position: relative;
        margin-right:12.8vw;
    }
    .redpacekt-list li img.curr_interval{
        position: absolute;
        display: block;
        width: 69px;
        height: 22px;
        top:-30px;
    }
    .redpacekt-list li >div.packet_img{
        width: 15.73vw;
        height: 23.2vw;
        padding-top: 14vw;
        color: #FFC1C8FF;
        line-height: 3.73vw;
        font-size: 12px;
        background-image: url('/static/imgs/ball/redpacket_close.png?c=1');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    .redpacekt-list li >div.red_open{
        padding-top: 2vw;
        color: #030305;
        font-weight: 600;
        background-image: url('/static/imgs/ball/redpacket_open.png?c=1');
    }
    .redpacekt-list li .list_name{
        margin-top: 8px;
        line-height: 4.53vw;
        font-size: 12px;
        white-space: nowrap;
        text-align: center;
    }
    .redpacekt-list li .list_name.grey-b{
        width: 16.8vw;
    }
    .redpacekt-list li .grey-butn,.redpacekt-list li .red-butn,.redpacekt-list li .black-butn{
        width:14.67vw;
        height: 7.47vw;
        line-height: 7vw;
        font-size: 12px;
        margin-top: 2.67vw;
        text-align: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    .redpacekt-list li .grey-butn{
        background-image: url('/static/imgs/ball/grey_button.png?c=1');
    }
    .redpacekt-list li .red-butn{
        background-image: url('/static/imgs/ball/small_butn.png?c=1');
    }
    .redpacekt-list li .black-butn{
        background-image: url('/static/imgs/ball/black_button.png?c=1');
    }
    /* .redpacekt-list li.arrow_img{
        padding: 0 4.8vw 0 5.6vw;
    } */
    .redpacekt-list li img.arrow_img{
        position: absolute;
        display: block;
        width: 2.4vw;
        right: -7.97vw;
        top: 11.8vw
    }
    .tab_olderpage .redpacekt-list li.arrow_img>img{
        margin-bottom: 22vw;
    }
    .redpacket-box .red_rules{
        padding: 0 0 5.27vw;
    }
    .redpacket-box .red_rules span{
        font-weight: 600;
        font-size: 14px;
    }
    .redpacket-box .red_rules img{
        width: 2.93vw;
        margin-left: 5px;
    }
    .tab_olderpage .redpacket-box .get_oxball,.tab_newerpage .redpacket-box .get_oxball{
        height: 13.87vw;
        font-size: 14px;
        margin:0 2.67vw;
        color: #fff;
        border-bottom-left-radius: 2.4vw;
        border-bottom-right-radius: 2.4vw;
    }
    .tab_newerpage .redpacket-box .get_oxball,.tab_newerpage .describ_word{
        background-color: #F66316;
    }
    .tab_olderpage .redpacket-box .get_oxball,.tab_olderpage .describ_word{
        background-color: #190C90;
    }
    .redpacket-box .get_oxball span{
        display: inline-block;
        margin: 0 1.4vw;
        font-size: 20px;
    }
    .tab_olderpage .redpacket-box .get_oxball span{
        color: #ED3E23;
    }
    /* .tab_newerpage .rules_box,.tab_olderpage .rules_box{
        background-repeat: no-repeat;
        background-size: 94.4%;
        background-position: 2.67vw 127.47vw;
    }
    .tab_newerpage .rules_box{
        background-image: url('/static/imgs/ball/red_quote.png?c=1');
        background-image: url('/static/imgs/ball/clound_03.png?c=1'),url('/static/imgs/ball/clound_04.png?c=1');
    }
    .tab_olderpage .rules_box{
        background-image: url('/static/imgs/ball/blue_quote.png?c=1');
        background-position: 2.93vw 140.8vw;
        background-image: url('/static/imgs/ball/clound_07.png?c=1'),url('/static/imgs/ball/clound_08.png?c=1');
    } */
    .tab_newerpage .text_tips,.tab_olderpage .text_tips{
        width: 88.93vw;
        font-size: 14px;
        text-align: left;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    .tab_newerpage .text_tips{
        background-image: url('/static/imgs/ball/red_box01.png?c=1'); 
        color: #010724;
        padding: 13vw 0 7vw;
        margin: 9.33vw auto 0;
        height: 85.33vw;
    }
    .tab_olderpage .text_tips{
        text-align: center;
        background-image: url('/static/imgs/ball/blue_box01.png?c=1'); 
        color: #fff;
        padding: 3.2vw 0 7vw;
        margin: 9.33vw auto 0;
        height: 85.07vw;
    }
    .tab_newerpage .words_para,.tab_olderpage .words_para{
        margin-top: 2.67vw;
        line-height: 5.33vw;
        padding:0 8vw;
    }
    .tab_olderpage .text_tips >div.words_para:first-child{
        margin-top: 14.83vw;
    }
    .text_tips >img{
        display: block;
        margin: 8vw auto 8vw;
        width: 79.4667vw;
    }
    .tab_newerpage .describ_word,.tab_olderpage .describ_word {
        height: 16.27vw;
        margin:0 2.67vw;
        padding: 2.93vw 0;
        color: #fff;
        border-bottom-left-radius: 2.4vw;
        border-bottom-right-radius: 2.4vw;
    }
    .describ_word span{
        display: block;
        margin-left: -2.67vw;
        width: 88.93vw;
        font-size: 10px;
        transform: scale(0.83);
    }
    .share_butns{
        position: fixed;
        bottom: 0;
        padding: 0 8vw;
        width: 100vw;
        height: 21.33vw;
        background-color: #fff;
        color: #010724;
        font-size: 10px;
        z-index: 9;
    }
    .share_butns img{
        display: block;
        margin-bottom: 2px;
        width: 11.73vw;
    }
</style>