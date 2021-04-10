<template>
  <div class="about" v-once>
    <header>
      斗牛简介
      <br>
      <div>
        <i></i>
        <span></span>
        <i></i>
      </div>
    </header>
    <article>
      <section class="aboutUs_section border_bottom">
        斗牛致力于建立中国最具影响力的潮流电商平台，这里汇聚了全球最潮最in的时尚单品和潮流限定单品。斗牛将引领中国消费者开启时尚潮流品牌的新购物模式，并借此模式引领中国潮流文化走向国际化。
      </section>
      <section class="aboutUs_section border_bottom">
        斗牛提供的商品从时尚潮流服饰到日常家居潮流单品等等，涉及生活中的方方面面。便捷的购买体验让你在“衣食住行”各方面成为最in的潮人。同时，这里提供最前沿的时尚资讯，让你足不出户就可以一探全球潮流中心城市的究竟。
      </section>
      <section class="aboutUs_section content">
        【限量发售】还在为一件限量单品扛着时差猛按F5刷新或者排一天的队就为了一双鞋、一件衣服吗？斗牛定期发售时尚品牌限量单品，满足你在家就能买一手限定商品的梦想。
      </section>
      <section class="aboutUs_section content">
        【潮店】这里拥有全球时尚大牌的“大众流行”单品，这里还有“鬼才”设计师们独具匠心的原创品牌店铺。
      </section>
      <section class="aboutUs_section content">
        【鬼市】从潮流到日常生活品牌，斗牛都将提供最大让利折扣，让你安心享受最超值优惠。
      </section>
    </article>
    <div class="footer_div">
      <p class="footer">联系我们：</p>
      <p>官方网站：www.eyee.com </p>
      <p>服务邮箱：service@eyee.com</p>
      <p>市场合作：magicya@eyee.com</p>
      <p>商家入驻：andy@eyee.com</p>
      <p>联系电话：021-60663633</p>
      <p>服务时间：9：30-18：30</p>
    </div>
    <p class="foot_p">
      如有任何问题，欢迎通过以上各种方式与我们取得联系。
    </p>
  </div>
</template>
<style scoped>

  @media screen and (min-width: 768px) {
    .about header {
      font-size: 30px;
    }
    .about article {
      line-height: 35px;
    }
    .about article section {
      font-size: 20px;
    }
    .about article section.border_bottom {
      border-bottom: 2px solid #fafafa;
      padding: 30px 25px;
    }
    .about article section.content {
      padding: 10px 25px;
    }

    .about .footer_div {
      margin: 0 auto 20px;
      font-size: 20px;
      width: 280px;
    }
    .about .footer {
      margin: 0 auto;
      color: #333;
      font-weight: 600;
      text-align: center;
      margin-bottom: 10px;
    }
    .about .footer_div span {
      display: block;
      line-height: 25px;
    }
    .about .foot_p {
      padding-left: 37px;
      font-size: 20px;
      color: #333;
    }
  }

  .about p>span,
  .about p>a {
    color: #666;
    font-size: 0.875rem;
  }

  .about p>span.tit-con {
    color: #333;
  }

  .about .tipsbox {
    padding: 10px 30px;
    line-height: 24px;
  }

  .about .bgcolr {
    background: #333;
    color: #fff;
  }

  @media screen and (max-width: 420px) {
    .about article {
      line-height: 25px;
    }
    .about article section {
      font-size: 0.875rem;
      ;
    }

    .about article section.border_bottom {
      border-bottom: 1px solid #fafafa;
      padding: 12px 30px;
    }
    .about article section.content {
      padding: 10px 30px;
    }

    .about .footer_div {
      margin: 0 auto 20px;
      font-size: 0.875rem;
      width: 210px;
    }
    .about .footer {
      margin: 0 auto;
      color: #333;
      font-weight: 600;
      font-size: 0.875rem;
      text-align: center;
      margin-bottom: 10px;
    }
    .about .footer_div p {
      display: block;
      font-size: 14px;
      line-height: 22px;
    }
    .about .foot_p {
      font-size: 14px;
      padding-left: 17px;
      color: #333;
    }
  }
</style>
