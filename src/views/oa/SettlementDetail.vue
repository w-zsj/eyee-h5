<template>
  <div class="settlement-detail">
    <v-header>
      <div class="nav-tab2">
        <h3>{{title.replace(/-/g, "")}}结算单</h3>
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
        <li v-for="(item,idx) in list" :key="idx">
          <div class="left">
            <p>{{item.typetext}}</p>
            <p>订单完成时间：{{item.ordertime}}</p>
          </div>
          <div class="right">¥{{item.amount}}</div>
        </li>
      </ul>
    </v-list>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>暂无结算单~</p>
    </div>
  </div>
</template>
<script>
import { DateDiffFormat } from '../../common/util'
import { settlementdetail } from '@/common/api/oa'
export default {
  data() {
    return{
      isLoading: false,
      isEnd: false,
      index: 0,
      query: {
        page: 1,
        size: 10,
        billid: ''
      },
      list: [],
      title: '',
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    }
  },
  beforeMount() {
    let _ = this
    let { load } = _
    _.title = _.$route.query.title
    load()
  },
  methods: {
    load() {
      let _ = this
      _.query.billid = _.$route.query.id
      let { toast, query, redirectUrl } = _
      _.isLoading = true
      settlementdetail(query)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.settlement-detail {
  font-size: 13px;

  li {
    display: flex;
    padding: 15px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    
    div:first-child {
      flex: 1;
    }
  }
  
}
</style>

