<template>
  <div
    v-if="hasdata == 1"
    class="page-footer"
    id="page-footer"
    :class="{ productDetail: showData, hasbess: realInfo.cashtype == 2 }"
    ref="conBox"
  >
    <!-- v-scroll='scrollF' -->

    <div
      class="product_content"
      v-if="showData"
      ref="conT"
      :class="{ cot: showTitle }"
    >
      <!-- 头部-->
      <div class="tabs flex-center block_color" :class="{ act: showTitle }">
        <span
          class="flex-center"
          v-for="(item, ach) in Aharr"
          :key="ach"
          :class="{ act: ach === curah }"
          @click="tabs(item.el, ach)"
          >{{ item.txt }}</span
        >
      </div>
      <v-headerscopy bg="#333" style="background: #333;" v-if="!showTitle">
        <div class="nav-tab2 ellipsis" style="color: #fff; font-size:12px;">商品详情</div>
      </v-headerscopy>

      <!-- 返回按钮 -->
      <!-- <div v-if="!insq" v-show="!showTitle" class="flex-center top_btns fixnav">
        <v-back></v-back>
        <div class="nav-tab2"></div>
      </div>-->
      <!-- 详情大图轮播 -->
      <div class="product_sw" v-if="swItem && swItem.length">
        <!-- <swiper :options="prodSwiOption" class="product_sw">
          <swiper-slide v-for="(item,index) in swItem" :key="index">
            <img :src="https(item)" :alt="item" />
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination"></div>-->
        <carousel
          :per-page="1"
          :autoplay="true"
          :autoplayTimeout="3500"
          :navigate-to="someLocalProperty"
          :loop="true"
          :autoplayHoverPause="false"
          :paginationEnabled="false"
          @page-change="pageChange"
        >
          <slide
            v-if="videoInfo.videoImg"
            @slide-click="openShowVideo"
            class="flex-center block_color"
          >
            <img class="video-img" :src="videoInfo.videoImg" />
            <img class="play-btn" src="../../assets/image/icon_play_big.png" />
          </slide>
          <slide v-for="(item, index) in swItem" :key="index + 'ad'">
            <img :src="https(item)" :alt="item" />
          </slide>
        </carousel>
      </div>
      <!-- 价格描述部分 gaps-->
      <div class="block_color porductCart">
        <!-- 平台大促图片 -->
        <div
          class="activityPhoto"
          v-if="realInfo.producttype == 7 && evts.evtactivity"
        >
          <img
            width="100%"
            height="100%"
            v-lazy="https(realInfo.platformactivityicon)"
            alt
          />
        </div>
        <!-- 平台大促 -->
        <div
          class="limitTimeSale flex flex-btwn"
          v-if="realInfo.producttype == 7 && evts.evtactivity"
          @click="goPlatFormActivity(evts.evtactivity.id)"
        >
          <div class="col1">
            该商品{{ realInfo.salestatus == 2 ? "即将" : "正在" }}参与{{
              evts.evtactivity.name
            }}
          </div>
          <div class="col2 icon-right">前往主会场</div>
        </div>
        <!-- 限量发售 -->
        <div
          class="limitTimeSale flex flex-btwn"
          v-if="evts.evtlimit"
          @click="goPlatFormActivity(evts.evtactivity.id)"
        >
          <div class="col1">
            该商品正在参与限量发售
          </div>
          <div class="col2" v-if="evtlimitType == 0">{{ timeSale }}</div>
          <div class="col2" v-if="evtlimitType == 1">
            距优惠结束
            <span
              v-for="(item, index) in evtlimitTime.split('')"
              :key="'time' + index"
              :class="{ black_block: item != ':' }"
              >{{ item }}</span
            >
          </div>
        </div>
        <!-- 限时折扣 -->
        <div class="limitTimeSale flex flex-btwn" v-if="evts.evtpromotion">
          <div class="col1">
            该商品{{ realInfo.salestatus == 2 ? "即将" : "正在" }}参与限时折扣
          </div>
          <div class="col2">
            <span class="time_color" v-if="realInfo.salestatus == 2">
              开始{{ evts.evtpromotion.b }}
            </span>
            <span class="time_color" v-else>{{ evts.evtpromotion.e }}结束</span>
          </div>
        </div>
        <!-- 助力砍价 -->
        <div class="limitTimeSale flex flex-btwn" v-if="iscut" @click="loadApp">
          <div class="col1">正在参与助力砍价,最低￥{{ cutminprice }}入手</div>
          <div class="col2 icon-right"></div>
        </div>
        <!-- 领券 -->
        <div
          class="couponsWrapper flex flex-btwn"
          v-if="evts.evtcoupon && evts.evtcoupon.length"
          @click.stop="showCoupon"
        >
          <div class="col1 flex">
            <div
              class="couponsleft couponsright flex flex-center"
              v-for="(item, index) in evts.evtcoupon"
              :key="'coupons' + index"
              v-show="index < 2"
            >
              <div class="coupons">
                {{ item.txt }}
              </div>
            </div>
          </div>
          <div class="col2 icon-right flex flex-center">
            共{{ evts.evtcoupon.length }}个优惠
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex flex-btwn">
          <!-- 商品名称 -->
          <div class="product_name ellipsis-2">{{ realInfo.name }}</div>
          <!-- 购物车 -->
          <div @click="gotocart" class="cartIcon">
            <img
              class="shoppingCart"
              src="../../../static/imgs/mall/icon_buy.png"
              alt=""
            />
            <i class="circle" v-if="cartnum > 0">{{ cartnum }}</i>
          </div>
        </div>

        <!-- 轮播图spot点 -->
        <div class="carousel_spotWrapper">
          <div class="carousel_spot">
            <div :style="{ width: currentwidth + 'vw' }" class="item act"></div>
          </div>
          <div class="carousel_spot position">
            <div
              class="itempos"
              @click="pageChange(index - 1)"
              v-for="index in swItem.length + (videoInfo.videoImg ? 1 : 0)"
              :key="'spot' + index"
            ></div>
          </div>
        </div>

        <!-- 商品价格，发货地，运费，购物须知,尺码 -->
        <div class="product_info">
          <div class="row1 flex">
            <div class="col1">
              <!-- 价格 -->
              <template v-if="realInfo.isov">
                <span class="price"
                  >{{ realInfo.symbol }}{{ realInfo.overseasprice
                  }}{{ realInfo.unit }} =</span
                >
              </template>
              <template
                v-if="
                  (realInfo.salestatus == 2 && evts.hasactive) ||
                  !evts.hasactive ||
                  iscut
                "
              >
                <span
                  class="price"
                  :style="{
                    fontSize: realInfo.isov
                      ? realInfo.realpriceChia &&
                        realInfo.realpriceChia.length > 8
                        ? '5.5vw'
                        : '8.5vw'
                      : realInfo.saleprice && realInfo.saleprice > 8
                      ? '5.5vw'
                      : '8.5vw',
                  }"
                >
                  <i class="rmb">¥</i>
                  {{
                    realInfo.isov ? realInfo.realpriceChia : realInfo.saleprice
                  }}
                </span>
              </template>
              <template v-if="evts.hasactive && !iscut">
                <img
                  class="image"
                  src="../../../static/imgs/mall/image_activity.png"
                />
                <div class="price" style="margin-top: 3.8vw;">
                  <i class="rmb">¥</i>
                  <span
                    v-if="
                      realInfo.salestatus === 2 || realInfo.specialprice == 0
                    "
                    >???</span
                  >
                  <span
                    v-else-if="realInfo.specialprice > 0"
                    class="pr"
                    :style="{
                      fontSize:
                        realInfo.specialprice.length > 8 ? '5.5vw' : '8.5vw',
                    }"
                  >
                    {{ realInfo.specialprice }}
                  </span>
                </div>
              </template>
              <!-- 品牌条形码 -->
              <div class="qr flex flex-center">
                <div class="qr_brand">
                  <img class="brand_img" :src="realInfo.brandlogo" />
                </div>
                <div>
                  <img
                    src="../../../static/imgs/mall/icon_qr.png"
                    style="width: 21.3vw;"
                  />
                  <div class="qrcode" v-if="qrcodenumber">
                    <span
                      v-for="(item, index) in qrcodenumber.split('')"
                      :key="'qr' + index"
                    >
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col2">
              <div class="item">
                <span>发货：</span>{{ realInfo.sendplace }}
              </div>
              <div class="item">
                <span>运费：</span>至 {{ realInfo.destination || "上海" }} ¥{{
                  realInfo.expressfee && realInfo.expressfee.toFixed(2)
                }}
                <span>
                  <span
                    v-if="realInfo.isglobalpurchase && realInfo.isdirectmail"
                    class="isglobalpurchase"
                    >海外直邮</span
                  >

                  <span
                    class="isglobalpurchase"
                    v-if="realInfo.isglobalpurchase && !realInfo.isdirectmail"
                    >国内现货</span
                  >
                </span>
              </div>
              <div class="shop-tip item icon-right" @click.stop="globalShop()">
                <span
                  >{{
                    realInfo.isaftersale ? "无忧售后：购物须知" : "不支持退换货"
                  }}
                </span>
              </div>
              <div
                class="item"
                v-if="(evts.hasactive && !iscut) && (realInfo.specialprice > 0 && realInfo.salestatus != 2)"
              >
                <span>原价：</span
                ><span class="saleprice">¥{{ realInfo.saleprice }}</span>
              </div>
            </div>
          </div>
          <div class="row2 flex flex-btwn" @click="cartModel(1)">
            <img
              src="../../../static/imgs/mall/icon_decoration.png"
              class="image"
            />
            <div class="row2-right flex flex-end">
              <div class="btngroup flex">
                <span
                  class="btnItem"
                  v-for="(item, size) in sizeColor.list"
                  :key="size"
                  v-show="size < (sizeColor.type == 'color' ? 5 : 4)"
                >
                  <i v-if="sizeColor.type == 'color'">{{ item.color }}</i>
                  <i v-else class="flex-center">{{ item.size }}</i>
                </span>
              </div>
              <span class="btnItem lastbtn">
                共{{ sizeColor.list && sizeColor.list.length }}种{{
                  sizeColor.type == "color" ? "颜色" : "尺码"
                }}可选
              </span>
            </div>
          </div>
        </div>
        <!-- 价格信息 -->
        <!-- <div
          class="info-price flex-center"
          :class="!evts.hasactive && !iscut ? 'bt' : ''"
        >
          海外价=====================================================================================================================
          <template v-if="realInfo.isov">
            <span style="color: #646464; font-size: 12px;"
              >{{ realInfo.symbol }}{{ realInfo.overseasprice
              }}{{ realInfo.unit }} =</span
            >
          </template>
          <template
            v-if="
              (realInfo.salestatus == 2 && evts.hasactive) ||
              !evts.hasactive ||
              iscut
            "
          >
            <span class="info-saleprice">
              <i class="rmb">¥</i>
              {{ realInfo.isov ? realInfo.realpriceChia : realInfo.saleprice }}
            </span>
          </template>
          <template v-if="evts.hasactive && !iscut">
            <label class="label">
              <span class="act-txt">活动价:</span>
              <span
                class="info-saleprice red"
                :class="{
                  'no-price':
                    realInfo.salestatus === 2 || realInfo.specialprice == 0,
                }"
              >
                <i class="rmb">¥</i>
                <span
                  v-if="realInfo.salestatus === 2 || realInfo.specialprice == 0"
                  >???</span
                >
                <span v-else-if="realInfo.specialprice > 0" class="pr">{{
                  realInfo.specialprice
                }}</span>
                <span
                  class="spec_price"
                  v-if="realInfo.specialprice > 0 && realInfo.salestatus != 2"
                  style="margin-left: 5px;"
                >
                  <i class="rmb">¥</i>
                  {{ realInfo.saleprice }}
                </span>
              </span>
            </label>
          </template>
        </div> -->
        <p
          class="flex-center info-exchange"
          v-if="realInfo.isoverseas || realInfo.exchange != 1"
        >
          <span v-if="realInfo.exchange != 1"
            >1{{ realInfo.currencyname }}兑换{{
              realInfo.exchange
            }}元人民币</span
          >
          <!--<span v-if="realInfo.referenceprice>0">国内参考价{{realInfo.referenceprice.toFixed(2)}}元</span>-->
        </p>
      </div>

      <!-- 店铺new -->
      <div class="store block_color">
        <div class="flex">
          <div class="flexRigth">
            <img
              class="avatar"
              v-lazy="https(realInfo.businessheadportraiturl)"
            />
            <div
              class="businesstype flex flex-center"
              :class="{
                'sp-official': busniessinfo.businesstype == 1,
                'sp-buy': busniessinfo.businesstype == 2,
                'sp-store': busniessinfo.businesstype == 3,
              }"
            >
              {{
                busniessinfo.businesstype == 1
                  ? "官方店"
                  : busniessinfo.businesstype == 2
                  ? "买手店"
                  : busniessinfo.businesstype == 3
                  ? "专营店"
                  : ""
              }}
            </div>
          </div>
          <div>
            <div class="row1 flex flex-btwn">
              <div class="flex">
                <div class="text">
                  <div
                    class="name"
                    @click.stop="gotoShopDetl(realInfo.businessid)"
                  >
                    {{ busniessinfo.businessname }}
                  </div>
                  <div
                    class="icon-right lookcount flex"
                    @click.stop="favorshop"
                  >
                    {{ busniessinfo.onlookercount }}人正在逛
                  </div>
                </div>
              </div>
              <div
                class="collection flex flex-center"
                :class="{ actCollection: busniessinfo.iscollection }"
                @click.stop="favorshop"
              >
                {{ busniessinfo.iscollection ? "已收藏" : "收藏" }}
              </div>
            </div>
            <div class="row2 flex">
              <div class="describe ellipsis-2">
                {{ busniessinfo.describe }}
              </div>
            </div>
          </div>
        </div>

        <div class="row3 shopbtngroup flex">
          <div class="btnItem">商品数量 {{ busniessinfo.productcount }}</div>
          <div class="btnItem">店铺销量 {{ busniessinfo.salecount }}</div>
          <div class="btnItem">店铺粉丝 {{ busniessinfo.fanscount }}</div>
        </div>
        <div class="divider"></div>
        <div class="row4">
          <div class="title">店铺推荐</div>
          <div class="carouselWrapper">
            <carousel :paginationEnabled="false" :per-page="2.65">
              <slide v-for="(ri, ridx) in recdlist" :key="ridx + 'ad'">
                <div class="productInfo" @click.stop="updetapage(ri.id)">
                  <img :src="https(ri.mainpic)" class="image" />
                  <div class="productTitle ellipsis-2">{{ ri.name }}</div>
                  <div class="price">
                    <span class="rmb" v-if="ri.specialprice > 0">¥</span>
                    <span v-if="ri.specialprice > 0">{{
                      ri.specialprice
                    }}</span>
                    <div
                      :class="ri.specialprice > 0 ? 'del' : ''"
                      style="margin-left: 14rpx; display: inline-block;"
                    >
                      <span class="rmb">¥</span>
                      {{ ri.saleprice }}
                    </div>
                  </div>
                </div>
              </slide>
            </carousel>
          </div>
        </div>
      </div>

      <!-- 热门推荐的产品 -->
      <!-- <div class="bt bus-rec" v-if="recdlist && recdlist.length">
        <div class="title">店铺推荐</div>
        <carousel :per-page="2.65">
          <slide v-for="(ri, ridx) in recdlist" :key="ridx + 'ad'">
            <div class="prd" @click.stop="updetapage(ri.id)">
              <div class="prd-img">
                <img :src="https(ri.mainpic)" />
              </div>
              <div
                class="ellipsis-2 prd-name"
                style="-webkit-box-orient: vertical;"
              >
                {{ ri.name }}
              </div>
              <div class="_pr">
                <span class="rmb" v-if="ri.specialprice > 0">¥</span>
                <span v-if="ri.specialprice > 0">{{ ri.specialprice }}</span>
                <div
                  :class="ri.specialprice > 0 ? 'del' : ''"
                  style="margin-left: 14rpx; display: inline-block;"
                >
                  <span class="rmb">¥</span>
                  {{ ri.saleprice }}
                </div>
              </div>
            </div>
          </slide>
        </carousel>
      </div> -->
      <!-- <div class="recomd gaps" v-if="relate&&relate.length>0">
        <p class="recomd_title">热门推荐</p>
        <Recomd-prods :recodsList="relate"></Recomd-prods>
      </div>-->
    </div>
    <!-- 回到首页按钮 -->
    <div class="back-newshome" v-if="!insq">
      <img :src="img" alt @click="backtoMall()" />
    </div>
    <!-- 商品详情和购买须知:delay="500"  -->
    <v-delay class="detail">
      <template v-if="showData">
        <!-- <div class="titleP clearfix fixedTop">
          <p @click="activeType=0">
            <span :class="{activeType:activeType==0}">商品详情</span>
          </p>
          <p @click="activeType=1">
            <span :class="{activeType:activeType==1}">购物须知</span>
          </p>
        </div>-->
        <div v-show="activeType == 0 && realInfo.description">
          <div class="detail-tit block_color">商品详情</div>
          <div class="product_des" v-html="https(realInfo.description)"></div>
        </div>

        <!-- <ShopNotice v-if="activeType==1"></ShopNotice> -->
        <!-- <div class="bee_box" v-if="realInfo.producttype ==5&&!insq" @click.stop.prevent="loadApp">
          <p class="left_bee font-price flex-center">
            <template v-if="!realInfo.isallexchange">¥{{realInfo.specialprice}}+</template>
            <em></em>
            &nbsp;{{realInfo.bees}}
          </p>
          <p class="right_bee">立即兑换</p>
        </div>-->
        <div class="clearFix">
          <!-- <div class="fixBottom clearFix" v-if="realInfo.cashtype==2">
            <span class="font-price">
              ¥{{realInfo.cashprice.toFixed(2)}} +
              <i class="icon_bee"></i>
              {{realInfo.cashbees}}
            </span>
            <span class="exchange">立即兑换</span>
          </div>-->
          <div class="footer_bot footer_bar fix-btm flex-between">
            <!-- :class="{noFavBtn:realInfo.producttype == 1,insq:insq}" -->
            <section class="icon_btn flex-ctr-start">
              <template>
                <div class="flex-aic-btwn _icon-txt">
                  <!-- <div class="sa div flex-col">
                    <span class="icon_service"></span>
                    客服
                  </div> -->
                  <div
                    @click.stop="gotoShopDetl(realInfo.businessid)"
                    class="sa div flex-col"
                  >
                    <span class="icon_shop"></span>
                    店铺
                  </div>
                  <div class="sp div flex-col" v-if="realInfo.producttype != 1">
                    <span
                      @click.stop="favProduct"
                      :class="{
                        out_fev: realInfo.pstatus == 3,
                        icon_fev: !realInfo.isfavor,
                        icon_isfev: realInfo.isfavor,
                        bs_animate: favShow,
                      }"
                    ></span>
                    收藏
                  </div>

                  <!-- <span
                  class="icon_server"
                  @click.stop="QiyuProd(realInfo)"
                  :class="{out_fev:realInfo.pstatus==1||realInfo.pstatus==2||evts.evtlimit||realInfo.type==1}"
                  ></span>-->
                  <!-- <div class="cart div flex-col" @click="gotocart">
                    <span class="icon_cart"></span>
                    <div class="txt">购物车</div>
                    <i class="flex-center" v-if="cartnum > 0">
                      <em class="flex-center">{{ cartnum }}</em>
                    </i>
                  </div> -->
                </div>
              </template>
            </section>
            <section
              class="btn_fix halfBtn flex"
              :class="{
                noFavBtn:
                  realInfo.producttype == 1 ||
                  realInfo.soldout ||
                  (realInfo.salestatus == 2 && realInfo.producttype != 7),
                insq: insq,
              }"
            >
              <div
                class="add_cart"
                v-if="
                  !(
                    realInfo.producttype == 1 ||
                    (realInfo.producttype == 0 && realInfo.salestatus == 2) ||
                    realInfo.noactivity ||
                    realInfo.soldout
                  )
                "
                @click="cartModel(0)"
              >
                加入购物车
              </div>
              <template
                v-if="
                  realInfo.soldout ||
                  (realInfo.salestatus == 2 && realInfo.producttype != 7)
                "
              >
                <div class="btn_fix noStartSoldout noCartBtn">
                  {{
                    realInfo.salestatus == 2 ? timeSale || "未开始" : "已售罄"
                  }}
                </div>
              </template>
              <template v-else>
                <div
                  class="btn_fix btn_buy"
                  :class="{
                    noCartBtn:
                      realInfo.producttype == 1 ||
                      (realInfo.producttype == 0 && realInfo.salestatus == 2) ||
                      realInfo.noactivity ||
                      realInfo.soldout,
                  }"
                  @click="cartModel(1)"
                >
                  立即购买
                </div>
              </template>
            </section>
          </div>
        </div>
      </template>
    </v-delay>

    <div class="loadError" v-if="error"></div>
    <!-- 点击礼券 点击领取弹框 v-if="evts.showEvtcoupon"-->
    <div
      v-show="showCoupons && evts.showEvtcoupon"
      class="show-cop fix-coupon"
      @click="showCoupon"
    >
      <transition name="fadeTuihuo">
        <div class="cont" @click.stop="showCoupon">
          <div class="close"></div>
          <div class="title flex flex-center">店铺优惠券</div>
          <div class="list">
            <CouponModal
              :cous="evts.evtcoupon"
              :isShow="true"
              v-show="showCoupons"
            ></CouponModal>
          </div>
        </div>
      </transition>
    </div>
    <!-- 全球购商品 弹框 -->
    <div
      class="promise contentText"
      @click.stop="globalShop()"
      v-if="salesShow"
    >
      <transition name="fadeTuihuo">
        <div class="read-buy" @click.stop="globalShop">
          <!-- <span class="close" @click.stop="globalShop"></span> -->
          <div class="read-buy-top" @click.stop="globalShop"></div>
          <div class="title">购物须知</div>
          <div class="content">
            <buydesc
              :title="true"
              :isaftersale="realInfo.isaftersale ? 1 : 2"
            ></buydesc>
          </div>
        </div>
      </transition>
    </div>
    <!-- 点击加入购物车 弹出购物车组件 -->
    <product-items
      v-if="css.showItems"
      :show="css.showItems"
      :helpType="true"
      :qrcodenumber="qrcodenumber"
      :product-info="realInfo"
      @close="itemsClose"
      :btntxt="btntxt"
    ></product-items>
  </div>
  <div v-else>
    <div class="no-data">
      <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt />
      <p>商品不存在或已下架</p>
    </div>
  </div>
</template>
<script>
import {
  NewDetail,
  DetailExpress,
  DetailFavor,
  ProdRelated,
} from "../../common/api/product";
import { QiyuProd } from "../../common/api/WyQiyu";
import { FavorProduct } from "../../common/api/userFavor";
import { Add as CartAdd } from "../../common/api/cart";
import { GetCouponInProduct } from "../../common/api/marketing";
import { GetProductDetailGroup } from "../../common/api/group";
import {
  uploadUserAction,
  GetProductSizeColor,
  GetBusinessInfo,
  BusRelated,
} from "../../common/api/product";
import {
  CutProductDetail,
  CutProductDetailOpen,
  StartCut,
} from "../../common/api/bargain";

import { FavorBusiness } from "../../common/api/userFavor";
import { GroupList } from "../../common/api/cart";
import ArticleLabel from "../templates/ArticleLabel";
import ProductUnit from "../templates/ProductUnit";
import ShopNotice from "../templates/ShopNotice";
import RecomdProds from "../templates/RecomdProds";
import { mapGetters } from "vuex";
import CouponModal from "../templates/CouponModal";
import GroupPopup from "../group/GroupPopUp";
// import CartModal from '../templates/CartModal'
import ProductItems from "@/comps/ProductItems";
import buydesc from "../templates/ShopNotice";
import {
  _getDate,
  DateDiff,
  APP,
  getUrlParam,
  DateFormat,
} from "../../common/util"; // DateFormat, ENUM,
import model from "../helpbargain/helppopmodel.vue";

import { MoreSetPoints, SetPoints } from "../../common/api/base";

import { Carousel, Slide } from "vue-carousel";
// const dom = window.document
const ls = window.localStorage;
const cartkey = "FC_LOCAL_CART";
let cleartimer = null;
export default {
  data() {
    return {
      btntxt: "",
      timer: new Date().getTime(),
      cutdowntimer: null,
      css: {
        // groupPopUp: false,
        // isShowGroup: false,
        // isShowGroupHaveList: false,
        // special: false,
        showItems: false,
        // isShowHelp: false,
        // cutType: 1 // 1 分享 3 发起助力 （没有助力的情况 进来的时候）
      },
      producttype: 0,
      buyingType: 0,
      // groupBuyType: 0, // 1 拼团 开团 2 拼团参团
      // groupBuyTeamId: 0,
      activited: false,
      // fixStyleExt: {},
      // scrollWatch: true,
      // titleFix: false,
      // activityTime: {},
      productInfo: {},
      evtcoupon: [],
      salesShow: false,
      prodSwiOption: {
        autoplay: 3500,
        loop: true,
        autoplayDisableOnInteraction: false,
        pagination: ".swiper-pagination",
        roundLengths: true,
        preloadImages: true,
        updateOnImagesReady: true,
        // scrollbar: ".swiper-scrollbar",
        scrollbarHide: false, // ,
        // scrollbarDraggable: true,
        // scrollbarSnapOnRelease: true
      },
      swItem: [],
      videoInfo: {
        videoPath: "",
        videoImg: "",
      },
      showPage: true,
      // screenWidth: '',
      labels: [],
      sizeList: {},
      showData: false,
      img: "//files.eyee.com/mcdn/static/img/home_b2c.png", // require('../../assets/img/home_b2c.png'),
      countDown: {},
      showTitle: false,
      activeType: 0,
      error: false,
      // isBegin: 0, // 0是正常,1是还没有开始,

      // popupVisible: false,
      hasdata: 1,
      // relativePods: [],
      favShow: false,
      // showcart: false,
      // purchaseNotesHash: false, // 购买须知
      timeSale: "",
      evtlimitType: null, // 限量发售结束时间显示类型：0: 大于一天 1: 小于一天
      evtlimitTime: "00:00:00",
      // groupProductDetailInfo: {
      //   pintuanId: "",
      //   teamprice: 999999,
      //   teamlimitcount: 99,
      //   teamtotalcount: 99,
      //   list: []
      // },
      // CutProductDetailInfo: {}, //助力砍价信息
      // groupList: [],
      distribution: null,
      isShare: true,
      // confirmAdress: false,
      // showBtn: 1,
      // cutText: "",
      // modelBgClassBG: "", // cutgoing进行中  cutOver活动结束 cutLater来晚了 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
      // cutGoingFail: false,

      iscut: false,
      cutminprice: 0, // 砍价 最低价
      sizeColor: {}, // 颜色尺码
      busniessinfo: {}, // 店铺信息
      recdlist: [], // 推荐商品
      cartnum: 0,
      Aharr: [
        { el: "product_sw", txt: "商品" },
        { el: "detail", txt: "详情" },
      ], // 锚点
      curah: 0,

      someLocalProperty: 0,
      qrcodenumber: "",
    };
  },
  components: {
    model,
    ArticleLabel,
    ProductUnit,
    ShopNotice,
    RecomdProds,
    CouponModal,
    ProductItems,
    GroupPopup,
    Carousel,
    Slide,
    buydesc,
  }, // CartModal,
  computed: {
    ...mapGetters({
      user: "userInfo",
      insq: "insq",
      userInfo: "userInfo",
      userDefaultAddress: "userDefaultAddress",
      discounts: "discounts", // 优惠 和红包id 和 用户优惠券标识
    }),
    currentwidth() {
      const width = 26.7,
        count = this.swItem.length + (this.videoInfo.videoImg ? 1 : 0),
        currentWidth = width / count;
      let dotalWidth = currentWidth * (this.someLocalProperty + 1);
      return dotalWidth || 0;
    },
    showCoupons() {
      let c = this.$store.state.product.showCoupons;
      this.$nextTick(() => {
        if (c) document.getElementById("page-footer").classList.add("lock");
        else document.getElementById("page-footer").classList.remove("lock");
      });

      return c;
    },
    prodId() {
      return this.$route.params.id;
    },
    // 首页猜你喜欢 埋点字段requestid
    requestid() {
      return this.$route.query.requestid;
    },
    issearchclick() {
      return this.$route.query.issearchclick;
    },
    // dealLocal() {
    //   return this.insq && !this.user.token
    // },
    evts() {
      let _ = this;
      let res = _.productInfo || {};
      let coupon = _.evtcoupon || [];
      let ret = {
        evtactivity: res.evtactivity,
        evtexpressfree: res.evtexpressfree,
        evtlimit: res.evtlimit,
        evtpromotion: res.evtpromotion,
        evtspecial: res.evtspecial,
        evtcoupon: coupon,
      };

      for (let k in ret) {
        let item = ret[k];
        if (item && item.id) {
          // 判断活动是否存在
          ret.hasactive = true;
          if (k == "evtlimit") {
            let diff = DateDiff({ destination: item.endtime, type: "d" });
            // console.log("diff--", diff);
            if (diff.d >= 1) {
              _.evtlimitType = 0;
              _.timeSale = `结束时间: ${DateFormat(
                item.endtime,
                "MM月dd日 HH:mm"
              )}`;
            } else {
              _.evtlimitType = 1;
              _.startClock(item.endtime);
            }
          } else {
            if (item.begintime)
              item.b = DateFormat(item.begintime, "MM月dd日 HH:mm");
            if (item.endtime)
              item.e = DateFormat(item.endtime, "MM月dd日 HH:mm");
          }
        }

        // console.log("item------", item);
      }

      if (ret.evtcoupon && ret.evtcoupon.length > 0) {
        // && !_.insq
        // 有礼券活动
        // ret.showEvtcoupon = true
        ret.showEvtcoupon = true;
        // console.log("res.specialprice-->>>", res);
        if (res.info && res.info.specialprice > 0 && res.info.producttype != 5)
          ret.hasactive = true;
        ret.evtcoupon = ret.evtcoupon.map((i) => {
          if (i.usecondition <= 0) i.txt = `¥${i.facevalue}无门槛券`;
          else i.txt = `满${i.usecondition}减${i.facevalue}`;
          return i;
        });
      }
      // console.log("computed evts ---", ret);
      // if (res.evtexpressfree) {
      //   // 包邮活动
      //   _.realInfo.showEvtexpressfree = true
      // }
      // console.log(ret,'ret=============================')
      return ret;
    },
    // ordertype() {
    //   let opt = 0;
    //   let _ = this;
    //   if (_.css.isShowGroup) {
    //     opt = _.groupBuyType;
    //   } else if (_.css.isShowHelp) {
    //     opt = 3;
    //     if (!_.CutProductDetailInfo.cutid) {
    //       opt = 0;
    //     }
    //   }
    //   return opt;
    // },
    realInfo() {
      let _ = this;
      // console.log('computed realInfo ---', _.productInfo)
      let res = _.productInfo;
      let info = (res && res.info) || {};
      let returnResult = {};
      if (res && res.info) {
        _.swItem = [];
        // "noactivity":"不参与的活动，空或null时 无，有0不使用优惠券，有1不包邮，竖线隔开"
        if (!_.sizeList.body) {
          try {
            _.sizeList = JSON.parse(info.sizedesc || "{}");
          } catch (e) {
            console.error("尺码表解析异常", e);
          }
          // console.log('尺码表--', _.sizeList)
        }

        _.swItem = (info.mainpic || "").split("|");
        var sharedes = APP.shareData.productDetail.desc;

        if (res.video && res.videoimg) {
          _.videoInfo.videoPath = res.video;
          _.videoInfo.videoImg = res.videoimg;
        }
        _.initShare({
          type: 1,
          info: { title: info.name, img: _.swItem[0], desc: sharedes },
        });
        _.setSharePoint(info.name);
        if (
          info.specialprice &&
          info.specialprice > 0 &&
          info.specialprice < info.saleprice &&
          info.producttype !== 5 &&
          info.producttype !== 10 &&
          info.producttype >= 0
        ) {
          info.realprice = info.specialprice;
          // _.css.special = true;
        } else {
          // _.css.special = false;
          info.realprice = info.saleprice;
        }
        // if (this.css.isShowHelp) {
        //   info.specialprice = 0;
        //   info.saleprice = this.CutProductDetailInfo.cutcurrentprice;
        // }
        // info.realprice = info.realprice.toFixed(2)
        // info.istax = true
        if (Number(info.exchange) !== 1) {
          // 国外商品
          info.isov = true;
          // info.isov = true // 加税
          // 国外产品 折合成人民币
          info.realpriceChia =
            Math.floor(info.overseasprice * info.exchange * 100) / 100; // .toFixed(2)
        } else {
          info.isov = false;
          // info.istax = false
          // 伪国内商品(exchange == 1 && isoversea == false)不加税	}
        }

        info.productid = info.id;
        // info.isglobalpurchase = info.isglobalpurchase
        // info.isdirectmail = info.isdirectmail
        // info.isaftersale = info.isaftersale
        // info.businessisglobalpurchase = info.businessisglobalpurchase
        // info.businesstype = info.businesstype
        if (
          info.salestatus === 2 &&
          info.producttype === 0 &&
          info.saletime &&
          !_.timeSale
        ) {
          _.countDownSale(info.saletime);
        }

        returnResult = info;

        _.labels = [
          { name: info.brandname, id: info.brandid },
          { name: info.categoryname, id: info.categoryid },
        ];
        // if (res.labels != null) {
        //   _.labels = _.labels.concat(res.labels)
        // }
        if (_.swItem && _.swItem.length <= 1) {
          _.showPage = false;
        }
        _.showData = true;
        // var dateTime = null;
        // var timeList = null;
        // if (res.evtlimit) {
        //   // 限量的时间
        //   timeList = res.evtlimit;
        // } else if (res.evtspecial) {
        //   // 鬼市特卖时间
        //   timeList = res.evtspecial;
        // } else if (res.evtpromotion) {
        //   // 促销时间
        //   timeList = res.evtpromotion;
        // } else if (res.evtactivity) {
        //   // 大促
        //   timeList = res.evtactivity;
        //   let bt = _getDate(timeList.begintime);
        //   let et = _getDate(timeList.endtime);
        //   _.activityTime = {
        //     begintimeMouth: bt.getMonth() + 1,
        //     begintimeHours: bt.getHours(),
        //     begintimeDate: bt.getDate(),
        //     begintimeMinutes: bt.getMinutes(),
        //     endtimeMouth: et.getMonth() + 1,
        //     endtimeHours: et.getHours(),
        //     endtimeDate: et.getDate(),
        //     endtimeMinutes: et.getMinutes()
        //   };
        // }
        // if (timeList && timeList.begintime) {
        //   var now = new Date();
        //   var begintime = new Date(_getDate(timeList.begintime));
        //   var t = now - begintime;
        //   if (t < 0) {
        //     this.isBegin = 1;
        //     dateTime = timeList.begintime;
        //   } else {
        //     this.isBegin = 0;
        //     dateTime = timeList.endtime;
        //   }
        // }
        // this.countDown = DateDiff({ destination: dateTime, type: "d" });
      }
      console.log("商品详情信息处理后: ", returnResult);
      return returnResult;
    },
    // relate() {
    //   return this.relativePods;
    // }
  },
  mounted() {
    let distribution = {
      id: getUrlParam("parentId"),
      commission: getUrlParam("commission"),
    };
    this.distribution = distribution;
    if (getUrlParam("commission")) {
      this.isShare = false;
    }
    // this.screenWidth = window.screen.width
    // this.getGroupProductDetail();
    this.getProductDetail();
    // console.log('_.$route.params.id',this.$route.params.id)
    // this.getCutProductDetail(); //砍价接口
    // if (this.$store.state.user.cutType) {
    //   this.confirmAdress = true; //弹框  确认收货地址
    // }
    // alert(JSON.stringify(this.user))
    // let _ = this
    // setTimeout(()=>{
    //     alert(JSON.stringify(_.user))
    // },2000)
    // var titleFixed = 0
    // 定时器，5S之后开始请求接口
    // this.timeRun = setTimeout(() => {
    //   this.getRelateds()
    //   titleFixed = dom.querySelector('.titleP').offsetTop
    // }, 2000)

    // console.log('mounted', '')
    window.addEventListener("scroll", this.scrollF);
    // window.addEventListener('scroll', () => {
    //   if (this.scrollWatch) {
    // if (titleFixed < 1) titleFixed = dom.querySelector('.titleP') && dom.querySelector('.titleP').offsetTop
    // var scrollTop = 0
    // if (dom.documentElement && dom.documentElement.scrollTop) {
    //   scrollTop = dom.documentElement.scrollTop
    // } else if (dom.body) {
    //   scrollTop = dom.body.scrollTop
    // }
    // if (scrollTop >= titleFixed) {
    //   this.titleFix = true
    //   if (this.insq) {
    //     this.fixStyleExt = { top: 0 }
    //   }
    // } else {
    //   this.titleFix = false
    // }
    // console.log(titleFixed)
    //   }
    // })

    this.$nextTick(() => {
      window.document.querySelector("body").classList.remove("waiting-product");
    });

    let co = this.discounts;
    co.isusecoup = true;
    co.redpacketids = [];
    // 优惠券id
    co.couponuserid = "";
    this.$store.dispatch("Discounts", co);

    // 埋点
    $log({
      e: "productDetail",
      p: { productID: this.prodId, type: "B2C" },
      t: 0,
      ext: 1,
    });
  },
  // beforeDestroy() {
  //   clearTimeout(this.timeRun)
  // },
  beforeDestroy() {
    // this.scrollWatch = false
    // console.log('destroyed', '')
    clearInterval(this.cutdowntimer);
    window.removeEventListener("scroll", this.scrollF);
    if (document.getElementById("page-footer"))
      document.getElementById("page-footer").classList.remove("lock");
  },
  methods: {
    startClock(endtime) {
      console.log("endtime", endtime);
      let _ = this;
      if (!endtime) {
        clearInterval(_.cutdowntimer);
        return;
      }
      _.cutdowntimer = setInterval(() => {
        const time = endtime.replace(/-/g, "/");
        let ms = Math.abs(new Date(time).getTime() - new Date().getTime());
        if (ms <= 0) {
          _.evtlimitTime = "00:00:00";
          clearInterval(_.cutdowntimer);
          return;
        }
        let hm = 1000,
          mi = hm * 60,
          hh = mi * 60,
          dd = hh * 24,
          day = parseInt(ms / dd),
          hour = parseInt((ms - day * dd) / hh),
          minute = parseInt((ms - day * dd - hour * hh) / mi),
          second = parseInt((ms - day * dd - hour * hh - minute * mi) / hm),
          endday = day <= 9 ? "0" + day : day,
          endhour = hour <= 9 ? "0" + hour : hour,
          endminute = minute <= 9 ? "0" + minute : minute,
          endsecond = second <= 9 ? "0" + second : second;

        _.evtlimitTime = `${endhour}:${endminute}:${endsecond}`;
      }, 1000);
    },
    openShowVideo() {
      this.$router.push({
        path: "/playProductVideo",
        query: this.videoInfo,
      });
    },
    pageChange(index) {
      let _ = this;
      _.someLocalProperty = index;
      console.log("index--->>", index);
    },
    getcartnum() {
      let _ = this,
        num = 0;
      if (_.user && _.user.uid)
        GroupList().then((res) => {
          if (res && res.length > 0) {
            res.map((i) => {
              if (i.items && i.items.length > 0) {
                i.items.map((p) => {
                  num += Number(p.count);
                  return p;
                });
              }
              return i;
            });
            _.cartnum = num;
          }
        });
    },
    gotocart() {
      this.$router.push("/cart");
    },
    getsizecolor() {
      let _ = this;
      GetProductSizeColor(_.prodId)
        .then((res) => {
          // console.log("size---color--", res);
          if (res) {
            if (res.colors && res.colors.length > 1) {
              _.sizeColor.list = res.colors;
              _.sizeColor.type = "color";
            } else {
              _.sizeColor.list = res.sizes;
              _.sizeColor.type = "size";
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 店铺信息
    businfo() {
      let _ = this;
      GetBusinessInfo(_.prodId)
        .then((res) => {
          console.log("店铺信息", res);
          if (res) _.busniessinfo = res;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 店铺收藏
    favorshop(e) {
      let _ = this,
        busniessinfo = _.busniessinfo;
      let businessid = busniessinfo.businessid,
        iscancel = busniessinfo.iscollection;
      if (_.user && _.user.uid) {
        FavorBusiness({ businessid, iscancel })
          .then((res) => {
            _.busniessinfo.iscollection = !iscancel;
          })
          .catch((e) => console.error(e));
      } else _.$router.push("/login");
    },
    // 推荐商品
    recdprd() {
      let _ = this;
      BusRelated(_.prodId)
        .then((res) => {
          console.log("推荐商品", res);
          if (res) {
            _.recdlist = res;
            _.recdlist = _.recdlist.map((i) => {
              i.mainpic = i.mainpic.split("|")[0];
              return i;
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    updetapage(id) {
      this.reset(() => {
        this.$router.replace("/productDetail/" + id);
      });
    },
    reset(call) {
      let _ = this;
      _.iscut = false;
      _.sizeColor = {}; // 颜色尺码
      _.$store.state.product.showCoupons = false;
      _.sizeColor = {};
      _.productInfo = {};
      _.someLocalProperty = 0;
      if (cleartimer) clearTimeout(cleartimer);
      call();
    },
    getCut() {
      let _ = this,
        iscut,
        { uid } = _.user;
      let req = uid ? CutProductDetail : CutProductDetailOpen;
      req({ productid: _.prodId })
        .then((res) => {
          console.log("CutInProduct res", res);
          if (res) {
            _.iscut = !!res.businesscutid;
            _.cutminprice = res.cutminprice;
          }
        })
        .catch((e) => {
          console.error("CutInProduct error", e);
        });
    },
    setSharePoint(title) {
      // 分享埋点
      let share = {
        sharePageName: window.location.href,
        sharePageType: 1,
        title: title,
        ID: 1,
      };
      $log({ e: "share", p: share, t: 0, ext: 1 });
    },
    // close(type) {
    //   if (type == 2) {
    //     this.$store.state.user.cutToastShare = true; // 进助力详情弹出分享
    //     this.$router.push(
    //       "/helpbargain/helpdetail/" + this.CutProductDetailInfo.cutid
    //     );
    //   } else if (type == 6) {
    //     this.$store.state.user.cutToastShare = false; // 进助力详情弹出分享
    //     this.$router.push(
    //       "/helpbargain/helpdetail/" + this.CutProductDetailInfo.cutid
    //     );
    //   } else if (type == 3) {
    //     this.$router.push("/helpbargain");
    //   }

    //   this.cutGoingFail = false;
    //   this.confirmAdress = false;
    // },
    countDownSale(saletime, type = 0) {
      let _ = this;
      let diff = DateDiff({
        destination: saletime,
        type: type == 1 ? "d" : "H",
      });

      if (diff.H <= 0 && diff.m <= 0 && diff.s <= 0) {
        if (cleartimer) clearTimeout(cleartimer);
        _.getProductDetail();
        return;
      }
      if (type == 1)
        _.timeSale = `距结束还剩 ${diff.H > 9 ? diff.H : "0" + diff.H}:${
          diff.m > 9 ? diff.m : "0" + diff.m
        }:${diff.s > 9 ? diff.s : "0" + diff.s}`;
      else
        _.timeSale = `距开售时间：${diff.H > 0 ? diff.H + "时" : ""}${
          diff.m > 0 ? diff.m + "分" : ""
        }${diff.s}秒`;
      //  console.log("countDownSale",  _.timeSale);
      cleartimer = setTimeout(() => {
        _.countDownSale(saletime, type);
      }, 1000);
    },
    getProductDetail() {
      // var productid = this.$route. params.id
      let _ = this;

      NewDetail(_.prodId, _.requestid, _.issearchclick)
        .then((res) => {
          console.log("商品详情", res);
          if (res && res.info) {
            _.hasdata = 1;
            _.productInfo = res;

            _.$nextTick(() => {
              // 获取物流
              if (res.info && res.info.expresstemplateid) {
                _.getExpress(res.info.expresstemplateid);
              }

              // 获取收藏信息
              _.getFavor();
              // 助力砍价
              _.getCut();
              // 获取尺码
              _.getsizecolor();
              // 购物车数量
              _.getcartnum();
              setTimeout(() => {
                // 获取券
                // if (!_.insq)
                _.getCoupon();

                // // 获取推荐
                // _.getRelateds();

                // 店铺信息
                _.businfo();

                // 推荐商品
                _.recdprd();
              }, 800);
            });
          } else {
            _.hasdata = 2;
            _.toast("商品不存在或已下架");
            // _.error = true
          }
          if (res.qrcodenumber) {
            _.qrcodenumber = res.qrcodenumber;
          }
        })
        .catch((e) => {
          this.toast("加载失败");
          console.error("商品详情异常", e);
        });
    },
    getExpress(expressTemplateId) {
      let _ = this;
      DetailExpress(expressTemplateId)
        .then((res) => {
          console.log("商品详情物流信息", res);
          if (res) _.productInfo.info = { ..._.productInfo.info, ...res };
        })
        .catch((e) => {
          console.error("物流信息加载失败", e);
        });
    },
    getFavor() {
      let _ = this;
      if (_.user.token) {
        DetailFavor(_.prodId)
          .then((res) => {
            console.log("商品详情收藏信息", res);
            if (res) _.productInfo.info = { ..._.productInfo.info, ...res };
          })
          .catch((e) => {
            console.error("收藏信息异常", e);
          });
      }
    },
    getCoupon() {
      let _ = this;
      _.evtcoupon = [];
      GetCouponInProduct(_.prodId)
        .then((res) => {
          console.log("商品详情优惠券", res);
          if (res) {
            _.evtcoupon = res;
            // this.hasdata = 1
          }
        })
        .catch((e) => {
          // this.hasdata = 2
          console.error("获取优惠券异常", e);
        });
    },
    goSearch(name, id) {
      var set = {};
      if (id) {
        set.brandid = id;
        set.brandName = name;
      } else {
        set.keyword = name;
      }
      this.$store.dispatch("confirOption", { data: set });
      this.$router.push("/mall/search/" + name);
    },
    goPlatFormActivity(id) {
      this.$router.push("/platformActivity/" + id);
    },
    backtoMall: function () {
      this.$router.replace("/");
    },
    gotoShopDetl: function (id) {
      this.$router.push("/shop/shopdetail/" + id);
    },
    showCoupon() {
      this.$store.state.product.showCoupons = !this.$store.state.product
        .showCoupons;
    },
    favProduct() {
      if (this.user.token) {
        var postData = {
          productid: this.realInfo.id,
          iscancel: this.realInfo.isfavor,
        };

        try {
          $log({
            e: "goodsCollect",
            p: { productid: postData.productid, type: "B2C" },
            t: 2,
            ext: 1,
          });
        } catch (err) {
          console.error("request error report error: ", err);
        }

        // console.log('收藏参数', postData)
        FavorProduct(postData)
          .then((res) => {
            this.favShow = true;
            setTimeout(() => {
              this.favShow = false;
              this.realInfo.isfavor = !this.realInfo.isfavor;
              this.toast((this.realInfo.isfavor ? "" : "取消") + "收藏成功");
            }, 500);
          })
          .catch((err) => {
            console.log("err", err);
            // this.toast(err.msg)
          });
      } else {
        // if (this.$root.ISWX) {
        //   this.$router.push('/wxlogin')
        // } else {
        //   this.$router.push('/login')
        // }
        this.$router.push("/login");
      }
    },
    scrollF() {
      let name = window.document.querySelector(".product_content");
      let rect = name && name.getBoundingClientRect();
      let t = (rect && rect.top) || 50;
      var winY = window.scrollY;
      if (winY && winY >= t) {
        this.showTitle = true;
      } else {
        this.showTitle = false;
      }

      let scol = window.document.querySelector(".detail").offsetTop;
      // console.log("scol--->>", scol);
      if (scol) {
        if (scol && winY > scol - 100) this.curah = 1;
        else this.curah = 0;
      }
    },
    tabs(el, index) {
      this.curah = index;
      let elem = "." + el;
      let scol = window.document.querySelector(elem);
      if (scol) {
        window.scrollTo(0, scol.offsetTop - 1 - (el === "detail" ? 68 : 0));
      }
    },
    goHost() {
      // this.$router.replace('/mall/ghost')
      this.$router.replace("/GhostProList?id=" + this.evts.evtspecial.id);
    },
    QiyuProd(info) {
      // 商品详情页面【分享】&【客服】点击操作调用埋点接口（
      let _ = this;
      let orderitem = _.realInfo;
      let extendid = "";
      extendid = orderitem.productid;
      // if (_.ordertype == 0) {
      //   extendid = orderitem.productid;
      // } else if (_.css.isShowHelp) {
      //   extendid = _.CutProductDetailInfo.cutid || _.$route.params.id;
      // } else if (_.css.isShowGroup) {
      //   extendid = _.groupProductDetailInfo.pintuanId || _.$route.params.id;
      // }
      uploadUserAction({ actiontype: 1, itemid: extendid })
        .then((res) => {})
        .catch((e) => {
          console.error(e);
        });
      var prodInfo = {};
      prodInfo.title = info.brandname;
      prodInfo.desc = info.name;
      prodInfo.picture = info.mainpic.split("|")[0];
      prodInfo.note =
        info.specialprice > 0 ? info.specialprice : info.saleprice;
      prodInfo.url = window.location.href;
      QiyuProd.call(this, prodInfo);
      // QiyuProd(prodInfo);
    },
    // getRelateds() {
    //   this.relativePods = [];
    //   ProdRelated({ ProductId: this.prodId })
    //     .then(res => {
    //       // console.log('相关推荐', res)
    //       if (res) {
    //         this.relativePods = res;
    //       }
    //     })
    //     .catch(e => {
    //       console.error("商品详情相关推荐异常", e);
    //     });
    // },

    cartModel(type) {
      let _ = this;
      // type 0 加入购物车，1 立即购买 2 我要开团 拼团 3 助力
      console.log("cartModel", type);
      if (type == 1) {
        _.btntxt = "立即购买";
      } else if (type == 0) {
        _.btntxt = "加入购物车";
      }
      // groupBuyType 1 开团 2 参团

      // if (_.realInfo.producttype == 10) {
      //   _.loadApp();
      //   return;
      // }
      _.buyingType = type;
      // _.groupBuyType = groupBuyType || 0;
      // _.groupBuyTeamId = groupBuyTeamId || 0;

      if (_.insq || _.user.token) {
        this.css.showItems = true;
        // if (!this.realInfo.isaftersale && !this.css.isShowHelp) {
        //   this.purchaseNotesHash = true;
        // } else {
        //   this.css.showItems = true;
        // }
      } else {
        // if (_.$root.ISWX) _.$router.push('/wxlogin')
        _.$router.push("/login");
      }

      /* this.showcart = true
        if (this.insq || this.user.token) { // 有用户信息
          this.$store.state.cart.showCartModel = true
          if (type == 0) this.$store.state.cart.cartType = ENUM.cartType.add.val
          if (type == 1) this.$store.state.cart.cartType = ENUM.cartType.buyNow.val
        } else {
          if (this.$root.ISWX) {
            this.$router.push('/wxlogin')
          } else {
            this.$router.push('/login')
          }
          // this.$router.push('/login')
        }*/
    },
    itemsClose(item) {
      let _ = this;
      _.css.showItems = false;
      sessionStorage.removeItem("cuttype", 1);
      if (item) {
        let type = _.buyingType;
        try {
          $log({
            e: "addCart",
            p: { productid: item.productitemid },
            t: 2,
            ext: 1,
          });
        } catch (err) {
          console.error("request error report error: ", err);
        }
        if (this.distribution) {
          item.prostatus = 0;
          item.distributionid = this.distribution.id;
        }

        // if (type == 3 && this.css.isShowHelp) {
        //   // 助力
        //   // alert(type);
        //   localStorage.setItem("helphand", JSON.stringify(item));
        //   this.$router.push({
        //     path: "/user/address",
        //     query: { cutType: 1 }
        //   });
        //   return;
        // }
        if (type === 0) {
          // if (_.dealLocal) _.addLocalCart(item)
          // else _.addCart(item)
          _.addCart(item);
        } else {
          _.buyNow(item);
        }
      }
    },
    addCart(item) {
      CartAdd(item)
        .then((res) => {
          console.log("✔购物车添加成功", res);
          this.toast("已成功添加到您的购物车!");
          this.getcartnum();
        })
        .catch((e) => {
          console.error("✖购物车添加失败", e);
          this.toast("购物车添加失败");
        });
    },
    addLocalCart(item) {
      console.log("--addLocalCart", item);
      let info = this.realInfo;
      let p = {
        businessid: info.businessid,
        businessname: info.businessname,
        businesstype: info.businesstype,
        isopen: true,
        createtime: "",
      };

      let cart = JSON.parse(ls.getItem(cartkey) || "[]");
      if (cart.length > 0) {
        let ok = false;
        cart = cart.map((c) => {
          if (c.businessid === p.businessid) {
            c.items = c.items.map((i) => {
              if (i.productitemid === item.productitemid) {
                ok = true;
                i.count += item.count;
              }
              return i;
            });

            if (!ok) c.items.unshift(item);

            ok = true;
          }
          return c;
        });
        if (!ok) cart.unshift({ ...p, items: [item] });
      } else cart = [{ ...p, items: [item] }];
      console.log("local add cart", cart);
      ls.setItem(cartkey, JSON.stringify(cart));
      this.toast("已成功添加到您的购物车!");
    },
    globalShop() {
      this.salesShow = !this.salesShow;
      this.$nextTick(() => {
        if (this.salesShow)
          document.getElementById("page-footer").classList.add("lock");
        else document.getElementById("page-footer").classList.remove("lock");
      });
    },
    goSeleSize(type) {
      // this.purchaseNotesHash = false;
      // if (this.css.isShowHelp && type === 1) {
      //   this.cutPayBuy();
      //   return;
      // }
      if (type === 1) {
        this.css.showItems = true;
      }
    },
    goSeleSizeNullFun() {},

    buyNow(item) {
      let _ = this;
      console.log("this.item", item);
      if (_.insq) {
        item.salemoney = item.saleprice;
        item.saleprice = item.price;
        item.specialprice = item.price;
        item.checked = true;
        item.isok = true;

        let tempTotalPrice = item.count * item.price;

        // if (_.css.isShowGroup && !_.css.special && _.buyingType === 2) {
        //   item.groupBuyType = _.groupBuyType;
        //   item.groupBuyTeamId = _.groupBuyTeamId;
        //   item.groupActivityId = _.groupProductDetailInfo.pintuanId;
        //   item.saleprice = _.groupProductDetailInfo.teamprice;
        //   item.specialprice = _.groupProductDetailInfo.teamprice;
        //   item.salemoney = _.groupProductDetailInfo.teamprice;
        //   item.referenceprice = _.productInfo.info.saleprice;
        //   tempTotalPrice = item.count * _.groupProductDetailInfo.teamprice;
        // }
        let pay = {
          ...item,
          id: item.productid,
          allPay: tempTotalPrice,
          item: [item],
        };

        _.$store.dispatch("setOrderCoupon", {
          canUseCoupon: [],
          unCanUseCoupon: [],
        });
        _.$store.state.order.selectedCoupon = {};
        console.log("buyNow", pay);
        _.$store.dispatch("setOrderOut", { ...pay });
        _.$store.dispatch("setFromeType", 1);

        _.$router.push("/order/checkout");
      } else {
        _.$store.dispatch("updPayingOrder", "");
        _.buyparams(item.count, item.productitemid);
      }
    },
    buyparams(count, productitemid) {
      console.log("--buyNow-------------------: ", this.realInfo);
      let _ = this;
      let orderitem = _.realInfo;
      let extendid = null;
      extendid = orderitem.productid;
      // if (_.ordertype == 0) {
      //   extendid = orderitem.productid;
      // } else if (_.css.isShowHelp) {
      //   extendid = _.CutProductDetailInfo.cutid || _.$route.params.id;
      // } else if (_.css.isShowGroup) {
      //   extendid = _.groupProductDetailInfo.pintuanId || _.$route.params.id;
      // }
      orderitem.producttype =
        orderitem.producttype == 5 ? 0 : orderitem.producttype;
      let productitems = [
        {
          productitemid: productitemid, // "商品子项id",
          count: count || 1, // "int 数量",
          producttype: orderitem.producttype, // "int 商品类型"
        },
      ];

      _.$router.push({
        path: "/order/NewCheckout",
        query: {
          productitems: encodeURIComponent(JSON.stringify(productitems)),
          ordertype: 0, //  "int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",
          extendid: extendid, //      "扩展id （根据ordertype和producttype决定具体类型的id：例：productid、activityid、teamid、cuttingid)"
        },
      });
    },
  },
  watch: {
    "$route.params.id": function (val, old) {
      // console.log('watch prodId', val, old, this.$route.name)
      if (this.$route.name === "product-detail" && val && val !== old) {
        this.getProductDetail();
      }
    },
  },
};
</script>
<style lang="scss">
// .ellipsis-2{
//     overflow: hidden;
//     text-overflow: ellipsis;
//     display: -webkit-box;
//     -webkit-line-clamp: 2 !important;
// }
.page-footer {
  background: #191919;
  color: #fff;
}

.block_color {
  background: #232323;
}

.divider {
  margin: 0 4vw;
  border-top: 1px solid #1e1e1e;
}

.page-footer.lock {
  height: 100vh;
  overflow: hidden;
}

.carousel_spotWrapper {
  width: 100%;
  height: 5.3vw;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.carousel_spot {
  width: 26.7vw;
  height: 1.067vw;
  background: #505050;
  border-radius: 3px;
  display: flex;
  &.position {
    position: absolute;
    bottom: 0;
    background: transparent;
    .itempos {
      height: 1.067vw;
      flex: 1;
    }
  }
  .item {
    height: 1.067vw;
    transition: all 0.2s;
    border-radius: 3px;
  }
  .item.act {
    background: #fff;
  }
}

.icon-right:after {
  content: "";
  display: inline-block;
  margin-left: 1.6vw;
  width: 3.2vw;
  height: 3.2vw;
  background: url('../../../static/imgs/mall/icon_more_righ.png') no-repeat;
  background-size: contain;
}

.porductCart {
  .activityPhoto {
    width: 100%;
    height: 25vw;
    .image {
      width: 100%;
      height: auto;
    }
  }
  .limitTimeSale {
    width: 100%;
    color: #fff;
    font-size: 3.73vw;
    background: linear-gradient(to right, #4b412a, #b9a267 52%, #4b412b);
    padding: 2.67vw 4vw;
    .col1 {
      font-weight: 600;
    }
    .col2 {
      font-weight: 400;
      .black_block {
        display: inline-block;
        width: 3.2vw;
        height: 5.867vw;
        border-radius: 0.8vw;
        background: #000;
        font-family: OswaldBold;
        font-weight: 700;
        font-size: 3.73vw;
        margin-left: 0.53vw;
        text-align: center;
        line-height: 5.867vw;
      }
    }
  }
  .couponsWrapper {
    align-items: center;
    padding: 2.13vw 4vw;
    .col1 {
      height: 7.2vw;
      .couponsleft::before {
        content: "";
        display: inline-block;
        width: 3.2vw;
        height: 100%;
        background: url("../../../static/imgs/mall/image_left.png") no-repeat;
        background-size: cover;
      }
      .couponsright::after {
        content: "";
        display: inline-block;
        width: 11.47vw;
        height: 100%;
        background: url("../../../static/imgs/mall/image_right.png") no-repeat;
        background-size: contain;
        margin-right: 2.67vw;
      }
      .coupons {
        height: 7.2vw;
        box-sizing: border-box;
        line-height: 7.2vw;
        box-sizing: border-box;
        border-top: 1px solid #c8af6e;
        border-bottom: 1px solid #c8af6e;
        background: rgba(200, 175, 110, 0.15);
        display: inline-block;
        padding-right: 1.6vw;
        font-size: 3.2vw;
        color: #c8af6e;
        font-weight: 400;
        white-space: nowrap;
      }
    }
    .col2 {
      color: #969696;
      font-size: 2.93vw;
      font-weight: 400;
      white-space: nowrap;
    }
  }
  .cartIcon {
    position: relative;
    .circle {
      width: 5.3vw;
      height: 5.3vw;
      line-height: 5.3vw;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 50%;
      background: #c8af6e;
      font-size: 2.93vw;
      color: #000;
      font-family: OswaldBold;
      position: absolute;
      top: 1.867vw;
      right: 1.867vw;
    }
  }
}

.product_info {
  width: 100%;
  padding: 5.3vw 4vw;
  position: relative;
  .row1 {
    .col1 {
      background: linear-gradient(#505050 0%, #3c3c3c);
      border-radius: 3.2vw;
      padding: 1vw 2.67vw 3.467vw 2.67vw;
      position: relative;
      max-width: 170px;
      .image {
        width: 9.867vw;
        height: 4.8vw;
        position: absolute;
        top: 0;
        right: 0;
      }
      .price {
        white-space: nowrap;
        font-family: OswaldBold;
        font-size: 8.5vw;
        font-weight: 700;
        background: linear-gradient(#f5e6aa, #876e37);
        -webkit-background-clip: text;
        // line-height: 7.2vw;
        color: transparent;
        .rmb {
          font-size: 3.8vw;
        }
      }
      .qr {
        padding: 1.33vw;
        background: #fff;
        border-radius: 1.6vw;
        .qr_brand {
          position: relative;
          margin-right: 10px;
          border-radius: 4px;
          &:after {
            content: "";
            width: 45px;
            height: 45px;
            opacity: 0.05;
            background: #000000;
            border-radius: 4px;
            position: absolute;
            top: 0;
            left: 0;
          }
          .brand_img {
            width: 45px;
            height: 45px;
            border-radius: 4px;
          }
        }
        .qrcode {
          color: #282828;
          font-size: 2.4vw;
          font-weight: 600;
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .col2 {
      margin-left: 4vw;
      font-size: 3.73vw;
      color: #fff;
      line-height: 5.3vw;
      .item {
        margin-bottom: 2.67vw;
        .saleprice {
          text-decoration: line-through;
        }
      }
      .shop-tip {
        display: flex;
        align-items: center;
      }
    }
  }
  .row2 {
    margin-top: 4vw;
    align-items: center;
    .image {
      width: 6.93vw;
      height: 6.93vw;
      display: inline-block;
    }
    .row2-right {
      flex: 1;
    }
    .btngroup {
      max-width: 50vw;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .lastbtn {
      margin-left: 2.67vw;
    }
    .btnItem {
      padding: 1.6vw 2.67vw;
      background: #3c3c3c;
      border-radius: 1.6vw;
      font-size: 3.467vw;
      white-space: nowrap;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .btnItem:not(:last-child) {
      margin-right: 1.6vw;
    }
  }
}

.store {
  padding: 4vw 0;
  margin-top: 2.67vw;
  .flexRigth {
    min-width: 19.73vw;
    padding: 0 2.93vw 0 4.267vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar {
      width: 12.53vw;
      height: 12.53vw;
      display: inline-block;
      border-radius: 50%;
    }
    .businesstype {
      height: 4.8vw;
      width: 11.2vw;
      line-height: 4.8vw;
      text-align: center;
      border-radius: 0.53vw;
      font-size: 2.93vw;
      white-space: nowrap;
      margin-top: 7px;
      &.sp-official {
        background: linear-gradient(#9e414e, #e08c8c);
      }
      &.sp-buy {
        background: linear-gradient(#879bb9, #46557d);
      }
      &.sp-store {
        background: linear-gradient(#22515b, #739fa4);
      }
    }
  }

  .row1 {
    padding: 0 4.267vw 0 0 ;
    .text {
      .name {
        color: #fff;
        font-size: 4.267vw;
        font-weight: 600;
      }
      .lookcount {
        color: #969696;
        font-weight: 600;
        font-size: 3.467vw;
        align-items: center;
      }
    }
    .collection {
      background: #000;
      border-radius: 50px;
      padding: 2.4vw 4.8vw;
      font-size: 4.267vw;
      color: #c8af6e;
      font-weight: 600;
      margin-right: 0.8vw;
      height: 10.67vw;

      &:before {
        content: "";
        display: inline-block;
        width: 5.867vw;
        height: 5.967vw;
        background: url("../../../static/imgs/mall/icon_star.png") no-repeat;
        background-size: contain;
        margin-right: 0.8vw;
      }

      &.actCollection::before {
        background: url("../../../static/imgs/mall/icon_star_act.png") no-repeat;
        background-size: contain;
      }
    }
  }
  .row2 {
    padding: 0 4.267vw 0 0 ;
    margin-top: 1.6vw;

    .describe {
      font-size: 3.476vw;
      color: #c8c8c8;
      font-weight: 400;
    }
  }
  .row3.shopbtngroup {
    margin-top: 2.67vw;
    background: linear-gradient(to right, #232323, #323232 52%, #232323);
    color: #969696;
    font-weight: 400;
    font-size: 3.2vw;
    margin-bottom: 4vw;
    .btnItem {
      flex: 1;
      padding: 1.867vw 6.93vw;
      white-space: nowrap;
      text-align: center;
    }
  }
  .row4 {
    margin-top: 2.67vw;
    .title {
      padding: 4vw;
      font-size: 4.8vw;
      font-weight: 600;
    }
    .productInfo {
      width: 32vw;
      .image {
        width: 32vw;
        height: 32vw;
        border-radius: 2.67vw;
      }
      .productTitle {
        width: 100%;
        margin-top: 2.67vw;
        font-size: 3.467vw;
        color: #c8c8c8;
        font-weight: 400;
      }
      .price {
        margin: 1.6vw 1.6vw 1.6vw 0;
        font-family: OswaldBold;
        font-size: 3.73vw;
        font-weight: 700;
        .rmb {
          font-size: 2vw;
        }
      }
    }
    .carouselWrapper {
      padding: 0 4vw;
    }
  }
}

/* .swiper-pagination {
  position: absolute;
  left: 50%;
  bottom: 8vw;
  transform: translateX(-50%);
}
.swiper-pagination-bullet {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: rgba(210, 209, 209, 0.5);
}
.swiper-pagination-bullet-active {
  width: 4.266vw;
  background: #f5f5f5 !important;
}
.info-price .swiper-pagination-bullet {
  display: none;
} */
.product_sw .VueCarousel-pagination {
  position: absolute;
  left: 50%;
  bottom: 8vw;
  transform: translateX(-50%);
}
.product_sw .VueCarousel-pagination .VueCarousel-dot {
  width: 6px !important;
  height: 6px !important;
  padding: 0 !important;
  margin-top: 0 !important;
  margin-right: 7px;
  border-radius: 3px !important;
}
.product_sw .VueCarousel-pagination .VueCarousel-dot--active {
  width: 4.266vw !important;
  background: #f5f5f5 !important;
}
.product_sw .VueCarousel-slide {
  max-height: 100vw;
}
.bus-rec .VueCarousel-pagination {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.product_content {
  // padding-top: 48px;
  overflow: hidden;
}
.tabs {
  position: fixed;
  width: 100%;
  left: 0;
  top: -60px;
  height: 11.733vw;
  // background: #fff;
  transition: opacity 1s linear;
  z-index: 6;
  opacity: 0;
  font-size: 12px;
  // box-shadow: 0px 0px 5px #ccc;
}
.tabs.act {
  opacity: 1;
  top: 0;
}
.tabs span {
  flex: 1;
  color: #969696;
  font-size: 4vw;
  font-weight: bold;
  position: relative;
  line-height: 5.6vw;
}
.tabs span.act {
  color: #fff;
}
.tabs span.act::before {
  content: "";
  position: absolute;
  width: 6.933vw;
  height: 3px;
  background: #232323;
  left: 50%;
  bottom: -3px;
  transform: translateX(-50%);
}
.bt {
  border-bottom: 2.66vw solid #f5f5f5;
}

/* @import "../../assets/css/my-mint.css"; */
.fadeTuihuo-enter-active,
.fadeTuihuo-leave-active {
  transition: opacity 0.3s;
}
.fadeTuihuo-enter,
.fadeTuihuo-leave-to {
  opacity: 0;
}
.cutModel-enter-active,
.cutModel-leave-active {
  transition: opacity 0.3s;
}
.cutModel-enter,
.cutModel-leave-to {
  opacity: 0;
}
.BusinessIsGlobalPurchase {
  overflow: hidden;
  font-size: 12px;
  padding: 15px 20px 15px 20px;
  background: #fff;
  /* margin-top: 10px; */
}
.BusinessIsGlobalPurchase > div {
  float: left;
  /* overflow: hidden; */
}
.BusinessIsGlobalPurchase > div.shopTLD {
  color: #fff;
  font-size: 20px;
  line-height: 40px;
  font-family: DINOT-CondBlack;
  text-align: center;
  background: #000000;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
}
.BusinessIsGlobalPurchase > div.businesstype {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
  margin-left: 10px;
  margin-top: -4px;
}
.BusinessIsGlobalPurchase > div.businesstype span {
  width: 56px;
  height: 24px;
  /* display: inline-block; */
  float: left;
  transform: rotate(6deg) scale(0.8);
  /* border-radius:2px; */
  margin-top: 3px;
}
.BusinessIsGlobalPurchase > div.businesstype .globalLogo {
  background: url("//files.eyee.com/mcdn/static/img/globalbuy.png") 0 0
    no-repeat;
  background-size: cover;
  /* color: #000; */
}
.BusinessIsGlobalPurchase > div.businesstype .storeLogo {
  background: url("//files.eyee.com/mcdn/static/img/official.png") 0 0 no-repeat;
  background-size: cover;
}
.BusinessIsGlobalPurchase > div.businesstype .buyLogo {
  background: url("//files.eyee.com/mcdn/static/img/buyshop.png") 0 0 no-repeat;
  background-size: cover;
}
.BusinessIsGlobalPurchase > div.businesstype .patentLogo {
  background: url("//files.eyee.com/mcdn/static/img/monopoly.png") 0 0 no-repeat;
  background-size: cover;
}
.BusinessIsGlobalPurchase > div.go-stroll {
  float: right;
  border: 1px solid #ffc700;
  border-radius: 100px;
  font-size: 12px;
  color: #ffc700;
  width: 62px;
  margin-top: 10px;
  line-height: 22px;
  text-align: center;
}
.isglobalpurchase {
  padding-left: 10px;
  position: relative;
  line-height: 24px;
  margin-top: 10px;
  display: block;
}
.isglobalpurchase:before {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  left: 0;
  top: 9px;

  background: #ffc700;
}
.fixnav {
  position: fixed !important;
  background: transparent;
}
.top_btns {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 48px;
  top: 0;
  left: 0;
}
.swiper-pagination {
  z-index: 2;
}
.prod_promotion {
  position: absolute;
  /*height:50px;*/
  bottom: 0;
  width: 100%;
  z-index: 1;
}
// .activity {
//   font-size: 0.75rem;
//   color: #333;
// }
.right {
  border: solid #fa4b4b;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 0.65vw;
  transform: rotate(-45deg);
  margin-right: 2px;
  margin-left: 0.8vw;
}
.activity .moregoods {
  // color: #ffc700;
  float: right;
  font-weight: normal;
}
.activity .txt {
  font-size: 13px;
  font-weight: normal;
}
i {
  font-style: normal;
}

.productDetail {
  margin-top: 0 !important;
  overflow-y: scroll;
}

.nav-top {
  transition: backgroundColor 0.2s ease;
}
.productDetail .nav-top {
  background-color: #fff !important;
}

.nav-top img {
  width: 40px !important;
  height: auto;
}

.cartBox {
  height: 48px;
  margin-right: 10px;
}
.rmb {
  font-size: 4.8vw;
  transform: scale(0.833);
}
.info-price {
  font-family: "OswaldBold";
  padding-bottom: 2.66vw;
  overflow: hidden;
  // display: inline-block;
  // font-size: 16px;
  // background: #eee;
  // padding: 0px 30px;
  // padding-right: 10px;
  // height: 42px;
  // line-height: 42px;
  // text-align: center;
  // margin-top: 10px;
}

.info-price .label {
  margin-left: 2.66vw;
  margin-top: 1.066vw;
}
.info-saleprice {
  font-size: 6.4vw;
}
.info-saleprice.red {
  color: #fa4b4b;
  font-size: 6.4vw;
  font-family: "OswaldBold";
  margin: 2px 2.66vw;
  margin-left: 1.33vw;
}
.info-saleprice.red .pr {
  position: relative;
  top: 2px;
}
.info-saleprice.red .rmb {
  font-size: 3.733vw;
}
.info-saleprice.no-price,
.info-saleprice.no-price .rmb {
  font-size: 4.266vw;
  font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
}

.sea,
.state {
  display: inline-block;
  transform: translateY(-5px);
}

.state {
  border: 1px solid #333;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  margin-left: 3px;
  font-size: 1rem;
}

/* .productDetail .taxPrice {
  font-size: 22px;
}

.specialprice {
  font-size: 1rem;
} */

.product_name {
  font-weight: 600;
  padding: 4.267vw 4vw;
  font-size: 3.476vw;
  text-align: left;
  flex-basis: 90%;
  max-height: 13.33vw;
}

.shoppingCart {
  width: 8vw;
  height: 8vw;
  margin: 3.2vw 4vw 0 0;
}

.globalShop {
  /* display: flex; */
  background: #fff;
  overflow: hidden;
  padding: 2.66vw 4vw;
  // border-top: 2.66vw solid #f5f5f5;
  /* margin-bottom: 10px;
  margin-top: 10px; */
}
.globalShop .sec {
  height: 9.6vw;
}
.globalShop .sec .tit {
  color: #646464;
  font-size: 3.466vw;
}
.globalShop .sec .txt {
  color: #232323;
  font-size: 3.466vw;
}
.globalShop .sec:last-child .txt {
  padding-right: 0.6vw;
}
.globalShop .right {
  border: solid #969696;
  margin-left: 0.8vw;
  border-width: 0 2px 2px 0;
  /* float: left; */
  /* width: 25%; */
  // text-align: center;
  // line-height: 30px;
  // font-size: 10px;
  // position: relative;
  // padding-left: 18px;
  // padding-right: 5px;
  // flex: 1;
}
.globalShop .sec .txt span {
  position: relative;
}
.globalShop .sec .txt span:first-child i {
  position: absolute;
  width: 5.866vw;
  height: 5.866vw;
  background: url("https://files.eyee.com/mcdn/img/prddetail/icon_tick.png")
    center center no-repeat;
  background-size: 100% 100%;
  left: -5.866vw;
  top: 50%;
  transform: translateY(-50%);
}
.globalShop .sec .txt span:first-child i.no {
  background: url("https://files.eyee.com/mcdn/img/prddetail/icon_no.png")
    center center no-repeat;
  background-size: 100% 100%;
}
// .product_name section:nth-of-type(1) {
//   font-weight: 600;
//   margin: 10px auto;
//   line-height: 20px;
//   font-size: 15px;
// }

.show-size {
  padding: 2.66vw 4vw 3vw;
}

.show-size .pi-serv {
  margin-bottom: 0.8vw;
  color: #646464;
  font-size: 3.466vw;
  height: 9.6vw;
  padding-right: 0.6vw;
}
.show-size .pi-serv .right {
  border: solid #969696;
  margin-left: 0.8vw;
  border-width: 0 2px 2px 0;
}
.show-size .size span {
  display: inline-block;
  background: #f5f5f5;
}
.show-size .size span.img {
  margin-left: 1.2vw;
  margin-bottom: 1vw;
}
.show-size .size span.img:first-child {
  margin-left: 0;
}
.show-size .size span i,
.show-size .size span.total {
  padding: 1.6vw 2.922vw;
  border-radius: 2px;
  margin-left: 1.2vw;
  color: #969696;
  font-size: 3.466vw;
  height: 100%;
}
.show-size .size span img {
  width: 8vw;
  display: block;
  border-radius: 2px;
}
.send {
  margin-right: 5.866vw;
  position: relative;
}
.send::after {
  content: "";
  position: absolute;
  width: 1px;
  background: #e6e6e6;
  height: 4.266vw;
  top: 50%;
  right: -3.733vw;
  transform: translateY(-50%);
}
.send::before {
  content: "";
  position: absolute;
  width: 5.866vw;
  background: url("https://files.eyee.com/mcdn/img/prddetail/icon_place.png") 0
    0 no-repeat;
  background-size: 100% 100%;
  height: 5.866vw;
  top: 50%;
  left: -5.866vw;
  transform: translateY(-50%);
}

.pi-shop {
  padding: 4vw 4vw 2.66vw 4vw;
}

.pi-shop-avta {
  width: 10.1333vw;
  height: 10.1333vw;
  margin-right: 2.666vw;
  border-radius: 0.533vw;
  border: 1px solid #e6e6e6;
}

.pi-shop .businessname {
  color: #232323;
  font-size: 4.2666vw;
  font-weight: bold;
}

.businessname .busn {
  width: 24vw;
}

.pi-shop .save {
  color: #646464;
  font-size: 3.466vw;
}

.pi-shop .top {
  margin-bottom: 2.66vw;
}

.pi-shop .dec {
  color: #969696;
  font-size: 3.733vw;
  margin-bottom: 2.66vw;
}

.pi-shop .save img {
  width: 4.8vw;
  height: 4.8vw;
  margin-right: 1.33vw;
}

.pi-shop-link {
  font-size: 3.2vw;
  padding: 1.06vw 2.133vw 1.06vw 1.6vw;
  color: #fa4b4b;
  border: 1px solid #fa4b4b;
  border-radius: 0.533vw;
  height: 6.933vw;
  font-weight: bold;
}

.bus-info {
  margin-bottom: 2.66vw;
  background: #f5f5f5;
  border-radius: 0.533vw;
  padding: 2.66vw 0;
}

.bus-info .num {
  flex: 1;
  color: #969696;
  font-size: 3.2vw;
  position: relative;
}

.bus-info .num:nth-child(2)::before,
.bus-info .num:nth-child(2)::after {
  content: "";
  width: 1px;
  height: 8.533vw;
  background: #e6e6e6;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.bus-info .num:nth-child(2)::after {
  content: "";
  left: auto;
  right: 0;
}

.bus-info .num span:first-child {
  color: #646464;
  font-size: 4.266vw;
  font-weight: bold;
}
.bus-rec {
  padding: 2.66vw 15px 5.333vw;
}

.bus-rec .title {
  color: #232323;
  font-weight: bold;
  font-size: 5.33vw;
  margin: 2.933vw 0 4vw 0;
}

.bus-rec .prd {
  width: 32vw;
}

.bus-rec .prd .prd-img {
  width: 32vw;
  height: 32vw;
  overflow: hidden;
  height: 32vw;
  margin-bottom: 2.66vw;
}

.bus-rec .prd .prd-name {
  color: #232323;
  font-size: 3.466vw;
  padding-right: 2.66vw;
  margin-bottom: 1.7333vw;
  height: 10.066vw;
}

.bus-rec .prd ._pr {
  color: #232323;
  font-size: 4.8vw;
  font-family: OswaldBold;
}
.bus-rec .prd ._pr .rmb {
  font-size: 3.733vw;
}
// -------------------------------------------------------------------------------
.time_color {
  // color: #af3c03;
  font-weight: normal;
}

// .product_name section:nth-of-type(2) {
//   font-size: 0.75rem;
//   color: #666;
//   padding-bottom: 20px;
// }

// .Ev {
// padding: 5px 0 5px 20px;
/* margin: 10px 0; */
// }

.productDetail .hasEv {
  font-size: 3.7333vw;
  // display: flex;
  // align-items: center;
  // margin: 10px auto;
  // height: 10.666vw;
  background: #ffefef;
  color: #fa4b4b;
  padding: 0 4vw;
  font-weight: bold;
  line-height: 10.666vw;
}
.productDetail .hasEv.cop {
  background: #fff;
  height: 14.933vw;
}
.productDetail .hasEv.cop .cop {
  height: 100%;
}
.productDetail .hasEv > span {
  background-repeat: no-repeat;
  display: inline-block;
  width: 34px;
  height: 16px;
  background-size: 100%;
  margin-right: 5px;
}
.productDetail .hasEv .title {
  font-weight: normal;
  color: #646464;
  font-size: 3.466vw;
}
.productDetail .hasEv span i {
  display: inline-block;
  padding: 1.066vw 2.133vw;
  margin-left: 1.333vw;
  background: #fa4b4b;
  color: #fff;
  font-size: 12px;
  position: relative;
  // overflow: hidden;
}
.productDetail .hasEv span i::before,
.productDetail .hasEv span i::after {
  content: "";
  position: absolute;
  width: 3.2vw;
  height: 3.2vw;
  background: #fff;
  border-radius: 50%;
  left: -1.6vw;
  top: 50%;
  transform: translateY(-50%);
}
.productDetail .hasEv span i::after {
  content: "";
  left: auto;
  right: -1.6vw;
}
.productDetail .hasEv .ellipsis {
  max-width: 64vw;
}
.icon_gift {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_gift.png");
}

.icon_free {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_free.png");
}

.icon_limit {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_limit.png");
}

.icon_sale {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_sale.png");
}

.icon_special {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_special.png");
}
.icon_activity {
  background-image: url("//files.eyee.com/mcdn/static/img/icon_activity.png");
  align-self: flex-start;
}
.product_logo {
  text-align: center;
  /* margin-top: 10px; */
  padding-top: 15px;
  /* margin-bottom: 10px; */
}

.product_logo .logo_img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 1px solid #eee;
  overflow: hidden;
  margin: 6px auto;
}

.logo_img img {
  width: 100%;
  min-height: 100%;
}

.product_logo p:nth-of-type(1) {
  padding-bottom: 10px;
  font-weight: bold;
}

.product_logo p:nth-of-type(2) {
  padding: 5px 16% 20px 16%;
  font-size: 0.75rem;
}

.busName {
  position: relative;
  font-size: 0.875rem;
  padding: 15px 20px;
  margin: 10px 0;
}

.busName span {
  position: absolute;
  right: 10px;
  color: #ccc;
}
.busName > label {
  display: inline-block;
  padding: 0 3px;
  font-size: 11px;
  color: #fff;
  background: #d99485;
  border-radius: 2px;
  margin-right: 5px;
}
.busName > label.buyers {
  background: #e6cb5b;
}
.product_spanure section:nth-of-type(1) {
  padding: 20px 20px;
  font-size: 0.875rem;
  text-align: center;
}

.product_spanure section:nth-of-type(1) p {
  line-height: 26px;
  color: #000;
}

.product_spanure section:nth-of-type(1) span {
  color: #666;
  margin-left: 5px;
}

.labels {
  padding: 15px 20px 5px 20px;
  border: 1px solid #f2f2f2;
  border-left: none;
  border-right: none;
}

.labels li {
  background-color: #333;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding: 0 5px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.sizeList {
  padding: 0px 10px 18px 10px;
}

.sizeList table {
  width: 100%;
  border-collapse: collapse;
}

.sizeList table td {
  border: 1px solid #f2f2f2;
  text-align: center;
  color: #666;
  font-size: 0.75rem;
  width: 10%;
}

.sizeList table tr {
  height: 24px;
}

.sizeHead {
  background: #f2f2f2;
}

.recomd p {
  font-size: 0.94rem;
  margin-bottom: 20px;
}

.recomd p:after {
  margin-left: 10px;
}
.recomd .recomd_title {
  margin-left: 10px;
}
.icon_btn {
  float: left;
  // width: 36%;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2px;
}
.icon_btn.insq .favor {
  width: 30%;
  text-align: center;
}
.icon_btn:not(.insq) span,
.icon_btn.insq .icon_fev,
.icon_btn.insq .icon_isfev {
  display: inline-block;
  width: 5.876vw;
  height: 5.876vw;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}
.icon_btn.insq .icon_fev,
.icon_btn.insq .icon_isfev {
  width: 24px;
  height: 37px;
}

// .icon_btn:not(.insq) span:after {
//   content: "";
//   display: inline-block;
//   height: 100%;
//   border-right: 1px solid #f2f2f2;
//   position: absolute;
//   right: -10px;
// }
// .icon_btn span:last-child:after {
//   content: "";
//   border-right: none;
// }
// .icon_btn span.out_fev:after {
//   border: none;
// }
.icon_btn.insq .server {
  flex-direction: column;
  width: 40%;
  height: 100%;
  background-color: #ffc700;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  padding-top: 2px;
}
.icon_btn.noFavBtn.insq .server {
  width: 60%;
}
.icon_btn.insq .server img {
  width: 40%;
}

.icon_server {
  background-image: url("//files.eyee.com/mcdn/static/img/service.png");
}
.icon_btn.insq {
  width: 40%;
}
.icon_btn.noFavBtn {
  width: 24%;
}
.icon_btn.noFavBtn.insq {
  width: 30%;
}
.page-footer .footer_bar {
  padding: 2.66vw 4vw 2.66vw 4vw;
  background: #000;
  box-shadow: 0pt -10pt 15pt 0pt rgba(0, 0, 0, 0.03);
}
.footer_bar .btn_fix {
  // width: 70%;
  height: 13.333vw;
  line-height: 13.333vw;
  text-align: center;
  border: none;
  float: left;
  font-size: 0.875rem;
  // background: #333;
  color: #fff;
}

.footer_bar .icon_service {
  background: url("../../../static/imgs/mall/icon_customer_service.png");
}
.footer_bar .icon_shop {
  background: url("../../../static/imgs/mall/icon_shop.png");
}
.footer_bar .icon_fev {
  background: url("../../../static/imgs/mall/icon_star_unselected.png");
}

.footer_bar .icon_isfev {
  background: url("../../../static/imgs/mall/icon_star_act.png");
}

// .footer_bar .btn_fix.halfBtn {
//   width: 64%;
// }
.halfBtn .add_cart {
  background: #fff;
  color: #c8af6e;
  font-size: 3.73vw;
  font-weight: bold;
  background: #232323;
  white-space: nowrap;
  // border: 1px solid #fa4b4b;
  width: 29.3vw;
  height: 12.267vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}
.halfBtn .btn_buy {
  // background: #f02d2d !important;
  color: #000;
  font-size: 4vw;
  font-weight: bold;
  background: linear-gradient(#f5e6aa, #876e37);
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  height: 12.267vw;
  line-height: 12.267vw;
  // border: 1px solid #fa4b4b;
  width: 25.6vw;
  padding: 0 5.3vw;
  // border-radius: 2px;
}
.footer_bar .btn_fix.noFavBtn {
  width: 70%;
}
.footer_bar .btn_fix.insq {
  width: 60%;
}
.footer_bar .btn_fix.noFavBtn.insq {
  width: 70%;
}
.footer_bar .btn_m {
  // color: #333;
  background: #fff;
}
.footer_bar .btn_fix.halfBtn .noStartSoldout {
  width: 50%;
  color: #fff;
  background: #cdcdcd;
  font-weight: bold;
}
.footer_bar .btn_fix.halfBtn .btn_m,
.footer_bar .btn_fix.halfBtn .btn_buy,
.footer_bar .btn_fix.halfBtn .btn_group_buy {
  width: 50%;
}
// .footer_bar .btn_fix.halfBtn .btn_buy {
//   background: #333 !important;
// }
.footer_bar .btn_fix.halfBtn .btn_group_buy {
  color: #333333;
  background: #ffc700 !important;
}
.footer_bar .btn_fix.halfBtn.noFavBtn .btn_buy.noCartBtn {
  width: 100% !important;
  background: linear-gradient(#f5e6aa, #876e37);
  border-radius: 50px;
}
.footer_bar .btn_fix.halfBtn .noCartBtn {
  width: 100%;
  background: #cdcdcd;
}
.footer_bar .btn_fix.halfBtn .noStartSoldout.noCartBtn {
  width: 100%;
  background: #333;
  border-radius: 50px;
}

.info-exchange {
  color: #999;
  padding: 0 30px;
  justify-content: space-between;
  width: 100%;
}
._icon-txt {
  width: 100%;
}
._icon-txt .div {
  // width: 6.4vw;
  font-size: 12px;
  padding: 0 2.133vw;
  text-align: center;
}
._icon-txt .div.sa {
  padding-left: 0;
}
._icon-txt .div span {
  margin-bottom: 2px;
}
._icon-txt .div span.icon_cart {
  margin-left: 3px;
}
// ._icon-txt div.sa {
//   margin: 0 4.266vw;
// }
._icon-txt div.cart {
  position: relative;
}
._icon-txt .div img {
  display: block;
  width: 3.2vw;
}
._icon-txt div.cart .txt {
  text-align: left;
  width: 24px;
  white-space: nowrap;
}
._icon-txt div.cart i {
  position: absolute;
  width: 4vw;
  height: 4vw;
  background: #fa2337;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  right: 0;
  top: 0;
}
._icon-txt div.cart i em {
  transform: scale(0.833);
  font-weight: bold;
  width: 100%;
  height: 100%;
}
.info-exchange span {
  font-size: 0.75rem;
  margin-top: 5px;
}

.productDetail .spec_price {
  text-decoration: line-through;
  /* font-size: .9rem; */
  color: #969696;
  font-size: 12px;
  /* display: inline-block; */
  /* transform: translateY(-3px); */
}
.productDetail .spec_price .rmb {
  font-size: 3.2vw;
}
.act-txt {
  color: #fa4b4b;
  font-size: 12px;
  font-weight: bold;
}
.titleP {
  padding: 10px;
  background: #fff;
}
.titleP.fixedTop {
  position: sticky;
  width: 100%;
  z-index: 3;
  top: 48px;
  padding: 0 10px;
}
.titleP p {
  width: 50%;
  float: left;
  text-align: center;
}

.titleP p span {
  display: inline-block;
  padding: 10px 20px;
  font-size: 0.875rem;
  color: #999;
}

.titleP p span.activeType {
  border-bottom: 2px solid #333;
  color: #333;
}

.swiper-slide img {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

iframe {
  border: none;
  height: 1000px;
  background: #fff;
  width: 100%;
  overflow: hidden;
}
.product_sw {
  width: 100vw;
  height: 100vw;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  .video-img {
    max-height: 100vw;
  }
  .play-btn {
    width: 40px;
    height: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.detail-tit {
  font-weight: bold;
  padding: 4vw 4vw 2.67vw 4vw;
  font-size: 5.333vw;
  margin-top: 2.67vw;
}
.product_des {
  // text-align: center;
  padding: 2.666vw 4vw 10.666vw;
}
.fixBottom {
  position: fixed;
  bottom: 50px;
  color: #fff;
  font-size: 1.125rem;
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
}

.fixBottom span:nth-of-type(1) {
  width: 68%;
  text-align: center;
  float: left;
  background: #ffc700;
}

.exchange {
  float: left;
  width: 32%;
  background: #ffa600;
  font-size: 0.875rem;
}

.icon_bee {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(//files.eyee.com/mcdn/static/img/honey_white.png) no-repeat
    center;
  background-size: 100%;
  vertical-align: middle;
}

.hasbess {
  padding-bottom: 85px;
}

.mint-popup-bottom {
  width: 100%;
}

.mint-popup-top {
  top: 100px;
  width: 95%;
  border-radius: 4px;
}

.popup p:nth-of-type(1) {
  display: flex;
  justify-content: space-between;
  line-height: 20px;
  border-bottom: 1px solid #999;
  padding: 5px 10px 0 10px;
}

// .close::before {
//   font-size: 26px;
//   color: #999;
//   content: "\2717";
// }

.popup p:nth-of-type(2) {
  line-height: 20px;
  margin: 10px 50px 10px 10px;
  text-align: left;
}

.bee_box {
  position: fixed;
  bottom: 50px;
  color: #fff;
  font-size: 1.125rem;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.bee_box > p {
  float: left;
  height: 30px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.bee_box > p.left_bee {
  width: 68%;
  font-weight: 600;
  background-color: #fbd85d;
}
.bee_box > p.left_bee > em {
  display: inline-block;
  width: 16px;
  height: 17px;
  background: url("/static/img/bee_white.png") no-repeat center;
  background-size: 16px 17px;
}
.bee_box > p.right_bee {
  width: 32%;
  background-color: #ffc700;
}
.distribution {
  float: right;
  margin-top: 10px;
  line-height: 42px;
  padding-right: 10px;
  font-size: 14px;
  span {
    font-family: BASE_PRICE;
    font-size: 18px;
  }
  em {
    float: left;
    background: url(/static/img/d_share.png);
    width: 13px;
    height: 13px;
    background-size: 13px 13px;
    margin-top: 17px;
    margin-right: 4px;
  }
}
.cutAddress .title,
.confirmAdress .title {
  text-align: center;
  margin-bottom: -20px;
  margin-top: 20px;
}
.confirmAdress .title {
  margin: 20px;
  font-size: 17px;
  color: #333;
}
.addressName,
.dizhi {
  color: #666;
  font-size: 14px;
  padding-left: 20px;
  line-height: 24px;
  text-align: left;
}

.bg {
  background: rgba(0, 0, 0, 0.5);
  z-index: 101;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.confirmAdress {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  /* height: 216px; */
  padding-bottom: 20px;
  background: #fff;
  border-radius: 5px;
  z-index: 105;
}

.cutinfo .cut_btn,
.confirmAdress .cut_btn {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.cutinfo .cut_btn span,
.confirmAdress .cut_btn span {
  width: 46%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #ffc700;
  background: #ffc700;
  border-radius: 5px;
  color: #333;
}
.confirmAdress .cut_btn span {
  text-align: center;
}
.cutinfo .cut_btn span:nth-child(1),
.confirmAdress .cut_btn span:nth-child(1) {
  color: #999;
  background: none;
  border: 1px solid #ccc;
}

.show-cop {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.show-cop .cont {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #282828;
  height: 70vh;
}
.show-cop .cont .list {
  width: 100%;
  height: 55vh;
  overflow-y: scroll;
}
.close {
  position: absolute;
  width: 10.76vw;
  height: 1.6vw;
  border-radius: 40px;
  background: #505050;
  right: 50%;
  top: 3.733vw;
  transform: translate(50%, 0);
}

.fix-coupon .title {
  // color: #232323;
  font-size: 4.8vw;
  font-weight: bold;
  height: 18.66vw;
  margin-top: 2.66vw;
}

.fix-coupon .cont .cop {
  background: url("https://files.eyee.com/mcdn/img/prddetail/image_coupon.png")
    0 0 no-repeat;
  background-size: 100% 100%;
  margin: 0 4vw 2.66vw 4vw;
  height: 29.33vw;
  padding-right: 5.33vw;
}

.fix-coupon .cont .cop .cop-val {
  width: 26.4vw;
  height: 100%;
}

.fix-coupon .cont .cop .cop-val .val {
  color: #232323;
  font-size: 9.33vw;
  font-family: OswaldBold;
}

.fix-coupon .cont .cop .cop-val .type {
  color: #b4b4b4;
  font-size: 12px;
}

.cop-name .name {
  color: #969696;
  font-size: 12px;
  white-space: normal;
  width: 37.6vw;
}

.cop-name .bus-name {
  font-size: 3.733vw;
  color: #232323;
  font-weight: bold;
  margin-bottom: 4.266vw;
}
.cop-name .timer {
  white-space: nowrap;
}
.cop-name .get-cop {
  border-radius: 4rpx;
  background: #fa2337;
  color: #fff;
  font-size: 3.733vw;
  width: 17.6vw;
  height: 8.8vw;
  font-weight: bold;
}

.cop-name .get-cop.over {
  background: #cdcdcd;
}
.read-buy {
  position: absolute;
  background: #282828;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  padding-bottom: 60px;
  z-index: 101;
  border-radius: 18px 18px 0 0;
}
.read-buy-top {
  width: 40px;
  height: 6px;
  background-color: #505050;
  border-radius: 3px;
  margin: 15px auto 0;
}
.read-buy .title {
  line-height: 44px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: bold;
}
</style>
