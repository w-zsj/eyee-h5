<template>
  <div class="personally-fans">
    <v-header>
      <div class="nav-tab2">
        <h3>直招粉丝</h3>
      </div>
    </v-header>
    <v-list
      :load-handle="()=>{}"
      :more-handle="loadmore"
      :more-handling="isLoading"
      :isend="isEnd"
      v-if="list.length>0"
    >
      <ul>
        <li :class="idx==index?'active':''" @click="show(item,idx)" v-for="(item,idx) in list" :key="idx">
          <div class="fans-basic">
            <span>手机：{{item.mobile}}</span>
            <span :class="item.status===1?'sta':''">{{item.status===1?'已入会':'已过期'}}</span>
            <!-- <span>总佣金： <em>￥{{item.totalcommission}}</em></span> -->
          </div>
          <div class="fans-detail">
            <p>
              <span>个人推广佣金： <em>￥{{item.promotecommission||0}}</em></span>
              <!-- <span>总佣金： <em>￥{{item.totalcommission}}</em></span> -->
            </p>
            <p>入会时间： {{item.joinedtime}}</p>
            <p>最近登录： {{item.recentlogintime}}</p>
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
import { DateDiffFormat } from '../../common/util'
import { directfanslist } from '@/common/api/oa'
export default {
  data() {
    return{
      isLoading: false,
      isEnd: false,
      index: 0,
      query: {
        page: 1,
        size: 10
      },
      list: [],
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    }
  },
  // computed: {
  //   listData() {
  //     let _ = this
  //     let list = _.list
  //     if (list && list.length > 0) {
  //       list = list.map(i => {
  //         i.joinedtime = DateDiffFormat(i.joinedtime)
  //         i.recentlogintime = DateDiffFormat(i.recentlogintime)
  //         return i
  //       })
  //       return list
  //     } else {
  //       return null
  //     }
  //   }
  // },
  beforeMount() {
    let _ = this
    let { load } = _
    load()
  },
  methods: {
    load() {
      let _ = this
      let { toast, query, redirectUrl } = _
      _.isLoading = true
      directfanslist(query)
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
.personally-fans {
  font-size: 13px;

  li {

    em {
      color: #666;
    }
  }
  .active {
    .fans-detail{
      height: auto;
      padding: 20px 10px;
      line-height: 36px;
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
    line-height: 54px;
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
    span:first-child {
      flex: 1;
    }
    span:last-child{
      width: 100px;
      text-align: right;
    }
    .sta {
      padding: 0 10px;
      font-weight: bold;
      color: orange;
    }
  }
  .fans-detail {
    height: 0;
    padding: 0 10px;
    overflow: hidden;
    transition: all 0.2s linear;
    border-bottom: 1px solid #fff;
    p {
      display: flex;
      justify-content: space-between;
    }

    span {
      display: block;
    }
  }
}
</style>

