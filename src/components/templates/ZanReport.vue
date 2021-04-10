<template>
    <div class="zan_report">
        <div class="zan_list clearfix">
            <ul>
                <li v-for="(d,index) in diglist" :key="index">
                    <span>
                        <img v-lazy="https(d)" alt="">
                    </span>
                </li>
            </ul>
            <div class="zan_word" @click="zanArticle()">
                <span v-if="diglist.length === 0">快来点赞吧</span>
                <span v-if="diglist.length !== 0">
                    <span class="zan_person">{{digDetls.digcount}}</span>人点赞&nbsp;&nbsp;</span>
                <em :class="{'ico-zan-thumb':!digDetls.isdig,'ico-zan-favor':digDetls.isdig,bs_animate:favShow}"></em>
            </div>
        </div>
        <p class="post_word" @click.stop.prevent="loadApp(artitype)">
            <em class="ico-poster-tri"></em>
            <span>举报</span>
        </p>
    </div>
</template>
<script>
    import { DigArticle } from '../../common/api/userFavor'
    import { mapGetters } from 'vuex'
    export default {
      name: 'ZanReport',
      props: {
        artitype: {},
        diglist: {},
        digDetls: {}
      },
      data() {
        return {
          favShow: false
        }
      },
      computed: {
        ...mapGetters({ localUserInfos: 'userInfo' })
        // localUserInfos() {
        //   return JSON.parse(localStorage.getItem('currentUser'))
        // }
      },
      methods: {
        zanArticle() {
          console.log(this.digDetls)
          if (this.localUserInfos && this.localUserInfos.token) {
            var postData = {
              articleid: this.digDetls.id,
              IsCancel: this.digDetls.isdig
            }
            var errormsg = ''
            DigArticle(postData).then((res) => {
              this.favShow = true
              setTimeout(() => {
                this.favShow = false
                this.digDetls.isdig = !this.digDetls.isdig
                if (this.digDetls.isdig) {
                  this.digDetls.digcount = this.digDetls.digcount + 1
                  errormsg = '点赞成功'
                }
                if (!this.digDetls.isdig) {
                  this.digDetls.digcount = this.digDetls.digcount - 1
                  errormsg = '取消点赞成功'
                }
                this.toast(errormsg)
              }, 500)
            }).catch((err) => {
              console.log('err', err)
              this.toast(err.msg)
            })
          } else {
            // if (this.$root.ISWX) {
            //   this.$router.push('/wxlogin')
            // } else {
            //   this.$router.push('/login')
            // }
            this.$router.push('/login')
          }
        }
      }
    }

</script>
<style scoped>
    .zan_report {
        padding: 0 10px;
        margin: 20px auto;
    }

    .zan_report .zan_list ul {
        float: left;
        width: 75%;
        min-height: 1px;
    }

    .zan_report .zan_list li {
        position: relative;
        float: left;
        z-index: 1;
        height: 40px;
        width: 40px;
        margin-left: -15px;
    }

    .zan_report .zan_list li:first-child {
        margin-left: 0;
    }

    .zan_report .zan_list li>span {
        display: inline-block;
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid #fff;
        padding: 2px;
    }

    .zan_report .zan_list li img {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 34px;
        vertical-align: middle;
        height: 34px;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }

    .zan_report .zan_word {
        float: left;
        text-align: right;
        width: 25%;
        height: 40px;
        line-height: 40px;
    }

    .zan_report p {
        line-height: 20px;
        text-align: right;
        margin-bottom: 10px;
    }

    .zan_report .post_word {
        margin: 30px auto;
    }

    .zan_report .zan_word span,
    .zan_report .post_word span {
        display: inline-block;
        vertical-align: middle;
        font-size: .75rem;
        color: #333;
    }

    .zan_report .zan_word .zan_person {
        margin-right: 2px;
        color: #ffc700;
    }
</style>
