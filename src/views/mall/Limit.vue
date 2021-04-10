<template>
  <div class="main" >
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
          <h3>限量发售</h3>
      </div>
    </v-header>
    <div class="tablist flex flex-around">
      <div class="tabitem flex-col flex-center"  v-for="item in tablist" :key="item.value" @click="switchTab(item.value)">
        <div class="tabtitle" :class="{'selected':item.value == selecttab}">{{item.title}}</div>
        <div :class="{'selectedline':item.value == selecttab}"></div>
      </div>
    </div>

    <div class="nodata flex-col flex-center" v-if="sumcount==0">
      <img mode='widthFix' src="/static/imgs/mall/limitnodata.png" alt="">
      <p class="nodatatext">暂无更多限量专场~</p>
      <p class="goshop" @click='goshop'>去逛逛</p>
    </div>
    <v-list v-else-if="sumcount > 0" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' style="padding-top:10px;overflow:hidden;">
      <template v-if="list&&list.length>0">
        <limit-unit v-for="(item,idx) in list" :key="item.id" :flag="idx==list.length-1?1:2" :limitInfo="item" @reload="reload" style="padding-bottom:10px;"></limit-unit>
      </template>
    </v-list>
    <v-error v-else></v-error>

  </div>
</template>
<script>
import LimitUnit from '../../comps/LimitUnit'
import { LimitList } from '../../utils/api/mall'
import { mapGetters } from 'vuex'
export default {
  name: "MallLimit",
  components: { LimitUnit},
  data() {
    return {
      pbgc: '',
      isEnd: false,
      isLoading: false,
      pagedata: { pagesize: 20, pageindex: 1 },

      tablist: [
        {title:'发售中',value:1},
        {title:'预告中',value:2},
        {title:'已结束',value:3}
      ],
      selecttab:1,
      list:[],
      sumcount: 0
    }
  },
  mounted() {


    this.initShare({ type: 1 })
    // this.pbgc = document.body.style.backgroundColor
    // document.body.style.backgroundColor = '#eee'
    // var index = this.limitSaleList.length
    // if (this.limitSaleList && this.limitSaleList.length > 0) {
    //   for (var i = 0; i < this.limitSaleList.length; i++) {
    //     if (this.limitSaleList[i].salestatus == 2) {
    //       var index = i
    //       break
    //     }
    //   }
    //   this.hasdata = 1
    //   this.toplist = this.limitSaleList.slice(0, index)
    //   if (index != this.limitSaleList.length) {
    //     this.midlist = this.limitSaleList.slice(index)
    //   }
    // } else this.load()
    // let endlist = this.limitSaleEndList
    // if (endlist && endlist.length > 0) {
    //   this.endlist = endlist
    //   this.pagedata.pagesize = endlist.length
    // } else this.req()

    this.req()
  },
  computed: {
    ...mapGetters(['limitSaleList', 'limitSaleEndList'])
  },
  methods: {
    req() {
      let _ = this
      _.isLoading = true
      let page = _.pagedata
      let tabtype = _.selecttab
      LimitList(page.pageindex, page.pagesize,tabtype).then(res => {
        console.log('LimitList result', res)
        _.sumcount = res.sumcount
        if (res.list && res.list.length > 0) {
          // _.pagedata.pagesize = res.list.length
          if (res.pageindex == 1) this.list = res.list
          else _.list.push(...res.list)
        } else _.isEnd = true
        this.isLoading = false
      }).catch(e => { this.isLoading = false; this.toast(e && e.msg ? e.msg : ('error:' + e)) })
    },

    // load() {
    //   LimitSales().then(res => {
    //     console.log('LimitSaleList result', res)
    //     var index = res.length
    //     for (var i = 0; i < res.length; i++) {
    //       if (res[i].salestatus == 2) {
    //         var index = i
    //         break
    //       }
    //     }
    //     this.toplist = res.slice(0, index)
    //     this.midlist = res.slice(index)
    //     this.$store.dispatch('setLimitSaleList', res)
    //     this.hasdata = 1
    //   }).catch(e => { this.hasdata = 2; this.toast('请求异常') })
    // },

    goshop() {
      let _ = this
      _.$router.push('/home')
    },
    switchTab(value) {
      let _ = this
      if(_.selecttab == value) return
      _.selecttab = value

      window.scrollTo(0,0)

      // console.log("search   tab     value----------->",_.selecttab)
      _.sumcount = 0
      _.list = []
      // _.load()
      _.isEnd = false
      _.pagedata.pageindex = 1
      _.req()
    },
    reload($el) {
      this.sumcount = 0
      this.list = []
      // this.load()
      this.pagedata.pageindex = 1
      this.req()
    },
    loadmore($el) {
      if (this.isEnd === true) { this.toast('已无更多') } else {
        this.pagedata.pageindex += 1
        this.req()
      }
    },

  }
}
</script>

<style scoped>
.main {
  width:100%;
  background: #eee;
  padding-bottom: 48px;
}
.mint-loadmore{
  background: none;
}
.tablist {
  width:100%;
  position: sticky;
  top:48px;
  left:0;
  z-index: 2;
  background-color: #fff;
}
.tablist .tabitem {
  font-size:14px;
  line-height: 20px;
  padding:12px 0;
  color:#999999;
  padding: 5px;
}
.tablist .tabitem .tabtitle{
  padding: 5px;
}
.tablist .tabitem .selected{
  color:#333333;;
}
.tablist .tabitem .selectedline {
  background-color: #8050FF;
  width:40%;
  height: 2px;
  border-radius:2px;
}
.nodata {
  width:100%;
  padding-bottom:100%;
  overflow: hidden;
}
.nodata img {
  width:60%;
  margin-top:25%;
}
.nodata p.nodatatext {
  font-size:12px;
  line-height: 17px;
  color:#333;
  margin:15px 0 23px 0;
}
.nodata p.goshop {
  font-size:16px;
  line-height: 22px;
  color:#FFFFFF;
  padding:9px 40px;
  background-color:#8050FF;
  border-radius:3px;
}
</style>
