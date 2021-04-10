<template>
  <div class="bill-list">
    <v-header>
      <div class="nav-tab2">
        <h3>账单列表</h3>
      </div>
    </v-header>
    <v-list
      :load-handle="()=>{}"
      :more-handle="loadmore"
      :more-handling="isLoading"
      :isend="isEnd"
      v-if="list.length>0"
    >
      <ul v-if="list.length>0">
        <router-link v-for="(item, index) in list" :key="index" tag="li" :to="'/oa/settlementdetail?title='+item.billname+'&id='+item.billid">
          <p>
            <span>{{item.billname.replace(/-/g, "")}}&nbsp;结算单</span>
            <span>¥{{item.amount}}</span>
          </p>
          <p>
            <span>结算时间：{{item.settlementtime}}</span>
          </p>
        </router-link>
      </ul>
    </v-list>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>暂无账单~</p>
    </div>
    <oa-footer></oa-footer>
  </div>
</template>
<script>
import OaFooter from '@/comps/oa/Footer'
import { billlist } from '@/common/api/oa'
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
  components: {
    OaFooter,
  },
  beforeMount() {
    let _ = this
    let { load } = _
    load()
  },
  methods: {
    load() {
      let _ = this
      let { toast, redirectUrl, query } = _
      _.isLoading = true
      billlist(query)
        .then(res => {
          res.list &&  _.list.push(...res.list)
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
  }
}
</script>
<style lang="scss" scoped>
.bill-list {
  padding-bottom: 60px;
  font-size: 13px;

  li {
    border-bottom: 1px solid #eee;
    line-height: 30px;
    padding: 10px;

    p {
      display: flex;
      justify-content: space-between;
    }
    p:last-child{
      justify-content: flex-end;
    }
  }
}
</style>

