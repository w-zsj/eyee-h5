<template>
  <div class="fans">
    <div class="fans-head">
      <div class="hd-left">
        <p><span class="font-price">{{fansData.total||'0'}}</span>人</p>
        <p class="hd-total">邀请总数</p>
      </div>
      <router-link
        to="/vip/invite"
        class="hd-invite"
      >邀请新好友</router-link>
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
            <span>手机&nbsp;{{item.mobile}}</span>
            <span>已加入</span>
          </div>
          <div class="fans-detail">
            <p>昵称： {{item.nickname}}</p>
            <p>入会时间： {{item.jointime}}</p>
            <p>最近登录： {{item.lastlogintime}}</p>
          </div>
        </li>
      </ul>
    </v-list>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>暂无邀请~</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { fanslist } from '@/utils/api/vip'
export default {
  name: 'VipFans',
  data() {
    return {
      isLoading: false,
      isEnd: false,
      index: 0,
      query: {
        page: 1,
        size: 10
      },
      fansData: {},
      list: []
    }
  },
  beforeMount() {
    let _ = this
    let { load, user, confirm } = _
    if (!user || !user.token) {
      confirm({
        title: "登录提示",
        msg: "请登录后重试~",
        okText: "前往登录",
        cancelText: "容我想想",
        ok: () => {
          _.javascriptBridge({
            name: "callAppLoginPage",
            params: { callbackname: "_appLoginCallback" }
          })
        }
      })
      return
    }
    load()
    _.setToolBar({
      title: '我的邀请',
      bgcolor: '#ffffff',
      textcolor: '#232323'
    })
  },
  computed: {
    ...mapGetters({ user: 'userInfo' })
  },
  methods: {
    load() {
      let _ = this
      let { toast, query } = _
      _.isLoading = true
      fanslist(query)
        .then(res => {
          _.fansData = res
          _.list.push(...res.list)
          _.isEnd = res.page * res.size >= res.total && res.list.length > 0;
          _.isLoading = false
        })
        .catch(e => {
          _.isLoading = false
          toast('加载失败')
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
    show(item, idx) {
      const _ = this
      if(_.index == idx){
        _.index = -1
      } else {
        _.index = idx
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fans {
  min-height: 100vh;
  background-color: #F5F5F5;
  .fans-head {
    display: flex;
    padding: 28px 30px 20px;
    background: url(//files.eyee.com/activity/vip/bg-fans.png) no-repeat #232323;
    background-size: cover;
    align-items: center;
  }
  .hd-left {
    flex: 1;
    line-height: 24px;
    color: #F9E2CB;
    font-size: 12px;

    span {
      font-weight: bold;
      font-size: 30px;
    }
    .hd-total{
      font-weight: 500;
    }
  }
  .hd-invite {
    display: block;
    width: 102px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: linear-gradient(153deg, #FFDCB8 0%, #E6BA90 100%);
    border-radius: 2px;
    color: #111111;
    font-size: 14px;
    font-weight: bold;
  }
  .fans-cont {

    .active {
      .fans-detail{
        height: auto;
        padding: 10px;
        line-height: 30px;
        background-color: #F5F5F5;
      }
      .fans-basic{
        &::after {
          transform: rotate(0deg);
        }
      }
    }
    .fans-basic{
      position: relative;
      display: flex;
      line-height: 50px;
      padding: 0 35px 0 15px;
      background-color: #fff;
      justify-content: space-between;
      color: #232323;
      font-size: 15px;
      
      &::after {
        transition: transform 0.2s linear;
        position: absolute;
        top: 40%;
        right: 15px;
        // margin-top: -4px;
        content: '';
        width: 12px;
        height: 12px;
        // border-top: 1px solid #969696;
        // border-right: 1px solid #969696; 
        transform: rotate(-180deg);
        background: url(//files.eyee.com/activity/vip/ico-arrow-down.png) no-repeat;
        background-size: contain;
      }
      span {
        display: block;
      }
      span:nth-child(1){
        flex: 1;
      }
      span:last-child{
        color: #969696;
        font-size: 13px;
      }
    }
    .fans-detail {
      height: 0;
      padding: 0 10px;
      overflow: hidden;
      transition: all 0.2s linear;
      color: #646464;
      font-size: 12px;
    }
  }
  .no-data {
    p {
      margin-top: -5px;
      font-size: 16px;
    }
  }
}
</style>
