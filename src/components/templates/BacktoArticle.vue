<template>
  <div class="back-newshome">
    <img :src="img" alt="" @click="backtoMainArticle()">
  </div>
</template>
<script>
export default {
  name: 'BacktoArticle',
  data() {
    return {
      img: '//files.eyee.com/mcdn/static/img/home_news.png' // require('../../assets/img/home_news.png')
    }
  },
  methods: {
    backtoMainArticle: function () {
      this.$router.push('/news')
    }
  }
}
</script>
