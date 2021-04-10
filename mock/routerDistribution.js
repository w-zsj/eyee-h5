const Router = require('koa-router')

const router = new Router()

router.post('/api/distribution/entryProducts', (ctx, next) => {
  ctx.body = {
    'code': 1511200,  // 返回码，1511200：成功，其它是错误
    'expiretime': 0,  // 是否缓存
    'msg': '',  // 当返回码不是1511200时才会出现，返回错误信息
    'data': {// 数据内容
      'total': 6,  // 数据总数，返回码为true时才会返回。
      'page': 1,  //  当前页
      'size': 6,  // 返回的数据数
      'list': [
        {
          'id': '1',  // id
          'pid': '0572c40b38264ab59577cb298bf7435b', // 商品id
          'title': 'ESCVEL 刺绣落肩短袖连帽卫衣',  // 商品标题
          'brand': 'ESCVEL',  // 商品品牌
          'marketprice': 288,  //  原价（划掉的）
          'saleprice': 249,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/640a438422114002b35954c7cf649972.jpg!w400'  // 图片URL
        },
        {
          'id': '2',  // id
          'pid': 'd322129790824ef8a8f84c32514c917a', // 商品id
          'title': 'Chillhigh 2017AW Vol.2 秋冬百搭花纹保暖高领卫衣男女长袖时尚',  // 商品标题
          'brand': 'ChillHigh Brand',  // 商品品牌
          'marketprice': 318,  //  原价（划掉的）
          'saleprice': 229,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/5b984276f72844cb8819181b0245db5e.jpg!w400'  // 图片URL
        },
        {
          'id': '3',  // id
          'pid': 'ed756dea60aa48c7b7a88cb2522708a0', // 商品id
          'title': '日版Champion 大LOGO 帽衫',  // 商品标题
          'brand': 'Champion',  // 商品品牌
          'marketprice': 400,  //  原价（划掉的）
          'saleprice': 399,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/eb8cf7e35a774478b0798c03b444b9f6.jpg!w400'  // 图片URL
        },
        {
          'id': '4',  // id
          'pid': '2eccec8cbd28430fbd660266a03fb849', // 商品id
          'title': 'HEY MAN原创潮牌棉麻口袋工装休闲裤',  // 商品标题
          'brand': 'HEY MAN！',  // 商品品牌
          'marketprice': 556,  //  原价（划掉的）
          'saleprice': 389,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/03438aef856c48ed98ee33e88aa2f6b3.jpg!w400'  // 图片URL
        },
        {
          'id': '5',  // id
          'pid': 'e981c26b96dc43bd8210a028d863435b', // 商品id
          'title': 'GUPODO四色两条杠休闲收脚裤2018春',  // 商品标题
          'brand': '暗嘿骑士',  // 商品品牌
          'marketprice': 224,  //  原价（划掉的）
          'saleprice': 179,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/ff5ff3ab48d64f0eb44f64e5dc9fe706.jpg!w400'  // 图片URL
        },
        {
          'id': '6',  // id
          'pid': 'cb09ef90cc69473fb71b44c652b6bd61', // 商品id
          'title': '艺术字英文字短TEE',  // 商品标题
          'brand': 'RARE SHOP',  // 商品品牌
          'marketprice': 356,  //  原价（划掉的）
          'saleprice': 320,  // 价格
          'imageurl': 'http://files.eyee.com/Shop/system/main/f0dace3d91d94fc1ac297c90d09ba3af.jpg!w400'  // 图片URL
        }
      ]
    }
  }
})




module.exports = router
