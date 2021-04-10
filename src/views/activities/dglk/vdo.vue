<template>
  <keep-alive>
    <div :delay="600" class="kol-vdo">
      <video
        src="https://files.eyee.com/weapp/bargain/dglk.mp4"
        controls
        autoplay
        webkit-playsinline="webkit-playsinline"
        playsinline="playsinline"
      ></video>
    </div>
  </keep-alive>
</template>
<style scoped>
.kol-vdo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
}
.kol-vdo video {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  display: block;
}
</style>
