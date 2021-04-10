<template>
    <div v-if="hasdata==0"></div>
    <div v-else-if="hasdata==1">
        <v-header  :hasgap="true" class="flex nav-top  sneak_h nav-top-light">
            <div class="nav-tab">
                <div class="flex-center">
                    <div @click="goSex(0)" :class="{'nav-tab-act':ManFemale ==0}" tag="div">男鞋</div>
                    <div @click="goSex(1)" :class="{'nav-tab-act':ManFemale == 1}" tag="div">女鞋</div>
                </div>
            </div>
            <router-link tag="div" class="seackBtn" :to="searchUrl">
                <img :src="sImg" alt="">
            </router-link>
        </v-header>
        <div class="sneak_slidemenu">
            <v-list :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
                <ul class="hots_list clearfix">
                    <li v-for="(item,index) in list" :key="index">
                        <ShoeUnit :sneakerCaty="$route.params.category" :hotIndex="index" :SneakType="1"  :sneakItem="item"></ShoeUnit>
                    </li>
                </ul>
            </v-list>
        </div>
    </div>
</template>
<script>
    import { ENUM, APP } from '../../common/util'
    import { ShoeHotSale } from '../../common/api/sneaker'
    import ShoeUnit from '../templates/ShoeUnit'
    export default{
      components: { ShoeUnit },
      data() {
        return {
          sImg: '//files.eyee.com/mcdn/static/img/search_h.png', // require('../../assets/img/search_h.png'),
          list: [],
          isEnd: false,
          isLoading: false,
          pagedata: { sumcount: 0, pagesize: 0, pageindex: 1, categoryname: '', brandid: '' },
          hasdata: 1
        }
      },
      mounted() {
        this.reload()
  },
      methods: {
        reload() {
          this.list = []
          this.pagedata.pageindex = 1
          this.isEnd = false
          this.req()
        },
        loadmore($el) {
          if (this.isEnd === true) {
            this.toast('已无更多')
          } else {
            this.pagedata.pageindex++
            this.req()
          }
        },
        goSex(n) {
          console.log(n)
          if (n == 0) {
            this.categoryname = '男鞋'
          } else {
            this.categoryname = '女鞋'
          }
          this.$router.replace('/sneakerHotSale/' + n)
          this.reload()
        },
        req() {
          this.isLoading = true
          let page = this.pagedata
          page.categoryname = this.CateName
          ShoeHotSale(page).then(res => {
            console.log('SneakerSearch res', res)
            this.initShare({ type: res.share.type, info: { title: res.share.title, img: res.share.icon, desc: res.share.content }})
            if (res && res.list && res.list.length > 0) {
              if (res.pageindex == 1) {
                this.list = res.list
              } else this.list.push(...res.list)
              if (res.pageindex > 0) {
                page.pageindex = res.pageindex
              }
              if (res.sumcount > -1) {
                page.sumcount = res.sumcount
              }
              if (res.pagesize > -1) {
                page.pagesize = res.pagesize
              }
              if (page.pageindex * page.pagesize >= page.sumcount) {
                this.isEnd = true
              }
            } else {
              this.toast('加载失败')
            }
            this.isLoading = false
          }).catch(e => {
            this.isLoading = false
            this.toast(e && e.msg ? e.msg : ('error:' + e))
          })
    }
      },
      computed: {
        CateName() {
          return this.$route.params.category == 0 ? '男鞋' : '女鞋'
        },
        ManFemale() {
          return this.$route.params.category
        },
        searchUrl() {
          return ('/search/' + ENUM.SearchType.oldsneaker.val)
        }
      }
    }
</script>
<style scoped>
    .nav-tab {
        width: 60%;
        text-align: center;
        font-size: 14px;
        display: flex;
    }

    .nav-tab>div {
        width: 80%;
        margin: auto;
        color: #fff;
        border: 1px solid #fff;
        overflow: hidden;
        border-radius: 5px;
    }

    .nav-tab>div div {
        width: 50%;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        transition: all .2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    }

    .nav-tab-act {
        color: #333;
        background-color: #fff;
    }

    .nav-top-light .nav-tab>div {
        color: #333;
        border: 1px solid #333;
    }

    .nav-top-light .nav-tab-act {
        color: #fff;
        font-weight: 600;
        background-color: #333;
    }
    .hots_list{
        padding: 0 4px;
    }
    .clearfix {
        overflow: hidden;
    }
    .hots_list li{
        float: left;
        width: 100%;
        padding: 0 4px;
    }
    .sneak_slidemenu {
        position: relative;
        margin-top: 20px;
    }
    .seackBtn {
        /* position: absolute; */
        right: 0;
        text-align: center;
        width: 60px;
        line-height: 48px;
    }

    .seackBtn img {
        vertical-align: middle;
        width: 20px;
    }
    .sneak_h{
        justify-content: space-between;
    }
</style>
