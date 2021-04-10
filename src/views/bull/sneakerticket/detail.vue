<template>
  <div class="box">
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">{{ title }}</div>
    </v-header>
    <loader class="load" from="1" :id="activityid" v-if="!$root.ISAPP && hasdata == 1">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader>
    <div :class="{ 'sneaker-mall': hasdata === 1 }" v-if="hasdata === 1">
      <template>
        <!--活动开始提醒我 消息通知打开提醒 -->
        <!-- <div class="msg_notify_open" v-if="activityType != 4 && !is_on_msg && appversion >= '3.4.8'" @click="goOpenMsg">
          <div class="icon"></div>
          <div class="info">
            <div class="info1">开启通知</div>
            <div class="info2">不错过任何发售动态</div>
          </div>
          <div class="btn">去开启</div>
        </div>-->
        <!-- 购买成功小喇叭 -->
        <div class="buy_notice" v-if="
            isStart &&
            recordMsg &&
            recordMsg.length > 0 &&
            opentInfo.status != 1
          ">
          <ul :class="{ buyRecordList: animate == true }">
            <li class="buy_notice_item" v-for="(item, index) in recordMsg" :key="index">
              {{ item.username }} 抢到【{{ item.size }}】码
            </li>
          </ul>
        </div>
        <!-- 「买卖区」 逛一逛-->
        <div class="fixGo" @click="go(1)" v-if="opentInfo.couponarea">
          <div class="info">
            <p>「竞拍区」</p>
            <p>逛一逛</p>
          </div>
        </div>
        <div class="info_box" v-if="opentInfo">
          <div class="img_box flex-aic flex-col" @click="goProductDetail">
            <img id="mapImg" :src="opentInfo.image" alt />
          </div>
          <div class="ticketBox_pop_list">
            <div class="ticketBox_pop_list_left">
              <p class="tit">斗牛发售价</p>
              <p v-if="!opentInfo.showprice && opentInfo.status == 2" class="unPrice">
                <strong class="font-price price-sign">¥</strong>
                <em></em>
              </p>
              <p class="now_price" v-else>
                <strong class="font-price price-sign">¥</strong>
                <em>
                  {{ opentInfo.price }}
                  <img v-if="opentInfo.issameprice !== 1" src="//files.eyee.com/eyeeh5/img/crunchies/pop_qi.png" alt />
                </em>
              </p>
            </div>
            <div class="ticketBox_pop_list_right">
              <p class="deliver">{{ opentInfo.deliver }}</p>
              <p class="agora_price">
                <del>市场价￥{{ opentInfo.saleprice }}</del>
              </p>
            </div>
          </div>

          <!-- B活动 助力好友显示-->
          <div class="main_info" v-if="activityType == 1">
            <div class="diff_status" v-if="codeList && codeList.length > 0">
              <div class="info" v-if="
                  (codeList && codeList.length == 0) || codeList[0].status == 1
                ">
                <img src="http://files.eyee.com/eyeeh5/img/crunchies/share_info1.png" alt />
                <p>{{ codeList[0].count }}</p>
                <img v-if="opentInfo.canhelpuser == 2" src="http://files.eyee.com/eyeeh5/img/crunchies/share_info3.png" alt />
                <img v-else src="http://files.eyee.com/eyeeh5/img/crunchies/share_info2.png" alt />
              </div>
              <div class="info" v-if="codeList[0].status == 2">
                <img src="http://files.eyee.com/eyeeh5/img/crunchies/success_tit.png" alt />
              </div>
            </div>
            <div class="help-friend-list" v-if="drawlotInfo.list && codeList && codeList.length > 0">
              <div class="help_img">
                <div class="help_item" v-for="(item, index) in drawlotInfo.list" :key="index" :class="{ hidden: index > 3 }">
                  <img :src="
                      item.headpic
                        ? item.headpic
                        : 'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'
                    " alt />
                </div>
                <div class="emp" v-if="
                    drawlotInfo.list &&
                    codeList &&
                    codeList.length > 0 &&
                    codeList.length <= (codeList[0] && codeList[0].helpnum)
                    &&codeList[0].status!=2
                  ">
                  <div class="help_item help_empty" v-for="(item, index) in (codeList[0].helpnum > 4
                      ? 4
                      : codeList[0].helpnum) -
                    (drawlotInfo.list.length > 4 ? 4 : drawlotInfo.list.length)" :key="index" @click="playListShare()">
                    <span></span>
                  </div>
                </div>
                <div class="help_item help_empty look_more" v-if=" drawlotInfo.list && drawlotInfo.list.length > 0">
                  <em class="look" @click="look(1)">
                    <em>more</em>
                    <i></i>
                  </em>
                </div>
              </div>
            </div>
            <!-- button 区域 start -->
            <div class="btn_diff_status btn_diff_statusB" ref="btn_diff_statusB" v-show="!showBtnB">
              <div v-if="!$root.ISAPP">
                <loader class="load" :id="activityid" from="1" useConfirm style="display: block; width: 100%">
                  <div class="p">立即参与</div>
                </loader>
              </div>
              <div v-else-if="$root.ISAPP && isShowBtn">
                <!-- 未登录 去登录 -->
                <div v-if="notloged" class="p" @click="callAppLogin()">
                  立即参与
                </div>
                <div v-else>
                  <div class="flex_box" v-if="opentInfo.status === 1">
                    <div class="ending" @click="clickHint(2)">已结束</div>
                    <!-- <div class="p" @click="go(1)">去"买卖区"购买</div> -->
                  </div>
                  <div v-else-if="opentInfo.status === 2" class="p hasset set" :class="{ set: is_on_msg }" @click="goOpenMsg">
                    <!-- 即将开始,请稍后再来 -->
                    <span>{{ is_on_msg ? "已设置提醒" : "开始提醒我" }}</span>
                  </div>
                  <div v-else-if="opentInfo.status === 0">
                    <!-- 完成支付 -->
                    <div v-if="
                        codeList && codeList.length && codeList[0].ispaysuccess
                      " @click="go(1)">
                      <div class="p">已抢购成功 去逛逛</div>
                    </div>
                    <div class="flex_box" v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 3
                      ">
                      <div class="ending" @click="clickHint(5)">
                        本场抢购机会已失效
                      </div>
                      <!-- <div class="p" @click="go(1)">去"买卖区"购买</div> -->
                    </div>
                    <!-- 还未激活 -->
                    <div v-else-if="
                        codeList &&
                        (codeList.length == 0 ||
                          (codeList.length > 0 && codeList[0].status == 1))
                      ">
                      <!-- 有缩放动效 -->
                      <div class="p zoom" @click="playListShare(1)">
                        立即分享
                      </div>
                      <div class="hint">
                        <div class="p_info" v-if="!isStart">
                          还差 {{ timeData }} 开抢，请尽早激活～
                        </div>
                        <div class="p_info" v-else>正在抢购中，请尽快激活</div>
                      </div>
                    </div>
                    <!-- 已激活 -->
                    <div v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2
                      ">
                      <div class="p" :class="{ unStart: isShowVipChannel == 2 }" v-if="
                          isShowVipChannel > 0 &&
                          isVip &&
                          (!opentInfo.showsize ||
                            (opentInfo.showsize && allInv))
                        " @click="isShowVipChannel == 3 ? playListRob2() : ''">
                        {{
                          isShowVipChannel == 2
                            ? `专属通道将在 ${timeData_7} 后开放`
                            : `请在 ${timeData_7} 分内完成专属通道抢购`
                        }}
                      </div>
                      <div class="p unStart" v-else-if="!isStart">
                        还差
                        <span style="padding: 0 5px">{{ timeData }}</span>开抢
                      </div>
                      <div v-else>
                        <!-- 不选尺码-->
                        <div class="p" v-if="opentInfo.codenum == 1 && !opentInfo.showsize" @click="playListRob2()">
                          马上抢
                        </div>
                        <!-- 选尺码-->
                        <div class="p" v-else-if="
                            opentInfo.codenum == 1 &&
                            opentInfo.showsize &&
                            allInv
                          " @click="playListRob2()">
                          马上抢
                        </div>
                        <!-- 选尺码 无库存-->
                        <div class="p unStart" v-if="
                            opentInfo.codenum == 1 &&
                            !allInv &&
                            opentInfo.showsize > 0
                          " @click="clickHint(3)">
                          <span>排队中,请3分钟后再试...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 您是斗牛年卡会员，享受专属通道提前抢特权   -->
                  <div class="flex-center isvip" @click.stop="checkvip(1)" v-if="isopenchannel" :class="{
                      mt:
                        opentInfo.status === 0 &&
                        codeList &&
                        (codeList.length == 0 ||
                          (codeList.length > 0 && codeList[0].status == 1)),
                    }">
                    <span v-if="isVip">您是斗牛年卡会员，享受专属通道提前抢特权</span>
                    <span v-else class="bolt">
                      特殊通道可提前抢！
                      <em>点击开启</em>
                    </span>
                    <i v-if="isVip"></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- button 区域 end -->
          </div>

          <!-- 抢购概率 -->
          <div class="rob_chance" v-else-if="activityType == 5">
            <div class="Popularity_list_tit" v-if="opentInfo.popularconfig">
              <div class="bar" :class="{
                  max: wantsizerandomsize == 0 || wantsizerandomsize == 3,
                }">
                <img :src="`https://files.eyee.com/eyeeh5/img/crunchies/${
                    wantsizerandomsize == 0 ? 'ear_max_be' : 'ear_min_be'
                  }.png`" alt />
              </div>
              <div class="tit_info_box">
                <div class="tit_info" v-if="opentInfo.popularconfig.wantsize">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_before.png" alt />
                  <p>{{ opentInfo.popularconfig.intentionsizenum }}</p>
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_after_intention.png" alt />
                </div>
                <div class="tit_info" v-if="opentInfo.popularconfig.randomsize">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_before.png" alt />
                  <p>{{ opentInfo.popularconfig.randomsizemaxnum }}</p>
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_after_rand.png" alt />
                </div>

                <div class="tit_info" v-if="opentInfo.popularconfig.minpricesize">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_pre.png" alt />
                  <p>{{ opentInfo.popularconfig.minpricesizenum }}</p>
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/ming.png" alt />
                </div>
                <div class="tit_info" v-if="opentInfo.popularconfig.minpricesize">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/network_size.png" alt />
                </div>
              </div>
              <div class="bar after" :class="{
                  max: wantsizerandomsize == 0 || wantsizerandomsize == 3,
                }">
                <img :src="`https://files.eyee.com/eyeeh5/img/crunchies/${
                    wantsizerandomsize == 0 ? 'ear_max_be' : 'ear_min_be'
                  }.png`" alt />
              </div>
            </div>
            <p class="title">
              <span>抢购进度</span>
              <em v-if="drawlotInfo.sizes">(意向尺码:{{ drawlotInfo.sizes }})</em>
            </p>
            <div class="msg_exp" v-if="!isOverpoplar">
              <p>人气值实时更新,若停止分享可能导致排名被反超</p>
            </div>
            <div class="rate_exp" v-if="opentInfo.popularconfig">
              <div class="bar" :class="{
                  act:
                    codeList && codeList.length > 0 && codeList[0].status !== 1,
                }">
                <p class="info">可抢随机尺码</p>
                <span class="dot"></span>
              </div>
              <div class="bar" v-if="opentInfo.popularconfig.randomsize" :class="{
                  act:
                    (wantsizerandomsize == 0 || wantsizerandomsize == 2) &&
                    (Isinclusion == 1 || Isinclusion == 2),
                }">
                <p class="info">必中随机尺码</p>
                <span class="dot"></span>
              </div>
              <div class="bar" v-if="opentInfo.popularconfig.wantsize" :class="{
                  act:
                    (wantsizerandomsize == 1 || wantsizerandomsize == 0) &&
                    Isinclusion == 2,
                }">
                <p class="info">必中意向尺码</p>
                <span class="dot"></span>
              </div>
              <div class="bar" v-if="opentInfo.popularconfig.minpricesize" :class="{ act: wantsizerandomsize == 3 && Isinclusion == 3 }">
                <p class="info">全网低价可选尺码</p>
                <span class="dot"></span>
              </div>
            </div>
            <div class="progress_bar">
              <div class="cut-bar" :style="{ width: percentBar + '%' }"></div>
            </div>
            <div class="rate_exp_info" v-if="
                !isOverpoplar &&
                opentInfo.status == 0 &&
                codeList &&
                codeList.length > 0
              ">
              <div class="info" v-if="codeList[0].status == 1">
                分享{{ codeList[0].count }}个好友助力，即可参与抢购～
              </div>
              <div class="rate_exp_info_box" v-else-if="
                  codeList[0].status != 1 && drawlotInfo.rank && !isOverpoplar
                ">
                <div class="info" v-if="
                    (opentInfo.popularconfig.wantsize && Isinclusion == 2) ||
                    (!opentInfo.popularconfig.wantsize &&
                      opentInfo.popularconfig.randomsize &&
                      Isinclusion == 1) ||
                    (opentInfo.popularconfig.minpricesize && Isinclusion == 3)
                  ">
                  已暂时进入榜单,继续分享保持排名～
                </div>
                <div class="info" v-else>
                  距前一名还差
                  <span class="red">{{ drawlotInfo.differvalue }}</span>人气值，快去分享~
                </div>
              </div>
            </div>
            <!-- button 区域 start -->
            <div class="btn_diff_status btn_diff_statusD" ref="btn_diff_statusD" v-show="!showBtnD">
              <div v-if="!$root.ISAPP">
                <loader class="load" :id="activityid" from="1" useConfirm style="display: block; width: 100%">
                  <div class="p start">立即参与</div>
                </loader>
              </div>
              <div v-else-if="$root.ISAPP && isShowBtn">
                <!-- 未登录 去登录 -->
                <div v-if="notloged" class="p" @click="callAppLogin()">
                  立即参与
                </div>
                <div v-else>
                  <div class="flex_box" v-if="opentInfo.status === 1">
                    <div class="ending" @click="clickHint(2)">已结束</div>
                    <!-- <div class="p" @click="go(1)">去"买卖区"购买</div> -->
                  </div>
                  <!-- <div v-else-if="opentInfo.status === 2" class="p">即将开始,请稍后再来</div> -->
                  <div v-else-if="opentInfo.status === 2" class="p hasset set" :class="{ set: is_on_msg }" @click="goOpenMsg">
                    <!-- 即将开始,请稍后再来 -->
                    <span>{{ is_on_msg ? "已设置提醒" : "开始提醒我" }}</span>
                  </div>
                  <div v-else-if="opentInfo.status === 0">
                    <!-- 有缩放动效 -->
                    <div class="p zoom" v-if="codeList && codeList.length == 0" @click="join">
                      立即参与
                    </div>
                    <div class="p zoom" v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        (codeList[0].status == 1 ||
                          (codeList[0].status == 2 && !isOverpoplar))
                      " @click="playListShare()">
                      立即分享
                    </div>
                    <!-- isOverpoplar true 榜单已截止 false  榜单未截止 -->
                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        (Isinclusion == 0 ||
                          (Isinclusion == 1 && isRanendOver) ||
                          (Isinclusion == 2 && isSpeendOver) ||
                          (Isinclusion == 3 && isMinpriceendOver))
                      ">
                      <!-- 普通通道 未进榜单 || 意向未点抢(code是激活状态 意向通道截止) || 随机未点抢(code是激活状态 随机通道截止) || 全网最低未点抢(code是激活状态 全网最低通道截止)-->
                      <div class="p endTime1" v-if="!isStart">
                        还差 {{ timeData }} 开抢
                      </div>
                      <div class="p" v-else @click="playListRob(1)">马上抢</div>
                    </div>
                    <!-- 普通通道/随机特殊通道/意向特殊通道/全网最低价特殊通道 购买码失效 就显示 本场抢购机会已失效-->
                    <div class="flex_box" v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 3
                      ">
                      <div class="ending" @click="clickHint(5)">马上抢</div>
                      <!-- <div class="p" @click="go(1)">去"买卖区"购买</div> -->
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 2 &&
                        !isSpeendOver
                      ">
                      <div class="btn_box_exp" v-if="!isSpestartCountDown && isSpeendCountDown">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 2 入围情况 2 进入必中意向尺码-->
                      <div class="p endTime1" v-if="isSpestartCountDown">
                        专属通道将在 {{ timeData_3 }} 后开放
                      </div>
                      <div class="p" v-else-if="isSpeendCountDown" @click="playListRob(2)">
                        请在 {{ timeData_4 }} 内完成支付
                      </div>
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 1 &&
                        !isRanendOver
                      ">
                      <div class="btn_box_exp" v-if="!isRanstartCountDown && isRanendCountDown">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 1 入围情况 1 进入必中随机尺码-->
                      <div class="p endTime1" v-if="isRanstartCountDown">
                        专属通道将在 {{ timeData_5 }} 后开放
                      </div>
                      <div class="p" v-else-if="isRanendCountDown" @click="playListRob(3)">
                        请在 {{ timeData_6 }} 内完成支付
                      </div>
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 3 &&
                        !isMinpriceendOver
                      ">
                      <div class="btn_box_exp" v-if="
                          !isMinpricestartCountDown && isMinpriceendCountDown
                        ">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 3 入围情况 3 进入全网最低可选尺码-->
                      <div class="p endTime1" v-if="isMinpricestartCountDown">
                        专属通道将在 {{ timeData_7 }} 后开放
                      </div>
                      <div class="p" v-else-if="isMinpriceendCountDown" @click="playListRob(4)">
                        请在 {{ timeData_8 }} 内完成支付
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- button 区域 end -->
            <div class="help-friend-list flex-col help-friend-list-2" v-if="opentInfo.status != 2">
              <p class="tit">
                <span class="help_tit">
                  我的人气值
                  <span>({{ drawlotInfo.value || 0 }})</span>
                </span>
                <em class="look" v-if="drawlotInfo.value > 0" @click="look(2)">
                  more
                  <i></i>
                </em>
              </p>
              <div class="help_img">
                <div class="help_item help_empty" @click="playListShare()">
                  <span></span>
                </div>
                <div class="help_item" v-for="(item, index) in drawlotInfo.list" :key="index" :class="{ hidden: index > 3, margin_right0: index == 3 }">
                  <img :src="
                      item.headpic
                        ? item.headpic
                        : 'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'
                    " alt />
                </div>
              </div>
            </div>
          </div>
          <!-- 人气榜单 -->
          <div class="Popularity_list" v-if="activityType == 5 && opentInfo.status !== 2">
            <div class="head_box">
              <div class="head">
                <div class="head_1" @click="clickQuery()">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_title.png" alt />
                  <span></span>
                </div>
                <div class="loading" @click="load()"><i></i>点击刷新</div>
              </div>
              <p class="exp" v-if="!isOverpoplar && showListendtime">
                榜单截止更新时间：
                <span>{{ opentInfo.popularconfig.listendtime }}</span>
              </p>
              <p class="exp" v-else-if="
                  !isOverpoplar && !showListendtime && isPoplarCountDown
                ">
                榜单截止更新时间：还差
                <span>{{ timeData_2 }}</span>分
              </p>
              <p class="exp" v-else-if="isOverpoplar">
                榜单已截止更新,结果以当前页面排名为准
              </p>
            </div>
            <div class="myRankingBox" v-if="!isOverpoplar && drawlotInfo.rank">
              <p class="info_2">
                <span class="name">
                  我的排名
                  <span class="small" v-if="
                      (wantsizerandomsize == 0 || wantsizerandomsize == 2) &&
                      Isinclusion == 1
                    ">(已进入必中随机尺码榜)</span>
                  <span class="small" v-if="
                      (wantsizerandomsize == 0 || wantsizerandomsize == 1) &&
                      Isinclusion == 2
                    ">(已进入必中意向尺码榜)</span>
                  <span class="small" v-if="wantsizerandomsize == 3 && Isinclusion == 3">(已进入榜单)</span>
                </span>
                <span class="val" v-if="Isinclusion">
                  第
                  <span class="bold">{{
                    drawlotInfo.rank > 10
                      ? drawlotInfo.rank
                      : "0" + drawlotInfo.rank
                  }}</span>名
                </span>
                <span class="val" v-else>{{ drawlotInfo.rank }}</span>
              </p>
            </div>
            <div class="my_ranking_fruit" v-if="
                isOverpoplar &&
                codeList &&
                codeList.length > 0 &&
                codeList[0].status != 1
              ">
              <div class="info" v-if="Isinclusion == 3">
                <p class="info_fruit">恭喜! 进入本期“全网最低价”榜单</p>
                <p class="exp">
                  将在【
                  <span>{{ opentInfo.popularconfig.minpricestarttime }}-{{
                      opentInfo.popularconfig.minpriceendtime
                    }}</span>】为你开启专属购买通道,请及时支付!
                </p>
              </div>
              <div class="info" v-else-if="Isinclusion == 2">
                <p class="info_fruit">恭喜! 进入本期“必中意向尺码”榜单</p>
                <p class="exp">
                  将在【
                  <span>{{ opentInfo.popularconfig.spestarttime }}-{{
                      opentInfo.popularconfig.speendtime
                    }}</span>】为你开启专属购买通道,请及时支付!
                </p>
              </div>
              <div class="info" v-else-if="Isinclusion == 1">
                <p class="info_fruit">恭喜! 进入本期“必中随机尺码”榜单</p>
                <p class="exp">
                  将在【
                  <span>{{ opentInfo.popularconfig.ranstarttime }}-{{
                      opentInfo.popularconfig.ranendtime
                    }}</span>】为你开启专属购买通道,将会100%为你分配一个随机尺码,请及时支付!
                </p>
              </div>
              <div class="info" v-else-if="Isinclusion == 0">
                <p class="exp">
                  本期未入围,凭手速抢购,先到先得,尺码随机分配。加油!
                </p>
              </div>
            </div>
            <div class="my_ranking_box">
              <div class="hasList" v-if="popularlist.list && popularlist.list.length > 0">
                <div class="my_ranking">
                  <div class="ranking_item" v-for="(item, index) in popularlist.list" :key="index" :class="{
                      hidden:
                        opentInfo.popularconfig.wantsize ||
                        opentInfo.popularconfig.minpricesize
                          ? false
                          : index >
                            opentInfo.popularconfig.randomsizemaxnum - 1,
                    }">
                    <div class="index">
                      <span>{{ index + 1 }}</span>
                    </div>
                    <div class="img_box">
                      <img :src="
                          item.headimgurl
                            ? item.headimgurl
                            : 'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'
                        " alt />
                    </div>
                    <div class="name">
                      <span class="name1">
                        {{ item.nickname }}
                        <span class="isSelf" v-if="item.ismyself">我在这</span>
                      </span>
                    </div>
                    <div class="point">
                      <span>人气值</span>
                      <strong>{{ item.value }}点</strong>
                    </div>
                  </div>
                </div>
                <p v-if="$root.ISAPP" class="look_more" @click="look(3)">
                  <em>查看更多</em>
                  <span></span>
                </p>
                <loader class="load" from="1" :id="activityid" useConfirm v-else>
                  <p class="look_more">
                    <em>查看更多</em>
                    <span></span>
                  </p>
                </loader>
              </div>
              <div class="my_ranking_empty" v-else>
                <img src="//files.eyee.com/eyeeh5/img/image_empty.png" alt />
                <p class="info">啊哦~居然还没人！快来抢个沙发吧～</p>
              </div>
            </div>
          </div>
          <!-- 看广告 -->
          <div class="explain no-padding" style="marginBottom:15px;" @click="lookAdv" v-if="advEnter">
            <img src="https://files.eyee.com/eyeeh5/img/lottery/sneaker_banner.png" alt style="display:block;" />
          </div>
          <!-- 引导进群 -->
          <!-- <div class="explain no-padding OfficialAccount">
            <img src="https://files.eyee.com/eyeeh5/img/activity/ipo-code.png?c=2" alt />
          </div> -->
          <!-- <div
            class="explain no-padding OfficialAccount"
            v-if="opentInfo.wximage && opentInfo.copytxt"
            :data-clipboard-text="opentInfo.copytxt"
            @click="copy(1)"
          >
            <img :src="opentInfo.wximage" alt />
          </div> -->
          <!-- 抢购说明 -->
          <!-- <div class="explain no-padding" v-if="opentInfo.bullmarketuserrule">
            <div class="ticket_explain">
              <div v-html="opentInfo.bullmarketuserrule"></div>
            </div>
          </div> -->
          <!-- 往期回顾 和 商品详情 -->
          <div>
            <div v-for="(item, index) in opentInfo.ipotabshow" :key="index">
              <!-- 往期回顾 item.type == 2-->
              <!-- <div class="beforeLookConBox" v-if="item.type == 2">
                <div class="tit_box">
                  <h2 class="tit"><img src="//files.eyee.com/eyeeh5/img/crunchies/history_bg2.png" alt=""></h2>
                  <div class="head">往期团购商品和当前市场价格对比，数据实时更新！</div>
                </div>
                <div class="goods_box">
                  <div class="goods_list" v-if="goodsList && goodsList.length">
                    <div class="goods_item" v-for="(goodsItem, goodsIndex) in goodsList" :key="goodsIndex" @click="go(2, goodsItem)">
                      <div class="img_b">
                        <img :src="goodsItem.image" alt="">
                      </div>
                      <div class="goodsInfo1">
                        <p class="ellipsis-2 name" style="-webkit-box-orient: vertical;">[{{goodsItem.size}}码] {{goodsItem.name}}</p>
                        <div class="priceBox">
                          <p class="price">
                            <span v-if="goodsItem.lastprice">最新价￥{{goodsItem.lastprice}}</span>
                            <span v-else>最新价￥--</span>
                          </p>
                          <p class="price">
                            <span v-if="goodsItem.saleprice">发售价￥{{goodsItem.saleprice}}</span>
                            <span v-else>发售价￥--</span>
                          </p>
                        </div>
                      </div>
                      <div class="goodsInfo2">
                        <p class="pricerate" :class="{'red': goodsItem.pricerate > 0, 'gray': goodsItem.pricerate == 0}">
                          <span v-if="goodsItem.pricerate > 0">+</span>{{goodsItem.pricerate}}<span>%</span>
                        </p>
                        <p class="pricechange">
                          <span v-if="goodsItem.pricerate > 0">上涨</span><span v-else>下跌</span>￥{{goodsItem.pricechange>0?goodsItem.pricechange:'--'}}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>-->
              <!-- 商品详情 item.type == 1 -->
              <div class="explain goods_detail" v-if="item.type == 1">
                <h2 class="tit">
                  <img src="//files.eyee.com/eyeeh5/img/crunchies/history_bg1.png" alt />
                </h2>
                <div class="ticket_explain">
                  <div v-html="opentInfo.productdetails"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 问题解答 -->
          <div class="explain" v-if="false">
            <div class="questionanswer" v-if="
                opentInfo.questionanswer && opentInfo.questionanswer.length > 0
              ">
              <h2 class="tit">
                <img src="//files.eyee.com/eyeeh5/img/crunchies/question.png" alt />
              </h2>
              <div class="conten">
                <p class="item" v-for="(item, index) in opentInfo.questionanswer" :key="index" @click="questionanswer(item)">
                  <span>{{ item.title }}</span>
                  <em></em>
                </p>
              </div>
            </div>
          </div>
          <!-- 抢购秘诀 -->
          <div class="explain" v-if="identification">
            <div class="lit_secret">
              <h2 class="tit">
                <img src="//files.eyee.com/eyeeh5/img/crunchies/pop_secret.png" alt />
              </h2>
              <p class="content">
                提前进行实名认证,抢购快人一步！ 新来及未认证的小伙们
                <u v-if="$root.ISAPP" class="identify" @click="identify(1)">点此认证>></u>
                <loader class="load" from="1" :id="activityid" useConfirm v-else style="display: inline-block">
                  <u class="identify">点此认证</u>
                </loader>
              </p>
              <p class="content1" v-if="activityType == 5">
                温馨提示：完成认证
                <em>自己+{{
                    opentInfo.popularconfig.newuserauthentication
                  }}人气值,好友也+{{
                    opentInfo.popularconfig.authentication
                  }}人气值</em>
              </p>
            </div>
          </div>
        </div>
        <!-- 底部fixed按钮 -->
        <div class="fix_btn_box" v-if="showBtnB || showBtnD">
          <!-- button 区域 start -->
          <div class="btn_diff_status">
            <div v-if="!$root.ISAPP && (showBtnB || showBtnD)">
              <loader class="load" :id="activityid" from="1" useConfirm style="display: block; width: 100%">
                <div class="p">立即参与</div>
              </loader>
            </div>
            <div v-else-if="$root.ISAPP && isShowBtn">
              <!-- 未登录 去登录 -->
              <div v-if="notloged && (showBtnB || showBtnD)" class="p" @click="callAppLogin()">
                立即参与
              </div>
              <div v-else>
                <div class="flex_box" v-if="opentInfo.status === 1 && (showBtnB || showBtnD)">
                  <div class="ending" @click="clickHint(2)">已结束</div>
                </div>
                <!-- <div v-else-if="opentInfo.status === 2 && (showBtnB || showBtnD)" class="p">即将开始,请稍后再来</div> -->
                <div v-else-if="opentInfo.status === 2" class="p hasset set" :class="{ set: is_on_msg }" @click="goOpenMsg">
                  <!-- 即将开始,请稍后再来 -->
                  <span>{{ is_on_msg ? "已设置提醒" : "开始提醒我" }}</span>
                </div>
                <div v-else-if="opentInfo.status === 0">
                  <div v-if="activityType == 1 && showBtnB">
                    <!-- 完成支付 -->
                    <div v-if="
                        codeList && codeList.length && codeList[0].ispaysuccess
                      " @click="go(1)">
                      <div class="p">已抢购成功 去逛逛</div>
                    </div>
                    <div class="flex_box" v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 3
                      ">
                      <div class="ending" @click="clickHint(5)">
                        本场抢购机会已失效
                      </div>
                    </div>
                    <div v-else-if="
                        codeList &&
                        (codeList.length == 0 ||
                          (codeList.length > 0 && codeList[0].status == 1))
                      ">
                      <!-- 有缩放动效 -->
                      <div class="p" @click="playListShare(1)">立即分享</div>
                    </div>
                    <div v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2
                      ">
                      <div class="p" :class="{ unStart: isShowVipChannel == 2 }" v-if="isShowVipChannel > 0 && isVip" @click="isShowVipChannel == 3 ? playListRob2() : ''">
                        {{
                          isShowVipChannel == 2
                            ? `专属通道将在 ${timeData_7} 后开放`
                            : `请在 ${timeData_7} 分内完成专属通道抢购`
                        }}
                      </div>
                      <div class="p unStart" v-else-if="!isStart">
                        还差
                        <span style="padding: 0 5px">{{ timeData }}</span>开抢
                      </div>
                      <div v-else>
                        <!-- 不选尺码-->
                        <div class="p" v-if="opentInfo.codenum == 1 && !opentInfo.showsize" @click="playListRob2()">
                          马上抢
                        </div>
                        <!-- 选尺码-->
                        <div class="p" v-else-if="
                            opentInfo.codenum == 1 &&
                            opentInfo.showsize &&
                            allInv
                          " @click="playListRob2()">
                          马上抢
                        </div>
                        <!-- 选尺码 无库存-->
                        <div class="p unStart" v-if="
                            opentInfo.codenum == 1 &&
                            !allInv &&
                            opentInfo.showsize > 0
                          " @click="clickHint(3)">
                          <span>排队中,请3分钟后再试...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="activityType == 5 && showBtnD">
                    <!-- 有缩放动效 -->
                    <div class="p" v-if="codeList && codeList.length == 0" @click="join">
                      立即参与
                    </div>
                    <div class="p" v-else-if="
                        codeList &&
                        codeList.length > 0 &&
                        (codeList[0].status == 1 ||
                          (codeList[0].status == 2 && !isOverpoplar))
                      " @click="playListShare()">
                      立即分享
                    </div>
                    <!-- isOverpoplar true 榜单已截止 false  榜单未截止 -->
                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        (Isinclusion == 0 ||
                          (Isinclusion == 1 && isRanendOver) ||
                          (Isinclusion == 2 && isSpeendOver) ||
                          (Isinclusion == 3 && isMinpriceendOver))
                      ">
                      <!-- 普通通道 未进榜单 || 意向未点抢(code是激活状态 意向通道截止) || 随机未点抢(code是激活状态 随机通道截止) || 全网最低未点抢(code是激活状态 全网最低通道截止)-->
                      <div class="p endTime1" v-if="!isStart">
                        还差 {{ timeData }} 开抢
                      </div>
                      <div class="p" v-else @click="playListRob(1)">马上抢</div>
                    </div>
                    <!-- 普通通道/随机特殊通道/意向特殊通道/全网最低价特殊通道 购买码失效 就显示 本场抢购机会已失效-->
                    <div class="flex_box" v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 3
                      ">
                      <div class="ending" @click="clickHint(5)">马上抢</div>
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 2 &&
                        !isSpeendOver
                      ">
                      <div class="btn_box_exp" v-if="!isSpestartCountDown && isSpeendCountDown">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 2 入围情况 2 进入必中意向尺码-->
                      <div class="p endTime1" v-if="isSpestartCountDown">
                        专属通道将在 {{ timeData_3 }} 后开放
                      </div>
                      <div class="p" v-else-if="isSpeendCountDown" @click="playListRob(2)">
                        请在 {{ timeData_4 }} 内完成支付
                      </div>
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 1 &&
                        !isRanendOver
                      ">
                      <div class="btn_box_exp" v-if="!isRanstartCountDown && isRanendCountDown">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 1 入围情况 1 进入必中随机尺码-->
                      <div class="p endTime1" v-if="isRanstartCountDown">
                        专属通道将在 {{ timeData_5 }} 后开放
                      </div>
                      <div class="p" v-else-if="isRanendCountDown" @click="playListRob(3)">
                        请在 {{ timeData_6 }} 内完成支付
                      </div>
                    </div>

                    <div v-if="
                        codeList &&
                        codeList.length > 0 &&
                        codeList[0].status == 2 &&
                        isOverpoplar &&
                        Isinclusion == 3 &&
                        !isMinpriceendOver
                      ">
                      <div class="btn_box_exp" v-if="
                          !isMinpricestartCountDown && isMinpriceendCountDown
                        ">
                        未在规定时间内支付，则视为放弃购买
                      </div>
                      <!-- 专属通道 Isinclusion == 3 入围情况 3 进入全网最低可选尺码-->
                      <div class="p endTime1" v-if="isMinpricestartCountDown">
                        专属通道将在 {{ timeData_7 }} 后开放
                      </div>
                      <div class="p" v-else-if="isMinpriceendCountDown" @click="playListRob(4)">
                        请在 {{ timeData_8 }} 内完成支付
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- button 区域 end -->
        </div>
        <!-- — THE END — -->
        <div class="endingBox">
          <p>— THE END —</p>
        </div>
        <ticket-model @call-success="success" @call-success-2="success_2" @close="closeModel" @tghint="toggleHint" @call-getProCode="getProCode" :cssShow="cssShow" :ModelStatus="ModelStatus" :onlyShowBtn="onlyShowBtn" :opentInfo="opentInfo" :drawlotInfo="drawlotInfo" :GetActcode="GetActcode" :sizeList="sizeList" :chooseSizeList="chooseSizeList" :allNum="allNum" :isAll="isAll" :activityType="activityType" :fCode="fCode" :activityid="activityid" :chooseSizeNum="chooseSizeNum" :intentionsizenum="intentionsizenum" :wantsizerandomsize="wantsizerandomsize" :appversion="appversion" :Isinclusion="Isinclusion" :isMinpriceendCountDown="isMinpriceendCountDown" :timeData_8="timeData_8" :isOverpoplar="isOverpoplar"></ticket-model>
        <div class="vip-modal" v-if="openVip">
          <div class="cont">
            <div class="img">
              <img src="https://files.eyee.com/activity/vip/image_bg.png" alt />
              <div @click.stop="checkvip(2)" class="_btn flex-center">
                查看更多权益{{ isVip ? "" : "，加入会员" }}
              </div>
            </div>
            <span class="close" @click.stop="checkvip(3)"></span>
          </div>
        </div>
      </template>
    </div>
    <div class="fix-hint" v-show="showHint">
      <div>
        <div class="waiter">
          <i class="i1"></i>
          <i class="i2"></i>
          <i class="i3"></i>
        </div>
        <p class="title">当前页面拥堵</p>
        <p class="title">{{ hasdata ? "请稍后再试" : "请稍等" }}</p>
        <p v-show="hasdata">
          本场发售数量有限,先到先得。等待中库存可能会发生变动,最终有可能因为售罄而无法完成购买,敬请谅解！
        </p>
        <div class="btn" @click="back" v-if="!$root.ISIOS">知道了</div>
      </div>
    </div>
    <p class="empty" v-if="isEmp">该活动不存在</p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FormatSeconds } from "@/common/util";
import TicketModel from "@/comps/bull/sneakerticket/detail_pop";
// import { AntiBrush } from "../../../common/anti-brush";
import {
  Activityinfov2i,
  Getcodev2i,
  HasLoginActivityinfov2i,
  Getsizev2i,
  Identifysuccessv2i,
  GetIdentifyKeyv2i,
  Popularlist,
  Sizelistv2i,
  Luckidentifysuccessv2i,
  Randomidentifysuccessv2i,
  Minpriceidentifysuccessv2i,
  Shoecouponrank,
  ExclusiVeidentifySuccess,
} from "../../../common/api/bull";
import { isOpenAdv } from "@/common/api/active";
import Clipboard from "clipboard";
import Loader from "@/comps/Loader";
import { SET_ORDER_COUPON } from "../../../store/mutation-types";
let loader,
  endTimeStamp,
  refreshTimer,
  offloading = true; // offloading 防止函数节流

const isActing = ($) => {
  let diff = endTimeStamp - +new Date();
  // 提前1s结束
  return diff > 1000;
};
export default {
  components: { TicketModel, Loader },
  data() {
    return {
      showHint: false,
      title: "尖货发售",
      hasdata: 2,
      opentInfo: {}, //未登录时信息
      drawlotInfo: {}, //登录态信息
      isStart: false, // 是否开始抢券
      recordMsg: [], // 小喇叭信息
      isEnd: false, // 活动是否结束

      timeData: "", // 普通开始抢券的倒计时 无特殊通道
      timeData_1: "", // 倒计时timer 距离活动结束 倒计时
      timeData_2: "", // 榜单截止前一个小时的倒计时
      timeData_3: "", // 抢券开始的倒计时 意向特殊通道开启的倒计时
      timeData_4: "", //开始抢券的倒计时 意向特殊通道关闭的倒计时
      timeData_5: "", // 抢券开始的倒计时 意向特殊通道开启的倒计时
      timeData_6: "", //开始抢券的倒计时 意向特殊通道关闭的倒计时
      timeData_7: "", // 抢券开始的倒计时 全网最低特殊通道开启的倒计时
      timeData_8: "", //开始抢券的倒计时 全网最低特殊通道关闭的倒计时

      timeSettimeout: 0, //倒计时timer 普通开始抢券的倒计时 无特殊通道
      timeSettimeout_1: 0, //倒计时timer 距离活动结束 倒计时
      timeSettimeout_2: 0, //倒计时timer 榜单截止前一个小时的倒计时
      timeSettimeout_3: 0, //倒计时timer 抢券开始的倒计时 意向特殊通道开启的倒计时
      timeSettimeout_4: 0, //倒计时timer 开始抢券的倒计时 意向特殊通道关闭的倒计时
      timeSettimeout_5: 0, //倒计时timer 抢券开始的倒计时 随机特殊通道开启的倒计时
      timeSettimeout_6: 0, //倒计时timer 开始抢券的倒计时 随机特殊通道关闭的倒计时
      timeSettimeout_7: 0, //倒计时timer 抢券开始的倒计时 全网最低特殊通道开启的倒计时
      timeSettimeout_8: 0, //倒计时timer 开始抢券的倒计时 全网最低特殊通道关闭的倒计时

      timer_scroll_1: 0, // 小喇叭定时器
      timer_scroll_2: 0, // 小喇叭定时器

      startRobTime: "", //开始抢的时间
      clearTime: null,
      bullInfo: "",
      activityid: this.$route.query.activityid || "", // 从路由上获取activityid
      identification: false, // 是否需要实名认证
      is_page_identification: false, // 是否是页面实名认证 true 页面实名认证 false 立即抢时实名认证
      activityType: 1, // 活动类型 (1 助力  2群权限制 3无群限制,4.选尺码抢购 5.打榜)

      codeList: [], // 存放购买码
      // 组件参数
      cssShow: false,
      onlyShowBtn: false, // 只显示分享好友 分享朋友圈按钮
      ModelStatus: 0,
      GetActcode: {}, // 获取购买码数据
      fCode: "", // 暂存购买码
      allInv: 0, // 一进来时的库存
      allNum: 0, // 点击马上抢时的库存
      isAll: false, // 点击马上抢时 是否尺码都在
      sizeList: [], // 一进来时的尺码列表 点击马上抢时的尺码列表
      chooseSizeList: [], // 选择意向尺码列表
      isShowBtn: false, // 是否显示按钮

      is_on: false, // 是否展开购买码列表 true 展开 false 收起

      isOverpoplar: false, // 榜单活动是否截止 ture 截止 false 未截止
      isPoplarCountDown: false, // 榜单活动是否开始倒计时 false 未开始倒计时 true 开始倒计时 榜单截止更新前一个小时开始倒计时

      isSpestartCountDown: false, // 专属购买通道开放 意向通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时
      isSpeendCountDown: false, // 专属购买通道关闭 意向通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时

      isRanstartCountDown: false, // 专属购买通道开放 随机通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时
      isRanendCountDown: false, // 专属购买通道关闭 随机通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时

      isMinpricestartCountDown: false, // 专属购买通道开放 全网最低价通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时
      isMinpriceendCountDown: false, // 专属购买通道关闭 全网最低价通道 倒计时 ture 截止 false 未开始倒计时 true 开始倒计时

      isSpeendOver: false, // 意向专属通道是否关闭 true 关闭 false 未关闭
      isRanendOver: false, // 随机专属通道是否关闭 true 关闭 false 未关闭
      isMinpriceendOver: false, // 全网最低价通道是否关闭 true 关闭 false 未关闭

      showListendtime: false, // 显示榜单 榜单截止更新时间
      wantsizerandomsize: 0, // 意向和随机类型
      pass_type: 1, // 抢购类型 1 普通 2 意向特殊通道 3 随机特殊通道 4 全网最低特殊通道

      popularlist: {}, // 人气榜单列表数据
      animate: false, // 小喇叭 滚动
      intentionsizenum: 0, // 意向选择尺码个数
      chooseSizeNum: 0, // 榜单必中意向尺码人数

      isEmp: false, // 该活动不存在时为true

      is_on_msg: false, // 是否打开消息通知 false 未打开 true 已打开

      seledType: 2,

      goodsList: [],

      btnB_top: 0, // 按钮距离顶部的高度
      btnD_top: 0, // 按钮距离顶部的高度
      showBtnB: false, // 是否显示B活动底部按钮
      showBtnD: false, // 是否显示D活动底部按钮

      appversion: "", // app版本号  appversion >= 3.4.8  新的交互消息通知才有用 才让 消息提醒显示出来

      openVip: false, // 显示会员弹框
      isVip: false, // 是否是会员
      isShowVipChannel: 0, // 是否显示专属通道
      isopenchannel: false,

      onofff: true,

      SwitchAdv: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path == "/sneakerticket/friendList") {
        vm.hasLoginHandleInit();
        vm.handleInit();
        window.setTimeout(function () {
          window.scrollTo(0, 0);
          window.scrollTo(0, 1);
        }, 300);
      }
    });
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    },
    // 入围情况
    Isinclusion() {
      let _ = this,
        Isinclusion = 0;
      if (
        _.opentInfo.popularconfig &&
        _.drawlotInfo.rank &&
        _.drawlotInfo.list &&
        _.drawlotInfo.list.length > 0 &&
        _.codeList &&
        _.codeList.length > 0 &&
        _.codeList[0].status !== 1
      ) {
        if (
          _.opentInfo.popularconfig.randomsize &&
          _.drawlotInfo.rank <= _.opentInfo.popularconfig.randomsizemaxnum &&
          _.drawlotInfo.rank >= _.opentInfo.popularconfig.randomsizeminnum
        ) {
          // 进入必中随机
          Isinclusion = 1;
        } else if (
          _.opentInfo.popularconfig.wantsize &&
          _.drawlotInfo.rank <= _.opentInfo.popularconfig.intentionsizenum
        ) {
          // 进入必中意向 //此时也有随机
          Isinclusion = 2;
        } else if (
          _.opentInfo.popularconfig.minpricesize &&
          _.drawlotInfo.rank <= _.opentInfo.popularconfig.minpricesizenum
        ) {
          // 进去全网最低价 可选尺码
          Isinclusion = 3;
        } else {
          // 未入围
          Isinclusion = 0;
        }
      }
      return Isinclusion;
    },
    advEnter() {
      let { codeList, opentInfo } = this;
      let status =
        (codeList && codeList.length == 0) || codeList[0].status == 1;
      // console.log('status--',status)
      if (this.$root.ISAPP && this.SwitchAdv && opentInfo.status == 0 && status)
        return true;
      else return false;
    },
    // 抢购概率
    percentBar() {
      let _ = this,
        percentBar = 0;
      console.log(
        "Isinclusion ===> ",
        _.opentInfo.popularconfig,
        _.Isinclusion,
        _.wantsizerandomsize
      );
      // 抢购概率判断 percentBar
      if (_.wantsizerandomsize == 0 && _.activityType == 5) {
        if (
          _.drawlotInfo.rank <= _.opentInfo.popularconfig.intentionsizenum &&
          _.codeList &&
          _.codeList.length > 0 &&
          _.codeList[0].status !== 1
        ) {
          percentBar = 100;
        } else if (
          _.drawlotInfo.rank < _.opentInfo.popularconfig.randomsizemaxnum &&
          _.codeList &&
          _.codeList.length > 0 &&
          _.codeList[0].status !== 1
        ) {
          percentBar = 75;
        } else if (
          _.drawlotInfo.list &&
          _.drawlotInfo.list.length > 0 &&
          _.codeList.length > 0 &&
          _.drawlotInfo.rank == _.opentInfo.popularconfig.randomsizemaxnum &&
          _.codeList[0].status !== 1
        ) {
          percentBar = 50;
        } else if (
          _.codeList &&
          _.codeList.length > 0 &&
          _.codeList[0].status != 1
        ) {
          percentBar = 25;
        }
      } else if (_.wantsizerandomsize !== 0 && _.activityType == 5) {
        if (_.Isinclusion) {
          percentBar = 100;
        } else if (
          _.codeList &&
          _.codeList.length > 0 &&
          _.codeList[0].status !== 1
        ) {
          percentBar = 50;
        }
      }
      console.log("percentBar === >", percentBar);
      return percentBar;
    },
  },
  mounted() {
    let _ = this;
    if (!_.activityid) {
      _.toast("该活动不存在");
      _.isEmp = true;
      return;
    }
    _.setToolBar({ title: _.title });
    window.callbacklogin = (json) => {
      if (json) {
        _.getQueryParamUser(json).then((res) => {
          _.hasLoginHandleInit();
          if (_.opentInfo.showsize) {
            _.getsize(1);
          }
        });
      } else _.toast("获取登录信息失败~");
    };

    window.callbackIdentify = (result, via) => {
      console.log("callbackIdentify res------>>>", result, via);
      loader.close();
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (result == 1) {
        if (_.is_page_identification) {
          _.identification = true;
          if (_.opentInfo.showsize) _.getsize(1);
        } else {
          _.identification = true;
          if (_.activityType === 1) {
            status = 5;
            describe = "B种方式立马抢";
            _.robberyRob(5);
          } else if (_.activityType === 5) {
            if (_.pass_type == 1) {
              status = 12;
              describe = "D种方式 普通通道 马上抢";
            } else if (_.pass_type == 2) {
              status = 13;
              describe = "D种方式 意向特殊通道 马上抢";
            } else if (_.pass_type == 3) {
              status = 24;
              describe = "D种方式 随机特殊通道 马上抢";
            } else if (_.pass_type == 4) {
              status = 25;
              describe = "D种方式 全网最低价特殊通道 马上抢";
            }
            _.robberyRob(7, _.pass_type);
          }
        }
      } else _.toast("认证失败~");
      // $log({
      //   e: "ipoclick",
      //   p: { status: status, describe: describe, activityid: _.activityid },
      // });
    };

    window.callbackNotificationStatus = (result, via) => {
      console.log("callbackNotificationStatus res------>>>", result, via);
      // result 0：未打开，1：已打开
      if (result) {
        _.is_on_msg = true;
      } else {
        _.is_on_msg = false;
      }
    };

    window.addEventListener("scroll", this.showBtnFun);

    if (_.$root.ISAPP) {
      // 获取app通知的开关状态 action: 0 最开始查询app是否打开消息通知要传的参数 ,1 是通知APP打开通知设置界面
      _.javascriptBridge({
        name: "getAppNotificationStatus",
        params: {
          callbackname: "callbackNotificationStatus",
          action: 0,
        },
      });
    }
    setTimeout(() => {
      if (_.$root.loging) {
        _.$root.loging
          .then(($) => {
            console.log("登录信息", $);
            _.hasLoginHandleInit();
            _.handleInit();
          })
          .catch((e) => {
            console.error("query prams auto login error:", e);
            _.handleInit();
          });
      }
      _.getGoodsList();
    }, 300);
    _.getAdvStatus();

    window.AdvResult = (res) => {
      console.log("广告回调-->>>", res);
      _.hasLoginHandleInit();
      // _.handleInit();
      _.getAdvStatus();
    };
  },
  watch: {
    showHint(val, old) {
      if (val) {
        // 10s刷新一次
        refreshTimer = setTimeout(() => window.location.reload(), 10000);
        document.body.classList.add("lock");
      } else {
        if (refreshTimer) clearTimeout(refreshTimer, (refreshTimer = null));
        document.body.classList.remove("lock");
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.showBtnFun);
    document.body.classList.remove("lock");
  },
  methods: {
    // 判断是否显示广告 总开关
    getAdvStatus() {
      isOpenAdv().then((res) => {
        let _ = this;
        if (res && res.model && res.model.length) {
          res.model.forEach((el) => {
            if (el.id == 11 && el.isopen) _.SwitchAdv = true;
          });
        }
      });
    },
    lookAdv() {
      let _ = this;
      if (_.notloged) _.callAppLogin();
      else {
        if (!_.advEnter) {
          _.toast("本日已达到上限,明天再继续吧~");
          return;
        }
        // 调起app 广告
        _.javascriptBridge({
          name: "callAppShowAD",
          params: {
            source: 2,
            id: _.activityid,
            callbackname: "AdvResult",
          },
        });
      }
    },
    checkvip(type) {
      let _ = this;
      _.openVip = false;
      if (type == 1) _.openVip = true;
      else if (type == 2) _.$router.push("/vip");
      if (type == 3) _.openVip = false;
      //
    },
    // 根据滚动情况底部出现按钮
    showBtnFun() {
      let _ = this,
        scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      if (scrollTop) {
        if (_.activityType == 1) {
          _.showBtnD = false;
          if (scrollTop > _.btnB_top) {
            _.showBtnB = true;
          } else {
            _.showBtnB = false;
          }
        } else if (_.activityType == 5) {
          _.showBtnB = false;
          if (scrollTop > _.btnD_top) {
            _.showBtnD = true;
          } else {
            _.showBtnD = false;
          }
        }
      }
    },
    // 打开消息通知
    goOpenMsg() {
      let _ = this;
      // 获取app通知的开关状态 action: 0 最开始查询app是否打开消息通知要传的参数 ,1 是通知APP打开通知设置界面
      if (_.is_on_msg) return;
      _.javascriptBridge({
        name: "getAppNotificationStatus",
        params: {
          callbackname: "callbackNotificationStatus",
          action: 1,
        },
      });
    },
    back() {
      if (this.$root.ISAPP) this.javascriptBridge({ name: "gotoAppLastPage" });
      else history.back();
    },
    infoScroll() {
      clearTimeout(this.timer_scroll_1);
      clearTimeout(this.timer_scroll_2);
      this.scrollFun();
      this.timer_scroll_2 = setTimeout(() => {
        this.infoScroll();
      }, 3000);
    },
    scrollFun() {
      this.animate = true;
      this.timer_scroll_1 = setTimeout(() => {
        this.recordMsg.push(this.recordMsg[0]);
        this.recordMsg.shift();
        this.animate = false;
      }, 2000);
    },
    toggleHint(e) {
      this.showHint = !!e;
    },
    callAppLogin() {
      this.javascriptBridge({
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" },
      });
    },
    callIdentify(res) {
      console.log("callIdentify res", res);
      this.code = res;
      loader = this.$loader("认证中...");
      setTimeout(loader.close, 5000);

      // 自测可用下面代码
      // window.callbackIdentify(1, "ios");
      // return
      this.javascriptBridge({
        name: "callAppIdentifyAccountWithParams",
        params: { callbackname: "callbackIdentify" },
      });
    },
    success(params) {
      // param = {
      //   proCode: proCode
      // }
      let _ = this;
      // 走认证成功页 把优惠券信息展示在new_detail_pop 把鞋券信息存储在store this.$store.dispatch("snkInfo", snkInfo);
      GetIdentifyKeyv2i({ activityid: _.activityid })
        .then((res) => {
          // console.log("-----uid", res);
          if (res.url) {
            window.scrollTo(0, 0);
            _.closeModel(1);

            // AntiBrush({}, res2 => {
            //   if (res2.ticket) {
            //     let param = {
            //       proCode: params.proCode,
            //       uid: res.uid,
            //       ticket: res2.ticket
            //     };
            //     _.Identifysuccessv2iFun(param);
            //   } else {
            //     _.toast("验证失败了~");
            //   }
            // });
          }
          // else {
          //   let param = {
          //     proCode: params.proCode,
          //     uid: res.uid,
          //   };
          //   _.Identifysuccessv2iFun(param);
          // }
          let param = {
            proCode: params.proCode,
          };
          _.Identifysuccessv2iFun(param);
        })
        .catch((e) => _.toast((e && e.msg) || ""));
    },
    Identifysuccessv2iFun(param) {
      let _ = this;

      let api =
        _.isVip && _.isShowVipChannel == 3
          ? ExclusiVeidentifySuccess
          : Identifysuccessv2i;

      // console.log("api--", _.isVip && _.isShowVipChannel == 3,api);
      if (_.onofff) {
        _.onofff = false;

        api({
          activityid: _.activityid,
          code: param.proCode,
        })
          .then((res) => {
            console.log("Identifysuccess res", res);
            _.onofff = true;
            _.$store.dispatch("snkInfo", res);
            if (refreshTimer) clearTimeout(refreshTimer);
            _.showHint = false;
            _.$router.push(
              "/sneakerticket/result?status=" +
                1 +
                "&code=" +
                param.proCode +
                "&activityid=" +
                _.activityid +
                "&activityType=" +
                _.activityType +
                "&saleprice=" +
                _.opentInfo.saleprice +
                "&isvip=" +
                (_.isVip && _.isShowVipChannel == 3 ? 1 : 0)
            );
            // if (res && res.shoecouponid) {

            // } else {
            //   _.toast("认证校验失败,请稍后再试！");
            //   _.closeModel(1);
            // }
          })
          .catch((e) => {
            if (e.code == 1511401) {
              console.error("Activityinfo error: ", e);
              _.toast(e && e.msg ? e.msg : "");
              _.closeModel(1);
            } else {
              _.showHint = true;
              _.closeModel(1);
            }
            setTimeout(() => {
              _.onofff = true;
            }, 300);
            // else  _.toast("暂无库存,部分用户还未付款,请稍后再试!");
          });
      }
    },
    success_2(params) {
      let _ = this;
      let successv2iFunction, size;
      switch (params.type) {
        case 2:
          successv2iFunction = Luckidentifysuccessv2i; // 意向
          break;
        case 3:
          successv2iFunction = Randomidentifysuccessv2i; // 随机
          break;
        case 4:
          successv2iFunction = Minpriceidentifysuccessv2i; // 全网最低
          size = params.size;
          break;
      }
      if (_.onofff) {
        _.onofff = false;
        successv2iFunction({
          activityid: _.activityid,
          code: params.proCode,
          size,
        })
          .then((res) => {
            console.log("res ===>", res);
            _.onofff = true;
            if (res && res.shoecouponid) {
              _.$store.dispatch("snkInfo", res);
              if (refreshTimer) clearTimeout(refreshTimer);
              _.showHint = false;
              _.$router.push(
                "/sneakerticket/result?status=" +
                  1 +
                  "&code=" +
                  params.proCode +
                  "&activityid=" +
                  _.activityid +
                  "&activityType=" +
                  _.activityType +
                  "&pass_type=" +
                  params.type +
                  "&saleprice=" +
                  _.opentInfo.saleprice
              );
            } else {
              _.toast("认证校验失败,请稍后再试！");
              _.closeModel(1);
            }
          })
          .catch((e) => {
            if (e.code == 1511401) {
              _.toast("暂无库存,部分用户还未付款,请稍后再试!");
            } else {
              if (e.code == 1511401) {
                console.error("Activityinfo error: ", e);
                _.toast(e && e.msg ? e.msg : "");
                _.closeModel(1);
              } else {
                _.showHint = true;
                _.closeModel(1);
              }
            }
            setTimeout(() => {
              _.onofff = true;
            }, 300);
          });
      }
    },
    // 引到前往app参与活动
    tipDownload(type) {
      let _ = this;
      if (type === 1) {
        _.confirm({
          msg: "请到APP参加抢购活动哦~",
          okText: "立即前往",
          cancelText: "我再想想",
          ok: _.openAppClient,
        });
      } else {
        _.openAppClient();
      }
    },
    // 刷新
    load() {
      let _ = this;
      if (_.$root.ISAPP) {
        if (_.offloading) {
          _.Popularlist();
          _.hasLoginHandleInit();
        }
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }
    },
    // 什么是人气榜单？
    clickQuery() {
      let _ = this;
      document.body.classList.add("lock");
      _.cssShow = true;
      _.ModelStatus = 10;
    },
    handleInit() {
      let _ = this,
        activityid = _.activityid;
      _.offloading = false;
      Activityinfov2i({ activityid })
        .then((res) => {
          _.offloading = true;
          _.opentInfo = res;

          // 是否显示vip专属通道

          if (_.timeSettimeout_7) clearTimeout(_.timeSettimeout_7);

          if (res.isopenchannel) {
            _.isopenchannel = res.isopenchannel;
            _.isShowVipChannel = 1; // 显示专属通道按钮
            if (res.exclusivechannelconfig) {
              if (res.exclusivechannelconfig.begintimesecond > 0) {
                _.isShowVipChannel = 2; // 显示专属通道开放倒计时
                _.endTime_7(res.exclusivechannelconfig.begintimesecond);
              } else if (res.exclusivechannelconfig.endtimesecond > 0) {
                _.isShowVipChannel = 3; // 显示专属通道抢购倒计时
                _.endTime_7(res.exclusivechannelconfig.endtimesecond);
              } else _.isShowVipChannel = 0;
            }
          }

          if (refreshTimer) clearTimeout(refreshTimer);
          _.showHint = false;
          endTimeStamp = +new Date() + (res.endtimesecond || 0) * 1000;

          _.startRobTime = _.opentInfo.begintimesecond;
          _.bullInfo = res.info || "牛货";
          _.isStart = _.startRobTime <= 0;
          if (!_.isStart) {
            clearTimeout(_.timeSettimeout);
            _.endTime();
          }
          _.isEnd = _.opentInfo.endtimesecond <= 0;
          if (!_.isEnd) {
            clearTimeout(_.timeSettimeout_1);
            _.endTime_1();
          }

          // 活动类型
          _.activityType = res.type;

          // 设置活动为D活动 res.type = 5 不要背景颜色
          if (_.activityType == 5) {
            if (_.opentInfo.popularconfig) {
              if (_.opentInfo.popularconfig.spestarttimesecond > 0) {
                // 专属通道开放 倒计时 意向通道
                clearTimeout(_.timeSettimeout_3);
                _.isSpestartCountDown = true;
                _.endTime_3();
              }
              if (_.opentInfo.popularconfig.speendtimesecond > 0) {
                // 专属通道关闭的 倒计时 意向通道
                clearTimeout(_.timeSettimeout_4);
                _.isSpeendCountDown = true;
                _.endTime_4();
              }
              if (_.opentInfo.popularconfig.ranstarttimesecond > 0) {
                // 专属通道开放 倒计时 随机通道
                clearTimeout(_.timeSettimeout_5);
                _.isRanstartCountDown = true;
                _.endTime_5();
              }
              if (_.opentInfo.popularconfig.ranendtimesecond > 0) {
                // 专属通道关闭的 倒计时 随机通道
                clearTimeout(_.timeSettimeout_6);
                _.isRanendCountDown = true;
                _.endTime_6();
              }
              if (_.opentInfo.popularconfig.minpricestarttimesecond > 0) {
                // 专属通道开放 倒计时 全网最低价通道
                clearTimeout(_.timeSettimeout_7);
                _.isMinpricestartCountDown = true;
                _.endTime_7(_.opentInfo.popularconfig.minpricestarttimesecond);
              } else _.isMinpricestartCountDown = false;
              if (_.opentInfo.popularconfig.minpriceendtimesecond > 0) {
                // 专属通道关闭的 倒计时 全网最低价通道
                clearTimeout(_.timeSettimeout_8);
                _.isMinpriceendCountDown = true;
                _.endTime_8();
              }
              if (_.opentInfo.popularconfig.listendtimesecond > 0) {
                // 榜单截止 倒计时
                clearTimeout(_.timeSettimeout_2);
                _.isOverpoplar = true;
                _.endTime_2();
              }
              //判断榜单时间是否截止
              if (_.opentInfo.popularconfig.listendtimesecond <= 0) {
                // 榜单截止
                _.isOverpoplar = true;
                _.isPoplarCountDown = false;
                // 意向特殊通道关闭
                if (_.opentInfo.popularconfig.speendtimesecond <= 0) {
                  _.isSpeendOver = true;
                } else {
                  _.isSpeendOver = false;
                }
                // 随机特殊通道关闭
                if (_.opentInfo.popularconfig.ranendtimesecond <= 0) {
                  _.isRanendOver = true;
                } else {
                  _.isRanendOver = false;
                }
                // 全网最低价通道关闭
                if (_.opentInfo.popularconfig.minpriceendtimesecond <= 0) {
                  _.isMinpriceendOver = true;
                } else {
                  _.isMinpriceendOver = false;
                }
              } else {
                // 榜单未截止
                _.isOverpoplar = false;
                //  榜单截止前1小时开始倒计时 // 1小时是3600s
                if (
                  _.opentInfo.popularconfig.listendtimesecond <= 3600 &&
                  _.opentInfo.popularconfig.listendtimesecond > 0
                ) {
                  _.isPoplarCountDown = true;
                  _.showListendtime = false;
                } else {
                  // 显示榜单 榜单截止更新时间
                  _.showListendtime = true;
                }
              }
              if (
                _.opentInfo.popularconfig.wantsize &&
                _.opentInfo.popularconfig.randomsize
              ) {
                // 意向尺码 && 随机尺码
                _.wantsizerandomsize = 0;
              } else if (
                _.opentInfo.popularconfig.wantsize &&
                !_.opentInfo.popularconfig.randomsize
              ) {
                // 意向尺码
                _.wantsizerandomsize = 1;
              } else if (
                !_.opentInfo.popularconfig.wantsize &&
                _.opentInfo.popularconfig.randomsize
              ) {
                // 随机尺码
                _.wantsizerandomsize = 2;
              } else if (_.opentInfo.popularconfig.minpricesize) {
                // 阶梯价格
                _.wantsizerandomsize = 3;
              }
              console.log("wantsizerandomsize---->", _.wantsizerandomsize);
              //榜单必中意向尺码人数
              _.intentionsizenum = _.opentInfo.popularconfig.intentionsizenum;
              //需选择意向尺码数
              _.chooseSizeNum = _.opentInfo.popularconfig.sizenum;
            }
            _.Popularlist();
          }
          // 分享信息
          if (res.share) {
            let info = res.share;
            let content;
            if (_.opentInfo.status == 2) {
              // 分享不带价格的内容
              content = info.nopricecontent;
            } else {
              // 分享正常的内容
              content = info.content;
            }
            if (_.$root.ISAPP) {
              _.javascriptBridge({
                name: "getAppActivityShareContent",
                params: {
                  sharetitle: info.title,
                  sharecontent: content,
                  sharepicurl: info.icon,
                  shareurl: info.url,
                  hideshareicon: false,
                },
              });
            } else {
              _.initShare({
                type: 2,
                info: {
                  title: info.title,
                  url: info.url,
                  img: info.icon,
                  desc: content,
                },
              });
            }
          }
          _.hasdata = 1;
          _.isShowBtn = true;
          // if (_.$root.ISAPP) {
          //   _.getQueryParamUser().then(res => {
          //     _.appversion = res.param.version;
          //     _.hasLoginHandleInit();
          //     if (_.opentInfo.showsize) {
          //       _.getsize(1);
          //     }
          //   });
          // } else
          if (_.user && _.user.token) {
            _.hasLoginHandleInit();
            if (_.opentInfo.showsize) {
              _.getsize(1);
            }
          }

          _.$nextTick(() => {
            _.topFun();
          });
        })
        .catch((e) => {
          if (e.code == 1511401) {
            console.error("Activityinfo error: ", e);
            _.toast(e && e.msg ? e.msg : "");
            return;
          } else {
            _.showHint = true;
          }
        });
    },
    hasLoginHandleInit(act) {
      let _ = this,
        activityid = _.activityid;
      _.recordMsg = [];
      clearTimeout(_.timer_scroll_1);
      clearTimeout(_.timer_scroll_2);
      HasLoginActivityinfov2i({ activityid })
        .then((res) => {
          if (res) {
            _.drawlotInfo = res;
            _.isVip = !!res.isvip;
            _.recordMsg = _.drawlotInfo.record;

            if (_.recordMsg && _.recordMsg.length > 0) {
              _.infoScroll();
            }

            _.identification = res.needidentify; //1：需要实名认证；0：不需要实名认证（已实名认证）

            if (res.codelist && res.codelist == 0) {
              // 登录态接口没有购买码信息时 请求getcode接口 并把信息赋给drawlotInfo.codelist B方式和D方式的 只有随机或者只有全网最低(也就是没有意向)
              if (
                (_.activityType == 1 ||
                  (_.activityType == 5 &&
                    (!_.opentInfo.popularconfig.wantsize ||
                      _.opentInfo.popularconfig.minpricesize))) &&
                _.opentInfo.status != 1
              ) {
                let param = {
                  type: 7,
                };
                if (!act) {
                  _.getProCode(param);
                }
              }
            } else {
              _.codeList = res.codelist;
            }

            if (_.drawlotInfo.sizes) {
              let reg = /,/g;
              _.drawlotInfo.sizes = _.drawlotInfo.sizes.replace(reg, "/");
            }

            _.hasdata = 1;
            _.isShowBtn = true;
            _.$nextTick(() => {
              _.topFun();
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 计算距离顶部距离函数
    topFun() {
      let _ = this;
      const img = () => {
        let id = document.getElementById("mapImg");
        if (id) {
          id.onload = () => {
            if (_.activityType == 1) {
              // _.btnB_top = document.querySelector(".btn_diff_statusB").getBoundingClientRect().y
              _.btnB_top = _.$refs.btn_diff_statusB.getBoundingClientRect().top;
              console.log("btnB_top", _.btnB_top);
            } else if (_.activityType == 5) {
              // _.btnD_top = document.querySelector(".btn_diff_statusD").getBoundingClientRect().y
              _.btnD_top = _.$refs.btn_diff_statusD.getBoundingClientRect().top;
              console.log("btnD_top", _.btnD_top);
            }
          };
        } else {
          setTimeout(() => {
            console.log(333);
            img();
          }, 1000);
        }
      };
      img();
    },
    Popularlist() {
      let _ = this,
        activityid = _.activityid,
        page = 1,
        size = 3,
        uid = _.user.uid;
      console.log("size", size);
      if (_.opentInfo.popularconfig.wantsize) {
        size =
          _.opentInfo.popularconfig.intentionsizenum > 3
            ? 3
            : _.opentInfo.popularconfig.intentionsizenum;
      } else if (_.opentInfo.popularconfig.minpricesize) {
        size =
          _.opentInfo.popularconfig.minpricesizenum > 3
            ? 3
            : _.opentInfo.popularconfig.minpricesizenum;
      } else {
        size =
          _.opentInfo.popularconfig.randomsizemaxnum > 3
            ? 3
            : _.opentInfo.popularconfig.randomsizemaxnum;
      }
      Popularlist({ activityid, page, size, uid })
        .then((res) => {
          // console.log('人气榜单列表', res)
          _.popularlist = res;
        })
        .catch((e) => {
          if (e.code == 1511401) {
            _.toast(e.msg);
          }
        });
    },
    // 获取 往期回顾数据
    getGoodsList() {
      let _ = this,
        ranktype = 5,
        page = 1,
        size = 5;
      Shoecouponrank({ ranktype, page, size })
        .then((res) => {
          if (res && res.list) {
            _.goodsList = res.list;
          } else {
            _.goodsList = res;
          }
        })
        .catch((e) => {
          if (e.code == 1511401) {
            _.toast(e.msg);
          }
        });
    },
    //   倒计时
    // 抢券开始的倒计时 没有特殊通道的
    endTime() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout = timer;
          if (!_.timeSettimeout) clearTimeout(_.timeSettimeout);
          if (!_.isStart) {
            _.startRobTime--;
            _.timeData = FormatSeconds(_.startRobTime, 1);
            if (_.timeData === "end") {
              _.isStart = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout);
            }
          }
        },
        1000,
        1
      );
    },
    // 距离活动结束倒计时
    endTime_1() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_1 = timer;
          if (!_.timeSettimeout_1) clearTimeout(_.timeSettimeout_1);
          if (!_.isEnd) {
            _.opentInfo.endtimesecond--;
            _.timeData_1 = FormatSeconds(_.opentInfo.endtimesecond, 1);
            if (_.timeData_1 === "end") {
              _.isEnd = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_1);
            }
          }
        },
        1000,
        1
      );
    },
    // 榜单截止前一个小时的倒计时
    endTime_2() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_2 = timer;
          if (!_.timeSettimeout_2) clearTimeout(_.timeSettimeout_2);
          if (!_.isOverpoplar) {
            _.opentInfo.popularconfig.listendtimesecond--;
            _.timeData_2 = FormatSeconds(
              _.opentInfo.popularconfig.listendtimesecond,
              1
            );
            if (_.timeData_2 === "end") {
              _.isOverpoplar = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_2);
            }
          }
        },
        1000,
        1
      );
    },
    // 抢券开始的倒计时 意向特殊通道开启的倒计时
    endTime_3() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_3 = timer;
          if (!_.timeSettimeout_3) clearTimeout(_.timeSettimeout_3);
          if (_.isSpestartCountDown) {
            _.opentInfo.popularconfig.spestarttimesecond--;
            _.timeData_3 = FormatSeconds(
              _.opentInfo.popularconfig.spestarttimesecond,
              1
            );
            if (_.timeData_3 === "end") {
              _.isSpestartCountDown = false;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_3);
            }
          }
        },
        1000,
        1
      );
    },
    // 开始抢券的倒计时 意向特殊通道关闭的倒计时
    endTime_4() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_4 = timer;
          if (!_.timeSettimeout_4) clearTimeout(_.timeSettimeout_4);
          if (_.isSpeendCountDown) {
            _.opentInfo.popularconfig.speendtimesecond--;
            _.timeData_4 = FormatSeconds(
              _.opentInfo.popularconfig.speendtimesecond,
              1
            );
            if (_.timeData_4 === "end") {
              _.isSpeendCountDown = false;
              _.isSpeendOver = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_4);
            }
          }
        },
        1000,
        1
      );
    },
    // 抢券开始的倒计时 随机特殊通道开启的倒计时
    endTime_5() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_5 = timer;
          if (!_.timeSettimeout_5) clearTimeout(_.timeSettimeout_5);
          if (_.isRanstartCountDown) {
            _.opentInfo.popularconfig.ranstarttimesecond--;
            _.timeData_5 = FormatSeconds(
              _.opentInfo.popularconfig.ranstarttimesecond,
              1
            );
            if (_.timeData_5 === "end") {
              _.isRanstartCountDown = false;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_5);
            }
          }
        },
        1000,
        1
      );
    },
    // 开始抢券的倒计时 随机特殊通道关闭的倒计时
    endTime_6() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_6 = timer;
          if (!_.timeSettimeout_6) clearTimeout(_.timeSettimeout_6);
          if (_.isRanendCountDown) {
            _.opentInfo.popularconfig.ranendtimesecond--;
            _.timeData_6 = FormatSeconds(
              _.opentInfo.popularconfig.ranendtimesecond,
              1
            );
            if (_.timeData_6 === "end") {
              _.isRanendCountDown = false;
              _.isRanendOver = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_6);
            }
          }
        },
        1000,
        1
      );
    },
    // 抢券开始的倒计时 全网最低价特殊通道开启的倒计时
    endTime_7(countdowntimer) {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_7 = timer;
          if (countdowntimer > 0) {
            // _.opentInfo.popularconfig.minpricestarttimesecond--;
            countdowntimer--;
            _.timeData_7 = FormatSeconds(countdowntimer, 1);
            // console.log("_.timeData_7", _.timeData_7);
            if (_.timeData_7 === "end") {
              // _.isMinpricestartCountDown = false;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_7);
            }
          }
        },
        1000,
        1
      );
    },
    // 开始抢券的倒计时 全网最低价特殊通道关闭的倒计时
    endTime_8() {
      let _ = this;
      $timer(
        function (timer, count) {
          _.timeSettimeout_8 = timer;
          if (!_.timeSettimeout_8) clearTimeout(_.timeSettimeout_8);
          if (_.isMinpriceendCountDown) {
            _.opentInfo.popularconfig.minpriceendtimesecond--;
            _.timeData_8 = FormatSeconds(
              _.opentInfo.popularconfig.minpriceendtimesecond,
              1
            );
            if (_.timeData_8 === "end") {
              _.isMinpriceendCountDown = false;
              _.isMinpriceendOver = true;
              // 倒计时结束 重新请求接口
              _.handleInit();
              _.hasLoginHandleInit();
              clearTimeout(_.timeSettimeout_8);
            }
          }
        },
        1000,
        1
      );
    },
    // 实名认证
    identify(type) {
      // type = 1 页面进行实名认证 type = 2 按钮进行实名认证
      let _ = this;
      if (_.$root.ISAPP) {
        if (_.notloged) _.callAppLogin();
        else {
          if (!_.identification) {
            _.toast("已实名认证");
            return;
          }

          _.is_page_identification = type == 2 ? false : true;

          _.callIdentify();
        }
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }
    },
    // 提示下载app
    tipDownload(type) {
      let _ = this;
      if (type === 1) {
        _.confirm({
          msg: "请到APP参加抢购活动哦~",
          okText: "立即前往",
          cancelText: "我再想想",
          ok: _.openAppClient,
        });
      } else {
        _.openAppClient();
      }
    },
    // 问题解答跳转
    questionanswer(item) {
      let _ = this;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      status = 18;
      describe = "问题解答:" + item.title;
      window.location.href = item.link + "?title=" + item.title;
      // $log({
      //   e: "ipoclick",
      //   p: { status: status, describe: describe, activityid: _.activityid },
      // });
    },
    clickHint(type) {
      // type=1 提示 开始提醒我
      // type=2 来晚了 活动已结束~
      // type=3 排队中,请3分钟后再试...
      // type=4 购买码已失效  现在改成 本场抢购已失效
      // type=5 本场抢购机会已失效 现在改成 本场抢购已失效
      let msg = "",
        _ = this;
      switch (type) {
        case 1:
          msg = "开始提醒我";
          break;
        case 2:
          msg = "活动已结束~";
          break;
        case 3:
          msg = "排队中,请3分钟后再试...";
          break;
        case 4:
          msg = "本场抢购已失效";
          break;
        case 5:
          msg = "本场抢购已失效";
          break;
      }
      _.toast(msg);
    },
    // 查看助力的好友列表
    look(type) {
      // type = 1 活动方式A、B、C 方式 查看助力的好友列表
      // type = 2 活动方式D 方式 查看助力的好友列表
      // type = 3 活动方式D 方式 查看人气榜单列表
      let _ = this;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (_.$root.ISAPP) {
        if (_.notloged) _.callAppLogin();
        else {
          if (type == 1) {
            status = 15;
            describe = "活动方式B 方式 查看助力的好友列表";
          } else if (type == 2) {
            status = 16;
            describe = "活动方式D 方式 查看助力的好友列表";
          } else if (type == 3) {
            status = 17;
            describe = "活动方式D 方式 查看人气榜单列表";
          }
          _.$router.push(
            "/sneakerticket/friendList?activityid=" +
              _.activityid +
              "&type=" +
              type
          );
        }
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }

      // $log({
      //   e: "ipoclick",
      //   p: { status: status, describe: describe, activityid: _.activityid },
      // });
    },
    // 去逛逛
    go(type, goodsItem) {
      // type 1 去交易 2 往期回顾里面券的跳往对应的页面 3 前往往期发售页面(列表)
      let _ = this,
        goIschange = false,
        productid = "",
        size = "";
      if (_.$root.ISAPP) {
        if (type == 3) {
          _.javascriptBridge({
            name: "gotoPastSellRecordPage",
            params: {},
          });
        } else {
          if (type == 1) {
            _.javascriptBridge({
              name: "gotoAppMallCenterPage",
              params: {
                homepageindex: 1,
              },
            });
          }
          return;
          // if (type == 1) {
          //   goIschange = _.opentInfo.ischange;
          //   productid = _.opentInfo.productid;
          // } else if (type == 2) {
          //   productid = goodsItem.productid;
          //   size = goodsItem.size;
          //   if (goodsItem.type == 1) {
          //     // 预售券
          //     goIschange = false;
          //   } else if (goodsItem.type == 2) {
          //     // 现货券
          //     goIschange = true;
          //   }
          // }
          // if (goIschange) {
          //   // 判断是否为现货券
          //   _.javascriptBridge({
          //     name: "gotoAppSneakerDetailPage",
          //     params: {
          //       productid: productid,
          //       size: size,
          //     },
          //   });
          // } else {
          //   _.javascriptBridge({
          //     name: "gotoAppCouponTradePage",
          //     params: {
          //       productid: productid,
          //       size: size,
          //     },
          //   });
          // }
        }
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }
    },
    // 获得尺码列表
    getsize(number) {
      let _ = this,
        sum = 0,
        isall = true, //是否 每个尺码都有库存
        activityid = _.activityid;
      Getsizev2i({ activityid })
        .then((res) => {
          _.sizeList = res;
          if (_.sizeList.list) {
            _.sizeList.list.forEach((val, index) => {
              sum += val.num;
              if (!val.num) isall = false;
            });
          }

          if (number == 1) {
            // 页面一进来判断总库存
            _.allInv = sum;
            console.log("allInv", _.allInv);
          } else if (number == 2) {
            // 在页面里弹出尺码列表时再次请求
            document.body.classList.add("lock");
            _.allNum = sum;
            _.isAll = isall;
            _.cssShow = true;
            _.ModelStatus = 4;
          }
        })
        .catch((e) => {
          if (number == 1) {
            _.allInv = sum;
          } else if (number == 2) {
            _.allNum = sum;
          }
        });
    },

    // 获取购买码
    getProCode(param) {
      // param = {
      //   type: 8,
      //   sizes: _.storageSize
      // }
      console.log("param --->", param);
      let _ = this,
        activityid = _.activityid,
        sizes = param.sizes;
      Getcodev2i({ activityid, sizes })
        .then((res) => {
          if (res) {
            if (res.status === 1 && param.type == 1) {
              //A1,A2,A3,A4  获取购买码 引到进群
            } else {
              _.GetActcode = { ..._.GetActcode, ...res };
              _.cssShow = true;
              //把getcode里面的值赋给登录态
              if (param.type == 7) {
                // _.codeList = res.list;
                // _.chCodeList()
                setTimeout(() => _.hasLoginHandleInit(1), 150);
              }
              document.body.classList.add("lock");
              switch (param.type) {
                case 8:
                  // 活动方式D打榜 选择尺码后 展示登记成功页
                  _.ModelStatus = 7;
                  break;
                case 9:
                  // 活动方式D打榜 D分享激活和继续分享 B种方式 分享
                  _.ModelStatus = 9;
                  break;
              }
            }
          }
        })
        .catch((e) => {
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    // 复制
    copy(type, item) {
      // type 1 复制斗牛公众号到剪切板 className = '.OfficialAccount'
      let _ = this,
        className = "";
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (type == 1) {
        className = ".OfficialAccount";
        status = 14;
        describe = "复制斗牛公众号到剪切板";
      }
      var clipboard = new Clipboard(className);
      _.toast("已复制到剪贴板!");
      // $log({ e: "ipoclick", p: { status: status, describe: describe } });
    },
    closeModel(v) {
      let _ = this;
      if (v) {
        _.cssShow = false;
        _.ModelStatus = 0;
      }
      if (!_.showHint) {
        if (_.opentInfo.showsize) {
          _.getsize(1);
        }
        if (_.isStart && !isActing()) {
          _.drawlotInfo.status = 1;
        }
        _.hasLoginHandleInit();
      }
    },
    // 直接抢 函数
    robberyRob(type, pass_type) {
      let _ = this,
        code = "";
      if (_.codeList && _.codeList.length > 0) {
        // 登录态有购买码 取登录态里面的codelist
        _.codeList.forEach((val, index) => {
          if (val.status) {
            switch (val.status) {
              case 2:
                code = val.code;
                break;
            }
          }
        });
      }

      _.fCode = code;

      console.log("fCode", _.fCode);

      _.cssShow = true;
      document.body.classList.add("lock");

      switch (type) {
        case 5:
          // B种方式 直接抢 然后把购买码带到输入框内 分随机和选尺码
          if (_.opentInfo.showsize) {
            // 展开尺码弹框
            _.getsize(2);
          } else {
            // 直接走getcode接口 不能展示输入框
            _.$root.Bus.$emit("tell_child_commit", _.fCode);
          }
          break;
        case 7:
          if (pass_type == 4) {
            // 全网最低价 特殊通道 需要展示尺码弹框
            _.getsize(2);
          } else {
            // console.log('D方式 普通立即抢 意向通道立即抢 随机通道立即抢 不用显示输入框 应先到detail_pop 再调commit函数')
            _.$root.Bus.$emit("tell_child_commit", _.fCode, pass_type);
          }
          break;
      }
    },

    // D种方式 立即参与 选意向尺码
    join() {
      let _ = this,
        activityid = _.activityid;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (_.opentInfo.popularconfig && _.opentInfo.popularconfig.wantsize) {
        status = 9;
        describe = "D种方式 立即参与 有意向榜单时 选意向尺码";
        // 有意向榜单时 显示选意向尺码
        Sizelistv2i({ activityid })
          .then((res) => {
            _.chooseSizeList = res;
            _.cssShow = true;
            _.ModelStatus = 6;
          })
          .catch((e) => {
            if (e.code == 1511401) {
              _.toast(e.msg);
            }
          });
      } else {
        status = 10;
        describe = "D种方式 立即参与 没有意向榜单 走分享流程";
        // 没有意向榜单 直接走getcode接口然后显示分享的弹框 就是相当于走 分享流程
        _.playListShare();
      }

      // $log({
      //   e: "ipoclick",
      //   p: { status: status, describe: describe, activityid: _.activityid },
      // });
    },
    // D方式 分享
    playListShare(type) {
      // type = 1 B方式分享
      let _ = this,
        param = {
          type: 9,
        };
      if (_.$root.ISAPP) {
        let status = 0,
          describe = ""; // status 状态值 describe 状态值的描述
        if (type == 1) {
          status = 6;
          describe = "B种方式 分享";
        } else {
          status = 11;
          describe = "D种方式 分享";
        }

        _.getProCode(param);
        // $log({
        //   e: "ipoclick",
        //   p: { status: status, describe: describe, activityid: _.activityid },
        // });
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }
    },
    // D方式 抢券
    playListRob(pass_type) {
      let _ = this;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      // pass_type 1 普通通道(意向，随机，全网 未抢 code未失效) 2 意向特殊通道 3 随机特殊通道 4 全网最低价特殊通道
      _.pass_type = pass_type;
      if (_.$root.ISAPP) {
        if (_.notloged) _.callAppLogin();
        else {
          _.is_page_identification = false;
          if (!_.identification) {
            if (_.pass_type == 1) {
              status = 12;
              describe = "D种方式 普通通道 马上抢";
            } else if (_.pass_type == 2) {
              status = 13;
              describe = "D种方式 意向特殊通道 马上抢";
            } else if (_.pass_type == 3) {
              status = 24;
              describe = "D种方式 随机特殊通道 马上抢";
            }
            _.robberyRob(7, _.pass_type);
          } else {
            // 进行实名认证
            status = 8;
            describe = "进行实名认证";
            _.identify(2);
          }
        }
        $log({
          e: "ipoclick",
          p: { status: status, describe: describe, activityid: _.activityid },
        });
      } else _.loadApp("请前往【斗牛DoNew】APP参与活动~");
    },
    // B方式 抢券
    playListRob2() {
      let _ = this;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (_.$root.ISAPP) {
        if (_.notloged) _.callAppLogin();
        else {
          _.is_page_identification = false;
          if (!_.identification) {
            status = 5;
            describe = "B种方式立马抢";
            // B种方式 直接抢 然后把购买码带到输入框内
            _.robberyRob(5);
          } else {
            // 进行实名认证
            status = 8;
            describe = "进行实名认证";
            _.identify(2);
          }
        }
        // $log({
        //   e: "ipoclick",
        //   p: { status: status, describe: describe, activityid: _.activityid },
        // });
      } else _.loadApp("请前往【斗牛DoNew】APP参与活动~");
    },
    // 去往c2c商品详情页
    goProductDetail() {
      let _ = this,
        productid = _.opentInfo.productid;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: {
            productid,
          },
        });
      } else {
        _.$router.push("/sneaker/detail/" + productid);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.isvip {
  color: #646464;
  font-size: 3.4666vw;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  height: auto;
  border: 0;
  margin-top: 4.8vw;
  &.mt {
    margin-top: 2.133vw;
  }
  .bolt {
    position: relative;
    &::before {
      content: "";
      width: 4vw;
      height: 3.7333vw;
      background: url("https://files.eyee.com/activity/vip/bolt.png") 0 0
        no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: -4.3vw;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  em {
    color: #fa2337;
  }
  i {
    display: inline-block;
    width: 3.2vw;
    height: 3.2vw;
    right: -3.5vw;
    background: url("https://files.eyee.com/activity/vip/help.png") 0 0
      no-repeat;
    background-size: 100% 100%;
    margin-left: 2px;
  }
}

.vip-modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  .cont {
    width: 76vw;
    // height: 90.133vw;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;

    // background: url("https://files.eyee.com/activity/vip/image_bg.png") 0 0
    //   no-repeat;
    // background-size: 100% 100%;
    .img {
      position: relative;
      img {
        display: block;
        width: 100%;
      }
      ._btn {
        position: absolute;
        height: 11.733vw;
        left: 6.666vw;
        right: 6.666vw;
        bottom: 6.666vw;
        color: #3c3c3b;
        font-size: 4.2666vw;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        background: linear-gradient(
          180deg,
          rgba(255, 229, 190, 1) 0%,
          rgba(255, 198, 137, 1) 100%
        );
        border-radius: 5.8666vw;
      }
    }
    .close {
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
      display: block;
      margin: 8vw auto 0;
      // position: absolute;
      // left: 50%;
      // transform: translateX(-50%);
      background: url("https://files.eyee.com/activity/vip/icon_close.png") 0 0
        no-repeat;
      background-size: 100% 100%;
    }
  }
}
.p {
  &.hasset {
    opacity: 0.5;
    font-size: 4.2666vw;
    span {
      position: relative;
      &::before {
        content: "";
        width: 5.8666vw;
        height: 5.8666vw;
        background: url("https://files.eyee.com/activity/vip/icon_alarm_act.png")
          0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -6vw;
      }
    }
  }
  &.set {
    opacity: 1;
    span {
      &::before {
        content: "";
        background: url("https://files.eyee.com/activity/vip/icon_alarm.png") 0
          0 no-repeat;
        background-size: 100% 100%;
      }
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
  font-family: Arial, Helvetica, sans-serif;
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
.sneaker-mall {
  background: #ebebeb;
  width: 100%;
  min-height: 100vh;
  padding: 4vw 4vw 0;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  padding-bottom: 80px;
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
.info_box {
  min-height: 100vh;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
}
.img_box {
  width: 100%;
  margin-bottom: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
  }
}
.ticketBox_pop_list {
  background-color: #fff;
  // background: url("https://files.eyee.com/eyeeh5/img/price_bg.png") 0 0
  //   no-repeat;
  background-size: cover;
  padding: 0 6.67vw;
  height: 108px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  .ticketBox_pop_list_left {
    .tit {
      margin-bottom: 5px;
      height: 18px;
      height: 18px;
      font-size: 12px;
      color: #646464;
    }
    .now_price {
      height: 8vw;
      line-height: 8vw;
      color: #232323;
      font-weight: bold;
      position: relative;
      font-family: "OswaldBold";
      strong {
        font-size: 18px;
        position: relative;
        top: 2.4vw;
        left: -3px;
      }
      em {
        font-size: 30px;
        position: absolute;
        left: 12px;
        top: -2px;

        font-style: italic;
        width: 150px;
        img {
          display: inline-block;
          width: 16px;
          height: 15px;
          position: relative;
          top: 2px;
          left: -2px;
        }
      }
    }
    .unPrice {
      padding-top: 2.1vw;
      position: relative;
      strong {
        font-size: 18px;
        position: relative;
        top: 3px;
        left: -3px;
      }
      em {
        position: absolute;
        left: 14px;
        top: 8px;
        display: block;
        width: 14.4vw;
        height: 5.9vw;
        background: url("http://files.eyee.com/eyeeh5/img/crunchies/ques_mark.png")
          center center no-repeat;
        background-size: cover;
      }
    }
  }
  .ticketBox_pop_list_right {
    p {
      height: 18px;
      font-size: 12px;
      color: #969696;
      line-height: 18px;
      &.deliver {
        font-weight: 400;
        margin-bottom: 12px;
        position: relative;
        top: -4px;
      }
      &.agora_price {
        text-align: right;
        del {
          font-weight: 600;
        }
      }
    }
  }
}
.explain {
  box-shadow: 0px 2px 2px 4px rgba(243, 238, 238, 0.5);
  background: #fff;
  margin-bottom: 15px;
  width: 100%;
  border-radius: 20px;
  padding: 0 6.67vw;
  overflow: hidden;
}
.no-padding {
  padding: 0;
}
.questionanswer {
  padding: 30px 0 25px;
  .tit {
    height: 18px;
    line-height: 18px;
    margin-bottom: 8px;
    img {
      height: 18px;
    }
  }
  .conten {
    .item {
      display: block;
      width: 100%;
      height: 44px;
      line-height: 44px;
      border-bottom: solid 1px #f5f5f5;
      // padding: 0 15px 0 0;
      &:last-child {
        border: 0;
      }
      span {
        float: left;
        color: #333;
        font-size: 14px;
      }
      em {
        float: right;
        display: block;
        width: 12px;
        height: 12px;
        line-height: 12px;
        background: url("https://files.eyee.com/eyeeh5/img/crunchies/icon_more@3x.png")
          center center no-repeat;
        background-size: cover;
        position: relative;
        top: 16px;
      }
    }
  }
}
.lit_secret {
  padding: 6.67vw 0;
  .tit {
    height: 25px;
    line-height: 25px;
    margin-bottom: 12px;
    img {
      height: 18px;
    }
  }
  .content {
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin-bottom: 5px;
    .identify {
      color: #fa2337;
      font-weight: bold;
      padding-left: 5px;
    }
  }
  .content1 {
    font-size: 14px;
    color: #646464;
    line-height: 20px;
    font-weight: 400;
    em {
      font-weight: bold;
      padding-left: 5px;
      color: #232323;
    }
  }
}
.mb24 {
  margin-bottom: 24px;
}
.btn_box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0 10px 4vw;
  background: #fff;
  display: flex;
  z-index: 3;
  transform: translateZ(0);
  .btn_box_exp {
    position: absolute;
    top: -25px;
    left: 0;
    width: 100%;
    height: 26px;
    line-height: 42px;
    background: #fff;
    color: #fa2337;
    text-align: center;
    font-size: 12px;
  }
  .p {
    height: 50px;
    background: #fa2337;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    text-align: center;
    margin-right: 4vw;
    flex: 1;
    &.start {
      flex: 1;
      background: #fa2337;
    }
    &.unStart {
      background: #969696;
      flex: 1;
    }
    &.getCodeBtn {
      flex: 1;
      background: #000;
    }
    &.end {
      flex: 1;
      background: #969696;
    }
  }
  .ending {
    height: 50px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    text-align: center;
    margin-right: 4vw;
    width: 100%;
    background: #cdcdcd;
  }
}
.rob_chance {
  width: 100%;
  border-radius: 20px;
  background: #fff;
  padding: 5vw 6.67vw 30px;
  margin-bottom: 15px;
  .title {
    height: 17px;
    line-height: 17px;
    margin-bottom: 5px;
    span {
      font-size: 12px;
      color: #232323;
      font-weight: bold;
      margin-right: 10px;
    }
    em {
      font-size: 12px;
      color: #646464;
    }
  }
  .msg_exp {
    height: 20px;
    margin-bottom: 5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 85vw;
    p {
      width: 85vw;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #969696;
      line-height: 20px;
    }
  }
  .rate_exp {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 8px;
    width: 100% !important;
    padding-top: 10px;
    .bar {
      flex: 1;
      color: #969696;
      font-size: 12px;
      text-align: center;
      position: relative;
      &.act {
        color: #fa2337;
        .dot {
          background: #fa2337;
        }
      }
      &:first-child {
        text-align: left;
        .dot {
          left: 5px;
        }
      }
      &:last-child {
        text-align: right;
        .dot {
          left: 97%;
        }
      }
      .info {
        height: 16px;
        line-height: 16px;
      }
      .dot {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #dcdcdc;
        position: absolute;
        left: 50%;
        top: 137%;
        transform: translateX(-50%);
        z-index: 2;
      }
    }
  }
  .progress_bar {
    position: relative;
    width: 100%;
    background: #dcdcdc;
    height: 6px;
    border-radius: 3px;
    margin-bottom: 20px;
    .cut-bar {
      height: 6px;
      border-radius: 3px;
      background: #fa2337;
    }
  }
  .rate_exp_info {
    background: #f5f5f5;
    border-radius: 4px;
    text-align: left;
    height: 42px;
    line-height: 42px;
    padding-left: 15px;
    margin-bottom: 15px;
    .info {
      font-size: 12px;
      color: #232323;
      font-weight: bold;

      .red {
        color: #fa2337;
      }
    }
    .rate_exp_info_box {
      background: #f5f5f5;
      border-radius: 4px;
    }
  }
}
.help-friend-list {
  &.help-friend-list-2 {
    padding-top: 14px;
  }
  .tit {
    width: 100%;
    height: 26px;
    line-height: 26px;
    margin-bottom: 12px;
    .help_tit {
      float: left;
      font-size: 13px;
      color: #1b1b1b;
      font-weight: bold;
    }
    .look {
      float: right;
      font-size: 12px;
      color: #a0a0a0;
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url("https://files.eyee.com/eyeeh5/img/crunchies/icon_more@3x.png")
          center center no-repeat;
        background-size: cover;
        vertical-align: middle;
      }
    }
  }
  .look {
    font-size: 14px;
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      background: url("https://files.eyee.com/eyeeh5/img/crunchies/icon_more@3x.png")
        center center no-repeat;
      background-size: cover;
      vertical-align: middle;
    }
  }
  .help_img {
    width: 100%;
    display: flex;
    overflow: hidden;
  }
  .help_item {
    margin-right: 5.665vw;
    width: 11.2vw;
    height: 11.2vw;
    &.margin_right0 {
      margin-right: 0;
    }
    &.hidden {
      display: none;
    }
    img {
      display: block;
      width: 11.2vw;
      height: 11.2vw;
      margin: 0;
      border-radius: 50%;
    }
  }
  .emp2 {
    display: flex;
    .help_item:last-child {
      margin-right: 0;
    }
  }
  .help_empty {
    span {
      display: block;
      width: 11.2vw;
      height: 11.2vw;
      background: url("http://files.eyee.com/eyeeh5/img/crunchies/add.png")
        center center no-repeat;
      background-size: cover;
    }
    .look {
      em {
        color: #969696;
      }
    }
  }
  .help_tit {
    font-size: 14px;
  }
}

.myRankingBox {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px 15px;
  margin-bottom: 5px;
  .info_2 {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #232323;
    .name {
      font-size: 14px;
      .small {
        font-size: 12px;
      }
    }
    .val {
      font-size: 14px;
      .bold {
        font-size: 14px;
        font-weight: bold;
        padding: 0 2px;
      }
    }
  }
}
.Popularity_list_tit {
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 10px 0;
  .bar {
    display: block;
    width: 10px;
    height: 25px;
    margin-right: 8px;
    &.after {
      margin-left: 8px;
      margin-right: 0;
      -moz-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      transform: rotateY(180deg);
    }
    &.max {
      width: 17px;
      height: 39px;
      img {
        display: block;
        width: 17px;
        height: 39px;
      }
    }
    img {
      display: block;
      width: 10px;
      height: 25px;
    }
  }

  .tit_info_box {
    .tit_info {
      height: 18px;
      line-height: 18px;
      font-weight: 400;
      text-align: center;
      justify-content: center;
      display: flex;
      margin-bottom: 2px;
      img {
        display: block;
        height: 18px;
      }
      p {
        display: block;
        height: 18px;
        line-height: 18px;
        color: #f92438;
        font-family: OswaldBold;
        font-size: 18px;
        padding: 0 1px;
      }
    }
  }
}
.Popularity_list {
  width: 100%;
  border-radius: 20px;
  background: #fff;
  padding: 30px 6.67vw 25px;
  margin-bottom: 15px;
}
.head_box {
  .head {
    color: #232323;
    height: 18px;
    line-height: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    .head_1 {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        display: block;
        height: 18px;
        margin-right: 6px;
      }
      span {
        display: block;
        width: 14px;
        height: 14px;
        background: url("https://files.eyee.com/eyeeh5/img/crunchies/icon_question.png")
          center center no-repeat;
        background-size: cover;
      }
    }
    .loading {
      width: 50%;
      font-size: 12px;
      color: #969696;
      font-weight: 400;
      text-align: right;
      i {
        display: inline-block;
        width: 12px;
        height: 13px;
        background: url("https://files.eyee.com/eyeeh5/img/loading.png") center
          center no-repeat;
        background-size: cover;
        position: relative;
        top: 2px;
        left: -4px;
      }
    }
  }
  .exp {
    color: #969696;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
    font-weight: 400;
  }
}
.my_ranking_fruit {
  margin-bottom: 15px;
  padding: 4vw;
  background: #ff5a69;
  border-radius: 6px;
  overflow: hidden;
  .info {
    .info_fruit {
      margin-bottom: 5px;
      font-size: 14px;
      color: #fff;
      font-weight: 600;
      line-height: 20px;
    }
    .exp {
      font-size: 13px;
      color: #fff;
      font-weight: 600;
      line-height: 20px;
      span {
        font-weight: bold;
      }
    }
  }
}
.my_ranking_box {
  .tit {
    height: 40px;
    line-height: 40px;
    margin: 0;
    display: flex;
    span {
      width: 55%;
      color: #232323;
      font-size: 14px;
    }
    em {
      width: 25%;
      text-align: right;
      color: #646464;
      font-size: 12px;
    }
    strong {
      width: 20%;
      text-align: right;
      color: #232323;
      font-size: 12px;
    }
  }
}
.ranking_item {
  height: 50px;
  line-height: 50px;
  display: flex;
  padding: 12px 0;
  border-bottom: solid 1px #f0f0f0;
  &:last-child {
    border: 0;
  }
  &.hidden {
    display: none;
  }
  &.borderN {
    border: 0;
  }
  .index {
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    margin-right: 5px;
    img {
      display: block;
      width: 26px;
      height: 26px;
    }
    span {
      color: #232323;
      font-size: 12px;
      font-weight: bold;
    }
  }
  .img_box {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    img {
      display: block;
      width: 26px;
      height: 26px;
    }
  }
  .name {
    flex: 1;
    height: 26px;
    line-height: 26px;
    .name1 {
      color: #232323;
      font-size: 12px;
      position: relative;
      .isSelf {
        position: absolute;
        top: -6px;
        right: -64px;
        display: inline-block;
        width: 56px;
        height: 26px;
        line-height: 26px;
        background: rgba(245, 245, 245, 1);
        border-radius: 13px;
        color: #646464;
        font-size: 12px;
        text-align: center;
      }
    }
  }
  .point {
    width: 40%;
    display: flex;
    text-align: right;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    span {
      width: 50%;
      color: #646464;
    }
    strong {
      width: 50%;
      color: #232323;
    }
  }
}
.look_more {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  font-weight: bold;
  color: #969696;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: block;
    width: 12px;
    height: 12px;
    background: url("https://files.eyee.com/eyeeh5/img/crunchies/icon_more@3x.png")
      center center no-repeat;
    background-size: cover;
  }
}
.my_ranking_empty {
  img {
    margin: 5px auto 0;
    display: block;
    width: 28vw;
    height: 28vw;
  }
  .info {
    height: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #b4b4b4;
    line-height: 20px;
    text-align: center;
  }
}
.buy_notice {
  min-height: 34px;
  background: transparent;
  font-weight: 600;
  overflow: hidden;
  position: fixed;
  left: 4vw;
  top: 0;
  width: 40vw;
  text-align: center;
  font-size: 12px;
  z-index: 10;
  .buyRecordList {
    position: absolute;
    left: 0;
    top: 34px;
    animation: move 2.3s linear;
    width: 40vw;
    .buy_notice_item {
      display: block;
    }
  }
  .buy_notice_item {
    display: none;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    color: #232323;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 17px;
    width: 40vw;
    margin-bottom: 34px;
  }
}
@keyframes move {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-34px);
  }
  80% {
    transform: translateY(-34px);
  }
  90% {
    transform: translateY(-68px);
  }
  100% {
    transform: translateY(-102px);
  }
}

.msg_notify_open {
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 15px;
  margin-bottom: 12px;
  border-radius: 8px;
  .icon {
    width: 28px;
    height: 28px;
    background: url("//files.eyee.com/eyeeh5/img/crunchies/news_icon.png")
      center center no-repeat;
    background-size: cover;
    margin-right: 6px;
  }
  .info {
    flex: 1;
    .info1 {
      height: 18px;
      font-size: 13px;
      font-weight: bold;
      color: #232323;
      line-height: 18px;
    }
    .info2 {
      height: 16px;
      font-size: 12px;
      color: #646464;
      line-height: 16px;
    }
  }
  .btn {
    width: 55px;
    height: 24px;
    line-height: 24px;
    background: #fc606f;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    color: #646464;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
  }
}

.beforeLookConBox {
  box-shadow: 0px 2px 2px 4px rgba(243, 238, 238, 0.5);
  background: #fff;
  margin-bottom: 15px;
  width: 100%;
  border-radius: 20px;
  padding: 25px 0 25px;
  .tit_box {
    padding: 0 6.67vw;
    .tit {
      margin-bottom: 3px;
      img {
        height: 18px;
      }
    }
    .head {
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #969696;
      line-height: 17px;
      margin-bottom: 10px;
    }
  }
}
.goods_detail {
  padding-top: 6.67vw;
  padding-bottom: 6.67vw;
  .tit {
    height: 18px;
    line-height: 18px;
    margin-bottom: 8px;
    img {
      height: 18px;
    }
  }
}
.goods_item {
  padding: 2.67vw;
  padding-right: 4vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img_b {
    width: 18.67vw;
    height: 18.67vw;
    margin-right: 8px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .goodsInfo1 {
    width: 45.6vw;
    .name {
      font-size: 13px;
      font-weight: 600;
      color: #232323;
      line-height: 20px;
      margin-bottom: 6px;
    }
    .priceBox {
      display: flex;
      height: 16px;
      .price {
        height: 16px;
        flex: 1;
        position: relative;
        span {
          position: absolute;
          left: -2.5vw;
          bottom: 0;
          display: block;
          width: 28vw;
          height: 16px;
          line-height: 16px;
          transform: scale(0.8);
          font-size: 13px;
          font-weight: 400;
          color: #646464;
        }
      }
    }
  }
  .goodsInfo2 {
    width: 20vw;
    text-align: right;
    .pricerate {
      color: #0ab978;
      font-size: 17px;
      font-family: OswaldBold;
      &.red {
        color: #fa2337;
      }
      &.gray {
        color: #969696;
      }
      span {
        font-size: 14px;
      }
    }
    .pricechange {
      color: #969696;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
.main_info {
  width: 100%;
  border-radius: 20px;
  background: #fff;
  padding: 7vw 6.67vw;
  margin-bottom: 15px;
  .diff_status {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
    padding-top: 3px;
    .info {
      height: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      img {
        display: block;
        height: 19px;
      }
      p {
        color: #fa2337;
        font-family: OswaldBold;
        font-size: 18px;
        padding: 0 4px;
      }
    }
  }
  .help_item {
    margin-right: 5.665vw;
    width: 11.2vw;
    height: 11.2vw;
    &:last-child {
      margin-right: 0;
    }
    &.hidden {
      display: none;
    }
  }
  .emp {
    display: flex;
    .help_item:last-child {
      margin-right: 5.665vw;
    }
  }
  .help_empty {
    .look {
      display: block;
      width: 11.2vw;
      height: 11.2vw;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .help-friend-list {
    margin-bottom: 28px;
    // min-height: 11.2vw;
    position: relative;
    .look_more {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.btn_diff_status {
  .p {
    height: 50px;
    background: #fa2337;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    text-align: center;
    &.zoom {
      animation: scaleDraw 1.5s ease-in-out infinite;
      -webkit-animation: scaleDraw 1.5s ease-in-out infinite;
    }
    &.unStart {
      background: #969696;
    }
    &.endTime1 {
      background: #232323;
    }
  }
  .btn_box_exp {
    height: 42px;
    line-height: 42px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #232323;
    text-align: center;
    margin-bottom: 15px;
  }
  .flex_box {
    display: flex;
    .p {
      flex: 1;
    }
    .ending {
      height: 50px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 50px;
      text-align: center;
      width: 100%;
      background: #969696;
    }
  }
  .hint {
    padding-top: 18px;
    .p_info {
      height: 18px;
      font-size: 13px;
      font-weight: bold;
      color: #646464;
      line-height: 18px;
      text-align: center;
    }
  }
}
@keyframes scaleDraw {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(0.95);
  }
}
.endingBox {
  padding: 15px 0 30px;
  p {
    height: 16px;
    font-size: 12px;
    color: #b4b4b4;
    line-height: 16px;
    text-align: center;
    width: 100%;
  }
}
.fixGo {
  position: fixed;
  transform: translateZ(0);
  right: 0;
  top: 44%;
  background: #fa2337;
  z-index: 10;
  padding: 1.5vw 10px 1.5vw 14px;
  border-radius: 100px 0 0 100px;
  .info {
    text-align: center;
    p {
      font-weight: bold;
      color: #fff;
      height: 4.5vw;
      line-height: 4.5vw;
      font-size: 12px;
    }
  }
}
.fix_btn_box {
  position: fixed;
  transform: translateZ(0);
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  padding: 10px 15px;
}
.OfficialAccount {
  img {
    width: 100%;
    display: block;
  }
}
</style>
<style lang="scss">
.tcaptcha-transform {
  position: fixed !important;
}
</style>
