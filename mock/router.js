const Router = require('koa-router')

const router = new Router()
// 商家 个人 出售页
router.post('/api/Marketing/GetNewOrderUserCoupon', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": {
      unusable: [
        {
          "couponuserid": "111",
          "usestatus":0,//: int 状态 0 未使用 1 已使用 2 过期
          "gettime":"2018-10-09",// "String 领取时间:yyyy MM DD hh:mm:ss.SSS +8"
          "usebegintime": "2018-10-19",//": "String 使用时间:yyyy MM DD hh:mm:ss.SSS +8 未使用返回null"
           "useendtime": "2018-08-09 16:01:18 +8",
          "couponid": 13213,//"String 优惠券id"
          "title": "String 优惠券标题",
          "titlecn": "String 优惠券中文标题",
          "platformtype":2,// int 平台类型 0 平台 1 店铺 2 商品 3 定向(排除不参入优惠券商品)
          "facevalue": 50,//int 优惠券面值
          "usecondition":120, //int 使用条件 满*可用 0 不限
          "usedesc": "String 使用条件介绍",
          "type":1,//"1表示券,2红包"
          "isoverlay":true,//"false 不叠加,true叠加"
        }
      ],
      usable: [
        {
          "couponuserid": "111",
          "usestatus":0,//: int 状态 0 未使用 1 已使用 2 过期
          "gettime":"2018-10-09",// "String 领取时间:yyyy MM DD hh:mm:ss.SSS +8"
          "usebegintime": "2018-10-08",//": "String 使用时间:yyyy MM DD hh:mm:ss.SSS +8 未使用返回null"
           "useendtime": "2018-10-19 16:01:18 +8",
          "couponid": 13213,//"String 优惠券id"
          "title": "String 优惠券标题",
          "titlecn": "String 优惠券中文标题",
          "platformtype":1,// int 平台类型 0 平台 1 店铺 2 商品 3 定向(排除不参入优惠券商品)
          "facevalue": 50,//int 优惠券面值
          "usecondition":120, //int 使用条件 满*可用 0 不限
          "productid": "2eccec8cbd28430fbd660266a03fb849",// yuYhYLvx  2eccec8cbd28430fbd660266a03fb849 "String 可用商品id 非商品优惠券返回null",
          "usedesc": "String 使用条件介绍",
          "type":2,//"1表示券,2红包"
          "isoverlay":true,//"false 不叠加,true叠加"
        },
        {
          "couponuserid": "111",
          "usestatus":0,//: int 状态 0 未使用 1 已使用 2 过期
          "gettime":"2018-10-09",// "String 领取时间:yyyy MM DD hh:mm:ss.SSS +8"
          "usebegintime": "2018-10-08",//": "String 使用时间:yyyy MM DD hh:mm:ss.SSS +8 未使用返回null"
           "useendtime": "2018-10-19 16:01:18 +8",
          "couponid": 13213,//"String 优惠券id"
          "title": "String 优惠券标题",
          "titlecn": "String 优惠券中文标题",
          "platformtype":1,// int 平台类型 0 平台 1 店铺 2 商品 3 定向(排除不参入优惠券商品)
          "facevalue": 1,//int 优惠券面值
          "usecondition":120, //int 使用条件 满*可用 0 不限
          "productid": "2eccec8cbd28430fbd660266a03fb849",// yuYhYLvx  2eccec8cbd28430fbd660266a03fb849 "String 可用商品id 非商品优惠券返回null",
          "usedesc": "String 使用条件介绍",
          "type":2,//"1表示券,2红包"
          "isoverlay":true,//"false 不叠加,true叠加"
        }
      ]
    }
  }
})
router.post('/capi/channel/qiuxie/mysell', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": {
      "pledgeMoney": 5000,
      "type": 0,// 0/代表用户 ,1:代表商家"
      "sellSuccessCount": 20,//"int 出售 成交量",
      "sellSumMoney": 1536,//"dounble出售总金额",
      list: [
        {
          "count": 1,//"string 出售 代发货 ,的数量",
          "type": 0  //0: 出售中, 1: 代发货, 2: 已发货, 3: 交易成功, 4: 交易失败
        },
        {
          "count": 1,//"string 出售 代发货 ,的数量",
          "type": 1  //0: 出售中, 1: 代发货, 2: 已发货, 3: 交易成功, 4: 交易失败
        },
        {
          "count": 1,//"string 出售 代发货 ,的数量",
          "type": 2  //0: 出售中, 1: 代发货, 2: 已发货, 3: 交易成功, 4: 交易失败
        },
        {
          "count": 1,//"string 出售 代发货 ,的数量",
          "type": 3  //0: 出售中, 1: 代发货, 2: 已发货, 3: 交易成功, 4: 交易失败
        },
        {
          "count": 1,//"string 出售 代发货 ,的数量",
          "type": 4  //0: 出售中, 1: 代发货, 2: 已发货, 3: 交易成功, 4: 交易失败
        }
      ]

    }
  }
})

// 买家订单详情
router.get('/capi/order/front/getOrderDetail', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": {
      address: "上海 上海市 闵行区 合川路 3111号 2号7楼",
      businessid: "12",
      businessname: "官方专卖店",
      businesstype: 1,
      createdat: "2018-08-12 20:10:00",
      discountmoney: 0,
      expiredtime: "2018-08-18 20:40:00",
      expresscompany: "顺丰",
      expressfee: 0,
      expressno: "1568942110368",
      identifyinfo: "商品有瑕疵",
      items: [
        {
          createtime: "2018-08-12 20:10:00",
          productid: "1147",
          color: "红白",
          num: 1,
          brandname: "回力",
          id: "11",
          mainpic: "http://api.eyee.com/EYEE/Icons/defaulthead.jpg",
          price: 999,
          productid: "1147",
          size: "42",
          sku: "JM-SP369",
          status: 1,
          updatedat: "2018-08-12 20:10:00"
        }
      ],
      mobile: "+86 13688888888",
      orderno: 2018081210201000,
      paymoney: 999,
      paytype: 1,
      productmoney: 999,
      receiver: "郑智化",
      redress: 18,
      salemoney: 999,
      status: 5
    }
  }

});
//扣除记录
router.post('/capi/channel/qiuxie/deductDetail', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": [
      {
        "productname": "商品名字",
        "deducttime": "2018-08-01",
        "deductmoney": "200",
        "productprice": "商品价格",
        "productsize": "商品尺码",
      },
      {
        "productname": "商品名字",
        "deducttime": "2018-08-01",
        "deductmoney": "200",
        "productprice": "商品价格",
        "productsize": "商品尺码",
      }
    ]
  }

});
//商家入驻信息
router.post('/capi/channel/qiuxie/businessSellMessage', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  //  返回码，1511200是成功，其它是失败
    "expiretime": 0,  // 是否缓存
    "msg": "",  //  错误信息，只有在code != 1511200时才会有这个属性
    "data":  // 数据内容
    {
      "username": "用户名",
      "nickname": "张三军",
      "userimageurl": "https://files.eyee.com/Shop/system/main/6c5ff2dc766441f08e9b1795a2babd29.jpeg!c30",
      "identityCard": "411481198908062433",
      "mobile": "13248166371"
    }
  }



});
//商家退出入驻
router.post('/capi/channel/qiuxie/businessExit', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  //  返回码，1511200是成功，其它是失败
    "expiretime": 0,  // 是否缓存
    "msg": "",  //  错误信息，只有在code != 1511200时才会有这个属性
    "data":
    {// 数据内容
      "flag": false // "boolean 是否退出成功" 。
    }
  }



});

// 订单追踪
router.post('/capi/order/front/getTrace', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  //  返回码，1511200是成功，其它是失败
    "expiretime": 0,  // 是否缓存
    "msg": "",  //  错误信息，只有在code != 1511200时才会有这个属性
    "data":
    {// 数据内容
      "expressno": "123456789",
      "expresscompany": "物流公司名",
      trackprogress: 2,
      "orderstatus": 1, //#订单状态
      "traces": [
        [
          {//#物流信息
            "title": "买家同意发货",
            'msg': '跟踪描述信息',
            "createdat": "2018-05-05 13:18:00",// #创建时间
            action: 3,
            role: false,
            "pics": "https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400,https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400",
            "logistics": [
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              }
            ]
          }
        ],
        [
          {//#物流信息
            "title": "卖家已发货",
            'msg': '跟踪描述信息',
            "createdat": "2018-05-05 13:18:00",// #创建时间
            action: 1,
            role: false,
            "pics": "https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400,https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400",
            "logistics": [
              {
                "msg": "天津",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              },
              {
                "msg": "河南",
                "createdat": "2018-05-05 13:18:00"
              }
            ]
          }
        ],
        [
          {//#物流信息
            "title": "平台收货",
            'msg': '跟踪描述信息',
            "createdat": "2018-05-05 13:18:00",// #创建时间
            action: 6,
            role: false,
            "pics": "",
            "logistics": [

            ]
          },
          {//#物流信息
            "title": "卖家已发货",
            'msg': '跟踪描述信息',
            "createdat": "2018-05-05 13:18:00",// #创建时间
            action: 0,
            role: false,
            "pics": "https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400,https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400",
            "logistics": [

            ]
          },
          {//#物流信息
            "title": "卖家已发货",
            'msg': '跟踪描述信息',
            "createdat": "2018-05-05 13:18:00",// #创建时间
            action: 0,
            role: false,
            "pics": "https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400,https://files.eyee.com/Shop/system/main/b15defb6f3064d62b5261c4c141030cb.jpg!w400",
            "logistics": [

            ]
          }
        ]

      ]
    }
  }



});
router.get('/api/cut/customer/cutuserlist', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": {  // class list
      "total": 2,  // 数据总数，返回码为true时才会返回。
      "page": 1,  //  当前页
      "size": 5,  // 返回的数据数
      "list": [
        {
          "id": 102,  // 活动ID
          "productid": 'd36d5cf714224a67a1bde0d917605655',
          "productname": "商品标题",  //
          "brand": "品牌 ",  //
          "brandid": '3333',
          "businessid": '22',
          "businessname": "A",  //  商家名称
          "paymaney": 200,
          "saleprice": 123.05,  //  原价
          "teamprice": 45.99,  //  团价
          "starttime": '2018/06/25',
          "endTime": '2018/07/25',
          "expressfee": 222,
          "status": 2,//''int状态 0：助力失败 1：助力中 2：助力成功 3：关闭'',
          'size': "L",
          'color': '红色',
          "businesstype": 2,
          "imageurl": "https://files.eyee.com/Shop/system/main/c3038f05b48e45faa442514dbec31a56.jpg!w650"  // 图片URL
        },
        {
          "id": 102,  // 活动ID
          "productid": 'd36d5cf714224a67a1bde0d917605655',
          "productname": "商品标题",  //
          "brand": "品牌 ",  //
          "brandid": '3333',
          "businessid": '22',
          "businessname": "A",  //  商家名称
          "paymaney": 200,
          "saleprice": 123.05,  //  原价
          "teamprice": 45.99,  //  团价
          "starttime": '2018/06/25',
          "endTime": '2018/07/25',
          "expressfee": 222,
          "status": 1,//''int状态 0：助力失败 1：助力中 2：助力成功 3：关闭'',
          'size': "L",
          'color': '红色',
          "businesstype": 2,
          "imageurl": "https://files.eyee.com/Shop/system/main/c3038f05b48e45faa442514dbec31a56.jpg!w650"  // 图片URL

        }
      ]
    }
  }

});

//广播
router.post('/api/cut/customer/radio', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  //  返回码，1511200是成功，其它是失败
    "expiretime": 0,  // 是否缓存
    "msg": "",  //  错误信息，只有在code != 1511200时才会有这个属性
    "data":  // 数据内容
    {

      list: [
        { message: "String 内容1" },
        { message: "String 内容2" },
        { message: "String 内容3" },
        { message: "String 内容1" },
        { message: "String 内容2" },
        { message: "String 内容7" },
        { message: "String 内容4" }
      ],
      imageurllist: "https://files.eyee.com/Shop/system/main/adb0b2adffb740d68a9389934669be5a.jpg"
    }
  }



});


//助力详情
router.get('/api/cut/customer/cutUserProductDetail', (ctx, next) => {

  ctx.body = {
    "code": 1511200,   // 返回码，1511200：成功，其它是错误
    "expiretime": 0,   // 是否缓存
    "msg": "",   // 当返回码不是1511200时才会出现，返回错误信息
    "data": {
      "id": "String 用户砍价活动id",
      "userid": "string 用户id",
      "username": "string 用户名称",
      "productid": '7d27f8b19b6c4f5db94c2937fc4bead1',
      "productname": " string 商品名称",
      "productimageurl": "https://files.eyee.com/Shop/system/main/602490e0eee74911a7e137408409e9d4.jpg!c30",
      "userImageUrl ": "https://files.eyee.com/Shop/system/main/602490e0eee74911a7e137408409e9d4.jpg!c30",
      "businessname": " string 商家名称",
      "cutmoneycount": 60,
      "saleprice": 200,
      "cutminprice": 100,
      "cutnum": 20,
      "starttime": "date   开始时间",
      "endtime": "2018/07/06 00:00:00",
      "status": "int 活动状态",//#
      "successtime": "助力成功时间"
    }
  }


});




// 商品详情砍价
router.post('/api/cut/customer/cutProductDetail', (ctx, next) => {

  ctx.body = {
    "code": 1511200, //# 返回码，1511200是成功，其它是失败
    "expiretime": 0,// #是否缓存
    "msg": "", //# 错误信息，只有在code != 1511200时才会有这个属性
    "data": {
      "cutminprice": 100,
      "cutcurrentprice": 200,
      "cutsuccesscount": 30,
      "cutprice": 2,
      "isjoin": false,
      "usercutstatus": 1,
      "orderno": '',
      "color": "红色",
      "size": "L",
      "cutid": 'HuyW6ShN',
      "productitemid": "f07a5cffbe954921bfc2f50548a684e5",
      "colorimgurl": "https://files.eyee.com/Shop/system/main/f89d5769716c4cf49586f2949da46e87.jpg!c30",
      "usercutstatus": "0"//int 0:没有助力，1：助力中

    }
  }



});




router.post('/api/pintuan/front/open', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
  }

});




router.post('/api/pintuan/front/share', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
  }

});



router.post('/api/pintuan/front/join', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
  }

});




router.post('/api/pintuan/admin/updateOrderStatus', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
  }

});

router.post('/api/pintuan/admin/open', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
  }

});




router.post('/api/pintuan/front/adminList', (ctx, next) => {

  ctx.body = {
    "code": 1511200,  // 返回码，1511200：成功，其它是错误
    "expiretime": 0,  // 是否缓存
    "msg": "",  // 当返回码不是1511200时才会出现，返回错误信息
    "data": {  // class list
      "page": 1,  // 当前页面
      "total": 2,  // 总页面数量
      "size": 2,  // 返回的数据数
      "list": [
        {
          "product": {
            "id": "id",  // 活动ID
            "pid": "产品id",
            "title": "商品标题",  //
            "brand": "品牌 ",  //
            "businessid": "5ea3b230baa54c089f7260adc759ebb7",  //  商家ID
            "businessname": "A",  //  商家名称
            "businesstype": '1',  //  商家类型
            "color": "黑色",  //  商品规格
            "size": "M",  //  商品尺寸
            "productcount": "45",  //
            "marketprice": '123.05',  //  原价
            "teamprice": '45.99',  //  团价
            "teamtotalcount": '25',  // 已团购人数（下单不支付也算）
            "teamlimitcount": '25',  // 几人团
            "imageurl": "https://files.eyee.com/Shop/system/main/8370f22b0d3e482fa502478d8b5030de.jpg!w400"  // 图片URL
          },
          "ispaid": true,
          "orderpayexpiretime": "2018-05-04 13:00:10", //#未支付结束订单时间
          "teamid": "222",   // team id
          "joinid": "2525676409f649869882c123664117ef",
          "endtime": "2018-05-04 18:30:11",  // 结束时间
          "remainingcount": '3',  // 还剩几人成团
          "status": 1,  // 团状态1：进行中，2：成功，3：失败，4：已删除
          "orderstatus": 1,
          "orderid": "183404818162092", //#订单ID
          "productamount": '1',  // 商品总额
          "expressamount": '1',  // 运费
          "totalamount": '1',  // 订单总额
          "share": {
            "title": "Nike shoe",  // 标题
            "content": "dafddada",  // 内容
            "url": "http://www.eyee.com/xx", // 分享URL
            "type": '1',  // 类型，这个固定为1
            "xcxurl": "http.//www.eyee.com/xxx",  // 小程序URL，为空是没有小程序

          }
        },
        {
          "product": {
            "id": "id",  // 活动ID
            "pid": "产品id",
            "title": "商品标题",  //

            "brand": "品牌 ",  //
            "businessid": "5ea3b230baa54c089f7260adc759ebb7",  //  商家ID
            "businessname": "商家名称",  //  商家名称
            "businesstype": '2',  //  商家类型
            "color": "黑色",  //  商品规格
            "size": "M",  //  商品尺寸
            "productcount": "45",  //
            "marketprice": '123.05',  //  原价
            "teamprice": '45.99',  //  团价
            "teamtotalcount": '25',  // 已团购人数（下单不支付也算）
            "teamlimitcount": '25',  // 几人团
            "imageurl": "https://files.eyee.com/Shop/system/main/8370f22b0d3e482fa502478d8b5030de.jpg!w400"  // 图片URL
          },
          "teamid": "2525676409f649869882c123664117ef",   // team id
          "joinid": '222',
          "orderpayexpiretime": "2018-05-03 15:00:10", //#未支付结束订单时间
          "endtime": "2018-04-26 09:30:11",  // 结束时间
          "remainingcount": '1',  // 还剩几人成团
          "status": 2,  // 团状态1：进行中，2：成功，3：失败，4：已删除
          "orderstatus": 1,
          "productamount": '1',  // 商品总额
          "expressamount": '1',  // 运费
          "totalamount": '1',  // 订单总额
          "orderid": '188046916118290',
          "share": {
            "title": "Nike shoe",  // 标题
            "content": "dafddada",  // 内容
            "url": "http://www.eyee.com/xx", // 分享URL
            "type": '1',  // 类型，这个固定为1
            "xcxurl": "http.//www.eyee.com/xxx",  // 小程序URL，为空是没有小程序

          }
        }
      ]

    }
  }



});




module.exports = router
