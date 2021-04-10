<template>
  <div>
    <div class="sec-title flex-left">
      <p class="ico-btline">热门资讯<br>
        <span>HOT NEWS</span>
      </p>
      <router-link class="sec-subtitle" to="/news">资讯频道</router-link>
    </div>

    <div class="art-ani" v-if="realList&&realList.length>0">
      <swiper :options="hnOption">
        <div v-for="(item,idx) in realList" :key="item.id" class="swiper-slide" :class="{curr:idx==curridx,next:idx==curridx+1}" @click="goNews(item,idx)">
          <ArticleUnit :unit="item" :type="1"></ArticleUnit>
        </div>
      </swiper>
    </div>
  </div>
</template>
<script>
import ArticleUnit from './ArticleUnit'
import { ArticleSearch } from '../../common/api/article'
export default {
  name: 'hot-news',
  components: { ArticleUnit },
  data() {
    return {
      list: [],
      curridx: 0,
      pagedata: { pageindex: 1 },
      hnOption: {
        observer: true,
        direction: 'vertical',
        effect: 'flip',
        slidesPerView: 1,
        resistanceRatio: 0,
        initialSlide: 0,
        onSlideChangeEnd: swiper => {
          this.toggle(swiper)
        },
        onReachEnd: swiper => {
          this.slideEnd(swiper)
        }
      }
    }
  },
  beforeMount() {
    this.req()
  },
  computed: {
    realList() {
      let list = this.list
      // console.log(list);
      // this.list.splice(0, 1);
      return list // .reverse();
    }
  },
  methods: {
    req() {
      let page = this.pagedata
      ArticleSearch(page)
        .then(res => {
          // console.log('Home Article NewSearch result', res.article)
          if (res && res.article) {
            res = res.article
            if (res.list && res.list.length > 0) {
              if (res.pageindex == 1) this.list = res.list
              else this.list.push(...res.list)
            }
            page.isrecommendover = res.isrecommendover
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) {
              page.isrecommendover = 0
              page.pageindex = 1
            }
          } else {
            page.isrecommendover = 0
            page.pageindex = 1
          }
        })
        .catch(e => {
          console.log('热门资讯获取失败,' + e.msg)
        })
    },
    toggle(swiper) {
      swiper.removeSlide(0)
      this.list.splice(0, 1)
      // swiper.update();
      // console.log('this.list.length', this.list.length);
    },
    slideEnd(swiper) {
      // console.log('---slideEnd');
      this.pagedata.pageindex++
      this.req()
    },
    goNews(item, idx) {
    }
  }
}
</script>
<style scoped>
.art-ani {
  height: 130px;
  padding: 8px;
  position: relative;
  overflow: hidden;
  margin: 0 5px;
}

.swiper-container {
  height: 120px;
}

.swiper-slide {
  height: 120px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 rgba(212, 212, 212, 0.5);
}
</style>
