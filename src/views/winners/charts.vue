<template>
  <div class="winner">
    <div class="banner">
      <img src="https://files.eyee.com/eyeeh5/img/winner/banner.jpg?r=1.2" alt />
    </div>
    <!-- <div class="hint flex flex-center">友情提示：末尾有大彩蛋！！</div> -->
    <div class="content">
      <div>
        <div class="win-list" v-for="(item,indx) in 3" :key="indx">
          <div
            class="title-bg flex flex-center"
          >{{indx==0?'日盈利榜 '+daydate:indx==1?'周盈利榜 '+weekdate:'周交易榜 '+weekdate}}</div>
          <div class="subhead-title flex flex-air">
            <div
              v-for="(item,index) in (indx ==2?dealTitle:secTitle)"
              :key="index"
              class="flex flex-center list"
              :class="{'lot-icon':index==0}"
            >{{item}}</div>
          </div>
          <div class="pop-list">
            <div
              class="flex-center"
              v-if="indx ===0&&dayprofitlist.length===0 || indx ===1&&weekprofitlist.length===0||indx ===2&&tradelist.length===0"
            >暂无数据~</div>
            <div
              class="subhead-title pop flex flex-air"
              v-for="(item,i) in (indx ==0?dayprofitlist:indx ==1?weekprofitlist:tradelist)"
              :key="i+'pop'"
            >
              <div v-if="i<3" class="lot-icon list flex flex-center">
                <img :src="`https://files.eyee.com/eyeeh5/img/winner/no${i+1}.png`" alt />
              </div>
              <div v-else class="list lot-icon flex flex-center">{{i+1}}</div>
              <div class="list flex flex-center">{{item.nickname}}</div>
              <div class="list flex flex-center">{{indx ==2?item.buynum:item.sellnum}}</div>
              <div class="list flex flex-center">{{indx ==2?item.sellnum:item.buyprice}}</div>
              <div class="list flex flex-center">{{indx ==2?item.totalnum:item.sellprice}}</div>
              <div class="list flex flex-center last" v-if="indx !=2">￥{{item.totalprofit}}</div>
            </div>
          </div>
          <!-- 
          <div
            class="txt"
            v-if="indx==1&&weekprofitlist.length>0"
          >上周盈利前3，客服将在48小时内电话联系进行奖励发放，请保持电话畅通！</div>-->
        </div>
      </div>
      <div class="desc">
        <!-- <div class="title-img">
          <img src="https://files.eyee.com/eyeeh5/img/winner/tiger.png" alt />
        </div> -->
        <div class="activi-intro">
          <!-- <div class="act-date">
            <div>{{nextweek}}</div>
            <div class="img">
              <img src="https://files.eyee.com/eyeeh5/img/winner/songxianjinhongbao.png" alt />
            </div>
          </div> -->
          <!-- <div class="rule">
            <div class="img flex flex-center">
              <img src="https://files.eyee.com/eyeeh5/img/winner/zhoubangdan.png" alt />
            </div>
            <div class="rule-one rule-ranking">第一名：现金奖励500元</div>
            <div class="rule-two rule-ranking">第二名：现金奖励300元</div>
            <div class="rule-str rule-ranking">第三名：现金奖励100元</div>
          </div> -->
          <div class="formula-mode">
            <div class="img flex flex-center">
              <img src="https://files.eyee.com/eyeeh5/img/winner/count_txt.png" alt />
            </div>
            <div class="rule-ranking line-height">总盈利=总卖出的预售球鞋券价格-总买入的预售球鞋券价格</div>
             <div class="rule-ranking copyright">本活动最终解释权归斗牛DoNew所有</div>
          </div>
          <!-- <div class="activity-txt">
            <div class="img flex flex-center">
              <img src="https://files.eyee.com/eyeeh5/img/winner/activity_txt.png" alt />
            </div>
            <div class="rule-ranking date">活动时间：{{nextweek}}</div>
            <div class="rule-ranking line-height">周榜单奖励将在公示结果48小时内，由客服联系直接进行现金发放</div>
            <div class="rule-ranking copyright">本活动最终解释权归斗牛DoNew所有</div>
          </div> -->
        </div>
        <div class="footer">
          <img src="https://files.eyee.com/eyeeh5/img/winner/logo_win.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Profitlist } from "../../common/api/bull";
export default {
  data() {
    return {
      secTitle: ["榜单", "昵称", "卖出数量", "买入均价", "卖出均价", "总盈利"],
      dealTitle: ["榜单", "昵称", "买入数量", "卖出数量", "交易总数量"],
      daydate: "", //日盈利榜时间
      weekdate: "", //周盈利榜，周交易榜时间
      nextweek: "", //下周活动时间
      dayprofitlist: [], //日盈利
      weekprofitlist: [], //周盈利榜
      tradelist: [] //周交易榜
    };
  },
  mounted() {
    this.popList();
  },
  methods: {
    popList() {
      let _ = this;
      Profitlist()
        .then(res => {
          if (res) {
            if (res.dayprofitlist && res.dayprofitlist.length > 0)
              _.dayprofitlist = res.dayprofitlist;
            if (res.weekprofitlist && res.weekprofitlist.length > 0)
              _.weekprofitlist = res.weekprofitlist;
            if (res.tradelist && res.tradelist.length > 0)
              _.tradelist = res.tradelist;
            _.daydate = res.daydate || "";
            _.weekdate = res.weekdate || "";
            _.nextweek = res.nextweek || "";
            if (res.share) {
              let shareInfo = {
                sharecontent: res.share.content,
                sharepicurl: res.share.icon,
                shareurl: res.share.url,
                sharetitle: res.share.title,
                xcxurl: res.share.xcxurl,
                xcxicon: res.share.xcxicon,
                xcxid: res.share.xcxid,
                callbackname: ""
              };
              if (_.$root.ISMP) {
                wx.miniProgram.postMessage({ data: { share: shareInfo } });
              } else {
                // app 分享信息
                if (_.$root.ISAPP) {
                  _.javascriptBridge({
                    name: "getAppActivityShareContent",
                    params: shareInfo
                  });
                } else {
                  _.initShare({
                    info: {
                      title: res.share.title,
                      desc: res.share.content,
                      img: res.share.icon,
                      url: res.share.url
                    }
                  });
                }
              }
            }
          }
        })
        .catch(e => {
          console.error(e);
          // _.toast(e && e.msg);
        });
    }
  }
};
</script>
<style scoped>
.winner {
  background: rgb(242, 214, 192);
  min-height: 100vh;
  font-style: italic;
  letter-spacing: 1px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  /* font-weight: 600; */
  /* font-weight: bolder; */
  overflow: hidden;
}
img {
  display: block;
  width: 100%;
}
.banner {
  width: 100%;
  min-height: 100.7vw;
}

.hint {
  font-size: 4vw;
  color: #232323;
}
.content {
  margin-top: 8.8vw;
  /* overflow: hidden; */
  /* padding: 18.8vw 0px; */
}
.content .win-list {
  background: url("https://files.eyee.com/eyeeh5/img/winner/bg_border.png?r=1")
    0 0 no-repeat;
  background-size: 100% 100%;
  padding: 16vw 6.13vw 6.13vw 6.13vw;
  position: relative;
  margin-bottom: 8.4vw;
}
.win-list .txt {
  font-size: 12px;
  line-height: 5vw;
  letter-spacing: 1px;
  color: #223322;
  padding: 0 2%;

  /* -webkit-text-stroke: 0.1vw rgb(99, 98, 98); */
  margin-bottom: 5px;
}
.content .win-list:last-child {
  margin-bottom: 0;
}
.content .win-list .title-bg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3vw;
  border: 2px solid #232323;
  border-radius: 6px;
  background: #e26f35;
  color: #ffe4b7;
  font-size: 5vw;
  padding: 2vw 3.6vw;
  text-shadow: 0.13em 0.13em #333;
  box-shadow: 0 3px 5px 1px #ccc;
  white-space: nowrap;
  letter-spacing: 2px;
}
.content .subhead-title {
  font-size: 3.466vw;
  color: #ef6035;
}
.pop-list {
  margin-top: 6vw;
}
.content .subhead-title.pop {
  margin-bottom: 4.26vw;
  color: #232323;
}
.content .subhead-title .list.last {
  color: #ef6035;
}
.content .subhead-title .list {
  white-space: nowrap;
  width: 22.5%;
}
.content .subhead-title .lot-icon {
  width: 11%;
}
.content .subhead-title .lot-icon img {
  width: 5.33vw;
  height: 5.33vw;
}

/* .content .desc {
  background: url("https://files.eyee.com/eyeeh5/img/winner/zhuangshi.png?r=1")
    0 0 no-repeat;
  background-size: contain;
  padding-top: 7.8vw;
  position: relative;
  top: -1vw;
} */
.title-img {
  position: relative;
  z-index: 2;
}
.activi-intro {
  padding: 8vw 8vw 2vw 8vw;
  background: url("https://files.eyee.com/eyeeh5/img/winner/bg_border.png?r=1")
    0 0 no-repeat;
  background-size: 100% 100%;
  margin-top: 5vw;
  /* top: -13vw; */
  /* position: relative; */
}
.activi-intro .act-date {
  text-shadow: 1px 1px #333;
  font-size: 5.33vw;
  color: #e1743d;

  margin-bottom: 10.2vw;
}
.activi-intro .act-date img {
  width: 49vw;
  height: 8.93vw;
  margin-top: 3.86vw;
  margin-bottom: 7.2vw;
}
.activi-intro .rule {
  margin-bottom: 10.2vw;
}
.activi-intro .rule .img {
  width: 35.7vw;
  /* height: 9.4vw; */
  background: #e26f35;
  border: 2px solid #232323;
  border-radius: 2px;
  padding: 3vw 3.7vw;
  margin-bottom: 4vw;
}
.rule-ranking {
  font-size: 3.6vw;
  color: #232323;
  letter-spacing: 2px;
  margin-bottom: 10vw;
}
.formula-mode {
  margin-bottom: 10.2vw;
}
.formula-mode .img {
  width: 42vw;
  /* height: 9.4vw; */
  background: #e26f35;
  border: 2px solid #232323;
  border-radius: 2px;
  padding: 3vw 3.7vw;
  margin-bottom: 4vw;
}
.activity-txt .img {
  width: 31vw;
  /* height: 9.4vw; */
  background: #e26f35;
  border: 2px solid #232323;
  border-radius: 2px;
  padding: 3vw 3.7vw;
  margin-bottom: 4vw;
}
.activity-txt .date {
  font-size: 4.2vw;
}
.activity-txt .copyright {
  font-size: 3.33vw;
  margin-top: 10%;
}
.footer {
  width: 50%;
  height: 10.666vw;
  margin: 4vw auto 7vw;
}
.line-height {
  line-height: 7vw;
}
</style>


