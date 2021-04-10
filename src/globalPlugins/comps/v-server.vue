<template>
    <div>
        <div class="nav-server flex-center" @click='click'>
            <img :src="serverImg" alt="">
        </div>
    </div>
</template>
<script>
export default {
  props: {
    isShow: { type: Boolean, default: false },
    click: Function
  },
  computed: {
    serverImg() {
      return "//files.eyee.com/mcdn/static/img/service.png"; // require('./assets/img/service.png')
    }
  }
};
</script>