<template>
  <div v-if="hasdata==0">
  </div>
  <v-list v-else-if="hasdata==1" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' style="padding-top:10px;overflow:hidden;">
    <template v-if="toplist&&toplist.length>0">
      <limit-unit v-for="(item,idx) in toplist" :key="item.id" :flag="idx==toplist.length-1?1:2" :limitInfo="item" @reload="reload" style="padding-bottom:10px;"></limit-unit>
    </template>
    <template v-if="midlist&&midlist.length>0">
      <limit-unit v-for="(item,idx) in midlist" :key="item.id" :flag="idx==midlist.length-1?1:2" :limitInfo="item" style="padding-bottom:20px;"></limit-unit>
    </template>
    <template v-if="endlist&&endlist.length>0">
      <limit-unit v-for="(item,idx) in endlist" :key="item.id" :flag="idx==endlist.length-1?1:2" :limitInfo="item" style="padding-bottom:20px;"></limit-unit>
    </template>
  </v-list>
  <v-error v-else></v-error>
</template>
<script>
import LimitUnit from '../templates/LimitUnit'
import { LimitSales, LimitSaleEndedPage } from '../../common/api/marketing'
import { mapGetters } from 'vuex'
export default {
  components: { LimitUnit },
  data() {
    return {
      pbgc: '',
      hasdata: 0,
      toplist: [],
      midlist: [],
      endlist: [],
      isEnd: false,
      isLoading: false,
      pagedata: { pagesize: 0, pageindex: 1 }
    }
  },
  mounted() {


    this.initShare({ type: 1 })
    this.pbgc = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#eee'
    var index = this.limitSaleList.length
    if (this.limitSaleList && this.limitSaleList.length > 0) {
      for (var i = 0; i < this.limitSaleList.length; i++) {
        if (this.limitSaleList[i].salestatus == 2) {
          var index = i
          break
        }
      }
      this.hasdata = 1
      this.toplist = this.limitSaleList.slice(0, index)
      if (index != this.limitSaleList.length) {
        this.midlist = this.limitSaleList.slice(index)
      }
    } else this.load()
    let endlist = this.limitSaleEndList
    if (endlist && endlist.length > 0) {
      this.endlist = endlist
      this.pagedata.pagesize = endlist.length
    } else this.req()
  },
  beforeDestroy() {
    document.body.style.backgroundColor = this.pbgc
  },
  computed: {
    ...mapGetters(['limitSaleList', 'limitSaleEndList'])
  },
  methods: {
    reload($el) {
      this.hasdata = 0
      this.toplist = []
      this.load()
      this.endlist = []
      this.pagedata.pageindex = 1
      this.req()
    },
    loadmore($el) {
      if (this.isEnd === true) { this.toast('已无更多') } else {
        this.pagedata.pageindex += 1
        this.req()
      }
    },
    req() {
      this.isLoading = true
      let page = this.pagedata
      LimitSaleEndedPage({ pageindex: page.pageindex }).then(res => {
        console.log('LimitSaleEndList result', res)
        if (res.list && res.list.length > 0) {
          this.pagedata.pagesize = res.list.length
          if (res.pageindex == 1) this.endlist = res.list
          else this.endlist.push(...res.list)
        } else this.isEnd = true
        this.isLoading = false
      }).catch(e => { this.isLoading = false; this.toast(e && e.msg ? e.msg : ('error:' + e)) })
    },
    load() {
      LimitSales().then(res => {
        console.log('LimitSaleList result', res)
        var index = res.length
        for (var i = 0; i < res.length; i++) {
          if (res[i].salestatus == 2) {
            var index = i
            break
          }
        }
        this.toplist = res.slice(0, index)
        this.midlist = res.slice(index)
        this.$store.dispatch('setLimitSaleList', res)
        this.hasdata = 1
      }).catch(e => { this.hasdata = 2; this.toast('请求异常') })
    }

  }
}
</script>
