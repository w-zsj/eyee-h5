<template>
  <div class="" :class="{ isHeadHide: $root.ISAPP }">
    <v-header
      v-if="!fullData.data && !$root.ISAPP && !isin && !notself && !$root.ISMP && !type"
    >
      <div class="nav-tab2">
        <h3 v-if="templateData[0]">{{ templateData[0].title }}</h3>
      </div>
    </v-header>
    <div
      class="load flex-aic-btwn"
      v-if="!fullData.data && !$root.ISAPP && !isin && !notself && !$root.ISMP && showEnvelopes"
      @click="downapp"
    >
      <img class="load-app-img" src="/static/imgs/downapp/load-logo.png" alt />
      <span class="flex-center">新人领520红包</span>
    </div>
    <div class="_lottery" v-if="type == 'yfs'" @click="toLottery">
      <img src="/static/imgs/yfs.png" />
    </div>
    <div class="active_template">
      <template v-if="!fullData.data">
        <ul class="tempcontent" @click="activeClick">
          <template v-for="(temp, idx) in templateData">
            <li :key="'cell' + idx" v-if="temp.isEdit">
              <!-- type === 0  图片-->
              <div
                v-if="temp.type === 0"
                class="templist list_image clearfix"
                :style="{ marginTop: 0 + 'px' }"
              >
                <p
                  v-for="(label, index) in temp.data"
                  :key="index"
                  class="tempitem"
                  :style="{ width: label.percent + '%' }"
                  v-web-app="label"
                >
                  <img v-lazy="dealImg(label.imageurl)" />
                </p>
              </div>
              <!-- type === 9  图片-->
              <div
                v-else-if="temp.type === 9"
                class="templist list_image clearfix"
                :style="{
                  marginTop: 0 + 'px',
                  marginBottom: temp.bottom + 'px',
                }"
              >
                <p
                  v-for="(label, index) in temp.data"
                  :key="index"
                  class="tempitem"
                  :style="{ width: label.percent + '%' }"
                  @click="getConHon(label, temp.editIndex)"
                >
                  <img v-lazy="dealImg(label.imageurl)" />
                </p>
              </div>
              <!-- type === 1  视频-->
              <!-- <div v-else-if="temp.type === 1" class="templist list_video" :style="{ marginTop: temp.top+'px', marginBottom: temp.bottom + 'px' }">
              <section class="tempitem" v-for="(vid,index) in temp.data" :key="index">
                <video controls preload="true" webkit-playsinline="webkit-playsinline" playsinline="playsinline" loop="false" :poster="vid.imageurl" :style="{ margin:'0 auto',width:'100%','border-radius':12 + 'px'}" autobuffer>
                  <source :src="vid.videourl|https" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
                </video>
              </section>
            </div> -->
              <div
                v-else-if="temp.type === 1"
                class="templist list_video"
                :style="{ marginBottom: temp.bottom + 'px' }"
              >
                <section
                  class="tempitem"
                  v-for="(vid, index) in temp.data"
                  :key="index"
                >
                  <!-- <video controls preload="true" webkit-playsinline="webkit-playsinline" playsinline="playsinline" loop="false" :poster="vid.imageurl" :style="{ margin:'0 auto',width:'100%','border-radius':12 + 'px'}" autobuffer>
                  <source :src="vid.videourl|https" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
                </video> -->
                  <video
                    class="video"
                    :id="'videoNode' + index"
                    :src="vid.videourl | https"
                    :poster="vid.imageurl"
                  ></video>
                  <div class="video-mask" @click="(e) => playPause(index, e)">
                    <!-- <ico class="post-video" name="posting-video-play"></ico> -->
                    <img
                      class="post-video"
                      src="../assets/img/icon_play_big@3x.png"
                      style="width: 50px"
                    />
                  </div>
                </section>
              </div>
              <!-- type === 2  轮播图片-->
              <div
                v-else-if="temp.type === 2"
                class="templist list_slider"
                :style="{ marginBottom: temp.bottom + 'px' }"
              >
                <!-- <swiper :options="swiperAllPic" class="swiper-container swiper2" style="margin:1rem auto;border-radius:12px;height:259px;">
                <swiper-slide v-for="(item,index) in temp.data" :key="index" v-web-app="item">
                  <section>
                    <img v-lazy="https(item.imageurl)"/>
                  </section>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper> -->
                <swiper
                  :options="swiperAllPic"
                  class="swiper-container swiper2"
                  style="height: 288px"
                >
                  <swiper-slide
                    v-for="(item, index) in temp.data"
                    :key="index"
                    v-web-app="item"
                  >
                    <img v-lazy="https(item.imageurl)" style="height: 259px" />
                    <!-- </section> -->
                  </swiper-slide>
                  <div class="swiper-scrollbar" slot="scrollbar"></div>
                </swiper>
              </div>
              <!-- type === 3  滚动图片freemode-->
              <div
                v-else-if="temp.type === 3"
                class="templist list_scroll"
                :style="{
                  marginTop: temp.top + 'px',
                  marginBottom: temp.bottom + 'px',
                }"
              >
                <swiper
                  :options="swiperPicsPiece"
                  class="swiper-container swiper2 list_image"
                >
                  <swiper-slide v-for="(item, index) in temp.data" :key="index">
                    <section v-web-app="item">
                      <img v-lazy="https(item.imageurl)" />
                    </section>
                  </swiper-slide>
                </swiper>
              </div>
              <!-- type === 4  产品列表-->
              <div
                v-else-if="temp.type === 4"
                class="templist list_product clearfix"
                :style="{ marginBottom: temp.bottom + 'px' }"
              >
                <section
                  v-for="(lis, index) in temp.data"
                  :key="index"
                  class="tempitem"
                  v-web-app="lis"
                  :data-id="lis.urlname"
                  :data-typename="lis.typeName"
                >
                  <div class="myTopImg">
                    <img v-lazy="dealImg(lis.mainpic)" />
                  </div>
                  <p class="name" style="-webkit-box-orient: vertical">
                    {{ lis.productname }}
                  </p>
                  <p class="price">
                    <template v-if="lis.price == 0 && lis.delprice == 0">
                      <span>
                        <span style="font-size: 14px">¥&nbsp;</span
                        ><span> — —</span>
                      </span>
                    </template>
                    <template v-else>
                      <span style="font-size: 14px">¥&nbsp;</span
                      ><span style="font-size: 18px">{{
                        parseFloat(lis.price).toFixed(0)
                      }}</span>
                      <!--<span v-show="lis.isoverseas"> +TAX</span>-->
                      <!-- <span class="del" v-if="lis.delprice>0&&lis.delprice!=lis.price">{{parseFloat(lis.delprice).toFixed(2)}}</span> -->
                    </template>
                  </p>
                </section>
              </div>
              <!-- type === 5  产品滚动带产品名称和价格freemode -->
              <div
                v-else-if="temp.type === 5"
                class="templist list_product_srcoll"
                :style="{
                  marginTop: temp.top + 'px',
                  marginBottom: temp.bottom + 'px',
                }"
              >
                <section class="tempitem">
                  <swiper
                    :options="swiperProdsPiece"
                    class="swiper-container swiper2"
                  >
                    <swiper-slide
                      v-for="(prod, index) in temp.data"
                      :key="index"
                      v-web-app="prod"
                      :data-id="prod.urlname"
                      :data-typename="prod.typeName"
                    >
                      <img v-lazy="dealImg(prod.mainpic)" />
                      <p class="name" style="-webkit-box-orient: vertical">
                        {{ prod.productname }}
                      </p>
                      <p class="price">
                        <span style="font-size: 14px">¥&nbsp;</span
                        ><span style="font-size: 18px">{{
                          prod.price || " — —"
                        }}</span>
                        <!--<span v-show="prod.isoverseas"> +TAX</span>-->
                      </p>
                    </swiper-slide>
                  </swiper>
                </section>
              </div>
              <!-- type === 7  混乱布局 (相对定位点击)-->
              <div
                v-else-if="temp.type === 7"
                class="templist list_mixins"
                :style="{
                  marginTop: temp.top + 'px',
                  marginBottom: temp.bottom + 'px',
                }"
              >
                <img v-lazy="https(temp.imageurl)" alt />
                <p
                  class="region"
                  v-for="(mixs, index) in temp.data"
                  :key="index"
                  :data-id="mixs.urlname"
                  :data-typename="mixs.typeName"
                  :style="{
                    position: 'absolute',
                    width: mixs.width + '%',
                    height: mixs.height + '%',
                    left: mixs.left + '%',
                    top: mixs.top + '%',
                  }"
                  v-web-app="mixs"
                ></p>
              </div>
              <!-- type === 8  资讯列表一排一个列表 -->
              <div
                v-else-if="temp.type === 8"
                class="templist list_article clearfix"
                :style="{
                  marginTop: temp.top + 'px',
                  marginBottom: temp.bottom + 'px',
                }"
              >
                <section
                  class="tempitem"
                  v-for="(art, index) in temp.data"
                  :key="index"
                  v-web-app="art"
                >
                  <img v-lazy="dealImg(art.coverurl)" />
                  <p class="name" style="-webkit-box-orient: vertical">
                    {{ art.title }}
                  </p>
                </section>
              </div>
            </li>
          </template>
        </ul>
        <div class="fix-gs-endter" v-if="showGSenter" @click="enterGS">
          <img src="//files.eyee.com/mcdn/static/img/gs-enter.png" alt />
        </div>
      </template>
      <!-- type === 6  全屏布局 -->
      <div
        v-if="fullData.data"
        class="templist list_product_fullScreen"
        :style="{
          height: deviceHei + 'px',
          marginTop: fullData.top + 'px',
          marginBottom: fullData.bottom + 'px',
        }"
      >
        <swiper :options="swiperFullScreen" class="swiper-container swiper2">
          <swiper-slide
            v-for="(item, idx) in fullData.data"
            :key="idx"
            v-web-app="item"
          >
            <section
              class="full_bgimage"
              :style="{ backgroundImage: 'url(' + https(item.imageurl) + ')' }"
            ></section>
          </swiper-slide>
        </swiper>
      </div>
      <div v-else-if="hasdata == 1">
        <div class="no-data">
          <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt />
          <p>活动已结束</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { CustomSubjectInfo } from "../common/api/active";
import { GetCouponByCdKey } from "../common/api/marketing";
import LoaderApp from "@/comps/Loader";
const dom = window.document;
let clearSettimer = null;
let activitytype = "";
export default {
  name: "v-active",
  props: { isin: { type: Boolean, default: false }, id: String },
  components: { LoaderApp },
  data() {
    return {
      showGSenter: false,
      templateData: {},
      hasdata: 0,
      fullData: {},
      swiperAllPic: {
        // spaceBetween: 15,
        slidesPerView: 1,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false
      },
      // swiperAllPic: {
      //   autoplay: 0,
      //   pagination: ".swiper-pagination"
      // },
      swiperPicsPiece: {
        autoplay: 0,
        freeMode: true,
        slidesPerView: 3,
        spaceBetween: 5
      },
      swiperProdsPiece: {
        autoplay: 0,
        freeMode: true,
        slidesPerView: 3,
        spaceBetween: 5
      },
      swiperFullScreen: {
        autoplay: 0
      },

      activeid: "",
      type: "",
      showEnvelopes: 1
    };
  },
  mounted() {
    let _ = this;

    // document.title=t&&t.length>0?t[0].title:"斗牛 Let's DoNew"

    // if (!this.$root.ISAPP && window.location.href.indexOf('?') > -1) {
    //   window.location.href = window.location.href.split('?')[0]
    // }
    
    // 是否显示领取新红包
    _.showEnvelopes = parseInt(_.$route.query.show) || 0
    
    _.activeid = _.$route.params.id || "";
    activitytype = _.$route.query.type || "";
    _.type = activitytype;
    _.getActiveConts();
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    deviceHei() {
      return (
        window.innerHeight ||
        dom.documentElement.clientHeight ||
        dom.body.clientHeight
      );
    },
    notself() {
      return window.top !== window.self;
    }
  },
  methods: {
    playPause(i, e) {
      let videoNode = document.getElementById("videoNode" + i);
      if (clearSettimer) clearInterval(clearSettimer);
      if (videoNode.paused) {
        videoNode.play();
        e.currentTarget.children[0].style.display = "none";
      } else {
        videoNode.pause();
        e.currentTarget.children[0].style.display = "block";
        clearInterval(clearSettimer);
      }
    },
    downapp() {
      $log({
        e: $log.event.click,
        p: { name: "自定义专题", activeid: this.activeid || "" }
      });
      this.openAppClient();
    },
    dealImg(url) {
      return this.https((url || "").split("|")[0]);
    },
    getActiveConts: function () {
      let _ = this;
      // 0 商家 1平台
      let type = _.$route.query.t;
      type = isNaN(type) ? 1 : type;
      type = type > 1 ? 1 : type;
      // console.log('getActiveConts', type, _.$route.params, _.$route.query)
      let param = _.isin
        ? { subjectId: _.id, type: 0 }
        : { subjectId: _.$route.params.id, type };
      CustomSubjectInfo(param)
        .then((res) => {
          if (res && res.content) {
            // 字段名与值是反的
            _.showGSenter = res.ishideqqzone;
            this.hasdata = 0;
            var templ = JSON.parse(res.content);
            // _.templateData = JSON.parse(res.content);
            console.log("CustomSubjectInfo content", JSON.parse(res.content));

            _.setToolBar({ title: templ[0].title || "" });

            for (var i = 0; i < templ.length; i++) {
              // 专题活动标题
              if (templ[i].type === 99) {
                let { title, sharetitle, imageurl } = templ[0] || {},
                  shareurl = window.location.origin + window.location.pathname;
                _.$root.share.title = title;
                _.$root.share.desc = sharetitle;
                _.$root.share.imgUrl = imageurl;
                _.$root.share.link = shareurl;

                if (_.$root.ISAPP && sharetitle) {
                  _.javascriptBridge({
                    name: "getAppActivityShareContent",
                    params: {
                      sharecontent: sharetitle,
                      sharetitle: title,
                      shareurl: shareurl,
                      sharepicurl: imageurl,
                      callbackname: ""
                    }
                  });
                } else {
                  _.initShare({
                    info: {
                      title: templ[0].title,
                      desc: templ[0].sharetitle,
                      img: templ[0].imageurl
                    }
                  });
                }
              } else if (templ[i].type === 3) {
                console.log(templ[i]);
                _.swiperPicsPiece.slidesPerView = templ[i].slidesPerView;
                _.swiperPicsPiece.spaceBetween = templ[i].spaceBetween;
              }
              // 全屏切换的时候设置参数隐藏header
              else if (templ[i].type === 6) {
                _.fullData = templ[i];
              }
              if (templ[i].data) {
                for (var j = 0; j < templ[i].data.length; j++) {
                  /*
                  type: 图片：0,视频：1,轮播图片:2,滚动图片freemode:3,产品列表:4,产品带名称和价格滚动freemode:5,混乱布局:7,资讯列表:8,全屏滚动slide:6,优惠券:9;

                  urltype:
                   0:店铺详情,
                   1:品牌百科列表页,
                   12:具体品牌首页,
                   13:品牌详情页,
                   2:商品搜索页(关键字),
                   14:分类搜索（分类id）,
                   3:产品详情,
                   4:鬼市,
                   5:潮店列表,
                   7:限量发售首页,
                   8:品牌搜索页(品牌id),
                   9:资讯详情,
                   10:资讯搜索结果页,
                   11:自定义(限专题id),
                   15：鞋子专区系列页面(系列id 分类名称)
                   16：鞋子专区详情页面(shoeid)
                  */
                  switch (templ[i].data[j].urltype) {
                    case 0:
                      templ[i].data[j].typeName = "潮店详情";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppOnlineShopHomePage",
                          params: {
                            businessid: templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name: "/shop/shopdetail/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 1:
                      templ[i].data[j].typeName = "品牌百科";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppBrandStorePage",
                          params: {}
                        },
                        webUrl: {
                          name: "/brand",
                          params: {}
                        }
                      };
                      break;
                    case 12:
                      templ[i].data[j].typeName = "品牌百科内容";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppBrandIntroducePage",
                          params: {
                            brandid: templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name: "/brandInfo/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 13:
                      templ[i].data[j].typeName = "品牌百科详情";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppBrandArticlePage",
                          params: {
                            itemid: templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name: "/BrandDetail/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 14:
                      templ[i].data[j].typeName = "分类搜索";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppProductListPage",
                          params: {
                            categoryid: templ[i].data[j].urlname,
                            keyword: templ[i].data[j].keyword || ""
                          }
                        },
                        webUrl: {
                          name:
                            "/results/" +
                            (templ[i].data[j].keyword ||
                              templ[i].data[j].urlname),
                          params: {
                            type: "category",
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 2:
                      templ[i].data[j].typeName = "商品关键字搜索";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppProductListPage",
                          params: {
                            keyword:
                              templ[i].data[j].keyword ||
                              templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name:
                            "/results/" +
                            (templ[i].data[j].keyword ||
                              templ[i].data[j].urlname),
                          params: {
                            // id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 3:
                      let productid = templ[i].data[j].urlname,
                        isC2C = (productid && productid.length < 32) || false;
                      templ[i].data[j].typeName = "商品";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: isC2C
                            ? "gotoAppSneakerDetailPage"
                            : "gotoAppProductDetailPage",
                          params: {
                            productid
                          }
                        },
                        webUrl: {
                          name: isC2C ? "/sneaker/detail/" : "/productDetail/",
                          params: {
                            id: productid
                          }
                        }
                      };
                      break;
                    case 4:
                      templ[i].data[j].typeName = "鬼市";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppSpecialDetailPage",
                          params: {}
                        },
                        webUrl: {
                          name: "/mall/ghost",
                          params: {}
                        }
                      };
                      break;
                    case 5:
                      templ[i].data[j].typeName = "潮店列表";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppShopListPage",
                          params: {}
                        },
                        webUrl: {
                          name: "/mall/shop",
                          params: {}
                        }
                      };
                      break;
                    case 6:
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppNewpublishPage",
                          params: {}
                        },
                        webUrl: {
                          name: "root.home.newpro",
                          params: {}
                        }
                      };
                      break;
                    case 7:
                      templ[i].data[j].typeName = "限量发售";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppLimitSalePage",
                          params: {}
                        },
                        webUrl: {
                          name: "/mall/limit",
                          params: {}
                        }
                      };
                      break;
                    case 8:
                      templ[i].data[j].typeName = "品牌搜索";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppProductListPage",
                          params: {
                            brandid: templ[i].data[j].urlname,
                            keyword: templ[i].data[j].keyword || ""
                          }
                        },
                        webUrl: {
                          name:
                            "/results/" +
                            (templ[i].data[j].keyword ||
                              templ[i].data[j].urlname),
                          params: {
                            type: "brand",
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 9:
                      templ[i].data[j].typeName = "资讯";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoArticleDetailPage",
                          params: {
                            articleid: templ[i].data[j].urlname,
                            articletype: templ[i].data[j].articletype
                          }
                        },
                        webUrl: {
                          name: "/news/detail/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 15:
                      templ[i].data[j].typeName = "sneaker系列页";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppShoesZonePage",
                          params: {
                            seriesid: templ[i].data[j].urlname,
                            categoryname: templ[i].data[j].shoeCateName
                          }
                        },
                        webUrl: {
                          name: "/sneakerSeries/",
                          params: {
                            categoryname: templ[i].data[j].shoeCateName,
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 16:
                      templ[i].data[j].typeName = "sneaker详情";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoAppShoesListPage",
                          params: {
                            shoeid: templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name: "/sneakerDetail/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 10:
                      templ[i].data[j].typeName = "资讯关键字搜索";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "gotoArticleSearchResultPage",
                          params: {
                            keyword: templ[i].data[j].urlname
                          }
                        },
                        webUrl: {
                          name: "/news/Search/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                    case 11:
                      templ[i].data[j].typeName = "自定义专题";
                      templ[i].data[j].urltype = {
                        appUrl: {
                          name: "",
                          params: {}
                        },
                        paramstype: 11,
                        webUrl: {
                          name: "/active/",
                          params: {
                            id: templ[i].data[j].urlname
                          }
                        }
                      };
                      break;
                  }

                  if (templ[i].type === 4 || templ[i].type === 5) {
                    let productid = templ[i].data[j].productid,
                      isC2C = productid.length < 32;
                    templ[i].data[j].urltype = {
                      appUrl: {
                        name: isC2C
                          ? "gotoAppSneakerDetailPage"
                          : "gotoAppProductDetailPage",
                        params: {
                          productid
                        }
                      },
                      webUrl: {
                        name: isC2C ? "/sneaker/detail/" : "/productDetail/",
                        params: {
                          id: productid
                        }
                      }
                    };
                    templ[i].data[j].urlExist = true;
                  } else if (templ[i].type === 8) {
                    templ[i].data[j].urltype = {
                      appUrl: {
                        name: "gotoArticleDetailPage",
                        params: {
                          articleid: templ[i].data[j].id,
                          articletype: templ[i].data[j].type
                        }
                      },
                      webUrl: {
                        name: "/news/detail/",
                        params: {
                          id: templ[i].data[j].urlname
                        }
                      }
                    };
                    templ[i].data[j].urlExist = true;
                  }
                }
              }
            }
            _.templateData = templ;
          } else {
            this.hasdata = 1;
          }
          this.$nextTick(() => {
            setTimeout(() => {
              window.scrollTo(0, 2);
            }, 200);
          });
        })
        .catch((e) => {
          this.toast(e.msg || "数据加载失败");
          this.hasdata = 1;
          console.error("CustomSubjectInfo error", e);
        });
    },
    gotoWeb_App: function (item, appurl, weburl) {
      console.log(item, item.urltype.appUrl, item.urltype.webUrl);
    },
    getConHon: function (item, index) {
      console.log("getConHon", item, index);
      let _ = this,
        {
          user,
          $root: { ISAPP }
        } = _;
      if (item.linktype == 1) {
        if (user && user.token) {
          GetCouponByCdKey({ token: user.token, cdkey: item.urlname })
            .then(function (res) {
              _.toast("领取成功");
            })
            .catch((e) => {
              _.toast(e.msg || "领取失败~");
            });
        } else {
          if (ISAPP) _.toast("登录信息加载失败~");
          else _.$router.push("/login");
        }
      }

      // if (_.$root.ISAPP && user && user.token) {
      //   if (item.linktype == 1) {
      //     console.log("优惠券码");
      //     GetCouponByCdKey({ token: user.token, cdkey: item.urlname })
      //       .then(function(res) {
      //         if (res) {
      //           _.toast("领取成功");
      //         } else {
      //           _.toast("领取失败");
      //         }
      //       })
      //       .catch(e => {
      //         // if (e.code == 1511610) {
      //         //   _.toast("已经领取过了~~");
      //         // } else if (e.code == 1511545) {
      //         //   _.toast("该账号已经在其他登录了哟~~");
      //         // }
      //         _.toast(e.msg || "领取失败~");
      //         // this.toast(e && e.msg ? e.msg : ('error:' + e));
      //       });
      //   }
      //   //  else if (item.linktype == 2) {
      //   //   var paramObjs = _.user;
      //   //   paramObjs.subjectid = _.$route.params.id;
      //   //   paramObjs.type = 9;
      //   //   paramObjs.index = index;
      //   //   AddBeesBySubject(paramObjs)
      //   //     .then(function(res) {
      //   //       console.log(res);
      //   //       if (res) {
      //   //         _.toast("领取成功");
      //   //       } else {
      //   //         _.toast("领取失败");
      //   //       }
      //   //     })
      //   //     .catch(e => {
      //   //       if (e.code == 1511610) {
      //   //         _.toast("已经领取过了~~");
      //   //       } else if (e.code == 1511545) {
      //   //         _.toast("该账号已经在其他登录了哟~~");
      //   //       }
      //   //       // this.toast(e && e.msg ? e.msg : ('error:' + e));
      //   //     });
      //   // }
      // } else {
      //   _.toast("请在APP内领取~~");
      // }
    },
    enterGS() {
      let url =
        "https://h5.qzone.qq.com/fashion/home?_wv=16778247&qzUseTransparentNavBar=1&_ws=32&_wwv=129&_proxy=1&pf=wanba_ts.106";
      if (window.mqq) {
        window.mqq.invoke("ui", "openUrl", {
          url: url,
          // 0为当前webview打开,1为新的webview打开,2为外部浏览器打开
          target: 1,
          // 0: 顶部标题栏模式（无底部工具栏）,1: 顶部标题栏无分享入口（无底部工具栏）,2: 底部工具栏模式（顶部标题依然会存在）,3: 底部工具栏模式且顶部无分享入口（顶部标题依然会存在）
          style: 0
        });
      } else window.open(url, "_new");
    },
    activeClick(e) {
      if (e.target && e.target.dataset) {
        let id = e.target.dataset.id || "";
        let typename = e.target.dataset.typename || "";
      }
    },
    toLottery() {
      this.$router.push("/activity/luckDraw");
    }
  },
  directives: {
    "web-app": {
      bind: (el, binding, vnode) => {
        let _ = window.$vue,
          {
            $root: { ISAPP },
            $router
          } = _;
        setupWebViewJavascriptBridge(function (bridge) {
          // 调试
          var uniqueId = 1;
          function log(message, data) {
            var log = dom.getElementById("log");
            var el = dom.createElement("div");
            el.className = "logLine";
            el.innerHTML =
              uniqueId++ + ". " + message + ":<br/>" + JSON.stringify(data);
            if (log.children.length) {
              log.insertBefore(el, log.children[0]);
            } else {
              log.appendChild(el);
            }
          }

          // el.addEventListener('touchend', function(event) {
          el.onclick = function () {
            let elData = binding.value;
            if (activitytype == "yfs") {
              // 一番赏特殊标识
              $router.push("/activity/luckDraw");
              return;
            }

            console.log("web-app directive bindingValue", elData);
            // '点击>>'
            if (elData.urlExist) {
              if (ISAPP && elData.urltype.paramstype != 11) {
                console.log(
                  "APP 列表: ",
                  elData.urltype.appUrl.name,
                  elData.urltype.appUrl.params
                );
                // 'app内嵌点击>>appUrl.name:' + JSON.stringify(appUrl.name) + 'appUrl.params' + JSON.stringify(appUrl.params)
                bridge.callHandler(
                  elData.urltype.appUrl.name,
                  elData.urltype.appUrl.params,
                  function (response) {
                    console.log("Call bridge response: ", response);
                  }
                );
              } else {
                let routePath = elData.urltype.webUrl.name;
                let paramId = elData.urltype.webUrl.params.id;
                // console.log(routePath, elData.urltype.webUrl.params)
                if (elData.urltype.webUrl.params.type == "brand") {
                  var set = {};
                  // set.brandid = paramId
                  set.brandid = paramId;
                  _.$store.dispatch("confirOption", { data: set });
                  routePath = `${routePath}${
                    routePath.indexOf("?") > -1 ? "&" : "?"
                  }brandid=${paramId}`;
                  $router.push(routePath);
                } else if (elData.urltype.webUrl.params.type == "category") {
                  var set = {};
                  // set.brandid = paramId
                  set.categoryid = paramId;
                  _.$store.dispatch("confirOption", { data: set });
                  routePath = `${routePath}${
                    routePath.indexOf("?") > -1 ? "&" : "?"
                  }categoryid=${paramId}`;
                  $router.push(routePath);
                } else if (elData.urltype.webUrl.params.categoryname) {
                  $router.push(
                    routePath +
                      elData.urltype.webUrl.params.categoryname +
                      "/" +
                      paramId
                  );
                } else {
                  if (paramId) {
                    let url = routePath + paramId;
                    $router.push(url);
                  } else {
                    $router.push(routePath);
                  }
                }
              }
            }
          };
        });
        function setupWebViewJavascriptBridge(callback) {
          if (ISAPP) {
            // app内嵌
            if (window.WebViewJavascriptBridge) {
              return callback(WebViewJavascriptBridge);
            } else {
              dom.addEventListener(
                "WebViewJavascriptBridgeReady",
                function () {
                  callback(WebViewJavascriptBridge);
                },
                false
              );
            }
            if (window.WVJBCallbacks) {
              return window.WVJBCallbacks.push(callback);
            }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = dom.createElement("iframe");
            WVJBIframe.style.display = "none";
            WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
            dom.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
              dom.documentElement.removeChild(WVJBIframe);
            }, 0);
          } else {
            // 非app内嵌
            callback();
          }
        }
      }
    }
  },
  watch: {
    "$route.params.id": function (val, old) {
      console.log("watch active id", val, old);

      if (this.$route.name === "custom-activity" && val && val !== old) {
        this.activeid = val;
        this.templateData = {};
        this.getActiveConts();
      }
    }
  }
};
</script>
<style>
/* body {
  background-color: #191919 !important;
} */
._lottery {
  position: fixed;
  left: 50%;
  bottom: 44px;
  transform: translateX(-50%);
  z-index: 99;
  width: 56.2666vw;
}
.list_product {
  padding-right: 2.5%;
}
.list_product:first-child {
  margin-top: 15px;
}
.video {
  width: 100%;
  border-radius: 18px;
}
.video-mask {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.video-mask .post-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.list_slider {
  padding: 0 2.5%;
  border-radius: 18px;
}
.list_slider .swiper-scrollbar {
  background: #505050;
  border-radius: 200px !important;
  width: 30vw;
  /* margin: 0 auto; */
  left: 50vw;
  margin-left: -15vw;
  bottom: 3px !important;
  /* top: 34vh; */
  height: 4px !important;
}
.list_slider .swiper-scrollbar-drag {
  background: #f0f0f0;
  border-radius: 200px !important;
  height: 4px !important;
}
.myTopImg {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.myTopImg::after {
  content: "";
  background: rgba(0, 0, 0, 0.04);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.pro {
  margin: 15px auto;
  border-radius: 18px;
  background: #fff;
}
.list_image {
  /* margin: 0 2.5%; */
  /* border-radius: 18px; */
  overflow: hidden;
  margin-bottom: 15px;
}
.load {
  background: #fa2337;
  height: 50px;
  padding: 8px 20px;
}
.load img {
  width: 103px;
  height: 34px;
  display: inline-block;
}
.load span {
  width: 113px;
  height: 26px;
  left: 242px;
  top: 100px;
  background: #ffffff;
  border-radius: 21px;
  font-size: 13px;
  color: #fa2337;
  font-weight: bold;
}
.active_template {
  /* max-width: 100vw;
  overflow: hidden;
  background: #fff;
  border-radius: 18px; */
  /* background: #191919; */
  /* padding: 3%; */
  padding-top: 0;
}
.tempcontent {
  max-width: 100vw;
  overflow: hidden;
  background: #fff;
  /* border-radius: 18px; */
}
.active_template.isHeadHide {
  margin-top: 0 !important;
}
.active_template ul.tempcontent > li img,
.imageurl img {
  width: 100%;
  display: block;
  /* border-radius: 12px; */
}

.active_template ul.tempcontent > li .templist.list_product .tempitem {
  width: 50%;
  padding-left: 2.5%;
  float: left;
  text-align: center;
  padding-bottom: 3.5%;
}
.active_template ul.tempcontent > li .templist .tempitem p {
  font-size: 13px;
  color: #333;
  width: 100%;
  text-align: left;
}
.active_template ul.tempcontent > li .templist p.name {
  padding-left: 5px;
  margin: 10px 0 15px 0;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}
.price {
  padding-left: 5px;
}
.active_template
  ul.tempcontent
  > li
  .templist.list_product
  .tempitem:nth-child(2n)
  p {
  padding-left: 10px;
}
.active_template
  ul.tempcontent
  > li
  .templist.list_product
  .tempitem
  p.price
  span {
  color: #333;
  font-family: "OswaldBold";
  /* font-weight: 200; */
}
.active_template ul.tempcontent > li .templist.list_mixins {
  position: relative;
}
.active_template ul.tempcontent > li .templist.list_article .tempitem {
  width: 100%;
  float: none;
  /* text-align: center; */
  margin-bottom: 10px;
}
.active_template ul.tempcontent > li .templist.list_video .tempitem {
  display: block;
  position: relative;
  padding: 0 2.5%;
  float: none;
  margin: 12px auto 12px auto;
  border-radius: 12px;
  min-height: 100px;
}
.active_template .list_product_fullScreen .swiper-container,
.active_template .list_product_fullScreen .full_bgimage {
  height: 100%;
}
.active_template .list_product_fullScreen .full_bgimage {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.fix-gs-endter {
  display: block;
  position: sticky;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  background-color: #fff;
}
.fix-gs-endter img {
  display: block;
}
</style>
