<template>
  <div class="video">
    <video width="100%" height="auto" autoplay="autoplay" controls="controls" muted="muted">
  　　<source src="//files.eyee.com/activity/test/test01.mp4" type="video/mp4"></source>
　　</video>
  </div>
</template>
<script>
export default {
  name: 'vipVideo',
  data() {
    return {}
  },
  beforeMount() {
    this.setToolBar({
      title: '潮牌盲盒',
      bgcolor: '#232323',
      textcolor: '#FFFFFF'
    })
  }
}
</script>