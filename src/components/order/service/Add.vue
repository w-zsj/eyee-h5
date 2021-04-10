<template>
  <div class="head" v-scroll='menuScroll'>
    <v-header style="background-color:rgba(0,0,0,0);" id="transition">
      <div class="nav-tab2">
        <h3>{{title}}</h3>
      </div>
      <v-server :click="QiyuProd"></v-server>
    </v-header>
    <div class="list_huan">
      <div class="list_img">
        <div class="product-img">
          <img :src="info.mainpic|https">
          <div class="product-description">
            <p>{{info.brandname}}</p>
            <p v-if="info.status!=1">{{info.productname}}</p>
            <p v-if="info.status==1&&info.count>1">等{{info.count}}件商品</p>
          </div>
        </div>
        <div :class="presubmit">
          <p>{{statustitle}}</p>
        </div>
      </div>
      <div>
        <!-- 换货页面 -->
        <div v-if="page==1">
          <div class="content">
            <div class="content_left_l" @click="selectRes()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">换货原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.causereason}}</div>
                  <i :class="(rotate?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <div class="tuikuan-tuihuo" v-show="changeList" @click.stop="changeList=false"> </div>
            <transition name="fadeTuihuo">
              <ul class="select" v-show="changeList">
                <li class="sel_item">
                  <span>换货原因</span>
                </li>
                <li v-for="(i,index) in list" @click.stop="selectList(index)" class="sel_item" :key="index">
                  {{i}}
                  <span :class="changeListIndexHuan==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeList=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>
            <!-- <transition name="fade">
            <ul class="select"  v-show="changeList">
              <li v-for="(i,index) in list" @click="selectList(index)" class="sel_item">{{i}} {{index}}</li>

            </ul>
            </transition> -->

          </div>
          <span v-if="paramsdata.causeflag==3" style="font-size:12px;color:#666;">(请选择要换的规格颜色,若为缺货状态或情况复杂请备注说明或联系客服)</span>
          <!-- 选择颜色规格 -->
          <div v-if="paramsdata.causeflag==3" class="content_left_l specificationColor" @click.stop="specificationColorList">
            <div class="specificationColor-wrap">
              <div class="secd">{{passParamsSize.size}} {{passParamsSize.color}} {{passParamsSize.color?'x':''}}{{passParamsSize.count}}</div>
              <i :class="(rotate?'ico-bgr':'ico-bg')" style="float:right;"></i>
            </div>
          </div>
          <div class="tuikuan-tuihuo" v-show="specificationColor" @click.stop="specificationColor=false"></div>
          <!-- 购物车的组件===========================================================================-========================= -->
          <product-items :show="specificationColor" :isShowImg="false" :product-info="realInfo" @close='itemsClose'></product-items>
          <!-- 备注 -->
          <div class="explain" ref="c">
            <div class="content_left" @click="addblur()">
              <div class="content_right_r">
                <p class="description">备注说明</p>
                <div class="maxnum" v-text="(placeHolder?'最多500字':'')">{{placeHolder}}</div>
              </div>
            </div>
            <textarea class="remark" @input="descInput" v-model="paramsdata.memo" maxlength="500" placeholder="请输入备注" v-show="remark" @blur="focusstate=false" v-focus="focusstate"></textarea>
          </div>
          <div v-show="err" class="error">
            <span class="error-x">x</span>
            <p>最多只能输入500个字</p>
          </div>
        </div>
        <!-- 退款页面 -->
        <div v-else-if="page==2">
          <!-- 货物状态 -->
          <div class="content" v-if="info.status!=1">
            <div class="content_left_l" @click="selectRes()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">货物状态</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.goodstatuS}}</div>
                  <i :class="(rotate?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <!-- 选择 收到货 未收到货 -->
            <div class="tuikuan-tuihuo" v-show="changeList" @click.stop="changeList=false"> </div>
            <transition name="fadeTuihuo">
              <ul class="select" v-show="changeList">
                <li class="sel_item">
                  <span>是否收到货</span>
                </li>
                <li v-for="(i,index) in list1" @click="stateList(index)" class="sel_item">
                  {{i}}
                  <span :class="changeListIndexselect==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeList=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>

            <!-- <transition name="fade">
              <ul class="select"  v-show="changeList">
                <li v-for="(i,index) in list1" @click="stateList(index)" class="sel_item" >{{i}}</li>
              </ul>
            </transition> -->
          </div>
          <!-- 退款原因 -->
          <div class="content" v-if="info.status!=1">
            <div class="content_left_l" @click="selectRest()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">退款原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.causereason}}</div>
                  <i :class="(rotate1?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <div class="tuikuan-tuihuo" v-show="changeL&&listTuiKuan.length>0" @click.stop="changeL=false"> </div>
            <transition name="fadeTuihuo">
              <ul class="select" v-show="changeL&&listTuiKuan.length>0">
                <li class="sel_item">
                  <span>退货原因</span>
                </li>
                <li v-for="(i,index) in listTuiKuan" @click="resList(index)" class="sel_item">
                  {{i}}
                  <span :class="changeListIndexjin==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeL=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>

            <!-- v-if="changeL && info.refundstatus!=1" -->
            <!-- <transition name="fade">

              <ul class="select"  v-show="changeL">
                <li v-for="(i,index) in listTuiKuan" @click="resList(index)" class="sel_item" >{{i}}</li>
              </ul>
            </transition> -->
          </div>
          <!-- 待发货是退款原因 -->
          <div class="content" v-if="info.status==1">
            <div class="content_left_l" @click="selectRest()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">退款原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.causereason}}</div>
                  <i :class="(rotate1?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <div class="tuikuan-tuihuo" v-show="changeL" @click.stop="changeL=false"> </div>
            <transition name="fadeTuihuo">
              <!-- v-if="changeL && info.refundstatus!=1" -->
              <ul class="select" v-show="changeL">
                <li class="sel_item">
                  <span>退货原因</span>
                </li>
                <li v-for="(i,index) in waitSentShop" @click.stop="resList(index)" class="sel_item">
                  {{i.reason}}
                  <span :class="changeListIndexjin==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeL=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>
          </div>
          <!-- 商品退款 -->
          <div class="content">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res" v-if="info.status!=1">商品退款</p>
                  <p class="change-res" v-if="info.status==1">退款金额</p>
                </div>
                <div class="content_r">
                  <div class="secd1" :class="{unit:data.showrefund}"><input v-if="info.status!=1" type="number" placeholder="请输入退款金额" v-model="paramsdata.returnproductmoney" />
                  </div>
                  <div class="secd1" :class="{unit:data.showrefund}" v-if="info.status==1">
                    <span>{{(info.paymoney)|tofixed | filMoney}} </span>
                    <input disabled style="opacity:0;height:0" type="number" :placeholder="(info.allPay*info.count+info.expressfee)|tofixed | filMoney" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money" v-if="info.status==1">(商品金额
            <span>{{(info.allPay)|tofixed}}</span>, 运费
            <span>{{info.expressfee|tofixed}}</span>, 不包含优惠券金额)</p>
          <p class="product-money" v-if="info.status!=1">(最多可退商品金额
            <span>{{(info.paymoney*info.count)|tofixed}}</span>元)</p>
          <!-- 运费退款 -->
          <div class="content" v-if="info.status!=1">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">运费退款</p>
                </div>
                <div class="content_r">
                  <div class="secd1" :class="{unit:data.showexpfee}"><input type="number" placeholder="请输入运费退款金额" v-model="paramsdata.returnlogisticsmoney" /></div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money" v-if="info.status!=1">(最多可退运费金额
            <span>{{info.expressfee|tofixed}}</span>元)</p>
          <div class="explain" ref="c">
            <div class="content_left" @click="addblur()">
              <div class="content_right_r">
                <p class="description">备注说明</p>
                <div class="maxnum" v-text="(placeHolder?'最多500字':'')">{{placeHolder}}</div>
              </div>
            </div>
            <textarea class="remark" @input="descInput" v-model="paramsdata.memo" maxlength="500" placeholder="请输入备注" v-show="remark" @blur="focusstate=false" v-focus="focusstate"></textarea>
          </div>
          <div v-show="err" class="error">
            <span class="error-x">x</span>
            <p>最多只能输入500个字</p>
          </div>
        </div>
        <!-- 退货页面 -->
        <div v-else-if="page==3">
          <div class="content">
            <div class="content_left_l" @click="selectRes()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">退货原因</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.causereason}}</div>
                  <i :class="(rotate?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <div class="tuikuan-tuihuo" v-show="changeList" @click.stop="changeList=false"></div>
            <transition name="fadeTuihuo">
              <ul class="select" v-show="changeList">
                <li class="sel_item">
                  <span>退货原因</span>
                </li>
                <li v-for="(i,index) in list5" @click.stop="returnList(index)" class="sel_item" :key="index">
                  {{i}}
                  <span :class="changeListIndex==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeList=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>
          </div>
          <div class="content">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">商品退款</p>
                </div>
                <div class="content_r">
                  <div class="secd1" :class="{unit:data.showrefund}"><input type="number" placeholder="请输入商品退款金额" v-model="paramsdata.returnproductmoney" /></div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money">(最多可退商品金额
            <span>{{(info.paymoney*info.count)|tofixed}}</span>元)</p>
          <div class="content">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">运费退款</p>
                </div>
                <div class="content_r">
                  <!--  -->
                  <div class="secd1" :class="{unit:data.showexpfee}">
                    <input type="number" :placeholder="paramsdata.causeflag==3 || paramsdata.causeflag==8?'¥0.00':'请输入运费退款金额'" v-model="(paramsdata.causeflag==3 || paramsdata.causeflag==8) ? (data.showexpfee?'0.00':'¥0.00') : paramsdata.returnlogisticsmoney" :disabled='paramsdata.causeflag==3 || paramsdata.causeflag==8' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="product-money">
            <i v-if="paramsdata.causeflag!=3 && paramsdata.causeflag!=8" style="color:#666666;">(最多可退运费金额
              <span>{{info.expressfee|tofixed}}</span>元)</i>
            <i v-if="paramsdata.causeflag==3 || paramsdata.causeflag==8" style="color:#666666;font-size:12px;">(该退货原因下不退运费退款,由买家自行承担)</i>
          </p>
          <div class="explain" ref="c">
            <div class="content_left" @click="addblur()">
              <div class="content_right_r">
                <p class="description">备注说明</p>
                <div class="maxnum" v-text="(placeHolder?'最多500字':'')">{{placeHolder}}</div>
              </div>
            </div>
            <textarea class="remark" @input="descInput" v-model="paramsdata.memo" maxlength="500" placeholder="请输入备注" v-show="remark" @blur="focusstate=false" v-focus="focusstate"></textarea>
          </div>
          <div v-show="err" class="error">
            <span class="error-x">x</span>
            <p>最多只能输入500个字</p>
          </div>
        </div>
        <!-- 上传单号 -->
        <div v-else-if="page==4">
          <div class="content">
            <div class="content_left_l" @click="selectRes()">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">物流方式</p>
                </div>
                <div class="content_r">
                  <div class="secd">{{data.expresscompany}}</div>
                  <i :class="(rotate?'ico-bgr':'ico-bg')"></i>
                </div>
              </div>
            </div>
            <div class="tuikuan-tuihuo" v-show="changeList" @click.stop="changeList=false"></div>
            <transition name="fadeTuihuo">
              <!-- <transition name="fade"> -->
              <ul class="select" v-show="changeList">
                <li class="sel_item">
                  <span>物流方式</span>
                </li>
                <li v-for="(i,index) in list4" @click="selectExpress(index)" class="sel_item" :key="index">
                  {{i}}
                  <span :class="changeListIndexExpress==index?'curr':'defacurr'"></span>
                </li>
                <li class="sel_item" @click.stop="changeList=false">
                  <span>关闭</span>
                </li>
              </ul>
            </transition>
          </div>
          <input type="number" class="editExpress" placeholder="请您输入单号" v-model="paramsdata.expressno" maxlength="50" />
        </div>
        <div v-if="page!=4&&!info.isRefund" class="evidence">
          <ul class="flex-wrap">
            <li v-for="(item,idx) in evidenceUrls" :key='item'>
              <div class="flex-center">
                <img :src="item" alt="">
              </div>
              <div class="flex-center remove" @click.stop="removePic(idx)">
                <i class="ico-X "></i>
              </div>
            </li>
            <li class="flex-center upload" v-if="!(evidenceUrls&&evidenceUrls.length>=6)">
              <label for="uploadFiles" class="flex-col flex-center">
                <span>+</span>
                <span>上传凭证</span>
                <span>(最多六张)</span>
              </label>
              <input type="file" name="uploadFiles" id="uploadFiles" accept="image/*" hidden @change="fileChange">
            </li>
          </ul>

          <p class="hint">温馨提示：服饰类商品请拍摄吊牌，鞋履类请拍摄鞋底以及鞋舌标照片。</p>
        </div>
      </div>
    </div>
    <div>
      <!-- 提交申请 -->
      <div class="submit" :class="submitBg" @click="Submit()" v-if="submit==1">提交申请</div>
      <!-- 提交物流 -->
      <div class="submit_express" v-if="submit==2">
        <div class="express" @click="SubmitExpress()">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
import { RefundCauseFlag, OrderServiceBase, ServiceSubmitApply, ServiceEditApply, ServiceSubmitExpress, ServiceEditExpress } from '../../../common/api/order'
// GetProductItems,
import { NewDetail } from '../../../common/api/product'
import ProductItems from '@/comps/ProductItems'
import { QiyuProd } from '../../../common/api/WyQiyu'
import { UploadEvidence } from '../../../common/api/order'
import { mapGetters } from 'vuex'
// import { _getDate, DateDiff, APP } from "../../../common/util"; // DateFormat, ENUM,
export default {
  components: { ProductItems }, // CartModal,
  data() {
    return {
      presubmit: 'order-service-exchange-lg', // 不同状态下待提交的背景图
      placeHolder: true,
      page: 1, // 退换货、上传修改单号
      submit: 1,
      changeList: false,
      specificationColor: false,
      changeL: false,
      rotate: false,
      rotate1: false,
      title: '我要换货',
      statustitle: '待提交',
      err: false,
      remark: false,
      focusstate: false,
      list: [], // 换货原因
      list1: ['未收到货', '已收到货'], // 退款货物状态
      list2: [], // 未收到货-退款原因
      list3: [], // 已收到货-退款原因
      list4: [], // 物流信息
      list5: [], // 退货原因
      listTuiKuan: [], // 退款原因
      changeListIndex: null,
      changeListIndexHuan: null,
      changeListIndexjin: null,
      changeListIndexselect: null,
      changeListIndexExpress: null,
      passParamsSize: { size: '请选择规格颜色', color: '', count: '' },
      productInfo: {},
      sizeList: {},
      waitSentShop: [],
      subBg: '',
      paramsdata: {
        aftersaleid: '',
        type: '',
        goodstatus: '',
        returnproductmoney: '',
        returnlogisticsmoney: '',
        memo: '',
        goodstatuS: '请选择',
        returnlogisticsmoney: '',
        causeflag: '',
        causereason: '请选择',
        memo: '',
        expresscompany: '请选择',
        expressno: '',
        ProductItemId: '',
        Count: ''
      },
      evidenceUrls: [],
      evidences: []
    }
  },
  computed: {
    ...mapGetters({
      setOrderAdd: 'setOrderAdd',
      reCause: 'reCause',
      info: 'orderServiceInfo',
      changeInformation: 'changeInformation'
    }),
    data() {
      this.paramsdata.ProductItemId = this.info.productitemid
      this.paramsdata.Count = this.info.count
      let info = this.info
      let data = this.paramsdata
      let refund = parseFloat(data.returnproductmoney)
      let expfee = parseFloat(data.returnlogisticsmoney)
      if (refund > parseFloat(info.paymoney * info.count)) {
        this.paramsdata.returnproductmoney = parseFloat(info.paymoney * info.count).toFixed(2)
      }
      if (expfee > info.expressfee) {
        this.paramsdata.returnlogisticsmoney = parseFloat(info.expressfee).toFixed(2)
      }
      data.showrefund = refund >= 0
      data.showexpfee = expfee >= 0

      return data
    },
    // getProductDetail() {

    // },
    realInfo() {
      let _ = this
      let info = (_.productInfo && _.productInfo.info) || {}
      info.productid = info.id

      info.orderitemid = this.info.orderitemid
      return info
    },
    submitBg() {
      if (this.data.type == 1) {
        if (this.data.causereason != '请选择' && this.paramsdata.causeflag != 3) {
          this.subBg = 'subBg'
        } else if (this.passParamsSize.color != '' && this.paramsdata.causeflag == 3) {
          this.subBg = 'subBg'
        } else {
          this.subBg = ''
        }
      } else if (this.data.type == 2) {
        if (this.data.goodstatuS != '请选择' && this.data.causereason != '请选择' && this.data.returnproductmoney > 0 && this.data.returnlogisticsmoney >= 0) {
          this.subBg = 'subBg'
        } else this.subBg = ''
      } else if (this.data.type == 3) {
        if (this.data.causereason != '请选择' && this.data.returnproductmoney != '' && this.data.returnproductmoney > 0 && this.data.returnlogisticsmoney >= 0) {
          this.subBg = 'subBg'
        } else this.subBg = ''
      } else if (this.data.causereason != '请选择' && this.info.status == 1) {
        this.subBg = 'subBg'
      }
      //  console.log('this.data.goodstatuS',this.data.goodstatuS)
      return this.subBg
    }
  },
  mounted() {
    // status==1 状态值1 代表 待发货状态 GetProductItems
    //  console.log(this.changeInformation,'商品详情 ----orderitemid--------------------------------')
    // console.log(this.$root ,'root')

    // window.addEventListener("scroll", this.menuScroll);
    console.log('info',this.info)
    let _ = this
    //  NewDetail
    NewDetail(this.info.productid)   
      .then(res => {
        if (res) {
          _.productInfo = res
        }
      })
      .catch(e => {
        console.error('售后查看颜色规格详情', e)
      })

    if (this.info.status == 1) {
      this.page = 2
      this.title = '我要退款'
      if (this.reCause.length > 0) {
        this.waitSentShop = this.reCause
      } else {
        RefundCauseFlag().then(res => {
          // 退款原因接口
          // console.log(res,'waitSentShop')
          this.$store.dispatch('reCause', res)
          this.waitSentShop = res
        })
      }
    }
    if (this.setOrderAdd && this.setOrderAdd.reasons) {
      this.dealBase(this.setOrderAdd)
    } else {
      this.Data()
    }
    this.OrderBase()
    let info = this.info
    let editInfo = this.changeInformation || {}

    if (editInfo.evidenceurls) {
      let urls = editInfo.evidenceurls.split('|')
      _.evidenceUrls = [...urls]
      _.evidences = [...urls]
    }

    //  console.log(this.changeInformation,'editInfo')
    let base = this.setOrderAdd
    this.paramsdata.orderitemid = info.orderitemid
    if (editInfo.aftersaleid) {
      if (editInfo.goodstatus == 1) {
        editInfo.goodstatuS = '未收到货'
        this.listTuiKuan = this.list2
        if (this.paramsdata.causereason != '请选择') {
          this.data.causereason = '请选择'
          this.changeL = false
          this.rotate1 = false
        }
      } else {
        editInfo.goodstatuS = '已收到货'
        this.listTuiKuan = this.list3
        if (this.paramsdata.causereason != '请选择') {
          this.data.causereason = '请选择'
          this.changeL = false
          this.rotate1 = false
        }
      }

      if (base && base.reasons) {
        for (var i = 0; i < base.reasons.length; i++) {
          var a = base.reasons[i].id
          if (editInfo.causeflag == a) {
            editInfo.causereason = base.reasons[i].reason
          }
        }
      }
      this.paramsdata = editInfo
      this.paramsdata.expresscompany = editInfo.expresscompany || '请选择'
      this.paramsdata.expressno = editInfo.expressno || ''
      // ===============================修改申请时回传 颜色规格==============================================================================
      // this.paramsdata.size = editInfo.size
      // this.paramsdata.color= editInfo.color
      // this.paramsdata.count= editInfo.count
      this.passParamsSize.size = editInfo.size || '请选择规格颜色'
      this.passParamsSize.color = editInfo.color
      this.passParamsSize.count = editInfo.count
      if (this.paramsdata.returnproductmoney || this.paramsdata.returnlogisticsmoney) {
        this.paramsdata.returnproductmoney = parseFloat(editInfo.refundmoney - editInfo.returnlogisticsmoney).toFixed(2)
      } else {
        this.paramsdata.returnproductmoney = ''
      }
      this.paramsdata.returnlogisticsmoney = parseFloat(editInfo.returnlogisticsmoney).toFixed(2) || ''
      if (editInfo.memo != '') {
        this.placeHolder = false
        this.remark = true
        this.focusstate = true
        this.paramsdata.memo = editInfo.memo
      } else {
        this.placeHolder = true
        this.remark = false
        this.focusstate = false
      }
    }
    this.focusstate = false
  },
  directives: {
    focus: {
      update: function (el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  beforeDestroy() {
    this.$store.dispatch('ChangeInfo', {})
  },
  filters: {
    filMoney: function (val) {
      let monVal = '¥' + val
      return monVal
    }
  },
  methods: {
    fileChange(e) {
      let _ = this
      // console.log('fileChange', e)
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      var reader = new FileReader()
      reader.onload = (function (file) {
        return function (e) {
          // console.info('fileChange url', e, this.result) // 这个就是base64的数据了
          let dataUrl = (e.currentTarget || e.target).result
          if (!_.evidenceUrls.includes(dataUrl)) {
            UploadEvidence({ orderitemid: _.info.orderitemid, stream: dataUrl.split(',')[1] }).then(res => {
              _.evidenceUrls.push(dataUrl)
              _.evidences.push(res.evidenceurl)
            }).catch(e => {
              console.error('上传凭证失败：', e)
            })
          }
        }
      })(files[0])
      reader.readAsDataURL(files[0])
    },
    removePic(index) {
      let _ = this
      _.evidenceUrls = _.evidenceUrls.filter((i, idx) => idx !== index)
      _.evidences = _.evidences.filter((i, idx) => idx !== index)
    },
    menuScroll() {
      // 头部背景显示
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // if (scrollTop > 100) {
      //     document.getElementById('transition').style.background = 'rgba(255,255,255,0.95)'
      // }else if (scrollTop > 70) {
      //   document.getElementById('transition').style.background = 'rgba(255,255,255,0.8)'
      // }else if(scrollTop > 20){
      //   document.getElementById('transition').style.background = 'rgba(255,255,255,0.3)'
      // }else {
      //   document.getElementById('transition').style.background = 'transparent'
      // };
      // let scrollTop =
      //   window.pageYOffset ||
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop;
      // if (scrollTop > 100) {
      //   document.getElementById("transition").style.background = "#fff";
      // } else {
      //   document.getElementById("transition").style.background = "transparent";
      // }
    },
    dealBase(res) {
      // console.log('退货原因',res)
      res.express.map(i => {
        this.list4.push(i.expresscompany)
      })
      res.reasons.map(t => {
        var a = t.usage
        if (a.indexOf('1') != -1) {
          this.list.push(t.reason)
        }
        if (a.indexOf('2') != -1) {
          this.list2.push(t.reason)
        }
        if (a.indexOf('3') != -1 && t.id != 3) {
          // 已收到货，申请退款原因⾥里里，“⼤大⼩小尺码不不合适”去掉
          this.list3.push(t.reason)
        }
        if (a.indexOf('4') != -1) {
          this.list5.push(t.reason)
        }
      })
    },
    Data() {
      OrderServiceBase().then(res => {
        this.$store.dispatch('setOrderAdd', res)
        this.dealBase(res)
      })
    },
    OrderBase() {
      let pageType = parseInt(this.$route.query.type)
      if (pageType === 1) {
        this.page = 1
        this.submit = 1
        this.paramsdata.type = 1
      } else if (pageType === 2) {
        this.title = '我要退款'
        this.page = 2
        this.submit = 1
        this.presubmit = 'order-service-refund-lg'
        this.paramsdata.type = 2
      } else if (pageType === 3) {
        this.title = '我要退货'
        this.page = 3
        this.submit = 1
        this.presubmit = 'order-service-return-lg'
        this.paramsdata.type = 3
      }
      if (pageType === 4) {
        this.title = '上传单号'
        this.page = 4
        this.submit = 2
        this.paramsdata.type = this.changeInformation.type
        this.statustitle = '待发货'
      }
      if (pageType === 5) {
        this.title = '修改单号'
        this.page = 4
        this.submit = 2
        this.statustitle = '待发货'
      }
      if (pageType === 0) {
        if (this.changeInformation.type == 1) {
          this.title = '修改申请'
          this.presubmit = 'order-service-exchange-lg'
          this.page = 1
          this.submit = 1
        } else if (this.changeInformation.type == 2) {
          this.title = '修改申请'
          this.presubmit = 'order-service-refund-lg'
          this.page = 2
          this.submit = 1
        } else if (this.changeInformation.type == 3) {
          this.title = '修改申请'
          this.presubmit = 'order-service-return-lg'
          this.page = 3
          this.submit = 1
        }
      }
    },
    addblur() {
      this.focusstate = true
      this.placeHolder = !this.placeHolder
      this.remark = !this.remark
    },
    QiyuProd() {

      QiyuProd.call(this)
      console.log('打开客服')
    },
    selectList(index) {
      if (this.info.status == 1) {
        this.paramsdata.causereason = this.list[index].reason
      } else {
        this.paramsdata.causereason = this.list[index]
      }
      this.changeListIndexHuan = index
      this.changeList = false
      this.rotate = false
      this.causeid = ''
      this.paramsdata.goodstatus = 2
      if (this.setOrderAdd && this.setOrderAdd.reasons) {
        for (var i = 0; i < this.setOrderAdd.reasons.length; i++) {
          var a = this.setOrderAdd.reasons[i].reason
          if (a.indexOf(this.paramsdata.causereason) != -1) {
            this.causeid = this.setOrderAdd.reasons[i].id
            this.paramsdata.causeflag = this.causeid
          }
        }
      }
      if (this.paramsdata.causeflag == 3) {
        if (this.passParamsSize.color == 'null' || this.passParamsSize.color == null) {
          // console.log(typeof this.passParamsSize.color,'换货原因')
          this.passParamsSize.size = '' || '请选择规格颜色'
          this.passParamsSize.color = ''
          this.passParamsSize.count = ''
        }
      }
      // console.log( this.paramsdata.causeflag,'换货.causeflag')
    },
    // 选择规格
    itemsClose(item) {
      let _ = this
      _.specificationColor = false
      if (item && _.data.type === 1) {
        // console.log('itemsClose',item)
        // console.log('我要换货')
        _.passParamsSize.size = item.size
        _.passParamsSize.color = item.color
        _.passParamsSize.count = item.count
        _.paramsdata.ProductItemId = item.productitemid
        _.paramsdata.Count = item.count
      }
    },
    specificationColorList() {
      this.specificationColor = true
    },
    // guige(item,style){
    // if(style==1){
    //   this.passParams.size = item
    // }else if(style==2){
    //   this.passParams.color = item
    // }

    // console.log(this.passParams,'this.passParams')
    // },
    returnList(index) {
      if (this.info.status == 1) {
        this.paramsdata.causereason = this.list5[index].reason
      } else {
        this.paramsdata.causereason = this.list5[index]
      }

      this.changeListIndex = index
      this.changeList = false
      this.rotate = false
      this.causeid = ''
      this.paramsdata.goodstatus = 2

      if (this.setOrderAdd && this.setOrderAdd.reasons) {
        for (var i = 0; i < this.setOrderAdd.reasons.length; i++) {
          var a = this.setOrderAdd.reasons[i].reason
          if (a.indexOf(this.paramsdata.causereason) != -1) {
            this.causeid = this.setOrderAdd.reasons[i].id
            this.paramsdata.causeflag = this.causeid
          }
        }
      }
      //  console.log( this.paramsdata.causeflag,' this.paramsdata.causeflag')
    },
    resList(index) {
      if (this.info.status == 1) {
        this.paramsdata.causereason = this.waitSentShop[index].reason
        this.paramsdata.causeflag = this.waitSentShop[index].id
      } else {
        this.paramsdata.causereason = this.listTuiKuan[index]
      }
      this.changeListIndexjin = index
      // console.log( this.waitSentShop[index],'kkkkkk')
      this.changeL = false
      this.rotate1 = false
      if (this.setOrderAdd && this.setOrderAdd.reasons) {
        for (var i = 0; i < this.setOrderAdd.reasons.length; i++) {
          var a = this.setOrderAdd.reasons[i].reason
          if (a.indexOf(this.paramsdata.causereason) != -1) {
            this.causeid = this.setOrderAdd.reasons[i].id
            this.paramsdata.causeflag = this.causeid
          }
        }
      }
      if (this.data.goodstatuS != '请选择' && this.data.causereason != '请选择' && this.data.returnproductmoney > 0 && this.data.returnlogisticsmoney >= 0) {
        this.subBg = 'subBg'
      } else this.subBg = ''
    },
    selectExpress(index) {
      this.paramsdata.expresscompany = this.list4[index]
      this.changeListIndexExpress = index
      this.changeList = false
      this.rotate = false
    },
    stateList(index) {
      this.paramsdata.goodstatuS = this.list1[index]
      this.changeList = false
      this.rotate = false
      this.changeListIndexselect = index
      if (index == 0) {
        this.listTuiKuan = this.list2
        this.paramsdata.goodstatus = 1
        this.data.causereason = '请选择'
      } else {
        this.listTuiKuan = this.list3
        this.paramsdata.goodstatus = 2
        this.data.causereason = '请选择'
      }
      if (this.data.goodstatuS != '请选择' && this.data.causereason != '请选择' && this.data.returnproductmoney > 0 && this.data.returnlogisticsmoney >= 0) {
        this.subBg = 'subBg'
      } else this.subBg = ''
    },
    selectRes() {
      this.changeList = !this.changeList
      this.rotate = !this.rotate
      if (this.paramsdata.causereason != '') {
        this.changeL = false
        this.rotate1 = false
      }
    },
    selectRest() {
      // console.log(this.listTuiKuan,'listTuiKuan')
      if (this.listTuiKuan.length === 0 && this.info.status != 1) {
        this.toast('请选择货物状态')
        return
      }
      this.changeL = !this.changeL
      this.rotate1 = !this.rotate1
    },
    descInput() {
      if (this.paramsdata.memo) {
        var a = this.paramsdata.memo.length
        if (a >= 500) {
          this.err = true
          this.$refs.c.style.background = '#ffb9b9'
        } else {
          this.err = false
          this.$refs.c.style.background = '#fff'
        }
      }
    },
    Submit() {
      let _ = this
      //  console.log(_.paramsdata,'_.paramsdata3333')
      if (_.data.type == 1) {
        if (_.data.causereason == '请选择') {
          _.toast('请选择换货原因')
          return
        }
        if (!_.passParamsSize.color && _.paramsdata.causeflag == 3) {
          _.toast('请选择规格颜色')
          return
        }
      } else if (_.data.type === 2) {
        if (_.data.goodstatuS === '请选择') {
          _.toast('请选择货物状态')
          return
        } else if (_.data.causereason == '请选择') {
          _.toast('请选择退款原因')
          return
        } else if (_.data.returnproductmoney == '') {
          _.toast('请输入商品退款金额')
          return
        } else if (_.data.returnproductmoney < 0) {
          _.toast('退款金额不能小于0')
          return
        }
      } else if (_.data.type == 3) {
        if (_.data.causereason == '请选择') {
          _.toast('请选择退款原因')
          return
        } else if (_.data.returnproductmoney == '') {
          _.toast('请输入商品退款金额')
          return
        } else if (_.data.returnproductmoney < 0) {
          _.toast('退款金额不能小于0')
          return
        }
      } else {
        if (_.paramsdata.memo == '') {
          _.focusstate = false
        }
      }
      if (_.data.returnlogisticsmoney < 0) {
        _.toast('运费不能小于0')
        return
      }
      //  console.log('_.data---------------',_.data)
      // console.log('_.info.orderno',_.info.status)

      if (_.info.status == 1) {
        _.data.orderno = _.info.orderno
        _.data.type = 4
        if (!_.data.causeflag) {
          _.toast('请选择退款原因')
          return
        }
      }
      if (_.evidences.length > 0) _.data.evidenceurls = _.evidences.join('|')
      console.log('提交修改参数', _.data)
      let hook = _.$route.query.type != 0 ? ServiceSubmitApply : ServiceEditApply
      hook(_.data)
        .then(res => {
          console.log(res, 'data')
          _.$router.replace('/order/service/info')
        })
        .catch(e => {
          if (e.code == '1511503') {
            _.toast('Sorry,该产品库存不足')
          }

          console.error('', e)
        })
    },
    SubmitExpress() {
      // console.log(this.data)
      let hook = parseInt(this.$route.query.type) === 4 ? ServiceSubmitExpress : ServiceEditExpress
      if (this.data.expresscompany === '请选择') {
        this.toast('请选择物流方式')
      } else if (this.data.expressno == '') {
        this.toast('请输入单号')
      } else {
        hook(this.data)
          .then(res => {
            this.$router.replace('/order/service/info')
          })
          .catch(e => {
            console.error('', e)
            this.toast('操作失败')
          })
      }
    }
  }
}
</script>
<style scoped>
.evidence {
  margin: 20px 0;
}
.evidence ul{
  margin-bottom:10px;
}
.evidence li{
  position: relative;
  width: 90px;
  width: 26vw;
  height: 90px;
  height: 26vw;
  padding: 3px;
  margin: 0 4% 10px 0;
  color: #999;
  border: 1px solid;
}
.evidence li div:first-of-type{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.evidence .remove{
  position: absolute;
  right: -8px;
  top:-8px;
  padding: 4px;
  background-color: #e90707;
  border-radius: 50%;
}
.evidence .remove .ico-X{
  width: 14px;
  height: 14px;
  color: #fff;
}
.evidence .upload{
  border: 1px dashed;
  border-radius: 8%;
  font-size: 13px;
}
.evidence .upload span:first-of-type{
  font-size: 36px;
  font-weight: 600;
}
.evidence .hint {
  color: #999;
  font-size: 12px;
}
.fadeTuihuo {
}
.fadeTuihuo-enter-active,
.fadeTuihuo-leave-active {
  transition: all 0.5s;
}
.fadeTuihuo-enter,
.fadeTuihuo-leave-to {
  transform: translateY(500px);
  /* opacity: 0; */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.head {
  background-image: linear-gradient(-180deg, #ffc700 0%, #fcfd62 100%);
  background-size: 100% 160px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
}

.list_huan {
  width: 100%;
  position: absolute;
  top: 48px;
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 100px;
}
.list_img {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 8px;
  height: 160px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
.list_img img:nth-of-type(1) {
  display: block;
  width: 100px;
  height: 100px;
  margin-top: 15px;
  margin-left: 20px;
}
.list_img div:nth-of-type(2) {
  width: 140px;
  height: 120px;
  position: relative;
  padding-top: 20px;
}
.list_img div:nth-of-type(2).order-service-refund-lg {
  background: url('//files.eyee.com/mcdn/static/img/order-service-refund-lg.png') no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2).order-service-return-lg {
  background: url('//files.eyee.com/mcdn/static/img/order-service-return-lg.png') no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2).order-service-exchange-lg {
  background: url('//files.eyee.com/mcdn/static/img/order-service-exchange-lg.png') no-repeat #fff;
  background-size: 100% 100%;
}
.list_img div:nth-of-type(2) p {
  position: absolute;
  left: 26px;
  bottom: 27px;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  line-height: 30px;
  text-align: center;
  font-weight: bolder;
}
.production-img {
  display: flex;
  flex-direction: column;
}
.product-img p {
  font-size: 10px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}
.product-description {
  width: 112px;
  margin-top: 8px;
  text-align: center;
  font-size: 10px;
  color: #333;
  height: 28px;
  margin-left: 15px;
}
.product-description p {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.product-description p:nth-of-type(2) {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box; */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #999;
}
.content {
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
}
.content_l {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.content_r {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
}
.content_c {
  display: flex;
  align-items: center;
}
i {
  font-style: normal;
}
.red {
  display: block;
  width: 14px;
  height: 20px;
  text-align: center;
  line-height: 25px;
  font-size: 14px;
  color: #e90707;
}
.content_left {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 8px;
}
.content_left_l {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
.specificationColor {
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  margin-top: 15px;
}
.specificationColor .specificationColor-wrap {
  width: 100%;
}
.specificationColor .specificationColor-wrap .secd {
  float: left;
  font-size: 14px;
  color: #666;
}
.specificationColorSub {
  background: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  font-size: 14px;
  color: #111111;
  text-align: center;
  z-index: 11;
}
.specificationColorSub .title {
  margin: 26px 0;
}
.specificationColorSub .guanbi {
  line-height: 42px;
  background: #424242;
  color: #fff;
  text-align: center;
  font-size: 14px;
}
.specificationColorSub i {
  font-style: normal;
  font-size: 12px;
  color: #666;
}
.specificationColorSub .conColFlex {
  overflow: hidden;
  margin-bottom: 40px;
}

.specificationColorSub .conColFlex span {
  float: left;
  /* padding: 0 20px; */
  width: 20%;
}
.specificationColorSub .conColFlex dl {
  float: left;
  overflow: hidden;
  width: 80%;
  /* display: flex; */
}
.specificationColorSub .conColFlex dl dd {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  line-height: 14px;
  text-align: center;
  border: 1px solid #999;
  float: left;
  padding: 0 10px;
  line-height: 28px;
  margin-right: 10px;
  margin-bottom: 10px;
  /* flex: 1; */
}
.specificationColorSub .conColFlex.conColFlexNumbe dl dd {
  margin-right: 0;
}
.specificationColorSub .conColFlex.conColFlexNumbe dl dd:nth-child(2) {
  border-right: 0;
  border-left: 0;
  padding: 0 50px;
}
.content_right_r {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.change-res {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 13px;
}
.select {
  width: 100%;
  position: relative;
  height: 0;
  z-index: 11;
}
.select_1 {
  width: 100%;
  overflow: hidden;
}
.select_2 {
  height: 420px;
  width: 100%;
  position: relative;
  height: 0;
  z-index: 5;
}
.tuikuan-tuihuo {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.select {
  position: fixed;
  width: 100%;
  bottom: -2px;
  left: 0;
  background: #fff;
  min-height: 100%;
  overflow-y:auto;
  z-index: 100;

}
.sel_item {
  /* box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5); */
  border-bottom: 1px solid #eee;
  background: #ffffff;
  height: 42px;
  padding-left: 22px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #111111;
  letter-spacing: 1px;
  line-height: 13px;
  position: relative;
}
.sel_item:nth-child(1) {
  margin: 10px 0;
  margin-bottom: 0;
  border: 0;
  text-align: center;
  padding: 0;
}
.sel_item:nth-child(1) span,
.sel_item:last-child span {
  display: block;
  width: 100%;
  text-align: center;
}
.sel_item:last-child {
  color: #fff;
  background: #424242;
  font-size: 16px;
  line-height: 50px;
  height: 50px;
  padding: 0;
}
.sel_item .curr,
.defacurr {
  position: absolute;
  right: 20px;
  border-radius: 50%;
  top: 10px;
  width: 20px;
  height: 20px;
  background: url('/static/imgs/cart_choose.png') 0 0 no-repeat;
  background-size: cover;
}
.defacurr {
  background: url('//files.eyee.com/mcdn/static/img/cart_no.png') 0 0 no-repeat;
  background-size: cover;
}
.secd {
  font-size: 12px;
  color: #333;
  letter-spacing: 0.86px;
  line-height: 13px;
  text-align: left;
}
.secd1 input {
  padding: 0;
  color: #ffc700;
  background: rgba(0, 0, 0, 0);
}
.secd1 span {
  padding: 0;
  color: #ffc700;
  background: rgba(0, 0, 0, 0);
  display: inline-block;
  margin-top: 12px;
}
.secd1.unit input {
  padding-left: 10px;
}
.secd1 {
  color: #ffc700;
  letter-spacing: 0.86px;
  line-height: 13px;
  text-align: left;
}
.unit {
  position: relative;
}
.unit:before {
  content: '¥';
  position: absolute;
  transform: scale(0.8);
}
.product-money {
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  margin: 0 14px;
  margin-top: 10px;
}
.product-money span {
  color: #333;
  font-size: 13px;
  font-weight: 900;
}
.error {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.error p {
  font-size: 12px;
  color: #e90707;
  letter-spacing: 0;
  line-height: 12px;
  text-align: left;
  margin-left: 8px;
}
.error-x {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e90707;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  color: #fff;
  font-weight: 100;
}
.maxnum {
  border: 0;
  padding: 0;
  margin-left: 29px;
  opacity: 0.5;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 13px;
}
.explain {
  margin-top: 15px;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.description {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 13px;
  margin-left: 14px;
}
.remark {
  width: 100%;
  resize: none;
  margin: 0 22px 9px;
  padding: 0;
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
  line-height: 16px;
  text-align: left;
  height: 80px;
  background: rgba(0, 0, 0, 0);
}
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ccc;
  height: 50px;
  color: #fff;
}
.subBg {
  background: #333;
}
.submit_express {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #eee;
  height: 50px;
  color: #666;
}
.express {
  background: #ffffff;
  border: 1px solid #666666;
  border-radius: 4px;
  width: 66px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.editExpress {
  margin-top: 15px;
  width: 100%;
  border: 1px solid #999999;
  border-radius: 6px;
  height: 38px;
}
</style>
