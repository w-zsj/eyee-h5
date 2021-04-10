<template>
  <router-link class="superme" v-if="supremes&&supremes.length>0" :to="{name:'sale',params:{id:supremes[0].id}}" tag="div">
    <img v-lazy="https(supremes[0].coverurl)" @click='supremeGo' />
  </router-link>
</template>
<script>
export default {
  name: 'superme',
  props: { supremes: { default: [] }},
  methods: {
    supremeGo() {
      let rect = window.document.querySelector('.superme').getBoundingClientRect()

    }
  }
}
</script>
<style scoped>
.superme {
  padding: 0;
  margin: 10px 10px 0;
  border-radius: 10px;
  overflow: hidden;
}
.superme > img {
  display: block;
}
</style>
