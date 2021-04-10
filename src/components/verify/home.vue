<template>
  <div class="main">
    <div>
        <div class="banner">
        <div class="font-top">
            <p>尊敬的客户您好：</p>
            <p class="p-main">您当前查询的球鞋溯源码为
                <span>{{orderList.origincode}}</span>,由斗牛球鞋提供售卖、鉴定服务，当前溯源码已被
                <span>{{orderList.checkeduser}}位用户</span>验证，最近一次扫码时间是
                <span>{{orderList.checktime}}</span>更多详细溯源信息请查看下方详情，谢谢！
            </p>
            <div class="source-mark">
            <img src="../../../static/img/source/source_mark@2x.png" alt="">
            </div>
        </div>
        
    </div>
    <div class="information">
        <h4>商品信息</h4>
        <div class="line"></div>
        <div class="message-box">
            <div class="message-img">
                <img :src="orderList.orderpic" alt="">
            </div>
            <div class="trade-name">
                <p>{{orderList.name}}</p>
                <div class="trade-detail">
                    <p>{{orderList.color}}</p>
                    <p>品牌：{{orderList.brandname}}</p>
                    <p>货号：{{orderList.goodsno}}</p>
                </div>
            </div>
        </div>
        <div class="line line-two"></div>
        <div class="price">
            <p>买家拍下价：<span>￥{{orderList.price}}</span></p>
        </div>
        <div class="line"></div>
        <div class="go-buy">
            <div class="logo-img">
                <img src="/static/img/source/logo@2x.png" alt="">
            </div>
            <div><p>斗牛球鞋</p></div>
            <div class="gobuy-font" @click="goProductDetail(orderList.productid)"><p>去购买</p></div>
            <div class="gobuy-img">
                <img src="/static/img/source/buy_btn@2x.png" alt="">
            </div>
        </div>
    </div>
    </div>
    <div class="more" @click="goDetail()">
        <div class="more-title">
            <p>更多溯源信息</p>
            <p class="title-tips">（查询需要验证用户购买手机号信息）</p>
        </div>
        <div class="line"></div>
        <div class="more-body">
            <div class="item">
                <img src="/static/img/source/more_source@2x.png" alt="">
                <p>溯源详情</p>
            </div>
            <div class="item">
                <img src="/static/img/source/more_trading@2x.png" alt="">
                <p>交易信息</p>
            </div>
            <div class="item">
                <img src="/static/img/source/more_identification@2x.png" alt="">
                <p>鉴定详情</p>
            </div>
            <div class="item">
                <img src="/static/img/source/more_order@2x.png" alt="">
                <p>订单跟踪</p>
            </div>
        </div>
    </div>
    
    <Modal type='confirm' @took='okfall2' @tocancel='cancelfall' :showstate='showb'>
            <span class="slot2" slot='tlt'>验证失败</span>
            <div slot='text'>
                <div class="box-tips">
                    <p>您的手机号与该订单手机号不一致，</p>
                    <p>不可查看更多溯源信息~</p>
                </div>
                <div class='footer'>
                    <div class='md-btn'><input class="md-btnin"  @click='okfall2()' type="button" value="确认"></div>
                </div>
            </div>
    </Modal>
    <div class="tips">
        <div class="tips-title">
            <img src="/static/img/source/notice@2x.png" alt="">
            <p>温馨提示</p>
        </div>
        <p class="end-p">所有经斗牛球鞋鉴定、售卖的商品均有唯一溯源码，实现交易的全链路跟踪、保障正品。</p>
    </div>
  </div>

</template>

<script>
    import Modal from './modal'
    import { mapGetters } from "vuex";
    import {getOrder,getOrderDetail} from './../../common/api/traceability'
    const DOMAIN = process.env.NODE_ENV !== 'production' ? window.location.origin : 'https://m.eyee.com'
    export default{
        name:'container',
        components:{
            Modal
        },
       
        data(){
            return {
                friends:1,
                friends1:1,
                time:0,
                showa:false,
                showb:false,
                phoneNum:"", //手机号
                verifyNum:"", //验证码
                btnContent:"获取验证码", //获取验证码按钮内文字
                time:0, //发送验证码间隔时间
                disabled:false, //按钮状态


                orderList:[],
                uniqueid:''
            }
        },
        computed: {
            ...mapGetters({
                user: "userInfo",
                insq: "insq",
            })
        },
        mounted(){
            this.uniqueid = this.$route.params.id
            this.getOrder( this.uniqueid)
        },
        methods:{
            goDetail(){
                if (!this.user.token && !this.insq) {
                    this.$router.push("/login");
                }else{
                    getOrderDetail({uniqueid: this.uniqueid}).then(res => {
                        if(res){
                            this.$router.push({path:`/verify/detail/${this.uniqueid}`})
                        }
                    }).catch(err =>{
                        console.log(err)
                        if(err.code == 1511201){
                            this.showb = true;
                        }else{
                            this.toast('加载失败')
                        }
                    })
                }
            },
            goProductDetail(productid){
                window.location.href = `${DOMAIN}/sneaker/detail/${productid}`
            },
            getOrder(uniqueid){
                var _ = this;
                getOrder({uniqueid:uniqueid}).then(res => {
                    if(res){
                        // console.log(res)
                        _.orderList = res;
                    }     
                }).catch(err =>{
                    this.toast('加载失败')
                })
            },

            inputFunc(){
                this.friends=2;
            },
            inputFunc1(){
                this.friends1=2;
            },
            
            verification(){
                this.showa=false;
                this.showb=true;
                this.disabled = false;
                this.friends = 1;
            },
  
            alerts(){
                this.showa=true;
            },
            
            okfall(){
                this.showa=false;
            },
            okfall2(){
                this.showb=false;
            },
            cancelfall(){
                this.showc=false;
            }
    
        }
    }
</script>

<style scoped>
  p{   
      font-weight: 600;
  }
  .main{
      width: 100%;
      background-color: #f5f5f5;
  }
  .banner{
      width: 100%;
      background-color:#333333;
  }
  .banner .font-top{
      width: 100%;
      padding: 15pt 15pt 20pt 15pt;
  }
  .banner p{
      font-size: 0.9rem;
      font-family: PingFang-SC;
      color: white;
      line-height:17pt;
      font-weight: 200;
      z-index: 100;

  }
  .md-btnin{
      background-color: #333333;
  }
  .p-main{
      text-indent : 30px; 
  }
  .banner span{
      color: red;
  }
  .source-mark{
      position: absolute;
      width: 20%;
      height: 20%;
      right: 1%;
      top: 6%;
  }


  .information{
      position: relative;
      left: 1%;
      margin-top: 1rem;
      width: 98%;
      background-color: white;
      border: 0px;
      border-radius: 5px;
  }
  .information h4{
      font-size: 0.95rem;
      width: 80%;
      padding: 10pt 0 10pt 20pt;
  }
  .line{
      position: relative;
      left: 2%;
      width: 96%;
      height:1px;
      background-color: #cccccc;
  }
  .line-two{
      position: relative;
      top:1rem;
  }
  .message-box{
      display: flex;
      position: relative;
      top:0.5em;
      left: 0.5em;
      justify-content:space-around;
  }
  .message-img{
      width: 8rem;
      box-shadow: rgb(180, 178, 178) 0px 0px 5px;
  }
  .message-img img{
      margin:1em 0 1em 0em ;
  }
  .trade-name{
     width: 80%;
  }
  .trade-name p{
      padding:0 0.2em 0 0.5em;
      font-size: 0.85rem;
      line-height:17pt;
      color:#333333;
  }
  .trade-detail{
      margin: 0.8em 0 0 0;
  }
  .trade-detail p{
      font-size: 0.85rem;
      line-height: 14pt;
  }
  .price{
      text-align: right;
      padding: 15pt 10pt 6pt 20pt;
  }
  .price p{
      font-size: 0.85rem;

  }
  .go-buy{
      display: flex;
      padding: 0.5em 0.5em 0.5em 1em;
  }

  .logo-img{
      width: 5.5%;
  }
  .go-buy p{
      font-size: 0.95rem;
      margin-left: 0.5rem;
      margin-top: -0.15rem;
  }
  .gobuy-font{
      margin-left: 50%;
      color: #666666;
      font-weight: 100;
  }
  .gobuy-img{
      width: 3%;
      margin-left: 1%;
  }

  .more{
      position: relative;
      left: 1%;
      margin-top: 1.5em;
      width: 98%;
      background-color: white;
      border: 0px;
      border-radius: 5px;
  }
  .more-title{
      display: flex;
      width:100%;
      padding: 10pt 0 5pt 20pt;
      font-size: 0.95rem;
  }
  .title-tips{
      font-size: 0.7rem;
      padding: 2pt 0 5pt 0pt;
      color: #666666;
  }
  .more-body{
      width: 90%;
      margin-left: 1rem;
      margin-top: 0.5rem;
      padding-bottom: 0.6rem;
      display: flex;
  }
  .item{
      flex-grow:1;
      padding: 1rem 0 0 0rem;
      text-align: center;
  }
  .item img{
      width:50%;
  }
  .item p{
      font-size: 0.95rem;
  }
  .cancleimg{
      width: 13%;
      position: relative;
      left:40%;
      bottom: 10%
  }
  .box-tips{
      text-align: center;
      color: #333333;
      line-height: 2rem;
      font-size: 1rem;
      padding: 2rem 0 0 0;
  }
  

  .tips{
      position: relative;
      margin-top: 1rem;
      padding-bottom: 2rem;
      left: 8%;
      width: 84%;
      font-size: 0.6rem;
  }
  .tips-title{
      display: flex;
  }
  .tips-title img{
      width: 5%;
      height: 5%;
  }
  .tips-title p{
      color: #777777;
  }
  .end-p{
      margin-top: 0.5rem;
      color: #999999;
  }


  .alert-input{
      position: relative;
      border:1.5pt solid #333333;
      border-top: none;
      border-left: none;
      border-right: none;
      width: 95%;
      margin-top: 2rem;
  }
  .input-two{
      width: 55%;
      margin-top: 2.5rem;
  }
  .input-btn{
      position: relative;
      bottom:0.7rem;
      left: 1%;
      width: 40%;
      padding: 0.7rem 0.5rem 0.7rem 0.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
      border-radius: 3px;
      color:#fff;
  }
  .slot{
      position: relative;
      left:30%;
  }
  .slot2{
      position: relative;
      left:35%;
  }
  .border-b{
    background-color: #cccccc;
  }
  .border-none{
    background-color: #333333;
  }
  .border1-b{
    background-color: #cccccc;
  }
  .border1-none{
    background-color: #333333;
  }
  

.footer{
        background-color: #fff;
        width: 105.5%;
        line-height:3rem;
        color:#fff;
        font-size:1.3rem;
        border-radius:15pt;
        position: relative;
        right: 0.5rem;
        top: 1.2rem;
    }
</style>


