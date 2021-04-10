<template>
    <div class="comment_fixed clearfix">
        <div class="button-comts">
            <div class="toComts" @click="loadApp(articleInfo.type)"> 唠叨两句...</div>
        </div>
        <div class="button-ico clearfix">
            <span @click="loadApp(articleInfo.type)">
                <b v-if="articleInfo.commentcount&&articleInfo.commentcount>0">{{articleInfo.commentcount>99?'99+':articleInfo.commentcount}}</b>
                <em class="ico-msg-col"></em>
            </span>
            <span @click="favArticle()">
                <em :class="{'ico-heart-yell':!articleInfo.isfavor,'ico-heart-favoryell':articleInfo.isfavor,bs_animate:favShow}"></em>
            </span>
        </div>
    </div>
</template>
<script>
    import { FavorArticle } from '../../common/api/userFavor'
    import { mapGetters } from 'vuex'
    export default {
      name: 'CommentFixed',
      props: {
        articleInfo: { type: Object }
      },
      data() {
        return {
          favShow: false
        }
      },
      mounted() {
        this.$parent.$el.style.marginBottom = this.$el.clientHeight + 'px'
  },
      computed: {
        ...mapGetters({ localUserInfos: 'userInfo' })
        // localUserInfos() {
        //   return JSON.parse(localStorage.getItem('currentUser'))
        // }
      },
      methods: {
        favArticle() {
          console.log(this.articleInfo)
          if (this.localUserInfos && this.localUserInfos.token) {
            var postData = {
              ArticleId: this.articleInfo.id,
              IsCancel: this.articleInfo.isfavor
            }
            var errormsg = ''
            FavorArticle(postData).then((res) => {
              this.favShow = true
              setTimeout(() => {
                this.favShow = false
                this.articleInfo.isfavor = !this.articleInfo.isfavor
                if (this.articleInfo.isfavor) {
                  errormsg = '收藏成功'
                }
                if (!this.articleInfo.isfavor) {
                  errormsg = '取消收藏成功'
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
	.comment_fixed{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 40px;
        z-index: 1;
        background: #fff;
	}
    .comment_fixed .button-comts {
        float: left;
        width: 70%;
    }
    .comment_fixed .button-comts .toComts {
        position: relative;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #fff;
        margin: 0;
        padding: 0 15px;
        font-size: .75rem;
        padding-left: 15px;
        /*border: 1px solid #eee;*/
        background: #ccc;
    }
    .comment_fixed .button-comts .toComts:before{
        content: '';
        position: absolute;
        display: inline-block;
        width: 1px;
        height: 80%;
        top: 10%;
        left: 5px;
        background: #fff;
    }
    .comment_fixed .button-ico {
        float: right;
        width: 30%;
        height: 40px;
        line-height: 40px;
    }
    .comment_fixed .button-ico>span{
        display: block;
        float: left;
        width: 50%;
        text-align: center;
        position: relative;
    }
    .comment_fixed .button-ico>span b{
        position: absolute;
        top: 5%;
        right: 15%;
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        color: #fff;
        padding: 0 5px;
        background-color: #ffc700;
        z-index: 1;
    }
</style>
