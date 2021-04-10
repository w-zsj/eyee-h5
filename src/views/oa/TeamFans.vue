<template>
  <div class="team-fans">
    <v-header>
      <div class="nav-tab2">
        <h3>团队粉丝</h3>
      </div>
    </v-header>
    <div class="mode">
      <h4>团队成员</h4>
      <ul class="content">
        <li>
          <p class="num">{{user.teamfanscount||0}}</p>
          <p>粉丝总数（人）</p>
        </li>
        <li>
          <p class="num">{{user.leadercount||0}}</p>
          <p>潮牌主理（人）</p>
        </li>
        <li>
          <p class="num">{{user.directorcount||0}}</p>
          <p>潮牌总监（人）</p>
        </li>
      </ul>
    </div>
    <v-list
      :load-handle="()=>{}"
      :more-handle="loadmore"
      :more-handling="isLoading"
      :isend="isEnd"
      v-if="list.length>0"
    >
      <ul class="fans-cont">
        <li :class="idx==index?'active':''" @click="show(item,idx)" v-for="(item,idx) in list" :key="idx">
          <div class="fans-basic">
            <span>手机：{{item.mobile}}</span>
            <span v-if="item.level === 1">vip</span>
            <span v-else-if="item.level === 2">总监</span>
            <span v-else>主理人</span>
            <span> 直属潮牌合伙人： <em>{{item.directvipcount||0}}</em></span>
          </div>
          <div class="fans-detail">
            <span>本月邀新奖励：<em>￥{{item.monthinviteincome||0}}</em></span>
            <span>本月培训津贴: <em>￥{{item.monthtrainincome||0}}</em></span>
            <span>本月团队推广佣金: <em>{{item.monthteampromoteincome||0}}</em></span>
            <span>本月新增合伙人: <em>{{item.monthaddvip||0}}</em></span>
            <span>团队总潮牌合伙人: <em>{{item.totalvipcount||0}}</em></span>
          </div>
        </li>
      </ul>
    </v-list>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>暂无粉丝~</p>
    </div>
  </div>
</template>
<script>
import { teamfansinfo, teamfanslist } from '@/common/api/oa'
export default {
  data() {
    return {
      isLoading: false,
      isEnd: false,
      index: 0,
      query: {
        page: 1,
        size: 10
      },
      user: {},
      list: [],
      fanscount: 0,
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    }
  },
  beforeMount() {
    let _ = this
    let { load, getTeamfansinfo } = _
    getTeamfansinfo()
    load()
  },
  methods: {
    load() {
      let _ = this
      let { toast, query, redirectUrl } = _
      _.isLoading = true
      teamfanslist(query)
        .then(res => {
          res.list && _.list.push(...res.list)
          _.isEnd = res.page * res.size >= res.total && _.list.length > 0;
          _.isLoading = false

        })
        .catch(e => {
          _.isLoading = false
          toast(e.msg)
          location.href = redirectUrl
        })
    },
    loadmore() {
      let _ = this
      let { load, isLoading, isEnd, toast } = _
      if(isLoading) return
      if(isEnd) {
        toast("已无更多")
      } else {
        _.query.page++
        load()
      }
    },
    getTeamfansinfo() {
      let _ = this
      let { toast, redirectUrl } = _
      teamfansinfo()
        .then(res => {
          _.user = res
        })
        .catch(e => {
          toast(e.msg)
          location.href = redirectUrl
        })
    },
    show(item, idx) {
      const _ = this
      if (_.index === idx) {
        _.index = -1
      } else {
        _.index = idx
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.team-fans {
  font-size: 13px;
}
.mode {
    border-bottom: 1px solid #eee;
    padding: 15px 10px 24px;

    h4{
      padding: 5px 10px 20px;
    }
    .content{
      display: flex;
      line-height: 26px;
      
      li {
        flex: 1;
        text-align: center;
      }
      .num {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .fans-cont {
    li {

      em {
        color: #666;
      }
  }
  .active {
    .fans-detail{
      height: auto;
      padding: 10px;
      line-height: 40px;
      border-bottom: 1px solid #eee;
    }
    .fans-basic{
      &::after {
        transform: rotate(135deg);
      }
    }
  }
  .fans-basic{
    position: relative;
    display: flex;
    line-height: 40px;
    padding: 0 28px 0 10px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;

    &::after {
      transition: transform 0.2s linear;
      position: absolute;
      top: 50%;
      right: 10px;
      margin-top: -4px;
      content: '';
      width: 8px;
      height: 8px;
      border-top: 1px solid #333;
      border-right: 1px solid #333; 
      transform: rotate(45deg);
    }
    span {
      display: block;
    }
    span:last-child{
      width: 122px;
      text-align: right;
    }
  }
  .fans-detail {
    height: 0;
    padding: 0 10px;
    overflow: hidden;
    transition: all 0.2s linear;
    border-bottom: 1px solid #fff;
    span {
      float: left;
      width: 50%;
    }
  }
}
</style>
