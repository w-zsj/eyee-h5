<template>
    <div v-if="unit&&unit.id">
        <div v-if="listType==0" @click="gotoArtiDetl(info.id,info.type)" class="ul_artilces" :class="[(info.channeltype == 1 && info.type == 0)? 'normalArticle flex-tops' : 'unbaseArticle',type==1?'card':'',type==1&&info.type==0?'newsCard flex-aic':'']">
            <div v-if="type==1" class="picshow1" :class="{hotNews:type==1,hot_new:type==1&&info.type==0}" :style="info.type==0&&info.channeltype==1&&type!=1?'padding:10px':''">
                <!--图片-->
                <!--<img v-lazy="https(info.coverurl)" alt="">-->
                <div :style="[info.style]" class="hot_content" :class="{hot_contentB:info.type==0}">
                    <!-- <div v-if="info.channeltype !=1 ||info.type !=0" class="video-bg"></div> -->
                    <!-- <span v-if="info.type == 2" class="video-playico"></span>  -->
                    <!-- <span v-if="info.channeltype == 2&&type==0&&!parentid" class="theme_channel">专题频道</span>
                    <span v-if="info.channeltype == 3&&type==0&&!parentid" class="honeyee_channel">HONEYEE</span> -->
                </div>
            </div>
            <div v-if="type!=1" class="picshow" :style="info.type==0&&info.channeltype==1?'height:'+this.imgHeight+';width:'+this.imgWidth:''">
                <div v-if="info.type==0&&info.channeltype==1" class="leftImgBox" :style="{backgroundImage: 'url('+https(info.coverurl) +')'}"></div>
                <img v-else v-lazy="https(info.coverurl)" alt="">
                <div v-if="info.channeltype !=1 ||info.type !=0" class="video-bg"></div>
                <span v-if="info.type == 2" class="video-playico"></span>
                <!-- <span v-if="info.channeltype == 2&&type==0&&!parentid" class="theme_channel">专题频道</span>
                <span v-if="info.channeltype == 3&&type==0&&!parentid" class="honeyee_channel">HONEYEE</span> -->
            </div>
            <!--右边文字-->
            <div v-if="type==1">
                <div class="descword" :class="{hotNewsDes:type==1}" :style="info.type==0&&info.channeltype ==1&&type!=1?'width:'+this.descWidth:''">
                    <p class="title_art">{{info.title}}</p>
                    <p v-if="info.channeltype == 1 && info.type == 0" class="arti_from">{{info.categoryname}}</p>
                    <p class="time_from">
                        <label v-if="!(info.channeltype == 1 && info.type == 0)">{{info.categoryname}}</label>
                        <label class="time_art" style="margin-right:14px;">{{info.publishtime}}</label>
                        <label class="msg_art">
                            <em :class="type==1&&info.type!=0||type==1&&info.channeltype!=1?'ico-read-white':'ico-read-nums'"></em>
                            <span>{{info.readcount}}</span>
                        </label>
                    </p>
                </div>
            </div>
            <div v-if="type!=1">
                <div class="descword" :class="{hotNewsDes:type==1}" :style="info.type==0&&info.channeltype ==1&&type!=1?'width:'+this.descWidth:''">
                    <p class="title_art">{{info.title}}</p>
                    <p v-if="info.channeltype == 1 && info.type == 0" class="arti_from">{{info.categoryname}}</p>
                    <p class="time_from">
                        <label v-if="!(info.channeltype == 1 && info.type == 0)">{{info.categoryname}}</label>
                        <label class="time_art">{{info.publishtime}}</label>
                        <label class="msg_art">
                            <em :class="type==1&&info.type!=0||type==1&&info.channeltype!=1?'ico-read-white':'ico-read-nums'"></em>
                            <span>{{info.readcount}}</span>
                        </label>
                    </p>
                </div>
            </div>
            <img v-if="type==1" class="hot" :src="hotImg" alt="">
        </div>
        <div v-if="listType==1" @click="gotoArtiDetl(info.id,info.type)" class="ul_artilces detl_list">
            <div class="picshow">
                <img v-lazy="https(info.coverurl)" alt="">
            </div>
            <div class="descword">
                <p class="title_art">{{info.title}}</p>
                <p class="arti_from ">{{info.categoryname}} {{info.publishtime}}</p>
                <p class="arti_icon">
                    <!--<label class="msg_art">-->
                    <em class="ico-read-nums"></em>
                    <span>{{info.readcount}}</span>
                    <!--</label>-->
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { DateDiffFormat } from '../../common/util'
export default {
  name: 'ArticleUnit',
  props: {
    unit: { type: Object },
    type: { type: Number, default: 0 },
    listType: { type: Number, default: 0 }, // 默认的是0，正常的文章列表 1视频和文章类型的推荐文章列表
    qzone: { type: Boolean, default: false }
  },
  data() {
    return {
      hotImg: '//files.eyee.com/mcdn/static/img/hot.png', // require('../../assets/img/hot.png'),
      imgHeight: '',
      imgWidth: '',
      descWidth: ''
    }
  },
  methods: {
    gotoArtiDetl: function (id, type) {
      let url = '/news/detail/' + id
      this.qzone ? this.qzoneGo(url) : this.$router.push(url)
    }
  },
  computed: {
    info() {
      // console.log('55555',this.unit)
      let info = this.unit
      if (info) info.publishtime = DateDiffFormat(info.publishtime)
      info.coverurl = info.coverurl.replace(/'/g, '%27').replace(/\s/g, '%20')
      if (this.type == 1 && info && info.coverurl) {
        info.style = { backgroundImage: 'url("' + info.coverurl + '") ' }
      }
      return info
    },
    parentid() {
      return this.$route.params.parentid
    }
  },
  mounted() {
    var deviceWid = document.documentElement.clientWidth || document.body.clientWidth
    this.imgHeight = deviceWid * 0.3 + 'px'
    this.imgWidth = deviceWid * 0.4 + 'px'
    this.descWidth = deviceWid - 20 - deviceWid * 0.4 + 'px'
    // console.log(deviceWid,this.descWidth)
  }
}
</script>
<style scoped>
.hot {
  position: absolute;
  width: 75px;
  top: 0;
  right: 0;
}

.ul_artilces {
  position: relative;
  padding: 5px;
  overflow: hidden;
  box-shadow: 0px 0px 1px 0px #d3d3d3;
  border-radius: 4px;
}

.ul_artilces .picshow {
  position: relative;
  float: left;
  width: 110px;
  /* height:110px; */
  max-height: 180px;
  display: flex;
  align-items: center;
  overflow: hidden;
  /* background: darkred; */
}

.ul_artilces .picshow1 {
  position: relative;
  float: left;
  /* width: 110px; */
  /* height:110px; */
  max-height: 110px;
  display: flex;
  align-items: center;
  /* overflow: hidden; */
  /* background: darkred; */
}

.ul_artilces .picshow1 img {
  display: block;
  width: 100%;
  /*min-height: 130px;*/
}

.ul_artilces .picshow img {
  display: block;
  width: 100%;
  /*min-height: 130px;*/
}

.ul_artilces .descword {
  float: left;
  width: 40%;
  padding: 0 5px 0 10px;
  text-align: left;
}

.ul_artilces .descword p {
  margin-bottom: 0;
  color: #999;
  font-size: 0.75rem;
}

.ul_artilces .descword p.title_art {
  font-size: 0.875rem;
  color: #333333;
  letter-spacing: 0px;
  line-height: 18px;
  font-weight: 600;
  max-height: 54px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.ul_artilces .descword p.arti_from {
  position: absolute;
  bottom: 20%;
  line-height: 12px;
  height: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ul_artilces .descword p.time_from {
  position: absolute;
  bottom: 7%;
  line-height: 12px;
  /*width: 30%;*/
  height: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ul_artilces .descword p span {
  display: inline-block;
  margin-right: 5px;
  font-size: 0.75rem;
  /*color: #999999;*/
  letter-spacing: 0px;
  line-height: 10px;
}

.ul_artilces .descword p.msg_art {
  position: absolute;
  bottom: 7%;
  width: 14%;
  line-height: 12px;
  height: 12px;
  right: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}

.ul_artilces .descword p.msg_art span {
  margin-right: 8px;
  font-size: 0.75rem;
  color: #999999;
  letter-spacing: 0px;
  vertical-align: middle;
}

.ul_artilces.unbaseArticle .picshow {
  width: 100%;
}

.ul_artilces.unbaseArticle .picshow .video-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.ul_artilces.unbaseArticle .picshow .video-playico {
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 50px;
  left: 0;
  bottom: 5%;
  background: url('//files.eyee.com/mcdn/static/img/video_play.png') no-repeat 15px center;
  background-size: 35px;
}

.ul_artilces.unbaseArticle .descword {
  width: 100%;
  /*text-align: center;*/
}

.ul_artilces.unbaseArticle .descword p.title_art {
  margin-bottom: 0;
  position: absolute;
  top: 50%;
  margin-top: -16px;
  color: #fff;
  text-align: center;
  width: 100%;
  left: 0;
  padding: 0 10%;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ul_artilces.unbaseArticle .descword p.arti_from {
  position: relative;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  text-align: left;
  width: auto;
  margin-right: 10px;
}

.ul_artilces.unbaseArticle .descword p.time_from {
  text-align: left;
  padding-right: 10px;
  position: initial;
  float: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}

.ul_artilces.unbaseArticle:not(.card) .descword .msg_art {
  position: absolute;
  right: 10px;
}

.ul_artilces.unbaseArticle.card .descword {
  margin-top: -30px;
}

.ul_artilces.unbaseArticle.card .descword .time_from {
  color: #fff;
  position: absolute;
  width: 90%;
  padding: 0;
  bottom: 4px;
  text-align: center;
  margin-left: -15px;
}
.ul_artilces.unbaseArticle.card .descword .time_from .time_art {
  padding: 0 0 0 14px;
}
.ul_artilces.newsCard .picshow,
.ul_artilces.newsCard .descword {
  float: none;
}
.ul_artilces.newsCard .hot_contentB {
  width: 110px;
  height: 110px;
  padding-bottom: 0;
  /* background-size: 100% 100%; */
}
.ul_artilces.newsCard .descword {
  width: 100%;
  height: 110px;
}
.ul_artilces.normalArticle:not(.card) .picshow,
.ul_artilces.normalArticle:not(.card) .descword {
  float: none;
}
.ul_artilces.normalArticle:not(.card) .descword {
  width: 100%;
}
/*详情推荐宽100%模式列表*/

.detl_list {
  padding: 0 5px;
  margin: 15px 0;
}

.detl_list .picshow {
  width: 35%;
  max-height: 100px;
}

.detl_list .descword {
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detl_list .descword p.title_art {
  font-size: 0.875rem;
  letter-spacing: 0px;
  line-height: 18px;
  font-weight: 500;
  max-height: 36px;
  -webkit-line-clamp: 2;
}

.detl_list .descword p.arti_from {
  /*position: relative;*/
  bottom: 26%;
}

.detl_list .arti_icon {
  position: absolute;
  bottom: 5px;
}

.detl_list p {
  line-height: 16px;
}
.hotNews {
  height: 110px;
  width: 100%;
}
.hot_new {
  max-width: 110px;
}
.hot_content,
.hot_contentB {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.hot_contentB {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
}

.ul_artilces .hotNewsDes p.arti_from {
  bottom: 30%;
  /*border: 1px solid red;*/
  /*首页样式*/
}
.ul_artilces .hotNewsDes p.time_from {
  bottom: 16%;
  width: 100%;
  /*border: 1px solid red;*/
}

#app .unbaseArticle .hotNewsDes p.time_from {
  width: 100%;
}
.leftImgBox {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}
</style>
