<template>
  <div class="add-info-mask">
    <div class="add-info">
      <!-- <div class="img-wrap">
        <img src="../../../static/img/addinfo3.png">
      </div> -->
      <div class="give">
        <!-- <p class="give-info">10元礼券已经加入您的个人账户</p> -->
        <div class="go-btn" @click.stop="goAddUserInfo">完善信息</div>
        <div class="close" @click="gotoHome()">
          <img src="//files.eyee.com/mcdn/static/img/close.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import { UpdateInfo } from '../../common/api/user'
    export default {
      data() {
        return {}
      },
      props: {},
      computed: {},
      watch: {},
      methods: {
        goAddUserInfo() {
          UpdateInfo({ sex: this.ischeck }).then((res) => {
            if (res) {
              console.log(res)
            }
          }).catch((e) => {
            console.log(e)
          })
          this.$router.replace('/user/account')
        },
        gotoHome() {
          this.$router.push('/')
        }
      },
      mounted() {
      },
      components: {}
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
    background:url('//files.eyee.com/mcdn/static/img/wanshanBg.jpg') 0 0 no-repeat;
    background-size:100%;
    background-position: 0 -100px;
  }
  .add-info{
    width: 240px;
    height: 316px;
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 4px;
    background:url('../../../static/img/addinfo3.png') 0 0 no-repeat;
    background-size: 100% 100%;
    /* overflow: hidden; */
  }
  .add-info .img-wrap{
    width: 260px;
    height: 200px;
  }
  .add-info .img-wrap img{
    width: 100%;
    height: 100%;
  }
  .give{
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
    width: 200px;
    background: #ffc700;
    border-radius: 4px;
    text-align: center;
    margin:5px auto;
    color: white;
    position: absolute;
    left: 50%;
    margin-left: -100px;
    bottom: 30px;
    font-size: 18px;
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

