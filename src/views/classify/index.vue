<template>
  <div class="classify">
    <!-- 顶部 -->
    <div class="header"
         v-if="!$root.ISAPP && !$root.ISMP"
         ref="header">
      <div class="search flex-aic-btwn">
        <img src="https://files.eyee.com/c2cxcx/img/global-arrow.png"
             class="arrow"
             @click.stop="$router.go(-1)" />
        <router-link to="/nesearch"
                     class="flex-aic"
                     style="display: block; width: 100%">
          <div class="sch flex-aic">
            <img src="https://files.eyee.com/c2cxcx/img/icon_search.png"
                 alt />
            <span>{{ hotword }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="cont flex flex-aic-btwn"
         :style="{ height: contHeight + 'px' }">
      <div class="tabs">
        <div class="item flex-center"
             :class="{ act: curTabs == tabs }"
             v-for="(item, tabs) in tabs"
             :key="tabs"
             @click.stop="changeTabs(item.channelid, tabs)">
          {{ item.name }}
        </div>
      </div>
      <div class="banner">
        <div class=""
             v-for="(item, idx) in contList"
             :key="idx">
          <div class="tit flex-center">
            <img src="https://files.eyee.com/c2cxcx/img/mask-group.png" />
            {{ item.name }}
            <img src="https://files.eyee.com/c2cxcx/img/mask-group.png" />
          </div>
          <div class="flex-aic flex-wrap module">
            <div class="pic flex-col flex-center"
                 v-for="(subItem, sub) in item.list"
                 :key="sub"
                 @click.stop="goSearch(subItem.type, subItem.content)">
              <div class="logo">
                <img :src="subItem.image"
                     alt="" />
              </div>
              <p class="name">{{ subItem.itemname }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Gettoplist } from '@/utils/api/search.js'
import { classifyTabsList, classifyItemList } from '@/utils/api/sneaker.js'
export default {
  data() {
    return {
      hotword: '搜索',
      contHeight: 0,
      tabs: [],
      curTabs: 0,
      channelid: '',

      contList: []
    }
  },
  beforeRouteEnter(to, from, next) {
    document.body.classList.add('bg')
    next()
  },
  beforeDestroy() {
    document.body.classList.remove('bg')
  },
  mounted() {
    let _ = this,
      headerTop = _.$refs.header ? _.$refs.header.offsetHeight : 0,
      clientHeight = document.documentElement.clientHeight
    _.contHeight = clientHeight - headerTop
    console.log('headerTop--', _.contHeight)

    if (_.$root.loging) {
      _.$root.loging.then(($) => {}).catch((e) => {})
    }
    _.gethotword()
    _.getList()

    if (this.$root.ISAPP) {
      _.setToolBar({
        title: '分类',
        bgcolor: '#f5f5f5',
        textcolor: '#323232'
      })
    }

    // 开启滚动监听
    window.addEventListener('scroll', this.hscroll)
  },
  methods: {
    async gethotword() {
      let word = await Gettoplist()
      if (word && word.length) this.hotword = word[0]['keyword']
    },
    changeTabs(id, idx) {
      let _ = this
      if (_.curTabs == idx) return
      _.curTabs = idx
      _.getSub(id)
    },
    getList() {
      let _ = this
      classifyTabsList()
        .then((res) => {
          if (res && res.length) {
            _.tabs = res
            _.channelid = res[0].channelid
            _.getSub(_.channelid)
          }
        })
        .catch((e) => console.error(e))
    },
    getSub(id) {
      let _ = this
      classifyItemList(id)
        .then((res) => {
          if (res && res.length) {
            _.contList = res
          }
        })
        .catch((e) => console.error(e))
    },
    goSearch(type, content) {
      let _ = this
      let para = 'brandid'
      // "type": "", #int 1.品牌 2.分类 3.系列
      // "content": ""#String 配置id(品牌或者分类或者系列id)
      switch (type) {
        case 1:
          para = 'brandid'
          break
        case 2:
          para = 'categoryid'
          break
        case 3:
          para = 'seriesid'
          break
      }
      if (this.$root.ISAPP) {
        // 跳转app搜索
        _.javascriptBridge({
          name: 'callAppCategorySearchResultPage',
          params: {
            type,
            id: content
          }
        })
      } else {
        _.$router.push({
          path: '/results/ ',
          query: {
            [para]: content
          }
        })
      }
    }
  }
}
</script>
<style>
body.bg {
  background: #f5f5f5;
  padding-bottom: 0 !important;
  overflow: hidden;
}
</style>
<style scoped lang='scss'>
.classify {
  background: #f5f5f5;
  min-height: 100vh;
  .header {
    overflow: hidden;
    .search {
      margin: 4px 4vw;
      margin-left: 0;
      font-size: 3.733vw;
      color: #969696;
      img {
        width: 5.33vw;
        height: 5.33vw;
        margin: 0 2.133vw 0 3.2vw;
        &.arrow {
          width: 8vw;
          height: 8vw;
          margin: 0 2.66vw;
        }
      }
      .sch {
        background: #fff;
        border-radius: 4.8vw;
        flex: 1;
        height: 9.6vw;
      }
    }
  }

  .cont {
    .tabs {
      width: 24vw;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .item {
        color: #969696;
        font-size: 4vw;
        font-weight: bold;
        padding: 4vw 0;
        margin-bottom: 2.66vw;
        &.act {
          color: #000;
        }
      }
    }
    .banner {
      flex: 1;
      height: 100%;
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      .tit {
        color: #232323;
        font-size: 4vw;
        font-weight: bold;
        margin: 4vw auto 1.066vw;
        img {
          width: 5.333vw;
          height: 5.333vw;
          margin: 0 2.133vw;
        }
      }
      .module {
        padding: 4.266vw 2.66vw 3.2vw;
      }
      .pic {
        width: 21.333vw;
        margin-right: 3.2vw;
        margin-bottom: 3.2vw;
        color: #000;
        font-size: 3.466vw;
        font-weight: bold;
        &:nth-child(3n + 3) {
          margin-right: 0;
        }
        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 14.4vw;
          height: 14.4vw;
        }
      }
      .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>