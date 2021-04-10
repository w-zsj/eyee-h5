<template>
  <div class="add-info-mask" v-show='isshow'>
    <div class="add-info">
      <div class="add-info-img">
        <img src="//files.eyee.com/mcdn/static/img/liwu04.png" alt="">
      </div>
      <div class="tetx">
           <i>恭喜你,领取成功</i>
          <em>请前往个人中心-卡卷查看</em>
      </div>
      <div class="give" >
        <div class="go-btn" @click.stop="gotoHome">先去逛逛</div>
        <div class="go-btn" @click.stop="goAddUserInfo">完善信息</div>
      </div>
    </div>
  </div>
</template>
<script>
    const elBody = document.getElementsByTagName("body")[0];
    export default {
      data() {
        return {
          isshow: true
        }
      },
      methods: {
        goAddUserInfo() {
          this.isshow = false
           sessionStorage.setItem('flg', '1')
           sessionStorage.removeItem('newpeople')
          this.$router.push('/user/account')
          elBody.classList.remove("lock");

        },
        gotoHome() {
          this.isshow = false
          sessionStorage.setItem('flg', '1')
          sessionStorage.removeItem('newpeople')
          this.$router.push('/')
          elBody.classList.remove("lock");

        }
      },
      mounted(){
        elBody.classList.add("lock");
      }

    }
</script>
<style scoped>
  .add-info-mask{
    position: fixed;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background:rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  .add-info{
    /*居中*/
    width: 240px;
    height: 316px;
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 14px;
    background: #000;
    /* background:url('//files.eyee.com/mcdn/static/img/liwu04.png') 0 0 no-repeat; */
    /* background-size: 100% 100%; */
    /* overflow: hidden; */
  }
  .add-info-img{
    width: 50%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .add-info.bgbold{
    background: #000;
  }
  .add-info.bgbold .title{
    font-family:PingFangSC-Medium;
    font-size:18px;
    color:#ffffff;
    letter-spacing:0;
    line-height:20px;
    text-align:center;
    margin-top: 30px;

  }
  .add-info .img-wrap{
    width: 260px;
    height: 200px;
  }
  .add-info .img-wrap img{
    width: 100%;
    height: 100%;
  }
  .tetx i,.tetx em{
    color: #fff;
    position: absolute;
    bottom: 100px;
    width: 100%;
    left: 0;
    text-align: center;
    font-style: normal;
    font-size: 16px;
  }
  .tetx em{
    bottom: 80px;
    font-size: 12px;
  }
  .give,.tetx{
    width:80%;
    margin:10px  auto 0;
    font-size: 12px;
  }
  .give .give-info{
    width:100%;
    text-align: center;
    line-height: 18px;
    color: #3ca0d1;
  }
  .give .go-btn{
    height: 35px;
    line-height: 35px;
    width: 100px;
    background: #ffc700;
    border-radius: 4px;
    text-align: center;
    margin:5px auto;
    color: white;
    position: absolute;
    left: 10px;
    /* margin-left: -50px; */
    bottom: 30px;
    font-size: 18px;
    float: left;
  }
  .give .go-btn:nth-child(2){
    left: auto;
    right:10px;

  }
  .close{
    position: absolute;
    width: 30px;
    height: 30px;
    left: 50%;
    margin-left: -15px;
    bottom: -50px;
    border-radius: 50%;
    border: 1px solid #ccc;
    overflow: hidden;
    text-align: center;
  }
  .close img{
    width: 80%;
    height: 80%;
    border-radius: 50%;
    margin-top:3px;
  }

</style>

