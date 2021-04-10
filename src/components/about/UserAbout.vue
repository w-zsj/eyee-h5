<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>关于斗牛</h3>
      </div>
    </v-header>
    <ul class="about_ul" style="height:100vh">
      <router-link to="/slas" tag="li">
        服务协议
        <p class="flex-center"><span class="rights_icon"></span></p>
      </router-link>
      <router-link to="/about/secret" tag="li">
        隐私政策
        <p class="flex-center"><span class="rights_icon"></span></p>
      </router-link>
      <router-link to="/aboutus" tag="li">
        关于我们
        <p class="flex-center"><span class="rights_icon"></span></p>
      </router-link>
      <router-link to="/shoppingtips" tag="li">
        购物须知
        <p class="flex-center"><span class="rights_icon"></span></p>
      </router-link>
      <router-link to="/company/information" tag="li" style="border:none">
        公司信息
        <p class="flex-center"><span class="rights_icon"></span></p>
      </router-link>
    </ul>
  </div>
</template>
<style scoped>
.about_ul {
  background: #f0f0f0;
}

.about_ul > li {
  background: #fff;
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
</style>