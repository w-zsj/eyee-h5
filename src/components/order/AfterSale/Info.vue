
<template>
  <div v-scroll='menuScroll' class="head">
       <!-- v-scroll='menuScroll' -->
      <!-- style="background-color:rgba(0,0,0,0);"-->
    <v-header   id="transition">
      <div class="nav-tab2" >
        {{presentStatus}}
      </div>
      <v-server :click="QiyuProd"></v-server>
    </v-header>
    <div class="content">
       <div class="list_img">
        <div class="product-img">
          <img :src="info.productimg|https">
          <div class="product-description">
            <p>{{info.brandname}}</p>
            <p>{{info.productname}}</p>
          </div>
        </div>
        <div>
          <img src="//files.eyee.com/mcdn/static/img/order-service-refund-lg.png" alt="">
          <div class="product-status" :style="{'bottom':isShow ? '10px':'24px'}">
            <p><span :class="yellowgreen">{{info.statustext}}</span></p>
            <p class="time" v-if='isShow'><span>{{cda.d |decpadleft}}</span>天<span>{{cda.H |decpadleft}}</span>时<span>{{cda.m |decpadleft}}</span>分</p>
          </div>
        </div>
      </div>   
      <template>
      <!-- 上传单号 -->
        <div v-if="isShowExpress">
          <div class="expressContent">
            <div class="content_left_l">
              <div class="content_l">
                <div class="content_c">
                  <span class="red">*</span>
                  <p class="change-res">物流方式</p>
                </div>
                <div class="content_r">
                  <div class="secd" >{{expressList.express}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="editExpressNo">
            <input type="number" class="editExpress" placeholder="请您输入单号" v-model="expressno" maxlength="12" />
            <!-- <img src="../../../../static/img/scan.png" alt="" class="editExpressImg"> -->
          </div>
          <p class="editExpressInfo">{{expressList.expresshint}}</p>
        </div>
        <!--  退款 退款并退货  -->
        <div v-show="isShowProgress">
          <!-- class {currentThis，current}   currentThis进度红叉 current黄色正常进度 -->
          <div class="progress-bar ">
            <span v-if='info.status == 5 || info.status == 7' v-for="(item,index) in info.progressinfo" :key="index"
            :class="info.progressstatus-1 >= item.progressstatus ? 'current':( info.progressstatus == item.progressstatus?'currentThis':'' )" >{{item.title}}</span>
            <span v-if='info.status != 5&&info.status != 7' v-for="(item,index) in info.progressinfo" :key="index"  
            :class="info.progressstatus >= item.progressstatus ? 'current':''" >{{ item.title}}</span>
            <!-- <span v-for="(item,index) in info.progressinfo" :key="index"  
            :class="info.status == 5?(info.progressstatus-1 >= item.progressstatus ? 'current':( info.progressstatus == item.progressstatus?'currentThis':'' )):(info.progressstatus1 >= item.progressstatus ? 'current':'')" >{{item.title}}</span> -->
          </div>
          <div class="shop-return-info">
            <ul>
              <!--type": int 操作类型 1-用户 2-平台-->
              <li v-for="item in referApply" :key='item.title' :class="item.type==1?'':'form-shop'">
                <p class="return-time">{{item.time}}</p>
                <p class="return-text" v-html="item.title"></p>
              </li>
            </ul>
          </div>
        </div>
         
        <div class="apply" >
          <div class="applyDiv" v-if='amend'>
              <span class="amend-apply" @click="changeInfo()">修改申请</span>
          </div>
          <div class="applyDiv" v-if='hasdata==1'>
              <span class="apply-intervene"  @click="repealCheck()">撤销申请</span>
          </div>
          <div class="applyDiv" v-if='hasdata==2'>
              <span class="apply-intervene" @click="uploadingLeaflets()">上传单号</span>
          </div>
          <div class="applyDiv" v-if='hasdata==3'>
              <span class="apply-intervene" @click="SubmitExpress()">提交</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<<script>
import { DateDiff } from '../../../common/util'
import { getRefund , getRevocation , submitExpress } from '../../../common/api/order'
import { QiyuProd } from '../../../common/api/WyQiyu'
export default {
  data() {
    return {
      hasdata: '',
      presentStatus: '申请退款', // 当前要选择的售后方式
      yellowgreen: '', // 已完成的时候字体颜色变化
      isShow: false,
      isShowExpress:false,
      isShowProgress:true,
      expressno: '',
      amend: false, // 修改
      cda: '',
      referApply: [], // 返回系统消息
      scroll: '', 
      refundid:'',
      info:{},
      expressList:[]
    }
  },
  mounted() {
    window.addEventListener("scroll", this.menuScroll);
    var _ =  this;
    _.refundid = _.$route.params.id
    this.getRefundInfo()
  },
  methods: {
    menuScroll() { // 头部背景显示
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        document.getElementById('transition').style.background = 'rgba(255,255,255,0.95)'
      } else if (scrollTop > 70) {
        document.getElementById('transition').style.background = 'rgba(255,255,255,0.8)'
      } else if (scrollTop > 20) {
        document.getElementById('transition').style.background = 'rgba(255,255,255,0.3)'
      } else {
        document.getElementById('transition').style.background = 'transparent'
      };
     
    },
    getRefundInfo() { 
      this.referApply = []
      getRefund({refundid:this.refundid})
        .then(res => {
          if (res) {
            this.info = res
            if(!!res.express){
              this.expressList = res.express[0]
            }
            
            console.log('res',res)
          // 切换 头部 状态值
            if (res.refundtype == 1) {
              this.presentStatus = '申请退款'
            } else if (res.refundtype == 2) {
              this.presentStatus = '退货并退款 '
            }
            this.referApply = res.progresslist
            this.referApply.map(i => {
              i.title = i.title.replace(/\n/g, '<br/>')
              return i.title
            })
            // 调用倒计时res.endtime
            let endtime = res.endtime
            // 换货状态值
            console.log('res.status',res.status)
            switch (res.status) {
              case 1:
                this.duplicatedCode( true,false, 2)
                this.currentTime(endtime)
                break
              case 2:
              case 3:
              case 7:
              case 8:
                this.duplicatedCode( false,false, 0)
                break
              case 4:
                this.yellowgreen = 'yellowgreen'
                this.duplicatedCode( false, false, 0)
                break
              case 5:
                this.yellowgreen = 'yellowred'
                this.duplicatedCode( false, false, 0)
                break
              case 6:
                this.duplicatedCode( true, true, 1)
                this.currentTime(endtime)
                break
            }
          } else {
            this.toast('暂无数据')
            this.hasdata = 0
            this.isShow = false
          }
        }).catch(e => {
          this.toast(e.msg)
        })
    },
    duplicatedCode( isShow, amend, hasdata) { 
      this.isShow = isShow // 倒计时判断
      this.amend = amend  // 修改申请按钮判断
      this.hasdata = hasdata
    },
    currentTime(time){
      this.cda = DateDiff({ destination: time, type: 'd' }) // 时间转化方法
      if(this.cda.H <= 0 && this.cda.m <= 0 && this.cda.s <= 0) {
        this.isShow = false
        // this.cda = {d:0,H:0,m:0,s:0}
        console.log('结束')
        return
      }else{
        console.log(this.cda)
        setTimeout(() => {
          this.currentTime(time)
        }, 1000);
      }
    },
    changeInfo() { // 修改申请
      // this.$store.dispatch('setOrderServiceInfo',this.orderServiceInfo)
      this.$router.replace({path:'/order/AfterSale/add',query:{orderno:this.info.orderno,refundid:this.refundid,refundtype:this.info.refundtype}})
    },
    repealCheck() { // 撤销申请
      let option = {
        msg: "您确定要撤销申请吗？",
        okRext: "确定",
        ok: () => {
          getRevocation({refundid:this.refundid}).then(res=>{
            this.toast('撤销成功')
            this.isShow = false;
            this.getRefundInfo()
          }).catch(err=>{
            this.toast(err.msg)
          })
        }
      };
      this.confirm(option);
    },
    uploadingLeaflets() { // 上传单号
      this.isShowExpress = true
      this.isShowProgress = false
      this.hasdata = 3
    },
    SubmitExpress() {
      var _ = this;
      if (_.expressno == '') {
        _.toast('请输入单号')
      }
      else if(!/^[0-9]{12}$/.test(_.expressno)){
        _.toast('请输入正确格式的顺丰物流单号')
      }
      else {
        let params={
          refundid:_.refundid,
          expressno:_.expressno,
          expressid:_.expressList.expressid
        }
        console.log('上传单号参数',params)
        submitExpress(params)
          .then(res => {
            _.isShowExpress = false
            _.isShowProgress = true
            _.getRefundInfo()
          })
          .catch(e => {
            console.error('', e)
            this.toast('操作失败')
          })
      }
    },
    QiyuProd() { // 跳客服的

      QiyuProd.call(this)
    }
  }
}
</script>
<style scoped>
#transition{
    background: transparent;
}
p.name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
.content {
  /* margin-top: 255px; */
  padding: 0 15px;
  padding-bottom: 55px;
  position: absolute;
  top: 48px;
  width: 100%;
  left: 0;
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
  height: 120px;
  position: relative;
  flex:1
}
.list_img div:nth-of-type(2) img {
  position: absolute;
  top: 0;right: 0 ;
  width: 140px;
  height: 120px;
  margin: 0;
}
.list_img div:nth-of-type(2) div.product-status {
  position: absolute;
  right: 20px;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  line-height: 30px;
  text-align: right;
  font-weight: bolder; 
}
.list_img div:nth-of-type(2) p.time {
  font-size: 18px;
  line-height: 30px;
}
.list_img div:nth-of-type(2) p.time span {
  color: #e90707;
}
.list_img div:nth-of-type(2) p .yellowgreen{
  color: #ffc700;
}
.list_img div:nth-of-type(2) p .yellowred{
  color: #e90707;
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
.progress-bar {
  margin-top: 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 10px;
  text-align: center;
  display: flex;
  text-align: center;
}
.progress-bar span {
  flex: 1;
  position: relative;
}
.progress-bar span:before {
  content: "";
  width: 10px;
  height: 10px;
  background: #eee;
  position: absolute;
  top: -15px;
  left: 50%;
  margin-left: -5px;
  border-radius: 50%;
  z-index: 2;
}
.progress-bar span:after {
  content: "";
  background: #eee;
  position: absolute;
  height: 2px;
  width: 100%;
  top: -11px;
  left: 0;
  margin-left: -50%;
  /* border-radius:50%; */
}
.progress-bar span:first-child:after {
  width: 0;
  z-index: 1;
}
.progress-bar span.current:before,
.progress-bar span.current:after {
  background: #ffc700;
}
.progress-bar span.currentThis:before,
.progress-bar span.currentThis:after {
  background: #f05959;
}
.progress-bar span.currentThis:before {
  content: "x";
  color: #fff;
  line-height: 7px;
  text-align: center;
}
.shop-return-info {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  width: 98%;
  margin: 0 auto;
  letter-spacing: 0;
  line-height: 20px;
  text-align: left;
}
.shop-return-info ul {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shop-return-info li {
  margin: 20px auto;
  width: 97.8%;
  float: left;
  margin-bottom: 0;
}
.shop-return-info li .return-time {
  text-align: center;
  margin-bottom: 10px;
  
}
.shop-return-info li .return-text {
  background: #eeeeee;
  padding: 10px 5%;
  border-radius: 5px;
  position: relative;
  /* min-height: 40px; */
  line-height: 20px;
}
.shop-return-info li .return-text:after {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-left: 8px solid #eee;
  border-bottom: 5px solid transparent;
}
.shop-return-info li.form-shop {
  float: right;
}
.shop-return-info li.form-shop .return-text {
  background: #ffe37f;
}
.shop-return-info li.form-shop .return-text:after {
  border-top: 0 solid transparent;
  border-bottom: 0 solid transparent;
  border-left: 0 solid #ffe37f;
}
.shop-return-info li.form-shop .return-text:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-right: 8px solid #ffe37f;
  border-bottom: 5px solid transparent;
}
.apply {
  display: flex;
  background: #eeeeee;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  /* padding: 15px 0; */
}
.apply .applyDiv {
  flex: 1;
  margin: 15px 0;
  text-align: center;
}
.apply .applyDiv span {
  outline-style: none;
  background: #fff;
  border: 1px solid #333;
  font-size: 14px;
  color: #666666;
  border-radius: 5px;
  padding: 7px;
}
.expressContent{
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
}
.content_left_l {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
.content_l {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.content_c {
  display: flex;
  align-items: center;
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
.change-res {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 13px;
}
.content_r {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
}
.secd {
  font-size: 12px;
  color: #333;
  letter-spacing: 0.86px;
  line-height: 13px;
  text-align: left;
}
.editExpressNo{
  margin-top: 15px;
  position: relative;
}
.editExpressNo .editExpressImg{
  height: 20px;
  width: 20px;
  position: absolute;
  right:10px;
  top:10px;
  }
  .editExpress {
  width: 100%;
  border: 1px solid #999999;
  border-radius: 6px;
  height: 38px;
  padding-right: 35px
}
.editExpressInfo{
  color:#EF0000;
  font-size: 12px;
  margin-top: 5px;
}
</style>