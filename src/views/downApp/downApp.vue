<template>
    <div class="down-app">
        <div class="box_one">
            <div class="middle-box">
                <img  class="logo-img" src="/static/imgs/downapp/downapp_pc_logo.png" alt="">
                <div class="left_right clearfix">
                    <div class="left_part">
                        <img width="360px" height="301px" src="/static/imgs/downapp/downapp_pc_donow.png" alt="">
                        <div class="left_right clearfix">
                            <div class="app-lists">
                                <p class="flex-center" @click="gotoIos()"><img width="30px" height="30px" src="/static/imgs/downapp/downapp_pc_ios.png" alt="">&nbsp;&nbsp;&nbsp;iPhone</p>
                                <p class="flex-center" @click="gotoAnd()"><img width="30px" height="30px" src="/static/imgs/downapp/downapp_pc_and.png" alt="">&nbsp;Android</p>
                            </div>
                            <div class="qrcode">
                                <img width="150px" height="150px" src="/static/imgs/downapp/downapp_pc_code.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="right_part">
                        <img width="560px" height="632px" src="/static/imgs/downapp/downapp_pc_main_1.jpg" alt="">    
                    </div>
                </div>
            </div>
        </div>
        <div class="red-bg">
            <div class="middle-box">
                <div class="left_right clearfix">
                    <div class="left_con">
                        <img class="left_quote" src="/static/imgs/downapp/downapp_pc_white.png" alt="">
                        <img class="donow_nebr" src="/static/imgs/downapp/downapp_pc_word2.png" alt="">
                        <p>发现潮流球鞋穿搭<br>表达最真实的态度</p>
                        <img class="right_quote" src="/static/imgs/downapp/downapp_pc_white2.png" alt="">
                    </div>
                    <div>
                        <img  src="/static/imgs/downapp/downapp_pc_neigb.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="box-three">
            <div class="middle-box">
                <div class="left_right clearfix">
                    <div>
                        <img  src="/static/imgs/downapp/downapp_pc_calendar.png" alt="">
                    </div>
                    <div class="right_con">
                        <img class="left_quote" src="/static/imgs/downapp/downapp_pc_redquote.png" alt="">
                        <img class="donow_nebr" src="/static/imgs/downapp/downapp_pc_word.png" alt="">
                        <p>汇聚全网限量球鞋发售信息<br>轻松原价入鞋</p>
                        <img class="right_quote" src="/static/imgs/downapp/downapp_pc_redquote2.png" alt="">
                    </div>
                </div> 
            </div>
        </div>
        <!-- <div class="red-bg box-four">
            <div class="middle-box">
                <div class="left_right clearfix">
                    <div class="left_con">
                        <img class="left_quote" src="/static/imgs/downapp/downapp_pc_white.png" alt="">
                        <img class="donow_nebr" src="/static/imgs/downapp/downapp_pc_word3.png" alt="">
                        <p>多重鉴别，确保正品！<br>海量鞋款任你选购</p>
                        <img class="right_quote" src="/static/imgs/downapp/downapp_pc_white2.png" alt="">
                    </div>
                    <div >
                        <img  src="/static/imgs/downapp/downapp_pc_shoes.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="box-three">
            <div class="middle-box">
                <div class="left_right clearfix">
                    <div>
                        <img  src="/static/imgs/downapp/downapp_pc_shopping.png" alt="">
                    </div>
                    <div class="right_con">
                        <img class="left_quote" src="/static/imgs/downapp/downapp_pc_redquote.png" alt="">
                        <img class="donow_nebr" src="/static/imgs/downapp/downapp_pc_word4.png" alt="">
                        <p>潮牌定期品牌特卖<br>精选全球潮流品牌正品</p>
                        <img class="right_quote" src="/static/imgs/downapp/downapp_pc_redquote2.png" alt="">
                    </div>
                </div> 
            </div>
        </div> -->
        <div class="footer-box flex-center flex-col">
            <p class="business_name">上海砸立电子商务有限公司</p>
            <p>地址：上海市金山区张堰镇工业区振帆路51号&nbsp;&nbsp;联系电话：021-60298566&nbsp;&nbsp; 备案号：沪ICP备15055176号-1</p>
        </div>
    </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  methods: {
    gotoIos:function(){
        window.location.href = 'https://itunes.apple.com/cn/app/id962223967?mt=8'
    },
    gotoAnd:function(){

        window.location.href = 'https://files.eyee.com/app/update/eyee.apk'
    }
  }
};
</script>
<style scoped>
    .down-app{
        min-width: 1200px;
        width: 100%;
        position: absolute;
        left: 50%;
        margin-left: -50%;
    }
    img{
        display: block;
    }
    .middle-box{
        width: 1200px;
        margin: 0 auto;
    }
    .box_one .middle-box{
        padding:14px 75px 8px; 
    }
    .box-three .middle-box{ 
        padding: 16px 80px 0;
    }
    .logo-img{
        width: 160px;
        height: 40px;
        margin-bottom: 26px;
    }
    .left_right>div{
        float: left;
    }
    .left_part{
        padding: 48px 0 0 5px;
        margin-right: 124px;
    }
    .app-lists{
        margin-top: 30px;
    }
    .app-lists>p{
        font-size: 20px;
        color: #fff;
        background-color: #FF4150;
        border-radius: 7px;
        width: 170px;
        height: 60px;
        margin-bottom: 25px;
        font-weight: 600;
    }
    .qrcode{
        margin-top: 27px;
        margin-left: 25px;
    }
    .red-bg{
        background-color: #FF4150;
    }
    .red-bg .middle-box{
        padding: 38px 160px 38px 111px;
    }
    .left_con{
        margin: 152px 355px 0 0;
    }
    .box-four .left_con{
        margin: 152px 291px 0 0;
    }
    .left_con>p{
        font-size: 32px;
        color: #ffe3e3;
        line-height: 45px;
        margin-bottom: 50px;
        font-weight: 600;
    }
    .left_quote{
        margin-bottom: 50px;
    }
    .box-three .right_con{
        margin: 174px 0 0 278px;
    }
    .left_con .right_quote{
        margin-left: 160px;
    }
    .right_con .right_quote{
        margin-left: 152px;
    }
    .right_con>p{
        font-size: 32px;
        color: #ff8888;
        line-height: 45px;
        margin-bottom: 50px;
        font-weight: 600;
    }
    .donow_nebr{
        margin-bottom: 25px;
    }
    .footer-box{
        background-color: #FF4150;
        color:#fff;
        height: 118px;
        font-size: 12px;
        font-weight: 600;
    }
    .business_name{
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 10px;
    }
</style>
