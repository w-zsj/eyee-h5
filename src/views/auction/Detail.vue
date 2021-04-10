<template>
  <div class="waiting-product" v-if="hasdata==2"></div>
  <div class="auction flex-col" v-else-if="hasdata">
    <div class="ad-box">
      <div class="ad-top">
        <mt-loadmore top-pull-text="下拉刷新" top-drop-text="释放加载" top-loading-text :top-distance="50" :top-method="pageload" ref="loadmore">
          <carousel class="imgs" center-mode :per-page="1" :paginationEnabled="false" :navigate-to="someLocalProperty" @page-change="_pageChange">
            <slide v-for="(img,iIdx) in banner" :key="'img'+iIdx" v-show="img" @slideclick="checkmore(1)">
              <img v-lazy="img" alt />
            </slide>
          </carousel>
          <div class="ad-info">
            <div class="ad-price">
              <p class="refer">参考价<span><em>¥</em>{{info.marketprice||0}}</span></p>
              <p class="curr-price">
                <span class="rmb">¥<em class="price" :style="{fontSize: fontSize + 'vw' }">{{info.currentbid||info.initbid}}</em></span>
                <span class="curr">{{info.currentbid>0?'当前出价':'起拍价'}}</span>
              </p>
            </div>
            <div class="ad-cd">
              <div class="ad-cd-info">
                <p>{{cdTxt}}</p>
                <p class="flex-center ad-cdcell">
                  <span>{{cd.h}}</span>
                  <i> ：</i>
                  <span>{{cd.m}}</span>
                  <i>：</i>
                  <span>{{cd.s}}</span>
                  <i>：</i>
                  <span>{{cd.ms}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="ad-mod">
            <!-- 轮播图spot点 -->
            <div class="carousel_spotWrapper">
              <div class="carousel_spot">
                <div :style="{ width: currentwidth + 'vw' }" class="item act"></div>
              </div>
              <div class="carousel_spot position">
                <div
                  class="itempos"
                  @click="_pageChange(index - 1)"
                  v-for="index in banner.length"
                  :key="'spot' + index"
                ></div>
              </div>
            </div>
            <!-- 标题 -->
            <div class="ad-name">
              <p class="ad-name-left ellipsis-2">
                <img v-if="info.iscooperativeseller" v-lazy="'https://files.eyee.com/mcdn/img/auction/good_title_2.png'" alt />
                【{{info.size}}】{{info.name}}
              </p>
              <div class="ad-name-right" @click="collection">
                <img v-lazy="'https://files.eyee.com/mcdn/img/auction/icon_star_selected.png'" alt v-if="info.iswant" />
                <img v-lazy="'https://files.eyee.com/mcdn/img/auction/icon_star_unselected.png'" alt v-else />
              </div>
            </div>
            <!-- 围观人数 -->
            <div class="ad-bid">
              <div class="ad-bid-head">
                <span class="bid-head-left">围观人数&nbsp;{{info.onlookers||0}}</span>
                <div class="bid-head-right" @click="handle('callShare')">
                  <i v-if="redpacket>0&&info.status==2">获得 ¥{{redpacket}}</i>
                  <i>{{redpacket>0&&info.status==2?'竞拍成功可抵扣':'分享领红包'}}</i>
                  <img v-lazy="'https://files.eyee.com/mcdn/img/auction/red_envelopes_small.png'" :class="{'move':!redpacket&&info.status==2}" alt />
                </div>
              </div>
              <div class="ad-records" v-if="records.length>0">
                <div class="ad-tr" v-for="(ri, rIdx) in records" :key="'rc'+rIdx" :class="{act:(ri.status==1||ri.status==3)}">
                  <div class="flex-aic">{{ri.nickname}}</div>
                  <div>{{ri.bidtime}}</div>
                  <div>¥{{ri.bid}}</div>
                  <div>
                    <span class="ad-rcs" :class="(ri.status==1||ri.status==3)?'first':'out'">{{ri.status==3?'成交':ri.status==1?'领先':'出局'}}</span>
                  </div>
                </div>
                <p class="ad-rcm" v-if="records.length>1" @click="handle('callRecords')">
                  <span>更多出价记录</span>
                  <i class="more-arrow"></i>
                </p>
              </div>
              <div class="ad-empty" v-else>
                <img v-lazy="'https://files.eyee.com/mcdn/img/auction/bid_empty.png'" alt />
                <p>第一个出价成功率更高哦～</p>
              </div>
            </div>
            <!-- 申请合作卖家 -->
            <div class="adm-prod" @click.stop="gotoDetail(moreInfo.productid)" v-if="moreInfo&&moreInfo.imgurl">
              <div class="adm-img" :style="`background-image:url(${moreInfo.imgurl})`"></div>
              <div class="adm-info">
                <p class="info1 ellipsis-2">{{moreInfo.name}}</p>
                <p class="info2 ellipsis">货号：{{moreInfo.sku}}</p>
              </div>
              <i class="more-arrow"></i>
            </div>
            <div class="ad-more">
              <p>
                <span>
                  <span>规格：</span>
                  <span>{{info.size}}码</span>
                </span>
                <span class="quality flex-center" @click.stop="cooperative(moreInfo.condition)">
                  <span>价格幅度：</span>
                  <span>{{info.priceincrease}} 元/次</span>
                </span>
              </p>
              <p>
                <span class="flex-aic">
                  <span>状况：</span>
                  <span class="good flex">
                    <em class="ellipsis">{{moreInfo.statustext||'完好'}}</em>
                    <!-- <i v-if="info.iscooperativeseller">优选</i> -->
                  </span>
                </span>
                <span class="flex-between">
                  <span>卖家：</span>
                  <span class="header flex-aic" @click.stop="!moreInfo.iscooperation?cooperative():''">
                    <img :src="moreInfo.headimgurl" v-if="!moreInfo.iscooperation" />
                    <span>{{moreInfo.seller}}</span>
                    <i class="ico-lg" v-if="!moreInfo.iscooperation"></i>
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>起拍价：</span>
                  <span>{{info.initbid||0}} 元</span>
                </span>
                <span class="quality flex-center" @click.stop="cooperative(moreInfo.condition)">
                  <i></i>
                  <span>成色：</span>
                  <span>{{moreInfo.quality}}</span>
                </span>
              </p>

              <p @click="handle('callServe')" v-if="moreInfo.servicetext">
                <span class="flex-aic">服务：</span>
                <span class="flex-end">
                  <span class="flex-col" style="width:65vw;">
                    <!-- <span class="flex-end">{{moreInfo.logisticstext}}</span> -->
                    <span class="flex-end no-wrap">{{moreInfo.servicetext}}</span>
                  </span>
                  <i class="more-arrow"></i>
                </span>
              </p>
              <p v-if="moreInfo.sellerdescription">
                <span>卖家说明：</span>
              </p>
              <p class="sellerdescription" v-if="moreInfo.sellerdescription">
                <span class="txt">{{moreInfo.sellerdescription||'卖家说明'}}</span>
              </p>
            </div>
          </div>
          <!-- 评论 -->
          <div class="ad-mod">
            <p class="ad-title comment-title">全部评论<span v-if="CommentInfo.total">（{{CommentInfo.total || 0}}）</span></p>
            <div class="none-data comment-none" v-if="!CommentInfo.list|| CommentInfo.list.length==0"></div>
            <div v-else>
              <div class="comt-list">
                <div v-for="(item,indx) in CommentInfo.list" :key="indx" class="mb">
                  <!-- 一级头像 -->
                  <div class="one-header com">
                    <div class="flex-between top">
                      <div class="header flex-center" @click.stop="OperationEvent(item,1)">
                        <img :src="item.userimgurl" alt />
                        <div class="nick-name flex-col">
                          <div class="nic-na flex-aic">{{item.username}}</div>
                          <div class="timer flex-aic">{{item.commenttime}}</div>
                        </div>
                      </div>
                      <div class="hand flex-aic" @click.stop="OperationEvent(item,2)">
                        <img v-lazy="'https://files.eyee.com/mcdn/img/auction/good_selected.png'" v-if="item.attitudestatus==3" />
                        <img v-lazy="'https://files.eyee.com/mcdn/img/auction/good_unselected.png'" v-else />

                        <span :class="{'act':item.attitudestatus==3}" v-if="item.goodcount>0">{{item.goodcount}}</span>
                      </div>
                    </div>
                    <div class="_txt" @click.stop="OperationEvent(item,3)">{{item.content}}<input type="text" /></div>
                  </div>
                  <!-- 二级 -->
                  <div v-for="(subitem ,subindex) in item.replylist" :key="subindex" @click.stop="OperationEvent(item,3)" v-show="subindex<2">
                    <div class="two-header com">
                      <input type="text" />
                      <div class="flex-between top">
                        <div class="header flex-start">
                          <img :src="subitem.userimgurl" alt />
                          <div class="nick-name flex-col">
                            <div class="nic-na flex-aic">{{subitem.fromusername}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="_txt">
                        <div v-if="subitem.tousername">
                          回复
                          <span>{{subitem.tousername}}</span>
                          ：{{subitem.content}}
                        </div>
                        <div v-else>{{subitem.content}}</div>
                      </div>
                    </div>
                  </div>
                  <!-- 展开回复 -->
                  <div class="com expand" v-if="item.replycount>1" @click.stop="OperationEvent(item,4)">展开{{item.replycount}}条回复</div>
                </div>
              </div>
              <!-- 查看全部评论 -->
              <div class="all-commont flex-center" v-if="CommentInfo.total-CommentInfo.list.length>0" @click="comment">查看全部{{CommentInfo.total-CommentInfo.list.length}}条评论</div>
            </div>
            <div class="comment-box flex-btwn">
              <img v-if="user.imageurl" :src="user.imageurl" class="user-img" alt />
              <input type="text" placeholder="我有话说…" @focus="getFocus" class="flex-aic" />
            </div>
          </div>
          <div class="ad-mod-des" v-if="info.description">
            <p class="ad-title">商品详情</p>

            <div class="ad-des" v-html="info.description" v-if="info.description"></div>
            <!-- <template v-for="(iItem, iIdx) in info.realimages" v-show="iItem">
              <img :key="'imgs'+iIdx" v-lazy="iItem" alt />
            </template> -->
          </div>
          <!-- <div class="ad-subsec recd" v-if="rcd.length>0&&recdisshow">
            <div class="ad-rcdtitle flex-between" style="padding-top: 5.866vw; padding-left: 4vw; padding-bottom:5.33vw;">
              <span>为你推荐</span>
              <span class="gray" @click.stop="goto">
                查看更多
                <i class="ico-lg"></i>
              </span>
            </div>
            <div class="card-container flex-aic flex-wrap">
              <div class="list" v-for="(ri, ridx) in rcd" :key="ridx+'ad'">
                <AuctionCell dbline v-show="ridx<18" enter="detailpage" :info="ri"></AuctionCell>
              </div>
            </div>
          </div> -->
        </mt-loadmore>
      </div>
    </div>
    <!--  -->
    <div v-if="clickCheckMore" class="cover" @click.stop="checkmore(0)">
      <span class="flex-center pagesize">
        <i @click.stop="checkmore(0)"></i>
        {{number+'/'+bannerCopy.length}}
      </span>
      <carousel class="imgs copy" :class="{'absolute':clickCheckMore}" center-mode :per-page="1" :pagination-size="0" :pagination-padding="4" :transition-start="number" @page-change="pageChange">
        <slide v-for="(img,iIdx) in bannerCopy" :key="'img'+iIdx" v-show="img">
          <span></span>
          <img :src="img" alt class="img" />
        </slide>
      </carousel>
      <div class="hidden">
        <div v-for="(img,i) in bannerCopy" :key="'img'+i" v-show="(number-1<=0?0:number-1)==i" :class="{'act':(number-1<=0?0:number-1)==i}">
          <!-- <span></span> -->
          <img :src="img" alt />
        </div>
      </div>
    </div>
    <div class="flex-center ad-foot" :class="{'ipx': getIsIphonex,'fixed':isgetfoucs}">
      <div class="flex-center ad-btn" :class="btn.class" @click="handle(btn.action)">
        <template v-if="btn.ico=='ok'">
          <i class="ico-ok white"></i>
        </template>
        <template v-else-if="btn.ico=='clock'">
          <img v-lazy="'http://files.eyee.com/mcdn/img/auction/alarm_big.png'" alt />
        </template>
        <span>{{btn.txt}}{{cdPay?` (剩余${cdPay})`:''}}</span>
      </div>
    </div>

    <!-- 点击回到顶部 -->
    <scroll-top>
      <template #url></template>
    </scroll-top>
    <div class="more-prod flex-col flex-center" v-if="channel=='0'" @click.stop="gomall">
      <div>更多</div>
      <div>商品</div>
    </div>
    <transition name="popup">
      <!-- 出价弹框 -->
      <div class="acn-modal bid-modal" v-show="showBidModal" key="bid-modal">
        <div class="fix-btm acn-modal-panel bid-panel">
          <!-- <div class="flex-end">
            <i class="ico-X" @click="bidclose"></i>
          </div> -->
          <div class="ms-head" @click="bidclose"></div>
          <div class="tit">宝贝很抢手 请立即出价</div>
          <div class="tip" v-if="info.ispaycashdeposit&&info.ispaymargin">
            <router-link to="/buyerSellKnow?type=20" tag="p">
              已支付保证金，若未拍到保证金将退回
              <span class="gh"></span>
            </router-link>
          </div>
          <p class="mid-hint">
            <span>当前价：¥{{info.currentbid||info.initbid}}</span>
          </p>
          <div class="flex-center bid-opt">
            <div class="flex-center bid-num" :class="{dis:!bider.cut}" @click="bidOpt(bider.cut,0)">
              <i class="ico-cut"></i>
              <span>{{info.priceincrease}}</span>
            </div>
            <div class="flex-center bid-price">
              <p>{{bidTemp}}</p>
              <i></i>
            </div>
            <div class="flex-center bid-num" :class="{dis:!bider.add}" @click="bidOpt(bider.add,1)">
              <span>{{info.priceincrease}}</span>
              <i class="ico-add"></i>
            </div>
          </div>
          <div class="flex-center ad-btn btn-red" @click="paymargin">确认</div>
          <p class="bid-rule">
            <span>出价即表示同意</span>
            <router-link to="/buyerSellKnow?type=20" tag="span">《斗牛竞拍规则》</router-link>
          </p>
        </div>
      </div>
    </transition>
    <transition name="popup">
      <!-- 支付保证金弹框 -->
      <div class="acn-modal bid-modal pay-modal" v-show="showPayModal" key="pay-modal">
        <div class="fix-btm acn-modal-panel bid-panel">
          <!-- <div class="flex-end">
            <i class="ico-X" @click="showPayModal=false"></i>
          </div> -->
          <div class="ms-head" @click="showPayModal=false"></div>
          <div class="tit">该商家设置出价保护</div>
          <div class="tip tip-pro">
            <router-link to="/buyerSellKnow?type=20" tag="p">
              单商品首次出价需支付保证金，如违约保证金将扣除并赔偿卖家，没有拍到保证金将退回账户余额中
              <span class="gh"></span>
            </router-link>
          </div>
          <div class="flex-center ad-btn btn-red" @click="dopay">支付保证金{{info.margin>0?'￥'+info.margin:''}}</div>
          <p class="bid-rule">
            <span>出价即表示同意</span>
            <router-link to="/buyerSellKnow?type=20" tag="span">《斗牛竞拍规则》</router-link>
          </p>
        </div>
      </div>
    </transition>
    <!-- 出价记录弹窗 -->
    <transition name="popup">
      <div class="acn-modal" v-if="hasRecords&&tgRecord" key="bidrecord-modal" @click="tgRecord=false">
        <div class="fix-btm acn-modal-panel record-panel" v-if="hasRecords">
          <div class="ms-head"></div>
          <p class="rp-title">出价记录</p>
          <!-- <div>
            <span class="rp-title">出价记录</span>
            <i class="ico-X" @click="tgRecord=false"></i>
          </div> -->
          <div class="rp-box">
            <auction-records :auctiongoodid="info.auctiongoodid" :page="1"></auction-records>
          </div>
        </div>
      </div>
    </transition>
    <!-- 服务弹窗 -->
    <transition name="popup">
      <div class="acn-modal" v-if="hasServe&&tgServe" key="serve-modal" @click="tgServe=false">
        <div class="fix-btm acn-modal-panel record-panel" v-if="hasServe">
          <div class="ms-head"></div>
          <p class="rp-title">服务</p>
          <div class="serve-box">
            <div v-html="richtext" class="richtext"></div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 评论弹窗 -->
    <transition name="popup">
      <div class="acn-modal" v-if="hasComment&&tgComment" key="comment-modal">
        <div class="acn-modal-panel" v-if="hasComment">
          <div class="comment-panel-box">
            <div>
              <textarea :placeholder="commentPlace" v-model="commentTxt" @keyup.enter="submitReplay" ref="input" @blur="getBlue"></textarea>
            </div>
            <button v-if="isgetfoucs" class="flex-center" :class="{'act':commentTxt}" @click="submitReplay">发送</button>
          </div>
        </div>
      </div>
    </transition>

    <auction-modal :type="modalType" :cd="cd" :info="modalTemp" @close="modalClose"></auction-modal>
  </div>
  <div class="none-data" v-else></div>
</template>
<script>
import { mapGetters } from "vuex";
// import AucSaveCell from "@/comps/AucSaveCell";
import AuctionModal from "./comps/AuctionModal";
import AuctionRecords from "./comps/Record";
import ScrollTop from "./comps/ScrollTop";
import { Carousel, Slide } from "vue-carousel";
import AuctionCell from "./comps/AuctionCell";
import { Showauctionlist } from "@/utils/api/mall";
import { html2canvas } from "@/utils/html2canvas.js";
import { agreement } from "@/common/api/snekc2c.js";
import {
  AuctionGoodInfo,
  Recommends,
  AuctionExtInfo,
  BidRecords,
  SetRemind,
  AuctionBid,
  ProductParams,
  Savebuyermargin,
  IsWant,
  CommentList,
  HandPraiseComments,
  CommentorReplay
} from "@/utils/api/auction";

const pad = num =>
  Math.floor(num)
    .toString()
    .padLeft(2, "0");

let agid = "",
  stamp = 0,
  _loader,
  shareInfo = {},
  $cd,
  $cdPay,
  addnum = 0;
export default {
  name: "AuctionDetail",
  components: {
    AuctionModal,
    AuctionRecords,
    Carousel,
    Slide,
    // AucSaveCell,
    ScrollTop,
    AuctionCell
  },
  data() {
    return {
      hasdata: 2,

      page: 1,
      info: {},
      moreInfo: {},

      btn: {},
      cdTxt: "",
      cd: { h: "00", m: "00", s: "00", ms: "0" },
      cdPay: "",

      records: [],
      rcd: [],

      showPayModal: false,
      showBidModal: false,
      bidTemp: 0,

      hasRecords: false,
      tgRecord: false,

      modalType: 0, // 0 不显示，1 出价成功，2 截拍倒计时，3 竞拍成功，4 红包，5 分享

      redpacket: 0,
      needinvations: 0,
      remaininvations: 0,
      order: {},
      poster: {},
      banner: [],
      bannerCopy: [],
      onoff: true, // 支付防连点

      eq: 1,
      channel: 0,

      clickCheckMore: false,
      number: 1,

      CommentInfo: {
        list: [],
        page: 1
      }, //评论数据
      commentPage: 0,
      commentTxt: "", //评论内容
      isgetfoucs: false,

      recdisshow: true,
      fontSize: 9.6,
      someLocalProperty: 0,
      hasServe: false,
      tgServe: false,
      richtext: '',
      hasComment: false,
      tgComment: false,
      operationtype: 1,
      commentPlace: '我有话说…',
      recommentid:''
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    loged() {
      return !!(this.user && this.user.uid);
    },
    bider() {
      let {
          bidTemp,
          info: { currentbid, initbid, priceincrease }
        } = this,
        curr = currentbid || initbid;
      return {
        cut: bidTemp > curr + priceincrease,
        add: bidTemp < 1e6
      };
    },
    modalTemp() {
      let {
        info: { currentbid },
        redpacket,
        needinvations,
        remaininvations,
        order,
        poster,
        isused
      } = this;

      return {
        agid,
        currentbid,
        redpacket,
        needinvations,
        isused,
        remaininvations,
        ...(order || {}),
        ...(poster || {})
      };
    },
    // ISIOS 判断是否是iphonX手机
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    currentwidth() {
      const width = 26.7,
        count = this.banner.length,
        currentWidth = width / count;
      let dotalWidth = currentWidth * (this.someLocalProperty + 1);
      return dotalWidth || 0;
    },
  },
  watch: {
    "$route.params.id": function(val, old) {
      console.log("TCL: this.$route.name", this.$route.name);
      if (this.$route.name == "AuctionDetail" && val && val !== old) {
        agid = val;
        this.reload();
      }
    },
    "$route.query.channel": function(val, old) {
      if (val && val !== old) {
        this.channel = val || 0;
      } else this.channel = 0;
    },
    showPayModal: function(newval, oldval) {
      if (newval) this.onoff = true;
    },
    commentTxt (nv, ov) {
      if (nv === ov) {
        return
      }
      this.commentTxt = nv
      console.log('value changed')
      if (this.commentTxt) {
        this.changeHeight()
      }
    }
  },
  mounted() {
    let _ = this;
    agid = _.$route.params.id;
    _.channel = _.$route.query.channel || 0;
    if (_.$root.loging)
      _.$root.loging
        .then($ => {
          // 已登录
          _.getInfo();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.getInfo();
        });
    else {
      _.getInfo();
    }
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getInfo();
        });
      } else _.toast("登录失败~");
    };
    window._shareCallBack = function() {};
    window._appPayCallback = function(ret) {
      // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
      _.javascriptBridge({
        name: "callAppOrderDetail",
        params: {
          type: 1, //1 拍卖
          orderno: _.info.orderinfo.orderno // 订单号
        }
      });
    };
    // 支付保证金回调
    window.PaymentDeposit = function(ret) {
      // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
      _.showPayModal = false;
      if (ret == 1) {
        _.modalType = 0;
        _.doBid();
        _.getInfo(1);
      } else _.toast("支付失败!");
    };
    _.setToolBar({ title: "斗牛拍卖", bgcolor: "#232323", textcolor: "#FFFFFF" });
  },
  methods: {
    changeHeight () {
      let _ = this
      this.$nextTick(() => {
        var textArea = _.$refs.input
        var scrollHeight = textArea.scrollHeight - 10 // 控件所有的高度，包含滚动的那部分(不可见也会有高度)
        var height = textArea.offsetHeight // 屏幕上显示的高度
        if (height <= scrollHeight) {
          textArea.style.height = 'auto' // 恢复默认值，这个作用就是根据内容自适应textarea高度
          textArea.style.height = textArea.scrollHeight + 'px' // 拿到最新的高度改变textarea的高度
        }
      })
    },
    checkmore(index) {
      setTimeout(() => {
        this.clickCheckMore = !!index;
        if (this.clickCheckMore) document.body.classList.add("lock");
        else {
          document.body.classList.remove("lock");
          this.number = 1;
        }

        this.creatImg(this.number);
      }, 200);
    },
    creatImg(num) {
      // console.log("num---", num);
      this.$nextTick(() => {
        setTimeout(() => {
          let banner = document.querySelector(".hidden .act");
          if (this.bannerCopy[num - 1 <= 0 ? 0 : num - 1].length > 100) return;
          html2canvas(banner, { useCORS: true })
            .then(canvas => {
              let dataUrl = canvas.toDataURL("image/jpg");
              if (dataUrl) {
                // this.bannerCopy[num - 1 <= 0 ? 0 : num - 1] = dataUrl;
                this.$set(this.bannerCopy, num - 1 <= 0 ? 0 : num - 1, dataUrl);
                console.log("生成图片成功", num, this.bannerCopy, dataUrl);
              }
            })
            .catch(err => {
              console.error("TCL: mounted -> err", err);
            });
        }, 300);
      });
    },
    pageload(e) {
      this.$refs.loadmore.onTopLoaded();
      this.getInfo();
    },
    _pageChange(num) {
      this.someLocalProperty = num;
      if (num < 0) num = 0;
      this.number = num + 1;
    },
    pageChange(num) {
      if (num < 0) num = 0;
      this.number = num + 1;
      this.creatImg(this.number);
    },
    gomall() {
      if (this.info.auctionid)
        this.$router.push("/auction/" + this.info.auctionid);
    },
    reload() {
      let _ = this;
      _.page = 1;
      _.rcd = [];
      _.getInfo();
    },
    getInfo(act) {
      let _ = this;
      $cd && clearTimeout($cd);
      $cdPay && clearTimeout($cdPay);
      AuctionGoodInfo(agid, _.loged)
        .then(res => {
          if (res && res.auctiongoodid) _.hasdata = 1;
          else _.hasdata = 0;
          console.log("AuctionGoodInfo res:", res);
          let livestatus = res.livestatus
          let roomno = res.roomno
          let pullstreamurl = res.pullstreamurl
          // h5页面通知App更新当前页面的直播信息
          _.javascriptBridge({
            name: "callAppUpdateLiveInfo",
            params: {
              roomno: roomno, // 房间号
              livestatus: livestatus, // 直播状态
              pullstreamurl: pullstreamurl // 直播拉流地址"
            }
          });
          _.info = res || {};
          // _.setToolBar({ title: "【" + _.info.size + "】" + _.info.name });
          if (_.info.realimages && _.info.realimages.length) {
            let ar = [];
            _.info.realimages.map(i => {
              if (!!i) ar.push(i);
              return ar;
            });
            _.info.realimages = ar;
          }
          if (_.info.imageurl) {
            _.banner = [...new Set([_.info.imageurl, ..._.info.realimages])];
            _.bannerCopy = [...new Set([_.info.imageurl, ..._.info.realimages])];
          } else {
            _.banner = [..._.info.realimages];
            _.bannerCopy = [..._.info.realimages];
          }

          let btn = {},
            cdTxt = "已成交",
            {
              status,
              remind,
              remaintime,
              remainpaytime,
              currentbid,
              initbid,
              priceincrease,
              countdownpop
            } = res || {};
          _.bidTemp = (currentbid || initbid) + priceincrease;
          if (remaintime > 0) {
            _.countdown(remaintime);

            if (countdownpop && !act) _.modalType = 2;
          }
          // 1-预展中 2-竞拍中 3-已截拍 4-待付款 5-成交 6-超时未付款
          switch (status) {
            case 1:
              cdTxt = "开拍倒计时";
              if (remind) {
                btn.class = "btn-grey";
                btn.txt = "已设置提醒";
                btn.ico = "ok";
                btn.action = "setRemind";
              } else {
                btn.class = "btn-black";
                btn.txt = "开始提醒我";
                btn.ico = "clock";
                btn.action = "setRemind";
              }
              break;
            case 2:
              cdTxt = "距离结束还剩";
              btn.class = "btn-red";
              btn.txt = "立即出价";
              btn.action = "callBid";
              break;
            case 3:
              btn.class = "btn-grey";
              btn.txt = "已截拍";
              cdTxt = "已截拍";
              break;
            case 4:
              btn.class = "btn-red";
              btn.txt = "立即付款";
              btn.action = "callPay";

              _.countdownPay(remainpaytime);
              break;
            case 5:
              btn.class = "btn-grey";
              btn.txt = "已成拍";
              break;
            case 6:
              btn.class = "btn-overtime";
              btn.txt = "立即付款";
              _.cdPay = "00:00:00";
              break;
          }
          _.cdTxt = cdTxt;
          _.btn = btn;
          if (!act) {
            if (_.loged) _.getExtInfo();
            _.getRecords();
            _.getRcd();
            _.getMoreInfo();
          }
          _.$nextTick(() => {
            window.scrollTo(0, 0);
          });
          // 评论
          _.commentPage = 0;
          _.comment(3);
          _.$nextTick(() => {
            if (_.info.currentbid){
              let size = _.info.currentbid.toString().length
              if (size === 8) {
                _.fontSize = 8
              } else if(size === 7) {
                _.fontSize = 9
              }
            }
          })
        })
        .catch(e => {
          console.error("AuctionGoodInfo error: ", e);
          _.toast("加载失败~");
          _.hasdata = 0;
        });
    },
    comment(size) {
      let _ = this,
        list = _.CommentInfo.list;
      let page = list && list.length ? list.length : 0;
      if (size == "success") page = 0;
      console.log(page, "page----->>");
      let params = {
        auctiongoodid: agid,
        page,
        size: typeof size == "number" ? 3 : 5,
        uid: (_.user && _.user.uid) || ""
      };
      CommentList(params)
        .then(res => {
          if (res) {
            console.log("评论数据----->>>CommentInfo", res);
            _.CommentInfo.total = res.total;
            _.CommentInfo.page = res.page;
            if (res.list && res.list.length > 0) {
              _.CommentInfo.list = _.CommentInfo.list.concat(res.list);
            }
          } else _.toast("加载失败");
        })
        .catch(e => {
          console.error("评论数据加载失败---" + e);
          _.CommentInfo = {};
        });
    },
    OperationEvent(item, type) {
      // type 1 社区个人主页 2  点赞和取消点赞 3 跳转APP评论详情 4查看全部
      let _ = this;
      switch (type) {
        case 1:
          _.javascriptBridge({
            name: "gotoAppPersonalHomePage",
            params: { userid: item.userid }
          });
          break;
        case 2:
          _.checkLogin(() => {
            _.Praisecomment(item);
          });
          break;
        case 3:
          console.log('回复评论', item)
          _.checkLogin(() => {
            _.recommentid = item.commentid;
            if (!_.hasComment) _.hasComment = true;
            _.isgetfoucs = true;
            _.tgComment = true;
            _.operationtype = 2;
            _.commentPlace = `@${item.username}`;
            _.$nextTick(() => {
              _.commentTxt = '';
              _.$refs.input.focus();
            })
            // _.$refs.input.val('333')
            // app交互 评论详情
            // _.javascriptBridge({
            //   name: "gotoAppCommentDetailPage",
            //   params: { commentid: item.commentid, commenttype: 8 }
            // });
          });
          break;
          case 4:
          _.checkLogin(() => {
             // app交互 评论详情
            _.javascriptBridge({
              name: "gotoAppCommentDetailPage",
              params: { commentid: item.commentid, commenttype: 8 }
            });
          });
          break;
      }
    },
    // 点赞
    Praisecomment(item) {
      // "refid":"评论或回复id",
      //   "type":"1评论 2回复",
      //   "receiveuserid":"被表态用户的id"
      let _ = this,
        params = {
          refid: item.commentid,
          type: 1,
          receiveuserid: item.userid
        };
      _.checkLogin(() => {
        HandPraiseComments(params)
          .then(res => {
            // "status":"3-点赞  0-取消表态"
            //  "attitudestatus":"表态态度： 3:很好 4：取消表态"，
            //  "attitudecount":"表态数",
            _.CommentInfo.list.map(i => {
              if (i.commentid === item.commentid) {
                if (res.status == 3) {
                  i.attitudestatus = 3;
                  i.goodcount += 1;
                  _.toast("已点赞");
                } else if (res.status == 0 || res.status == 4) {
                  i.attitudestatus = 4;
                  i.goodcount -= 1;
                  _.toast("已取消点赞");
                }
              }
              return i;
            });
            console.log("表态返回状态------>>>", res);
          })
          .catch(e => {
            console.error("表态失败---", e);
          });
      });
    },
    submitReplay() {
      let _ = this;
      let { operationtype } = _
      _.checkLogin(() => {
        if (_.commentTxt.length > 200) {
          _.toast("评论内容不得超过200个字！");
          return;
        }
        if (_.commentTxt == "") return;
        this.isgetfoucs = false;
        this.tgComment = false;
        let targetid = _.recommentid || agid
        CommentorReplay({
          targetid: targetid,
          operationtype,
          content: _.commentTxt
        }).then(res => {
          if (res && res.commentid) {
            _.recommentid = ""
            // _.commentPage = 0;
            _.commentTxt = "";
            // _.$refs.input.blur();
            _.toast("评论成功!");
            _.CommentInfo.list = [];
            setTimeout(() => {
              _.comment("success");
            }, 300);
            _.getBlue()
          }
        }).catch(e => {
           console.error("评论成功失败 ", e);
        });
      });
    },
    getExtInfo() {
      let _ = this,
        { auctionid } = _.info;
      auctionid = auctionid ? auctionid : "";
      AuctionExtInfo({ auctiongoodid: agid, auctionid })
        .then(res => {
          console.log("getExtInfo res: ", res);
          let {
              order,
              needinvations,
              remaininvations,
              redpacket,
              isused,
              redamountmin,
              redamountmax,
              share,
              poster
            } = res || {},
            { marketprice, initbid, size, name, status } = _.info;
          _.order = order;
          _.redpacket = redpacket;
          _.isused = isused;
          _.needinvations = needinvations;
          _.remaininvations = remaininvations;

          poster.min = redamountmin || 0;
          poster.max = redamountmax || 0;

          poster.subprice = marketprice;
          poster.isProd = true;
          poster.nickname = _.user.username;
          poster.avatar = _.user.imageurl;
          poster.initbid = initbid;
          poster.content = `【${size}】${name}`;
          _.poster = poster;
          if (order && order.auctiongoodid) _.modalType = 3;
          // 暂时不弹红包   竞拍中才弹红包
          // else if (redpacket > 0 && status == 2) _.modalType = 4;
          // 设置分享信息
          shareInfo = {
            sharecontent: share.content,
            sharepicurl: share.icon,
            shareurl: share.url,
            sharetitle: share.title,
            xcxurl: share.xcxurl,
            xcxicon: share.xcxicon,
            xcxid: share.xcxid,
            callbackname: "_shareCallBack"
          };
          // _.setShare();
        })
        .catch(e => {
          console.error("getExtInfo error: ", e);
        });
    },
    getRecords() {
      let _ = this;
      BidRecords({ auctiongoodid: agid, page: 1, size: 2 })
        .then(res => {
          console.log("BidRecords res:", res);
          _.records = res.list;
        })
        .catch(e => {
          console.error("BidRecords error: ", e);
        });
    },
    getRcd() {
      let _ = this;

      // 防重复请求
      if (_.rcd.length > 0) return;
      Showauctionlist({})
        .then(res => {
          console.log("Recommends res:", res);
          _.recdisshow = res.isshow;
          if (res && res.list) _.rcd = res.list || [];
        })
        .catch(e => {
          console.error("Recommends error: ", e);
        });
    },
    getMoreInfo() {
      ProductParams(agid)
        .then(res => {
          if (res) {
            this.moreInfo = res;
            this.moreInfo.auctionstrategy = JSON.parse(
              this.moreInfo.auctionstrategy.replace(/'/g, '"')
            );
            this.moreInfo.auctioncooperativeseller = JSON.parse(
              this.moreInfo.auctioncooperativeseller.replace(/'/g, '"')
            );
            console.log("商品参数------->>>", this.moreInfo);
          }
        })
        .catch(e => {
          console.error("Prod Params--", e);
        });
    },
    goto() {
      if (this.info.auctionid)
        this.$router.push("/auction/" + this.info.auctionid);
    },
    getFocus() {
      let _ = this
      console.log("获取焦点");
      _.checkLogin(() => {
        if (!_.hasComment) _.hasComment = true;
        _.isgetfoucs = true;
        _.tgComment = true;
        _.operationtype = 1;
        _.commentPlace = '我有话说…'
        agid = _.$route.params.id;
        _.$nextTick(() => {
          _.commentTxt = ''
          _.$refs.input.focus();
        })
      });
    },
    getBlue() {
      let _ = this
      console.log("失去焦点");
      _.isgetfoucs = false;
      _.tgComment = false
      // _.commentPlace = '我有话说…'
      // _.commentTxt = ''
    },
    gotoservice(type) {
      this.$router.push("/buyerSellKnow?type=" + type);
    },
    gotoDetail(id) {
      let _ = this,
        productid = "";
      if (id) {
        productid = id;
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid }
        });
      }
    },

    countdown(next) {
      let _ = this;

      if (next > 0) {
        _.cd = {
          h: pad(next / 36e5),
          m: pad((next / 6e4) % 60),
          s: pad((next / 1e3) % 60),
          ms: Math.floor((next % 1e3) / 100)
        };

        next -= 100;
        $cd = setTimeout(() => {
          if (location.pathname.includes("/auction/detail/")) _.countdown(next);
        }, next > 0 ? 100 : 0);
      } else location.reload();
    },
    countdownPay(next) {
      let _ = this;
      if (next > 0) {
        _.cdPay = `${pad(next / 36e5)}:${pad((next / 6e4) % 60)}:${pad(
          (next / 1e3) % 60
        )}`;

        next -= 1000;
        $cdPay = setTimeout(() => {
          if (location.pathname.includes("/auction/detail/"))
            _.countdownPay(next);
        }, next > 0 ? 1000 : 0);
      } else location.reload();
    },

    checkLogin(call) {
      let _ = this;
      if (_.loged) {
        call();
      } else {
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
    // 收藏
    collection() {
      let _ = this,
        { auctiongoodid, iswant = 0 } = _.info || {};
      iswant = iswant ? 0 : 1;
      _.checkLogin(() => {
        IsWant(auctiongoodid, iswant).then(res => {
          _.$set(_.info, "iswant", iswant);
          let count = _.info.wantcount || 0;
          if (!iswant) count -= 1;
          else count += 1;
          _.$set(_.info, "wantcount", count);
        });
      });
    },
    handle(action, type) {
      if (!action) return;
      let _ = this;
      console.log("handle", action);
      switch (action) {
        case "callBid":
          // $log({
          //   e: "click_ag_callbid",
          //   p: {
          //     // 0 详情按钮，1 弹框
          //     type: type == 2 ? 1 : 0,
          //     agid
          //   }
          // });
          _.checkLogin(() => {
            _.showBidModal = true;
          });
          break;
        case "callRecords":
          if (!_.hasRecords) _.hasRecords = true;
          _.tgRecord = true;
          break;
        case "callServe":
          if (!_.hasServe) _.hasServe = true;
          agreement({ type: 22 })
          .then(res => {
            if (res && res.agreement) {
              _.richtext = res.agreement.replace(/568/g, "");
              console.log("富文本数据", this.richtext);
            }
          })
          .catch(e => {
            console.error(e);
          });
          _.tgServe = true;
          break;
        case "callShare":
          // $log({
          //   e: "click_ag_callshare",
          //   p: {
          //     agid
          //   }
          // });
          _.checkLogin(() => {
            _.modalType = 5;
          });
          break;
        case "callCheck":
          // $log({
          //   e: "click_ag_check",
          //   p: {
          //     // 0 详情按钮，1 弹框(传唤起结算的拍品id)
          //     type: type == 3 ? 1 : 0,
          //     agid: type == 3 ? _.order.auctiongoodid : agid
          //   }
          // });
          _.checkLogin(() => {
            _.callCheckout(_.order.auctiongoodid);
          });
          break;
        default:
          _[action] && _[action]();
          break;
      }
    },
    callPay() {
      let _ = this,
        { orderinfo } = _.info || {};
      // $log({
      //   e: "click_ag_callpay",
      //   p: {
      //     // 0 拍品详情，1 结算页，2 订单详情，3 订单列表
      //     type: 0,
      //     orderno: (orderinfo && orderinfo.orderno) || ""
      //   }
      // });
      _.checkLogin(() => {
        if (orderinfo && orderinfo.orderno)
          _.javascriptBridge({
            name: "callAppPayment",
            params: {
              callbackname: "_appPayCallback",
              paymoney: orderinfo.paymoney,
              listreq: {
                orderno: orderinfo.orderno,
                paytype: 6 // 6:拍卖支付
              },
              prepayreq: {
                orderno: orderinfo.orderno,
                paysource: 22 // 22:拍卖
              }
            }
          });
        else _.callCheckout(agid);
      });
    },
    setRemind() {
      let _ = this,
        { remind } = _.info || {};
      status = remind ? 0 : 1;
      _.checkLogin(() => {
        SetRemind(agid, Number(status))
          .then(res => {
            if (Number(status)) {
              _.info.remind = 1;
              _.btn.class = "btn-grey";
              _.btn.txt = "已设置提醒";
              _.btn.ico = "ok";
              _.btn.action = "setRemind";
            } else {
              _.info.remind = 0;
              _.btn.class = "btn-black";
              _.btn.txt = "开始提醒我";
              _.btn.ico = "clock";
              _.btn.action = "setRemind";
            }

            // _.toast("操作成功~");
          })
          .catch(e => {
            console.error("SetRemind error: ", e);
            _.toast("操作失败~");
          });
      });
    },
    bidOpt(can, isadd) {
      if (!can) return;
      let _ = this,
        { priceincrease } = _.info || {};
      if (isadd) _.bidTemp += priceincrease;
      else _.bidTemp -= priceincrease;
    },
    dopay() {
      let _ = this,
        { info, moreInfo } = _,
        productid = "";
      if (moreInfo && moreInfo.productid) productid = moreInfo.productid;
      // $log({
      //   e: "click_ag_pay_margin",
      //   p: { type: 2, agid, pid: productid }
      // });
      console.log(
        "出价支付保证金参数",
        _.onoff,
        agid,
        "info.margin",
        info.margin,
        "productname",
        info.name
      );
      if (_.onoff) {
        _.onoff = false;
        Savebuyermargin({
          auctiongoodid: agid,
          margin: info.margin,
          productname: info.name
        })
          .then(res => {
            console.log("保存买家保证金记录", res);
            _.onoff = true;
            if (res) {
              _.javascriptBridge({
                name: "callAppPayment",
                params: {
                  callbackname: "PaymentDeposit",
                  paymoney: info.margin,
                  listreq: {
                    orderno: res, // 支付记录 唯一标识
                    paytype: 7 // 7:拍卖 支付保证金
                  },
                  prepayreq: {
                    orderno: res, // 支付记录 唯一标识
                    paysource: 24 // 24:拍卖出价支付保证金
                  }
                }
              });
            }
          })
          .catch(e => {
            console.error("保存买家保证金记录 Error", e);
            _.onoff = true;
          });
        setTimeout(() => {
          _.onoff = true;
        }, 2000);
      }
    },
    paymargin() {
      let _ = this;
      if (_.info.ispaycashdeposit && !_.info.ispaymargin && _.info.margin > 0) {
        _.showBidModal = false;
        _.showPayModal = true;
      } else _.doBid();
    },
    doBid() {
      let _ = this,
        {
          toast,
          bidTemp,
          info: { priceincrease }
        } = _;
      if (bidTemp < 1e9) {
        // $log({
        //   e: "click_ag_bid_confirm",
        //   p: {
        //     agid,
        //     bid: bidTemp
        //   }
        // });
        AuctionBid({ auctiongoodid: agid, bid: bidTemp })
          .then(res => {
            console.log("AuctionBid res: ", res);
            _.info.currentbid = res.currentbid;
            _.bidTemp = res.currentbid + priceincrease;

            _.showBidModal = false;
            if (res.bidstatus) _.modalType = 1;
            else toast("出价失败~");

            // 刷新出价记录
            _.getRecords();
          })
          .catch(e => {
            console.error("AuctionBid error: ", e);
            toast(e.msg || "出价失败~");
          });
      } else toast("出价不能超过8位数~");
    },
    modalClose(action, type) {
      // 0 不显示，1 出价成功，2 截拍倒计时，3 竞拍成功，4 红包，5 分享
      let _ = this;
      if (action == "doShare") {
        // $log({
        //   e: "click_ag_doshare",
        //   p: {
        //     // 0 出价成功后，1 红包弹框，2 面板分享好友，3 面板海报
        //     type: type == 1 ? 0 : type == 4 ? 1 : 2,
        //     agid
        //   }
        // });
      }
      console.log("modalClose", action);
      _.modalType = 0;
      _.onoff = true;
      if (action != "close") _.handle(action, type);
    },
    bidclose() {
      this.showBidModal = false;
    },
    doShare() {
      let _ = this;
      /**
       * callAppDirectlyShare
        {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址", 
          "shareurl":"分享链接", 
          "sharetitle":"分享标题", 
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址", 
          "xcxicon":"小程序的封面图", 
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
       */
      _loader = _.$loader("正在调起分享···");
      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          ...shareInfo,
          type: 2,
          platform: 2
        }
      });
      setTimeout(() => {
        _loader && _loader.close();
      }, 3000);
    },
    callCheckout(auctiongoodid) {
      let _ = this,
        isLeave = false;
      auctiongoodid += "";
      _.javascriptBridge({
        name: "callAppCheckout",
        params: {
          type: 1,
          auctiongoodid
        }
      });

      document.onvisibilitychange = function() {
        if (document.visibilityState === "hidden") isLeave = true;
        else if (isLeave) location.reload();
      };
    },
    cooperative(url) {
      if (url) {
        url = url.split(".eyee.com")[1];
        this.checkLogin(() => {
          this.$router.push(url);
        });
      } else {
        // 跳转社区个人主页
        this.javascriptBridge({
          name: "gotoAppPersonalHomePage",
          params: { userid: this.moreInfo.sellerid }
        });
      }
    },
    sencedeal(obj) {
      let _ = this;
      if (_.info.auctiongoodid == obj.auctiongoodid) {
        _.info.iswant = obj.iswant;
        if (obk.iswant) _.info.wantcount += 1;
        else _.info.wantcount -= 1;
      }
    },
    handleLog(agid) {
      // $log({
      //   e: "click_ag_list",
      //   p: {
      //     agid,
      //     type: 2 // 0 首页场次，1 首页推荐，2 详情推荐，3 参与列表
      //   }
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #505050;
  font-size: 4.266vw;
}
.carousel_spotWrapper {
  margin-top: 4.266vw;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}
.carousel_spot {
  width: 26.667vw;
  height: 1.067vw;
  background: #505050;
  border-radius: 0.8vw;
  display: flex;
  &.position {
    position: absolute;
    bottom: 0;
    background: transparent;
  }
  .item {
    height: 1.067vw;
    transition: all 0.2s;
    border-radius: 0.8vw;
  }
  .item.act {
    background: #fff;
  }
}
.mint-loadmore-content {
  transform: none !important;
}
.mint-loadmore {
  border-radius: 0;
  background: none;
}
.ad-mod {
  padding: 0 4vw;
  margin-bottom: 2.666vw;
  background-color: #232323;
  overflow: hidden;
}
.ad-bid {
  margin-bottom: 2.666vw;
}
.ad-bid-head {
  position: relative;
  background-color: #3C3C3C;
  border-radius: 3.2vw 3.2vw 0 0;
  display: flex;
  line-height: 13.866vw;
  align-items: center;
  justify-content: space-between;
  padding: 0.5333vw 4vw 0.066vw;
  font-size: 12px;

  &::after {
    position: absolute;
    content: '';
    left: 4vw;
    right: 4vw;
    top: 13.866vw;
    height: 0.266vw;
    background-color: #323232;
  }
}
.ad-empty {
  background-color: #3C3C3C;
  border-radius: 0 0 3.2vw 3.2vw;
  padding-bottom: 6.4vw;
  text-align: center;
  font-size: 3.467vw;
  font-weight: 600;
  color: #5C5C5C;
  overflow: hidden;

  img {
    display: block;
    width: 26.667vw;
    margin: 0 auto 3.2vw;
  }
}
.bid-head-right {
  display: flex;
  align-items: center;
  img {
    margin-left: 2.133vw;
    width: 6.666vw;
    height: auto;
    &.move {
      animation: big 0.5s linear infinite alternate;
    }
  }
}
.ad-records {
  background-color: #3C3C3C;
  border-radius: 0 0 3.2vw 3.2vw;
  padding: 1.6vw 0 2.666vw;
  color: #969696;

  .ad-tr {
    display: flex;
    justify-content: space-between;
    padding: 0 4vw;
    line-height: 9.066vw;
    font-size: 3.467vw;
    font-weight: 400;

    &>div:nth-child(1) {
      width: 18%;
      padding-right: 2vw;
    }

    &>div:nth-child(2) {
      width: 30%;
      text-align: center;
    }
    &>div:nth-child(3) {
      flex: 1;
      text-align: center;
    }

    &.act {
      color: #fff;
      .ad-rcs {
        font-weight: 600;
        background: #505050;
        color: #969696;

        &::after {
          border-right-color: #505050;
        }
      }
      .first {
        background: #000;
        color: #fff;

        &::after {
          border-right-color: #000;
        }
      }
    }
  }
  .ad-rcs {
    position: relative;
    background: #505050;
    color: #969696;
    border-radius: 1.067vw;
    padding: 0.4vw 2.4vw;
    font-size: 2.933vw;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-1.067vw);
      border-right: 2vw solid #505050;
      border-bottom: 2vw solid transparent;
    }
  }

  .ad-rcm {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2vw;
    font-weight: 400;
    color: #969696;
    padding: 3.2vw 0 1.333vw;
    span {
      margin-right: 0.8vw;
    }
  }
}
.none-data {
  margin: 8vw auto 5.333vw;
  width: 48vw;
  height: 48vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_empty.png") no-repeat 0 0;
  background-size: contain;
}
.ad-title {
  line-height: 13.3333vw;
  font-size: 4.8vw;
  font-weight: 600;

  span {
    font-size: 12px;
  }
}
.comment-title{
  padding: 0 0 0.8vw;
}
.comment-none {
  margin: 0 auto 1.333vw;
}
.ad-mod-des {
  background-color: #232323;
  .ad-title {
    padding: 0 4vw;
  }
  .ad-des {
    padding: 4vw;
  }
}
.comment-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 10.666vw;
  margin-bottom: 4vw;
  input {
    display: block;
    height: 10.666vw;
    width: 100%;
    line-height: 10.666vw;
    color: #fff;
  }
  // &.conttxt {
  //   input {
  //     width: 75.4vw;
  //   }
  // }
  // button {
  //   width: 13.866vw;
  //   height: 9.066vw;
  //   background: #fa2337;
  //   opacity: 0.5;
  //   border-radius: 2px;
  //   margin-left: 2.66vw;
  //   color: #ffc9ca;
  //   font-size: 14px;
  //   font-weight: bold;
  //   &.act {
  //     opacity: 1;
  //     color: #fff;
  //   }
  // }
  .user-img {
    display: block;
    width: 5.333vw;
    height: 5.333vw;
    border-radius: 100%;
  }
}
.comt-list {
  .mb {
    margin-bottom: 5.6vw;
    &:last-child {
      margin-bottom: 4vw;
    }
  }
  .com {
    margin-bottom: 2.933vw;
    font-weight: normal;
    &.expand {
      font-size: 12px;
      font-weight: 600;
      padding-left: 10.3996vw;
      margin: 2.6666vw 0 0 0;
    }
    .top {
      align-items: end;
      margin-bottom: 1.06vw;
    }
    .header {
      
      img {
        width: 8vw;
        height: 8vw;
        border-radius: 50%;
        margin-right: 2.666vw;
      }
      .nick-name {
        color: #C8C8C8;
        font-size: 3.2vw;
        .nic-na {
          height: 17px;
        }
        .timer {
          color: #969696;
          font-size: 12px;
          transform: scale(0.8333);
          margin-left: -2.45vw;
          height: 17px;
        }
      }
    }
    .hand {
      font-size: 12px;
      margin-left: 8px;
      color: #c8c8c8;
      .act {
        margin-left: 1.07vw;
        color: #C8AF6E;
      }
      img {
        width: 5.866vw;
        height: 5.866vw;
        margin: 0;
      }
    }
    ._txt {
      position: relative;
      font-size: 4vw;
      padding-left: 10.3996vw;

      input {
        position: absolute;
        top:0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
      }
    }
  }
  .two-header {
    position: relative;
    padding-left: 10.3996vw;
    margin-bottom: 2.666vw;
    input {
      position: absolute;
      top:0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
    }
    .top {
      margin-bottom: 0;
    }
    ._txt {
      padding: 0 0 0 6.7vw;
      font-size: 3.466vw;
      span {
        font-weight: 600;
      }
    }
    .header {
      img {
        width: 5.333vw;
        height: 5.333vw;
        margin-right: 1.333vw;
      }
    }
  }
}
.all-commont {
  font-size: 3.733vw;
  font-weight: 600;
  margin-bottom: 5.8666vw;
}
.comment-panel-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-radius: 4.8vw 4.8vw 0 0;
  background-color: #282828;
  padding: 4vw;

  & > div {
    flex: 1;
    border-radius: 4.8vw;
    background-color: #3C3C3C;
    overflow: hidden;
  }
  textarea {
    display: block;
    padding: 1.666vw 4.8vw;
    width: 100%;
    height: 9.6vw;
    line-height: 6.5vw;
    color: #C8AF6E;
    font-size: 4.266vw;
    outline: none;
    border: none;
    appearance: none;
    overflow-y: auto;
  }
  button {
    width: 15.466vw;
    line-height: 9.6vw;
    background: #000;
    border-radius: 4.8vw;
    margin-left: 2.66vw;
    color: #C8AF6E;
    font-size: 3.733vw;
    font-weight: 600;
    opacity: 0.5;
    &.act {
      opacity: 1;
    }
  }
}
.ms-head {
  margin: 0 auto;
  width: 10.666vw;
  height: 1.6vw;
  border-radius: 0.8vw;
  background-color: #505050;
}
</style>
<style lang="scss">
body {
  background-color: #191919;
}
.hidden {
  position: absolute;
  /* z-index: -999; */
  width: 100vw;
  height: 100vw;
  opacity: 0;
  span {
    position: absolute;
    width: 7.466vw;
    height: 7.4666vw;
    background: url("http://files.eyee.com/mcdn/img/auc/logo.png") 0 0 no-repeat;
    background-size: cover;
    right: 4vw;
    top: 4vw;
    z-index: 4;
    img {
      width: 100%;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
input,
textarea,
input:focus,
textarea:focus {
  list-style: none;
  outline-style: none;
  background: none;
  padding: 0;
  margin: 0;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  -webkit-appearance: none;
  caret-color: #c8c8c8;
  font-size: 4.266vw;
  padding-left: 3.2vw;
}
$red: #fa2337;
@keyframes big {
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
.more-prod {
  position: fixed;
  right: 25px;
  bottom: 50.733vw;
  background: #232323;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  width: 44px;
  height: 44px;
}
.auction {
  width: 100%;
  color: #fff;
  .ad-box {
    padding-bottom: 21.333333vw;
  }
  .ico-lg {
    width: 2.267vw;
    height: 2.267vw;
    margin-left: 1.333vw;
    margin-top: 0.667vw;
    // margin-right: 3%;
    color: #646464;
  }

  .ad-top {
    -webkit-overflow-scrolling: auto;
  }

  .VueCarousel-wrapper,
  .VueCarousel-inner,
  .VueCarousel-slide {
    height: 100% !important;
  }
  .VueCarousel-slide {
    position: relative;
    overflow: hidden;
    span {
      position: absolute;
      width: 8.533vw;
      height: 8.533vw;
      background: url("//files.eyee.com/mcdn/img/auction/logo.png") 0 0 no-repeat;
      background-size: cover;
      right: 4vw;
      top: 4vw;
      z-index: 4;
    }
  }
  .VueCarousel-pagination {
    text-align: right !important;
  }
  .VueCarousel-dot-container {
    margin-right: 5.333vw;
    margin-bottom: 8.533vw !important;
  }
  .VueCarousel-dot {
    transition: width 0.2s ease-in;
  }
  .VueCarousel-dot--active {
    border-radius: 12px;
    width: 14px !important;
  }
  .cover {
    background: #000000;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    .VueCarousel-pagination {
      display: none;
    }
    .pagesize {
      color: #fff;
      font-size: 4.5333vw;
      line-height: 11.7333vw;
      position: relative;
      font-weight: bold;
      i {
        position: absolute;
        width: 8vw;
        height: 8vw;
        background: url("//files.eyee.com/mcdn/img/auction/icon_close.png") 0 0
          no-repeat;
        background-size: cover;
        left: 2.933vw;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .imgs {
    height: 100vw;
    background: #000000;
    &.absolute {
      width: 100vw;
      position: absolute;
      left: 0%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
    }
    img {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 100%;
    }
  }

  .ad-info {
    display: flex;
    width: 100vw;
    height: 22.4vw;
    background: #000;
    color: #fff;
    align-items: flex-end;
    justify-content: space-between;
  }
  .ad-price {
    height: 100%;
    padding: 2.4vw 0 0 5.333vw;
    font-weight: 600;
    white-space: nowrap;
    .rmb {
      font-size: 4.8vw;
      display: inline-block;
      font-family: "OswaldBold";
      background: linear-gradient(180deg,#f5e6aa, #876e37);
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent; 
    }
    .curr-price {
      display: flex;
      align-items: baseline;
      position: relative;
      top: -0.266vw;
    }
    .curr {
      position: relative;
      top: -1.2vw;
      margin-left: 0.5vw;
      display: inline-block;
      padding: 0 1.333vw;
      height: 5.1vw;
      line-height: 5.1vw;
      background: #3c3c3c;
      border-radius: 4vw;
      text-align: center;
      color: #fff;
      font-size: 2.666vw;
      transform: scale(0.8);
    }
    .price {
      font-size: 9.6vw;
    }
    .refer {
      margin-left: -1vw;
      color: #969696;
      font-size: 2.666vw;
      transform: scale(0.95);
      
      span {
        margin-left: 1.333vw;
        text-decoration: line-through;
        font-size: 3.466vw;
        font-family: "OswaldBold";
      }
      em {
        font-size: 12px;
      }
    }
  }
  .ad-cd {
    position: relative;
    width: 38.133vw;
    height: 22.4vw;
    overflow: hidden;

    .ad-cd-info {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-direction: column;
      padding-right: 4vw;
    }

    &::before,
    &::after {
      z-index: 0;
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
    $offsetX: 8%;
    &::after {
      width: 100%;
      height: 100%;
      background: linear-gradient(0deg,#786737, #bea065);
      transform: skewX(-9deg) translateX($offsetX);
    }

    p {
      font-weight: 600;
      color: #fff;
    }
    p:first-of-type {
      font-size: 12px;
      margin-bottom: 2.666vw;
      transform: scale(0.9);
    }
  }
  .ad-cdcell {
    font-size: 12px;
    font-family: "OswaldBold";
    font-weight: 600;

    i {
      font-size: 4vw;
      font-weight: bold;
      width: 1.6vw;
      transform: translate(-10%,-10%);
    }

    span {
      width: 5.866vw;
      line-height: 7.466vw;
      text-align: center;
      border-radius: 0.8vw;
      background: #000;

      &:last-of-type {
        width: 3.4667vw;
        background: #fff;
        color: #000;
      }
    }
  }
  .ad-name {
    display: flex;
    align-items: center;
    padding: 5.333vw 0;
  }
  .ad-name-left {
    flex: 1;
    padding-right: 6.666vw;
    max-height: 10.666vw;
    line-height: 5.333vw;
    font-size: 3.733vw;
    font-weight: 600;
    img {
      width: 7vw;
      display: inline-block;
      position: relative;
      top: 0.8vw;
    }
  }
  .ad-name-right {
    img {
      display: block;
      width: 5.866vw;
      height: 5.866vw;
    }
  }

  .ad-extinfo {
    background: #fff;
    padding: 0 4vw 2.333vw;
    .border {
      border: 0.267vw solid #f5f5f5;
      border-radius: 1.067vw;
    }
  }
  .ad-subsec {
    border-top: 2.667vw solid #f5f5f5;
    &.recd {
      background: linear-gradient(#fff 5%, #f5f5f5);
      padding-bottom: 7.4666vw;
    }
    .card-container {
      // height: 27.733vw;
      padding: 0 4vw 4vw;
      .list {
        width: 49%;
        &:nth-child(2n) {
          margin-left: 2%;
        }
      }
      .ad-imgs {
        height: 27.733vw;
      }
      .VueCarousel-wrapper,
      .VueCarousel-inner,
      .VueCarousel-slide {
        height: 100% !important;
      }
      .VueCarousel-slide {
        height: 100% !important;
        padding-right: 2.667vw;
        &:last-child {
          padding-right: 0;
        }
      }
      .VueCarousel-pagination {
        display: none;
      }
    }
  }
  .ad-prompt {
    padding: 3.733vw 5.333vw;
    font-size: 3.2vw;
    font-weight: 400;
    color: #232323;
    // line-height: 2.667vw;
    i {
      margin-right: 1.333vw;
    }
  }
  // .ad-btm {
  //   background: #f5f5f5;
  //   line-height: 15.467vw;
  //   font-size: 3.467vw;
  //   font-weight: 600;
  //   color: #b4b4b4;
  //   text-align: center;

  //   i {
  //     position: relative;
  //     display: inline-block;
  //     width: 0.4vw;
  //     height: 2.667vw;
  //     background: currentColor;
  //     transform: translateY(10%);

  //     &::after {
  //       content: "";
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       width: 1.6vw;
  //       height: 1.6vw;
  //       border-left: 0.4vw solid;
  //       border-top: 0.4vw solid;
  //       transform: translate(-35%, -15%) rotate(45deg);
  //     }
  //   }
  // }
  .ad-more {
    padding: 2.666vw 0 4vw;
    color: #C8C8C8;
    > p {
      font-size: 3.733vw;
      font-weight: 400;
      line-height: 5.333vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.333vw 0;

      &.sellerdescription {
        margin-top: 1.333vw;
        margin-bottom: 2.6667vw;
        height: auto;
      }

      &.sell {
        span {
          width: 34.66vw;
          border-radius: 2px;
          overflow: hidden;
          &:first-child {
            margin-right: 2.66vw;
            width: 54.66vw;
          }
        }
      }
      > :first-of-type {
        min-width: 20%;
        
        .good {
          position: relative;
          width: 25vw;
          em {
            width: 100%;
          }
          i {
            background: #fa2337;
            font-size: 12px;
            transform: scale(0.8);
            color: #fff;
            font-weight: bold;
            padding: 0 4px;
            border-radius: 4.8vw;
            position: absolute;
            right: -8vw;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      > .txt {
        min-width: 100%;
        word-break: break-word;
      }
    }

    .quality {
      width: auto;
      
      .gray {
        color: #646464;
      }
      i {
        display: block;
        width: 24px;
        height: 24px;
        background: #969696;
        border-radius: 50%;
        position: relative;
        transform: scale(0.45);
        // top: 1px;
        &::before {
          content: "";
          width: 1.066vw;
          height: 1.066vw;
          background: #191919;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 1vw;
          transform: translateX(-50%);
        }
        &::after {
          content: "";
          width: 1.066vw;
          height: 2.132vw;
          background: #191919;
          position: absolute;
          left: 50%;
          top: 3vw;
          transform: translateX(-50%);
        }
      }
    }
    .header {
      
      img {
        width: 5.333vw;
        height: 5.333vw;
        border-radius: 50%;
        margin-right: 1.066vw;
      }
    }
    .no-wrap {
      white-space: nowrap;
    }
    .txt {
      padding: 3.2vw 4vw;
      background: #3C3C3C;
      border-radius: 3.2vw;
      font-size: 3.733vw;
      color: #C8C8C8;
    }
  }
  .adm-prod {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #3C3C3C;
    border-radius: 3.2vw;
    padding: 1.33333333333vw 4vw 1.33333333333vw 1.33333333333vw;
    margin-bottom: 2.666vw;
  }
  .more-arrow {
    display: block;
    width: 3.2vw;
    height: 3.2vw;
    background: url("//files.eyee.com/mcdn/img/auction/icon_more.png") 0 0 no-repeat;
    background-size: cover;
  }
  .adm-img {
    width: 21.333vw;
    height: 21.333vw;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    overflow: hidden;
    border-radius: 3.2vw;
  }
  .adm-info {
    padding-left: 2.666vw;
    width: 62.4vw;

    .info1 {
      font-size: 3.467vw;
      font-weight: 600;
      color: #fff;
      line-height: 4.8vw;
      margin-bottom: 4.533vw;
      height: 9.6vw;
    }
    .info2 {
      font-size: 12px;
      font-weight: 400;
      color: #969696;
      line-height: 4.267vw;
    }
  }
  .ad-foot {
    padding: 0 4vw;
    z-index: 1;
    height: 18.666vw;
    background: #000;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    &.ipx {
      height: 27.732vw;
      padding-bottom: 9.06666vw;
    }
    &.fixed {
      position: relative;
    }
  }
  .ad-btn {
    width: 100%;
    height: 12.2666vw;
    font-size: 4.8vw;
    font-weight: 600;
    color: #000;
    border-radius: 6.133vw;

    &.btn-grey {
      background: #191919;
      color: #969696;
    }
    &.btn-red {
      background: linear-gradient(180deg,#f5e6aa, #876e37);
    }
    &.btn-black {
      background: linear-gradient(180deg,#f5e6aa, #876e37);
    }
    &.btn-overtime {
      background: linear-gradient(180deg,#f5e6aa, #876e37);
      opacity: 0.5;
      color: rgba(0,0,0,0.5);
    }
    img {
      width: 5.8666vw;
      margin-right: 1.6vw;
    }
    .ico-ok {
      background: none;
      margin-right: 1.6vw;
      width: 5.866vw;
      height: 5.866vw;
    }
  }
}
.ico-ok.white::after {
  background: url("//files.eyee.com/mcdn/img/auction/selected_big.png") no-repeat center;
  background-size: contain;
}
.acn-modal {
  z-index: 9;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  .title {
    font-size: 4.5333vw;
    color: #232323;
    font-weight: bold;
    margin-bottom: 5.333vw;
  }
  .txt {
    color: #646464;
    font-size: 3.7333vw;
    margin-bottom: 10.6vw;
    padding: 0 6.6666vw;
  }
  &.pay-modal {
    .ad-btn {
      height: 13.333vw;
    }
  }
}
.acn-modal-panel {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  background: #282828;
  border-radius: 4.8vw 4.8vw 0 0;
  text-align: center;

  .ico-X {
    width: 25px;
    height: 25px;
    margin: 1.33333334vw 4vw;
  }
}
.bid-panel {
  padding: 3.466vw 4vw 2.667vw;
  .ms-head::after {
    position: absolute;
    content: '';
    padding-top: 100vw;
    width: 100%;
    top: -100vw;
    left: 0;
  }
  .tit {
    margin: 6.666vw 0 1.333vw;
    font-size: 5.333vw;
    color: #fff;
    font-weight: 600;
  }
  .tip {
    color: #C8C8C8;
    font-size: 3.466vw;

    .gh {
      background-color: #969696;
      &::after, &::before {
        background-color: #282828;
      }
    }
  }
  .tip-pro {
    padding: 2.666vw 2.666vw 5.333vw;
    text-align: left;
  }

  .bid-opt {
    margin: 5.333vw 0 8.533vw;
    color: #fff;
    font-size: 4.266vw;
    font-weight: 600;

    span {
      color: #fff;
      flex: 1;
    }

    .dis,
    .dis span {
      color: #cdcdcd;
    }
  }
  .bid-num {
    width: 30%;
  }

  .bid-price {
    width: 40%;
    height: 13.333vw;
    border-radius: 6.666vw;
    margin: 0 3vw;
    background-color: #3C3C3C;
    position: relative;
    color: #fff;
    font-size: 5.333vw;
    font-family: "OswaldBold";
    // i {
    //   position: absolute;
    //   top: 0;
    //   right: 0;
    //   border-right: 6.133vw solid;
    //   border-bottom: 5.6vw solid transparent;

    //   &::after {
    //     content: "";
    //     display: block;
    //     position: absolute;
    //     width: 9px;
    //     height: 5px;
    //     top: 0.533vw;
    //     right: -5.733vw;
    //     transform: translate(0, 0) rotate(-45deg);
    //     border-left: 2px solid #fff;
    //     border-bottom: 2px solid #fff;
    //   }
    // }
  }

  .ico-cut,
  .ico-add {
    width: 6.933vw;
    height: 6.933vw;
    border-radius: 100%;
    margin: 0 3vw;
    background: #3C3C3C;


    &:active {
      transition: transform 0.2s ease-in-out;
      transform: scale(1.13);
    }
  }
  .ico-cut {
    &::before {
      border-bottom-width: 2px;
      border-bottom-color: #C8AF6E;
      width: 47%;
      border-radius: 0.2666vw;
      left: 26%;
    }
  }
  .ico-add {
    // background: currentColor;
    &::before {
      height: 47%;
      top: 25%;
      left: 45%;
      color: #fff;
      border-left: 2px solid #C8AF6E;
      border-radius: 0.2666vw;
    }
    &::after {
      width: 47%;
      left: 25%;
      top: 45%;
      color: #fff;
      border-top: 2px solid #C8AF6E;
      border-radius: 0.2666vw;
    }
  }

  .mid-hint {
    margin: 4vw 0 6.666vw;
    color: #C8AF6E;
    font-size: 4.266vw;
    font-weight: 600;
  }

  .ad-btn {
    margin: 2.667vw auto;
  }

  .bid-rule {
    font-size: 2.933vw;
    font-weight: 400;
    color: #969696;
    line-height: 4.267vw;
    padding-top: 0.533vw;
    margin-bottom: 3.733vw;
  }
}
.record-panel {
  padding: 3.466vw 4vw 2.667vw;
  
  .rp-title {
    line-height: 11.7333vw;
    font-size: 3.733vw;
    font-weight: 600;
    color: #fff;
  }

  .rp-box {
    height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .serve-box {
    height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    text-align: left;
  }
}

.popup-enter-active,
.popup-leave-active {
  transition: background 0.3s ease-in;
  & > div {
    transition: bottom 0.2s ease-out;
  }
}
.popup-enter,
.popup-leave-to {
  background: transparent;

  & > div {
    bottom: -100vh;
  }
}
</style>