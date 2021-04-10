<template>
  <div :class="{'sneaker-mall': hasdata===1}">
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>
    <div class="fix-hint" v-show="showHint">
      <div>
        <div class="waiter">
          <i class="i1"></i>
          <i class="i2"></i>
          <i class="i3"></i>
        </div>
        <p class="title">当前页面拥堵</p>
        <p class="title">{{hasdata?'请稍后再试':'请稍等'}}</p>
        <p v-show="hasdata">本场发售数量有限,先到先得。等待中库存可能会发生变动,最终有可能因为售罄而无法完成购买,敬请谅解！</p>
        <div class="btn" @click="back" v-if="!$root.ISIOS">知道了</div>
      </div>
    </div>
    <div v-if="hasdata">
      <!-- 活动方式B方式 查看助力的好友列表 -->
      <div class="friendListBox" v-if="type == 1">
        <div class="tit_box">
          <p class="tit">帮我助力好友：{{drawlotInfo.total || 0}}</p>
        </div>
        <div class="friendList">
          <div class="ranking_item_list" v-if="userlist && userlist.length > 0">
            <div class="friendItem" v-for="(item,index) in userlist" :key="index">
              <div class="img_box">
                <img :src="item.headpic?item.headpic:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt="">
              </div>
              <div class="name">{{item.name}}</div>
              <div class="time">{{item.createtime}}</div>
            </div>
          </div>
          <p class="empt" v-else>暂无助力好友~</p>
        </div>
      </div>
      <!-- 活动方式D 方式 查看助力的好友列表 我的人气值 页面 -->
      <div class="friendListBoxD" v-else-if="type == 2">
        <div class="tit_box">
          <p class="tit">我的人气值：{{drawlotInfo.value || 0}}</p>
          <p class="tit">帮我助力好友：{{drawlotInfo.total || 0}}</p>
        </div>
        <div class="friendListD" v-if="userlist && userlist.length > 0">
          <v-cutlist class="ranking_item_list" :more-handle="loadmore" :more-handling="isLoading" :isend="isEnd">
            <div class="friendItemD" v-for="(item, index) in userlist" :key="index">
              <div class="img_box">
                <img :src="item.headpic?item.headpic:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt >
              </div>
              <div class="infoBox">
                <div class="info">
                  <p class="name" :class="{'big':!item.needdownapp}">{{item.name}}</p>
                  <p class="value2">+{{item.value}}人气值<span v-if="item.needdownapp">,下载可再+{{opentInfo.popularconfig.downappvalue}}人气值</span></p>
                </div>
                <div class="info2">
                  <p class="time">{{item.createtime}}</p>
                  <p class="download" v-if="item.source == 2 && item.needdownapp" @click="warnDownApp">提醒下载APP</p>
                  <p class="sourcetxt" v-else>
                    <em v-if="item.source == 1">好友助力</em>
                    <em v-else-if="item.source == 2 && !item.needdownapp">新好友助力</em>
                    <em v-else-if="item.source == 3">首次帮好友助力</em>
                    <em v-else-if="item.source == 4">好友APP登录</em>
                    <em v-else-if="item.source == 5">APP首次登录</em>
                    <em v-else-if="item.source == 6">好友完成实名认证</em>
                    <em v-else-if="item.source == 7">完成实名认证</em>
                  </p>
                </div>
              </div>
            </div>
          </v-cutlist>
          
        </div>
      </div>
       
      <!-- 活动方式D 方式 查看人气榜单列表 -->
      <div class="Popularity_list_box" v-else-if="type == 3">
        <div class="my_popularity_info" v-if="drawlotInfo.rank && drawlotInfo.value">
          <p v-if="drawlotInfo.rank">
            <span>我的排名</span>
            <em v-if="Isinclusion">第<em class="bold">{{drawlotInfo.rank>10?drawlotInfo.rank:'0' + drawlotInfo.rank}}</em>名</em>
            <em v-else>{{drawlotInfo.rank}}</em>
          </p>
          <p v-if="drawlotInfo.value"><span>我的人气值</span><em class="bold">{{drawlotInfo.value}}</em></p>
        </div>
        <div class="Popularity_list Popularity_wantsize_list" v-if="opentInfo.popularconfig && opentInfo.popularconfig.wantsize && ularlist.length > 0">
          <div class="tit_info_box">
            <div class="tit_info"><img src="//files.eyee.com/eyeeh5/img/crunchies/frien_list_pop_before.png" alt=""><p>{{opentInfo.popularconfig.intentionsizenum}}</p><img src="//files.eyee.com/eyeeh5/img/crunchies/friend_list_pop_after_intention.png" alt=""></div>
          </div>
          <div class="my_ranking" v-if="ularlist">
            <div class="ranking_item" v-for="(item,index) in ularlist" :key="index" :class="{'hidden': index>opentInfo.popularconfig.intentionsizenum-1, 'borderN':index == opentInfo.popularconfig.intentionsizenum-1}">
              <div class="index">
                <span>{{index+1}}</span>
              </div>
              <div class="img_box">
                <img :src="item.headimgurl?item.headimgurl:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt>
              </div>
              <div class="name"><span class="name1">{{item.nickname}}<span class="isSelf" v-if="item.ismyself">我在这</span></span></div>
              <div class="point">
                <span>人气值</span>
                <strong>{{item.value}}点</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="Popularity_list Popularity_randomsize_list" v-if="opentInfo.popularconfig && opentInfo.popularconfig.randomsize && ularlist.length > 0">
          <div class="tit_info_box">
            <div class="tit_info" v-if="opentInfo.popularconfig.wantsize"><img src="//files.eyee.com/eyeeh5/img/crunchies/friend_list_pop_title.png" alt=""><p>{{opentInfo.popularconfig.randomsizeminnum}}-{{opentInfo.popularconfig.randomsizemaxnum}}</p><img src="//files.eyee.com/eyeeh5/img/crunchies/friend_list_pop_after_rand.png" alt=""></div>
            <div class="tit_info" v-else><img src="//files.eyee.com/eyeeh5/img/crunchies/frien_list_pop_before.png" alt=""><p>{{opentInfo.popularconfig.randomsizemaxnum}}</p><img src="//files.eyee.com/eyeeh5/img/crunchies/friend_list_pop_after_rand.png" alt=""></div>
          </div>
          <div class="my_ranking" v-if="ularlist">
            <v-cutlist class="ranking_item_list" :more-handle="loadmore" :more-handling="isLoading" :isend="isEnd">
              
              <div class="ranking_item" v-for="(item,index) in ularlist" :key="index" :class="{'hidden': opentInfo.popularconfig.wantsize?(index<opentInfo.popularconfig.intentionsizenum || index > opentInfo.popularconfig.randomsizemaxnum-1):index > opentInfo.popularconfig.randomsizemaxnum-1, 'borderN':index == opentInfo.popularconfig.randomsizemaxnum-1}">
                <div class="index">
                  <span v-if="opentInfo.popularconfig.wantsize">{{index+1}}</span>
                  <span v-else>{{index+1}}</span>
                </div>
                <div class="img_box">
                  <img :src="item.headimgurl?item.headimgurl:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt>
                </div>
                <div class="name"><span class="name1">{{item.nickname}}<span class="isSelf" v-if="item.ismyself">我在这</span></span></div>
                <div class="point">
                  <span>人气值</span>
                  <strong>{{item.value}}点</strong>
                </div>
              </div>

            </v-cutlist>
          </div>
        </div>

        <div class="Popularity_list Popularity_randomsize_list" v-if="opentInfo.popularconfig && opentInfo.popularconfig.minpricesize && ularlist.length > 0">
          <div class="tit_info_box">
            <div class="tit_info"><img src="//files.eyee.com/eyeeh5/img/crunchies/pop_pre.png" alt=""><p>{{opentInfo.popularconfig.minpricesizenum}}</p><img src="//files.eyee.com/eyeeh5/img/crunchies/pop_ming_after.png" alt=""></div>
          </div>
          <div class="my_ranking" v-if="ularlist">
            <v-cutlist class="ranking_item_list" :more-handle="loadmore" :more-handling="isLoading" :isend="isEnd">
              
              <div class="ranking_item" v-for="(item,index) in ularlist" :key="index" :class="{'hidden': index > opentInfo.popularconfig.minpricesizenum-1}">
                <div class="index">
                  <span>{{index+1}}</span>
                </div>
                <div class="img_box">
                  <img :src="item.headimgurl?item.headimgurl:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt>
                </div>
                <div class="name"><span class="name1">{{item.nickname}}<span class="isSelf" v-if="item.ismyself">我在这</span></span></div>
                <div class="point">
                  <span>人气值</span>
                  <strong>{{item.value}}点</strong>
                </div>
              </div>

            </v-cutlist>
          </div>
        </div>
        <div class="btnBox fix-btm">
          <div class="btn" v-if="opentInfo.status !== 1 && drawlotInfo.codelist && drawlotInfo.codelist.length == 0" @click="join">立即参与</div>
          <div class="btn" v-else-if="opentInfo.status !== 1 && drawlotInfo.codelist && drawlotInfo.codelist.length > 0 && drawlotInfo.codelist[0].status != 3" @click="playListShare()">立即分享</div>
          <div class="btn" v-else-if="opentInfo.status !== 1 && drawlotInfo.codelist && drawlotInfo.codelist.length > 0 && drawlotInfo.codelist[0].status == 3" @click="playListShare()">喊人来玩</div>
          <div class="btn end" v-else-if="opentInfo.status === 1" @click="clickHint(2)">已结束</div>
        </div>
      </div>
      <ticket-model
        @close="closeModel"
        @call-getProCode="getProCode"
        :cssShow="cssShow"
        :ModelStatus="ModelStatus"
        :GetActcode="GetActcode"
        :activityType="activityType"
        :chooseSizeList="chooseSizeList"
        :chooseSizeNum="chooseSizeNum"
        :intentionsizenum="intentionsizenum"
        :wantsizerandomsize="wantsizerandomsize"
        :opentInfo="opentInfo"
        :drawlotInfo="drawlotInfo"
      ></ticket-model>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  HasLoginActivityinfov2i,
  Activityinfov2i,
  Popularlist,
  Helpuserlist,
  Getcodev2i,
  Sizelistv2i
} from "../../../common/api/bull";
import TicketModel from "@/comps/bull/sneakerticket/detail_pop";
var loader, refreshTimer;
export default {
  components: { TicketModel },
  data() {
    return {
      title: "",
      hasdata: 2,
      drawlotInfo: {},
      opentInfo: {},
      ularlist: [], // 人气榜单列表
      userlist: [], // 好友助力列表
      activityid: "",
      type: 0,

      page: 1,
      isLoading: false,
      isEnd: false,

      showHint: false,

      // 组件参数
      cssShow: false,
      ModelStatus: 0,
      GetActcode: {}, // 获取购买码数据
      activityType: 1, // 活动类型 暂时设置4 (1 助力  2群权限制 3无群限制,4.选尺码抢购 5.打榜)
      chooseSizeList: [], // 选择意向尺码列表
      wantsizerandomsize: 0, // 意向和随机类型 全网最低
      intentionsizenum: 0, // 意向选择尺码个数    
      chooseSizeNum: 0 // 榜单必中意向尺码人数
      
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    },
    // 入围情况
    Isinclusion() {
      let _ = this, Isinclusion = 0;
      if(_.opentInfo.popularconfig && _.drawlotInfo.rank && _.drawlotInfo.list && _.drawlotInfo.list.length > 0 && _.drawlotInfo.codelist && _.drawlotInfo.codelist.length > 0 && _.drawlotInfo.codelist[0].status !== 1) {
        if(_.opentInfo.popularconfig.randomsize && _.drawlotInfo.rank <= _.opentInfo.popularconfig.randomsizemaxnum && _.drawlotInfo.rank >= _.opentInfo.popularconfig.randomsizeminnum) {
          // 进入必中随机
          Isinclusion = 1
        }  else if (_.opentInfo.popularconfig.wantsize && _.drawlotInfo.rank <= _.opentInfo.popularconfig.intentionsizenum){
          // 进入必中意向 //此时也有随机
          Isinclusion = 2
        } else if(_.opentInfo.popularconfig.minpricesize && _.drawlotInfo.rank <= _.opentInfo.popularconfig.minpricesizenum) {
          // 进去全网最低价 可选尺码
          Isinclusion = 3
        } else {
          // 未入围
          Isinclusion = 0
        } 
      }
      return Isinclusion
    }
  },
  watch: {
    showHint(val, old) {
      // console.log('watch showHint',val,old)
      if (val) {
        // 10s刷新一次
        refreshTimer = setTimeout(() => window.location.reload(), 10000);
        document.body.classList.add("lock");
      } else {
        if (refreshTimer) clearTimeout(refreshTimer, (refreshTimer = null));
        document.body.classList.remove("lock");
      }
    }

  },
  beforeMount() {
    let _ = this;

    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          hideshareicon: true
        }
      });
    }
  },
  mounted() {
    let _ = this;
    _.activityid = _.$route.query.activityid || '' // 从路由上获取activityId
    _.type = _.$route.query.type || 0
    if(_.type == 1) {
      _.title = "好友列表"
    } else if(_.type == 2) {
      _.title = "我的人气值"
    } else if(_.type == 3) {
      _.title = "实时人气榜单"
    }
    _.setToolBar({ title: _.title });
    _.handleInit();
  },
  created() {},
  methods: {
    hasLoginHandleInit() {
      let _ = this,
          activityid = _.activityid;

      HasLoginActivityinfov2i({ activityid })
        .then(res => {
          if (res) {
            if (refreshTimer) clearTimeout(refreshTimer);
            _.showHint = false;
            _.drawlotInfo = res;
            _.hasdata = 1;
          }
        })
        .catch(e => {
          _.hasdata = 0
          if (e.code == 1511401) {
            console.error("Activityinfo error: ", e);
            _.toast(e && e.msg ? e.msg : "");
            return
          } else {
            _.showHint = true;
          }
        });
    },
    handleInit() {
      let _ = this,
        activityid = _.activityid;
      Activityinfov2i({ activityid })
        .then(res => {
          if (refreshTimer) clearTimeout(refreshTimer);
          _.showHint = false;
          _.opentInfo = res;
          // 活动类型
          _.activityType = res.type;
          if(_.activityType == 5) {
            if(_.opentInfo.popularconfig.wantsize && _.opentInfo.popularconfig.randomsize) {
            // 意向尺码 && 随机尺码
              _.wantsizerandomsize = 0
            } else if(_.opentInfo.popularconfig.wantsize && !_.opentInfo.popularconfig.randomsize) {
              // 意向尺码
              _.wantsizerandomsize = 1
            } else if(!_.opentInfo.popularconfig.wantsize && _.opentInfo.popularconfig.randomsize) {
              // 随机尺码
              _.wantsizerandomsize = 2
            } else if(_.opentInfo.popularconfig.minpricesize) {
              // 阶梯价格
              _.wantsizerandomsize = 3
            }
            //榜单必中意向尺码人数
            _.intentionsizenum = _.opentInfo.popularconfig.intentionsizenum
            //需选择意向尺码数    
            _.chooseSizeNum = _.opentInfo.popularconfig.sizenum
          }
          _.hasLoginHandleInit();
          if(_.type == 3) {
            _.Popularlist();
          } else if(_.type == 2 || _.type == 1) {
            _.Helpuserlist();
          }
          
          _.hasdata = 1;
          
        })
        .catch(e => {
          if (e.code == 1511401) {
            console.error("Activityinfo error: ", e);
            _.toast(e && e.msg ? e.msg : "");
            return
          } else {
            _.showHint = true;
          }
        });
    },
    Popularlist() {
      let _ = this, activityid = _.activityid, page = _.page, uid = _.user.uid;
      let size;
      if(_.opentInfo.popularconfig.wantsize) {
        size = _.opentInfo.popularconfig.intentionsizenum+10
      } else if (_.opentInfo.popularconfig.minpricesize) {
        if(_.opentInfo.popularconfig.minpricesizenum < 10) {
          size = _.opentInfo.popularconfig.minpricesizenum
        } else {
          size = 10
        }
      } else {
          size = 10
      }
      console.log(9999, size)
      _.isLoading = true
      Popularlist({activityid, page, size, uid}).then( res => {
        if (refreshTimer) clearTimeout(refreshTimer);
        _.showHint = false;
        // console.log('11人气榜单列表', res, _.isEnd)
        if(res && res.list) {
          if(res && res.list && res.list.length > 0) {
            if(res.page == 1) {
              _.ularlist = res.list
            } else {
              _.ularlist = _.ularlist.concat(res.list)
            }
          } else {
            _.isEnd = true
          }
          if(_.opentInfo.popularconfig.randomsize) {
            if(page*size >= res.total || page*size >= _.opentInfo.popularconfig.randomsizemaxnum) {
              _.isEnd = true
            }
          } else if(_.opentInfo.popularconfig.minpricesize) {
            if(page*size >= res.total || page*size >= _.opentInfo.popularconfig.minpricesizenum) {
              _.isEnd = true
            }
          }
          _.isLoading = false

        }
        
        console.log('222 ularlist', _.ularlist)
      }).catch( e => {
        if (e.code == 1511401) {
          console.error("Activityinfo error: ", e);
          _.toast(e && e.msg ? e.msg : "");
          return
        } else {
          _.showHint = true;
        }
      })
      
      
    },
    Helpuserlist() {
      let _ = this, activityid = _.activityid, page = _.page;
      let size = 10;
      _.isLoading = true
      Helpuserlist({activityid, page, size}).then( res => {
        if (refreshTimer) clearTimeout(refreshTimer);
        _.showHint = false;
        if(res && res.list) {
          if(res && res.list && res.list.length > 0) {
            if(res.page == 1) {
              _.userlist = res.list
            } else {
              _.userlist = _.userlist.concat(res.list)
            }
          } else {
            _.isEnd = true
          }
          if(page*size >= res.total) {
            _.isEnd = true
          }
          _.isLoading = false

        }
      }).catch( e => {
        if (e.code == 1511401) {
          console.error("Activityinfo error: ", e);
          _.toast(e && e.msg ? e.msg : "");
          return
        } else {
          _.showHint = true;
        }
      })
    },
    loadmore() {
      // _.type 1,2 好友列表 3 人气榜单
      let _ = this
      if (_.isEnd === true) {
        _.toast('已无更多')
      } else {
        _.page += 1
        if(_.type == 3) {
          _.Popularlist()
        } else if(_.type == 2 || _.type == 1) {
          _.Helpuserlist()
        }
      }
    },
    // D方式 分享
    playListShare() {
      let _ = this,
          param = {
            type: 9
          }
      let status = 0,
          describe = ""; // status 状态值 describe 状态值的描述
      status = 11
      describe = "D种方式 分享"
      _.getProCode(param);
      $log({ e: "ipoclick", p: { status: status, describe: describe } });
    },
    // 获取购买码
    getProCode(param) {
      console.log('param --->', param)
      let _ = this,
        activityid = _.activityid
      Getcodev2i({ activityid })
        .then(res => {
          if (res) {
            if (res.status === 1 && param.type == 1) {
            } else {
              _.GetActcode = { ..._.GetActcode, ...res };
              _.cssShow = true;
              
              document.body.classList.add("lock");
                     
              switch (param.type) {
                case 8:
                  // 活动方式D打榜 选择尺码后 展示登记成功页
                  _.ModelStatus = 7;
                  break;
                case 9:
                  // 活动方式D打榜 D分享激活和继续分享
                  _.ModelStatus = 9;
                  break;
              }
            }
          }
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    // D种方式 立即参与 选意向尺码
    join() {
      let _ = this,
      activityid = _.activityid;
      let status = 0,
          describe = ""; // status 状态值 describe 状态值的描述
      if(_.opentInfo.popularconfig && _.opentInfo.popularconfig.wantsize) {
        status = 9
        describe = "D种方式 立即参与 有意向榜单时 选意向尺码"
        // 有意向榜单时 显示选意向尺码
        Sizelistv2i({activityid}).then( res => {
          _.chooseSizeList = res
          _.cssShow = true;
          _.ModelStatus = 6;
        }).catch( e => {
            if (e.code == 1511401) {
              _.toast(e.msg)
            }
        })
      } else {
        status = 10
        describe = "D种方式 立即参与 没有意向榜单 走分享流程"
        // 没有意向榜单 直接走getcode接口然后显示分享的弹框 就是相当于走 分享流程
        _.playListShare()
      }

      $log({ e: "ipoclick", p: { status: status, describe: describe } });
    },
    back() {
      if (this.$root.ISAPP) this.javascriptBridge({ name: "gotoAppLastPage" });
      else history.back();
    },
    warnDownApp() {
      let _ = this;
      _.cssShow = true;
      _.ModelStatus = 8;
    },
    clickHint(type) {
      // type=2 来晚了 活动已结束~
      let msg = "",
        _ = this;
      switch (type) {
        case 2:
          msg = "活动已结束~";
          break;
      }
      _.toast(msg);
    },
    closeModel(v) {
      let _ = this;
      if (v) {
        _.cssShow = false;
        _.ModelStatus = 0;
      }
      _.hasLoginHandleInit();
    },
  }
};
</script>
<style lang="scss" scoped>
.sneaker-mall {
  background:#ebebeb;
  width: 100%;
  min-height: 100vh;
  padding: 0 15px 20px;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
}
.empty {
  background: #fff;
  text-align: center;
  padding-top: 20vh;
  min-height: 100vh;
  p {
    color: #999;
    margin: 20px;
  }
  button {
    display: inline-block;
    color: #fff;
    font-size: 15px;
    background: #333;
    padding: 5px 30px;
    border-radius: 2px;
  }
}
.friendListBox{
  .tit_box{
    padding: 0 4vw;
    .tit{
      height: 50px;
      line-height: 50px;
      font-size: 13px;
      font-weight: bold;
      color:#232323;
    }
  }
}
.friendList{
  background: #fff;
  border-radius: 20px;
  padding: 20px 25px;
  .friendItem{
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #F0F0F0;
    &:last-child{
      border: 0;
    }
    .img_box{
      height: 25px;
      width: 25px;
      margin-right: 5px;
      img{
        display: block;
        width: 25px;
        height: 25px;
        border-radius: 50%;  
      }
    }
    .name{
      flex: 1;
      color: #232323;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      overflow: hidden; 
      text-overflow: ellipsis; 
      white-space: nowrap;
      max-width: 46vw;
    }
    .time{
      height: 18px;
      line-height: 18px;
      width: 35vw;
      color: #969696;
      font-size: 12px;
    }
  }
}
.btn_box{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: #fff;
  transform: translateZ(0);
  .close{
    text-align: center;
    height: 82px;
    line-height: 75px;
    color: #D6D6D6;
    font-size: 30px;
  }
}
.friendListBoxD{
  .tit_box{
    display: flex;
    align-items: center;
    padding: 0 4vw;
    justify-content: space-between;
    .tit{
      height: 50px;
      line-height: 50px;
      font-size:14px;
      font-weight:600;
      color:#232323;
    }
  }
  
  .friendListD{
    background: #fff;
    border-radius: 20px;
    padding: 20px 4vw;
    .friendItemD{
      display: flex;
      align-items: center;
      height: 66px;
      border-bottom: solid 1px #F0F0F0;
      &:last-child{
        border: 0;
      }
      .img_box{
        width: 9vw;
        img{
          display: block;
          width: 8vw;
          height: 8vw;
          border-radius: 50%;
        }
      }
      .infoBox{
        width: 87vw;
        padding-left: 2vw;
        .info{
          display: flex;
          justify-content: space-between;
          height: 24px;
          line-height: 24px;
          .name{
            font-size: 14px;
            color: #232323;
            font-weight: 400;
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
            max-width: 25vw;
            &.big{
              max-width: 40vw;
            }
          }
          .value1{
            font-size: 14px;
            color: #646464;
            font-weight: 400;
            position: relative;
            top: 12px;
          }
          .value2{
            font-size: 12px;
            color: #646464;
            font-weight: 400;
          }
        }
        .info2{
          display: flex;
          justify-content: space-between;
          height: 24px;
          line-height: 24px;
          .time{
            font-size: 12px;
            color: #969696;
            font-weight: 400;
          }
          .download{
            font-size: 12px;
            color: #fff;
            width: 70px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: #232323;
            border-radius: 3px;
          }
          .sourcetxt{
            em{
              font-size: 12px;
              color: #646464;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
.Popularity_list_box{
  padding-top: 15px;
  padding-bottom: 70px;
}
.my_popularity_info{
  background:#fff;
  border-radius:20px;
  padding: 10px 8vw;
  margin-bottom: 4vw;
  p{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-weight: 400;
    color:#232323;
    display: flex;
    span{
      width: 30%;
    }
    em{
      width: 70%;
      text-align: right;
      color:#232323;
      .blod{
        font-size: 14px;
        font-weight: bold;
        padding: 0 2px;
      }
    }
  }
}
.Popularity_list{
  background:#fff;
  border-radius:20px;
  padding: 0 8vw 25px;
  margin-bottom: 4vw;
  .tit_info_box{
    padding-top: 30px;
    margin-bottom: 30px;
  }
  .tit_info{
    height: 18px;
    text-align: center;
    text-align: center;
    justify-content: center;
    display: flex;
    img{
      display: block;
      height: 18px;
    }
    p{
      display: block;
      color: #F92438;
      font-family: 'OswaldBold';
      font-size: 18px;
      padding: 0 1px;
      height: 18px;
      line-height: 18px;
    }
  }
}

.my_ranking{
  
}
.ranking_item{
  height: 50px;
  line-height: 50px;
  display: flex;
  padding: 12px 0;
  border-bottom: solid 1px #F0F0F0;
  &.hidden{
    display: none;
  }
  &:last-child{
    border: 0;
  }
  &.borderN{
    border: 0;
  }
  .index{
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    margin-right: 5px;
    img{
      display: block;
      width: 26px;
      height: 26px;
    }
    span{
      color: #232323;
      font-size: 12px;
    }
  }
  .img_box{
    width: 26px;
    height: 26px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    img{
      display: block;
      width: 26px;
      height: 26px;
    }
  }
  .name{
    flex: 1;
    height: 26px;
    line-height: 26px;
    .name1{
      color: #232323;
      font-size: 12px;
      position: relative;
      .isSelf{
        position: absolute;
        top: -6px;
        right: -64px;
        display: inline-block;
        width:56px;
        height:26px;
        line-height: 26px;
        background:rgba(245,245,245,1);
        border-radius: 13px;
        color: #646464;
        font-size: 12px;
        text-align: center;
      }
    }
    
  }
  .point{
    width: 40%;
    display: flex;
    text-align: right;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    span{
      width: 50%;
      color: #646464;
    }
    strong{
      width: 50%;
      color: #232323;
    }
  }
}
.fix-hint {
  position: fixed;
  transform: translateZ(0);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 102;

  & > div {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    padding: 10.667vw 8vw 8vw;
  }

  .waiter {
    font-size: 8vw;

    .i1,
    .i2,
    .i3 {
      display: block;
      width: 2vw;
      height: 2vw;
      margin: 2.667vw auto;
      border-radius: 100%;
      background: #fff;
      animation: fade 1.4s infinite ease-in-out both;
    }
    .i1 {
      animation-delay: -0.32s;
    }
    .i2 {
      animation-delay: -0.16s;
    }

    @keyframes fade {
      0%,
      80%,
      to {
        opacity: 0.4;
      }

      40% {
        opacity: 0.9;
      }
    }
  }

  p {
    color: #ccc;
    margin-top: 8vw;
    font-size: 3.733vw;
    letter-spacing: 1px;
  }

  .title {
    text-align: center;
    color: #fff;
    font-size: 7.467vw;
    font-weight: bold;
    margin-top: 2.667vw;
  }

  .btn {
    background: #fff;
    margin: 30vh auto 0;
    width: 73.333vw;
    line-height: 10.667vw;
    color: #000;
    text-align: center;
    border-radius: 5.333vw;
  }
}
.btnBox{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0 10px 4vw;
  background: #fff;
  display: flex;
  z-index: 3;
  transform: translateZ(0);
  .btn{
    flex: 1;
    height: 50px;
    background: #fa2337;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    text-align: center;
    margin-right: 4vw;
    &.end{
      background: #969696;
    }
  }
}
.empt{
  font-size: 14px;
  font-weight: bold;
  color: #232323;
  text-align: center;
  height: 20px;
  line-height: 20px;
}
</style>

