<template>
    <div class="article_label">
        <span v-for="(item,index) in info" :key="index" @click.stop.prevent="go(item.labelname)">{{item.labelname}}</span>
    </div>
</template>
<script>
    import { ENUM, Storage } from '../../common/util'
    export default {
      name: 'ArticleLabel',
      data() {
        return {
        }
      },
      props: {
        labelists: { }
      },
      mounted() {
    
      },
      computed: {
        info() {
          return this.labelists
        }
      },
      methods: {
        go(key) {
          this.$router.push('/news/search/' + key)
        }
      }
    }
</script>
<style scoped>
    .article_label{
        padding: 0 10px;
        margin: 20px auto;
    }
    .article_label >span{
        display: inline-block;
        background:#333;
        border-radius:2px;
        height:30px;
        line-height: 30px;
        color: #fff;
        font-size: .875rem;
        padding: 0 10px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>