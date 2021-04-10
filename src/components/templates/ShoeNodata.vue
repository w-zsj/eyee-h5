<template>
  <div class='no-shoe flex-center' v-else>
    <img :src="noShoeImg" alt="">
    <p>
      <slot></slot>
    </p>
  </div>
</template>
<script>
export default {
  name: 'no-shoe',
  data() {
    return {
      noShoeImg: '//files.eyee.com/mcdn/static/img/no_shoe.png' // require('../../assets/img/no_shoe.png')
    }
  }
}
</script>
<style scoped>
.no-shoe {
  text-align: center;
  color: #999;
  font-size: 14px;
  flex-direction: column;
  min-height: 300px;
}

.no-shoe img {
  max-width: 130px;
  margin-bottom: 30px;
}
</style>
