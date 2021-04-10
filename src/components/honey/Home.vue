<template>
  	<div class="honey_home">
	    <v-header>
	      	<div class="nav-tab2">
	        	<h3>牛币商城</h3>
	      	</div>
	    </v-header>
	    <div class="honey_rules gaps">
	    	<div class="curr_honey">当前牛币<span>{{creditsInfo.currcredits}}</span></div>
	    	<ul class="clearfix" v-if="false">
	    		<li><em class="icon_honeyrule"></em>牛币规则</li>
	    		<li><em class="icon_honeydetl"></em>牛币明细</li>
	    	</ul>
	    </div>
	    <div class="honey_levels gaps">
	    	<p class="curr_level">当前等级：<img :src="localUserInfos.rankpic|https" alt=""><span>成长值：{{creditsInfo.credits}}</span></p>
	    	<p class="level_detl">
	    		<label v-for="(n,index) in 6" :key="n" :class="{currL:creditsInfo.level >=index}">
	    			<span><b>{{index}}</b></span>
	    			<em class="trangle_icon" v-if="creditsInfo.level ==index"></em>
	    			<em class="frame_words" v-if="creditsInfo.level ==index">距离下个等级还差<i>{{creditsInfo.upgradeneedbees}}</i>成长值</em>
	    		</label>
	    	</p>
	    </div>
	    <p class="title_honeys">商品兑换</p>
	    <div class="top_slidemenu"><!-- :class="{fix_top:isFix_top}" -->
	        <swiper :options="swiperArtMenu" class="swiper-container news_swiper">
	          	<swiper-slide v-for="(c,index) in honeyCates" :key='index' style="width:auto">
	            	<div class="free_label" @click="tabCate(c.id,index)" :class="{clicked:honeyCateId==c.id}">
	              		<span>{{c.name}}</span>
	            	</div>
	          	</swiper-slide>
	        </swiper>
	    </div>
	    <v-list :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' class="honey_lists">
	    	<div v-if="list&&list.length>0" class="li_honeylist" v-for="(prodShop,index) in list" :key='index+prodShop.id'>
	    		<ProductUnit :productItem='prodShop' class="shopRecoLists" :productType="11"></ProductUnit>
	    	</div>
        <div v-else class="wait-list-dbl"></div>
		</v-list>
  	</div>
</template>
<script>
import { GetCreditsInfo, GetExchangeProduct } from '../../common/api/integral'
import { CategoryInIntegral } from '../../common/api/base'
import ProductUnit from '../templates/ProductUnit'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      scrollWatch: true,
      // isFix_top: false,
      honeyCateId: '0',
      list: [],
      isEnd: false,
      isLoading: false,
      swiperArtMenu: {
        slidesPerView: 'auto',
        freeMode: true,
        // slideToClickedSlide: true,
        lazyLoading: true,
        spaceBetween: 0
      },
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
      // timeRun: {},
      creditsInfo: {}
    }
  },
  components: { ProductUnit },
  computed: {
    ...mapGetters({ honeyCates: 'honeyCates', localUserInfos: 'userInfo' })
    // localUserInfos() {
    //    			return JSON.parse(localStorage.getItem('currentUser'))
    //   		}
  },
  mounted() {
    console.log(this.localUserInfos)
    this.getCredits()
    if (this.honeyCates && this.honeyCates.length > 0) {
      this.reload()
    } else {
      this.getHoneyCates()
    }
    // 定时器，1.5S之后开始请求接口
    // this.timeRun = setTimeout(() => {
    // 	this.reload()
    // }, 1000)
    //   		window.addEventListener('scroll', () => {
    //   if (this.scrollWatch) {
    //     var scrollTop = 0
    //     if (document.documentElement && document.documentElement.scrollTop) {
    //       scrollTop = document.documentElement.scrollTop
    //     } else if (document.body) {
    //       scrollTop = document.body.scrollTop
    //     }
    //     var selectDiv = document.querySelector('.top_slidemenu').offsetTop
    //     // console.log(scrollTop+'&&&&&'+selectDiv)
    //     if (scrollTop >= selectDiv) {
    //       this.isFix_top = true
    //     } else {
    //                 	this.isFix_top = false
    //     }
    //   }
    // })
  },
  // destroyed() {
  //   this.scrollWatch = false
  //     		clearTimeout(this.timeRun)
  // },
  methods: {
    getHoneyCates() {
      CategoryInIntegral()
        .then(res => {
          console.log('牛币兑换分类', res)
          var allC = {
            id: '0',
            name: '全部'
          }
          res.splice(0, 0, allC)
          this.$store.dispatch('setHoneyCates', res)
          this.reload()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCredits() {
      GetCreditsInfo()
        .then(res => {
          console.log('积分/牛币信息', res)
          this.creditsInfo = res
          this.creditsInfo.level = res.level.replace('v', '')
          console.log(this.creditsInfo)
        })
        .catch(e => {
          console.log(e)
        })
    },
    reload($el) {
      this.hasdata = 0
      this.list = []
      this.pagedata.pageindex = 1
      this.isEnd = false
      this.req()
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pagedata.pageindex += 1
        this.req()
      }
    },
    req() {
      this.isLoading = true
      let page = this.pagedata
      var paramObj = {
        categoryid: this.honeyCateId == 0 ? '' : this.honeyCateId,
        pageindex: page.pageindex
      }
      GetExchangeProduct(paramObj)
        .then(res => {
          if (res) {
            console.log('GetExchangeProduct', res)
            if (res.list && res.list.length > 0) {
              this.hasdata = 1
              if (res.pageindex == 1) {
                this.list = res.list
              } else this.list.push(...res.list)
            }
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) this.isEnd = true
          } else this.toast('加载失败')
          this.isLoading = false
        })
        .catch(e => {
          this.hasdata = 2
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : 'error:' + e)
        })
    },
    tabCate(id, index) {
      if (id === this.honeyCateId) return
      this.honeyCateId = id
      this.reload()
    }
  }
}
</script>
<style scoped>
.honey_home {
  color: #666;
  font-size: 14px;
}
.title_honeys {
  position: relative;
  font-size: 15px;
  color: #666;
  padding: 10px 0 8px 18px;
  line-height: 25px;
  border-bottom: 1px solid #f2f2f2;
}
.title_honeys:after {
  content: '';
  display: inline-block;
  position: absolute;
  left: 10px;
  top: 15px;
  width: 2px;
  height: 15px;
  background: #666;
}
.honey_rules .curr_honey {
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
}
.honey_rules .curr_honey > span {
  color: #000;
  font-size: 18px;
  display: inline-block;
  margin-left: 15px;
}
.honey_rules ul {
  padding: 5px 0;
}
.honey_rules ul li {
  float: left;
  width: 50%;
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 5px 0;
}
.honey_rules ul li:first-child {
  border-right: 0.5px solid #f2f2f2;
}
.honey_rules ul li > em {
  display: inline-block;
  margin-right: 4px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.honey_rules ul li > em.icon_honeyrule {
  background-image: url(//files.eyee.com/mcdn/static/img/honey_rule.png);
}
.honey_rules ul li > em.icon_honeydetl {
  background-image: url(/static/img/honey_black.png);
}
.honey_levels .curr_level {
  padding: 5px 0 5px 15px;
  border-bottom: 1px solid #f2f2f2;
}
.honey_levels .curr_level img {
  height: 20px;
  vertical-align: middle;
}
.honey_levels .curr_level span {
  display: inline-block;
  float: right;
  margin-right: 15px;
}
.top_slidemenu {
  background-color: #fff;
  height: 36px;
  width: 100%;
  z-index: 3;
  position: sticky;
  top: 48px;
}
/* .top_slidemenu.fix_top{
  	} */
.free_label {
  display: inline-block;
  color: #333;
  font-size: 14px;
  padding: 0 10px;
}
.free_label > span {
  display: inline-block;
  padding: 0;
  height: 36px;
  line-height: 36px;
  color: #999;
}
.free_label.clicked > span {
  color: #333;
}
.honey_lists {
  padding: 0 5px;
}
.honey_lists .li_honeylist {
  float: left;
  width: 50%;
  padding: 0 5px;
}
.level_detl {
  padding: 10px 0 65px;
  text-align: center;
}
.level_detl label {
  position: relative;
}
.level_detl label span {
  position: relative;
  display: inline-block;
  margin-right: 20px;
  color: #fff;
  width: 24px;
  height: 24px;
  border: 2px solid #e3e3e3;
  border-radius: 50%;
  background: #999;
  text-align: center;
  line-height: 20px;
}
/*.level_detl label span:after {
  content: '';
  display: inline-block;
  position: absolute;
  width: 20px;
  height: 2px;
  background: #e3e3e3;
  right: -22px;
  top: 8px;
}*/

.level_detl label.currL span {
  background: #ffc700;
  border-color: #f7dc7e;
}
.level_detl label span:after {
  content: '';
  display: inline-block;
  position: absolute;
  width: 48px;
  height: 2px;
  background: #e3e3e3;
  top: 8px;
  left: 50%;
  margin-left: -22px;
}
.level_detl label.currL span:after {
  background: #ffc700;
}
.level_detl label.currL:after {
  content: '';
  display: inline-block;
  position: absolute;
  width: 10px;
  height: 2px;
  background: transparent;
  top: -1px;
  left: 50%;
  margin-left: -32px;
}
.level_detl label:last-child span:after {
  width: 10px;
}
.level_detl label.currL:first-child:after {
  background: #fff;
}
.level_detl label.currL:last-child:after {
  background: #fff;
  margin-left: 2px;
}
.level_detl label span > b {
  position: absolute;
  width: 20px;
  z-index: 1;
  left: 50%;
  margin-left: -10px;
  height: 20px;
  border-radius: 50%;
  background: #999;
}
.level_detl label.currL span > b {
  background: #ffc700;
}
.level_detl label > em.trangle_icon {
  display: inline-block;
  position: absolute;
  right: 5px;
  bottom: -10px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #f3f3f3;
  z-index: 3;
}
.level_detl label > em.frame_words {
  display: inline-block;
  position: absolute;
  width: 90px;
  padding: 5px;
  z-index: 2;
  bottom: -60px;
  text-align: left;
  font-size: 11px;
  line-height: 15px;
  left: 0;
  background: #f3f3f3;
}
.level_detl label > em.frame_words i {
  color: #ffc700;
}
</style>
