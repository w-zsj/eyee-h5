<template>
  <div class="puzzle">
    <v-header>
        <div class="nav-tab2">
            <h3>拼团</h3>
        </div>
        <v-cart :isshow="true" :isdark="true"></v-cart>
    </v-header>
    <div v-if='css.hasData'>
      <v-list :load-handle='getGroupListDataLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
          <div class="banner">
              <img src="//files.eyee.com/mcdn/static/img/groupbuy-banner.png" alt="">
          </div>
          <div class="group_product_list">
              <ProductUnit v-for="(groupItem, index) in groupBuyList" :key='index' v-if="groupBuyList.length>0"   :productItem='groupItem' :productType="13"></ProductUnit>
          </div>
      </v-list>
    </div>
    <div class="no_product" v-if='!css.hasData'>
      <span>暂无拼团活动~~~</span>
    </div>
  </div>
</template>
<script>
import ProductUnit from '../templates/ProductUnit'
import { GetGroupProductList } from '../../common/api/group'
export default {
  components: { ProductUnit },
  data() {
    return {
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true
      },
      groupBuyList: [],
      pagination: {
        sumcount: 0,
        pagesize: 5,
        pageindex: 1,
        hasLoad: true
      }
    }
  },
  mounted() {
    this.getGroupListData()
  },
  methods: {
    getGroupListDataLoad() {
      this.groupBuyList = []
      this.pagination.pageindex = 1
      this.css.isEnd = false
      this.getGroupListData()
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pagination.pageindex += 1
        if (this.pagination.pageindex > 1) {
          this.pagination.hasLoad = false
        }
        this.getGroupListData()
      }
    },
    getGroupListData() {
      if (this.css.isLoading) return
      this.css.isLoading = true
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      }
      if (postParams.pageindex === 1) {
        this.css.isEnd = false
        window.scrollTo(0, 0)
      }
      console.log('获取团购列表参数: ', postParams,this.pagination.hasLoad)
      GetGroupProductList(postParams,this.pagination.hasLoad)
        .then(res => {
          if (res && res.total && res.list.length > 0) {
            for (let i = 0; i < res.list.length; i++) {
              const source = res.list[i]
              let target = {}
              target.brandname = source.brand
              target.businessname = source.businessname
              target.businesstype = source.businesstype
              target.id = source.pid
              target.teamid = source.id
              target.mainpic = source.imageurl
              target.name = source.title
              target.users = source.users
              target.specialprice = source.teamprice
              target.saleprice = source.marketprice
              target.teamlimitcount = source.teamlimitcount
              target.teamtotalcount = source.teamtotalcount

              this.groupBuyList.push(target)
            }

            this.css.hasData = true

            if (res.page * res.size >= res.total) this.css.isEnd = true
          } else {
            this.css.isEnd = true
            this.css.hasData = false
          }
          this.css.isLoading = false
        })
        .catch(e => {
          console.error(e)
          this.css.hasData = false
          this.css.isLoading = false
          // this.toast(e && e.msg ? e.msg : ('error:' + e))
        })
    }
  }
}
</script>
<style scoped>
.banner {
  width: 100%;
  height: 220px;
  overflow: hidden;
  margin-bottom: 15px;
}
.banner img {
  width: 100%;
  height: 100%;
}
.no_product {
  position: relative;
}
.no_product span {
  position: absolute;
  bottom: -30px;
  left: 10px;
}
.group_product_list {
  padding: 0 5px;
  overflow: hidden;
}
</style>



