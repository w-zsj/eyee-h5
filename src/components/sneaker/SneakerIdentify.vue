<template>
    <div>
      <v-header v-if="!$root.ISAPP">
        <div class="nav-tab2">
          <h3>鉴定秘籍</h3>
        </div>
      </v-header>
      <div class="identify-list">
        
        <div :class="$root.ISAPP?'app-type-list':'type-list'">
          <div class="type-item" v-for="(item,index) in typeList" :class="{'active-type':index===typeItem}" @click="switchType(index)">
            <p>{{item}}</p>
          </div>
        </div>

        <v-list :load-handle='getIdentifyListLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
          <div class="identify-item" v-for="item in identifyList" >
            <img class="identify-img" :src="item.imgurl">
            <div class="identify-mask"  @click="getVedioUrl(item.vediourl)">
              <div class="identify-item-info">{{item.title}}</div>
              <img class="identify-img-player" src="../../../static/img/sneaker/identify_icon.png" alt="">
            </div>
          </div>
        </v-list>
      </div>
      <div class="video-mask" v-show="vedioMask"  @click="closeVedio()" @touchmove.prevent >
        <video :src="vedioUrl" ref="videoRes" autoplay width="100%" controls @click.stop="prevent()"></video>
      </div>
    </div>
</template>

<script>
import {getSneakerIdentify} from '../../common/api/sneaker';
export default {
  data(){
    return{
      typeList: ["全部", "人气", "球鞋", "服饰"],
      typeItem: 0,
      identifyList:[],
      appShare: {},
      vedioUrl:'',
      vedioMask:false,

      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
      },
      pagination: {
        sumcount: 0,
        pagesize: 20,
        pageindex: 1,
        pagetype: 0,
        hasLoad: true
      },
    }
  },
  created() {
    this.getIdentifyList();
  },
  methods: {
    getIdentifyListLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 20;
      this.identifyList = [];
      this.getIdentifyList();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;

        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getIdentifyList();
      }
    },
    prevent(){},
    getVedioUrl(url){
      this.$refs.videoRes.play();
      this.vedioUrl = url;
      this.vedioMask = true;
    },
    closeVedio(){
      console.log(this.$refs)
      this.$refs.videoRes.currentTime = 0;
      this.$refs.videoRes.pause();
      this.vedioMask = false;
    },
    getIdentifyList(){
      var _ = this;
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
        type: this.pagination.pagetype
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      getSneakerIdentify(postParams).then(res =>{
        if(res){
          // _.identifyList = res.list;
          if (res && res.total && res.list.length > 0) {
            this.identifyList.push(...res.list);
            this.css.hasData = true;
            if (
              res.page * res.size >= res.total &&
              this.identifyList.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.identifyList.length == 0) {
              this.css.hasData = false;
            }
          }
          this.css.isLoading = false;
          // app 分享信息
          this.appShare.sharecontent = res.share.content;
          this.appShare.sharetitle = res.share.title;
          this.appShare.sharepicurl = res.share.icon;
          this.appShare.shareurl = res.share.url;
          this.appShare.xcxurl = res.share.xcxurl || "";
          this.appShare.callbackname = "";
          
          _.initShare({
            info:{
              title:res.share.title,
              desc:res.share.content,
              img:res.share.icon,
              url:res.share.url
            }
          })
          if (this.$root.ISAPP) {
            this.javascriptBridge({
              name: "getAppActivityShareContent",
              params: this.appShare
            });
          }
        }
      }).catch(err => {
        _.toast('加载失败')
      })
    },
    init() {
      this.css = {
        isLoading: false,
        isEnd: false,
        hasData: true
      };
      this.pagination.pageindex = 1;
      this.identifyList = [];
      window.scrollTo(0, 0);
    },
    switchType(index) {
      if (index === this.typeItem) return;
      this.init();
      this.typeItem = index;
      this.pagination.pagetype = index;
      this.getIdentifyList();
    }
  }
};
</script>

<style lang="scss" scoped>
  .nav-top{
    border-bottom: 1px solid #f5f5f5;
  }
  .type-list {
    z-index: 20;
    position: fixed;
    top: 48px;
    left: 0;
    width: 100%;
    height: 11.6667vw;
    padding: 0 4vw;
    background: #ffffff;
  }
  .app-type-list {
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 11.6667vw;
  padding: 0 4vw;
  background: #ffffff;
}
  .type-item {
    float: left;
    background: rgba(245,245,245,1);
    border-radius: 4px;
    height: 24px;
    margin:  3.2vw;
    padding: 3px 12px;
    p {
      color: #282828;
      font-size: 13px;
    }
  }
  .active-type {
    float: left;
    background: rgba(51,51,51,1);
    border-radius: 4px;
    height: 24px;
    margin:  3.2vw;
    padding: 3px 12px;
    p {
      color: #ffffff;
      font-size: 13px;
    }
  }
  .identify-list{
    padding: 9.6667vw 2.6667vw;
    .identify-item{
      width: 94.6667vw;
      margin-top: 2.6667vw;
      box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1) ;
      border-radius:16px;
      padding: 2.6667vw;
      position: relative;
      .identify-img{
        width:89.3333vw;
        height: 53.3333vw;
        display: block;
        border-radius: 5px;
      }
      .identify-mask{
        position: absolute;
        top:2.6667vw;
        width:89.3333vw;
        height: 53.3333vw;
        border-radius: 5px;
        padding: 0 6.4vw;
        background-color: rgba(0,0,0,0.3);
        display:flex;justify-content:center;align-items:center;
        .identify-img-player{
          width: 10vw;
          position: absolute;
          bottom: 5.3333vw;
          left:5.3333vw;
        }
        .identify-item-info{
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #FFFFFF;
          font-size: 16px;
          line-height: 22px;
          // display:inline-block; 
        }
      }
    }

  }
  .video-mask{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    display:flex;justify-content:center;align-items:center;
    background-color: rgba(0,0,0,1);
  }
</style>
