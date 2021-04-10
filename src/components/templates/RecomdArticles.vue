<template>
  <div>
    <template v-if="listType!=1">
      <div class="recomd_articles">
        <ul class="clearfix">
          <mt-loadmore :top-method="reload" ref="loadmore">
            <li v-for="(item,index) in artlist" :key='index' @click="gotoArticleDetl(item)">
              <img v-lazy="https(item.coverurl)" alt="">
              <p class="title_relats">{{item.title}}</p>
              <div class="from_read clearfix">
                <span>{{item.categoryname}}</span>
                <span><em class="ico-read-nums"></em>{{item.readcount}} </span>
              </div>
            </li>
          </mt-loadmore>
        </ul>
      </div>
    </template>
    <template v-if="listType==1">
      <ArticleUnit v-for="item in artlist" :key="item.id" :unit="item" :listType="listType"></ArticleUnit>
    </template>
  </div>
</template>
<script>
import ArticleUnit from './ArticleUnit'
export default {
  name: 'RecomdArticles',
  props: {
    artlist: Array,
    listType: { type: Number, default: 0 },
    load: Function
  },
  components: { ArticleUnit },
  methods: {
    gotoArticleDetl: function (item) {
      this.$router.push('/news/detail/' + item.id)
    },
    reload() {
      this.load()
      this.$refs.loadmore.onTopLoaded()
    }
  }
}
</script>
<style scoped>
.recomd_articles {
  padding: 0 5px;
}

.recomd_articles ul li {
  float: left;
  width: 50%;
  padding: 0 5px;
  margin-bottom: 10px;
}

.recomd_articles img {
  display: block;
  width: 100%;
}

.recomd_articles .title_relats {
  font-size: 0.75rem;
  color: #333;
  line-height: 17px;
  height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 5px 0;
}

.recomd_articles .from_read > span {
  float: left;
  width: 50%;
  font-size: 0.75rem;
  height: 15px;
  line-height: 15px;
  color: #999;
}

.recomd_articles .from_read > span:last-child {
  text-align: right;
}
</style>
