const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const logger = require('koa-logger')
const XResponseTime = require('koa-response-time')

const app = new Koa()


const apiRoutes = require('./router')
const apiRoutesDistribution = require('./routerDistribution')


app.use(logger())
app.use(XResponseTime())     // 设置Header

app.use(cors())
app.use(bodyParser())     // POST请求 body 解析

app.use(koaStatic(__dirname + '/static'))
app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods())
app.use(apiRoutesDistribution.routes()).use(apiRoutesDistribution.allowedMethods())


app.listen(3100)
console.log('===== Mock Server is starting at port 3100 !')

