//云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const openid = cloud.getWXContext().OPENID
const appid = 'wx5085c0ec03e0db18'
const mch_id = '1549948141'
const random = require('random.js')
const body = "腾讯-游戏"
const notify_url = 'http://www.weixin.qq.com/wxpay/pay.php'
const trade_type = 'JSAPI'
const key = 'CFFSSSMSMXN259175667725917599777'
const crypto = require("crypto")
const requestData = require("requestData")
const request = require("request")
const xmlreader = require("xmlreader")

//云函数入口函数
exports.main = async (event, content) => {
  const out_trade_no = Date.parse(new Date()).toString()
  const total_fee = event.total_fee
  const spbill_create_ip = event.spbill_create_ip
  let stringA = `appid=${appid}&body=${body}&mch_id=${mch_id}&nonce_str=${random}&notify_url=${notify_url}&openid=${openid}&out_trade_no=${out_trade_no}&spbill_create_ip=${spbill_create_ip}&total_fee=${total_fee}&trade_type=${trade_type}&key=CFFSSSMSMXN259175667725917599777`
  var sign = crypto.createHash('md5').update(stringA).digest('hex').toUpperCase()
  let dataBody = requestData(
    appid,
    mch_id,
    random,
    sign,
    body,
    out_trade_no,
    total_fee,
    spbill_create_ip,
    notify_url,
    trade_type,
    openid
  )
  return new Promise(reslove => {
    request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: "POST",
      body: dataBody
    }, body => {
       
      xmlreader.read(body, res => {
        console.log(res)
        // let prepay_id = res.xml.prepay_id.text()
        // let timeStamp = Date.parse(new Date()).toString()
        // let str = `appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=CFFsssmsmxn259175667725917599777`
        // let paySign = crypto.createHash('md5').update(str).digest('hex')
        //返回上面的五个参数
        reslove({
          data: {
            res:res
          }
        })
      })
    })
  })
}