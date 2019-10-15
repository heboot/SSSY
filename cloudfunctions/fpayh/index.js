const rp = require('request-promise')
// const request = require("request")
const crypto = require('crypto')
const cloud = require('wx-server-sdk')
// var Parser = require('dom-parser')
const xmlreader = require("xmlreader")
cloud.init({
  env: 'sssy-server' // 你的环境id
})

const key = "CFFSSSMSMXN259175667725917599777" //这是商户的key，不是小程序的密钥。32位，必须大写。
const mch_id = "1549948141" //你的商户号

function paysign({
  ...args
}) {
  let sa = []
  for (let k in args) sa.push(k + '=' + args[k])
  sa.push('key=' + key)
  return crypto.createHash('md5').update(sa.join('&'), 'utf8').digest('hex').toUpperCase()
}
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      // appid openid
      let appid = "wx5085c0ec03e0db18"
      let openid = cloud.getWXContext().OPENID
      let {
        OPENID = cloud.getWXContext().OPENID,
        APPID = "wx5085c0ec03e0db18",
      } = cloud.getWXContext()
      // 附加数据 例如:深圳分店
      const attach = "水生照相馆"
      // 商品描述  128字节  例如:腾讯充值中心-QQ会员充值
      const body = "会员支付服务"
      // 标价金额  订单总金额，单位为分
      const total_fee = 1
      // 回调地址  填写也无效
      const notify_url = "https://www.qq.com/notify"
      // 终端IP
      const spbill_create_ip = "127.0.0.1"
      // 随机字符串
      const nonce_str = Math.random().toString(36).substr(2, 15)
      // 当前时间搓
      const timeStamp = parseInt(Date.now() / 1000) + ''
      // 商户订单号
      const out_trade_no = "otn" + nonce_str + timeStamp
      // xml表单
      let formData = "<xml>"
      formData += "<appid>" + appid + "</appid>"
      formData += "<attach>" + attach + "</attach>"
      formData += "<body>" + body + "</body>"
      formData += "<mch_id>" + mch_id + "</mch_id>"
      formData += "<nonce_str>" + nonce_str + "</nonce_str>"
      formData += "<notify_url>" + notify_url + "</notify_url>"
      formData += "<openid>" + openid + "</openid>"
      formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
      formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
      formData += "<total_fee>" + total_fee + "</total_fee>"
      formData += "<trade_type>JSAPI</trade_type>"
      formData += "<sign>" + paysign({
        appid,
        attach,
        body,
        mch_id,
        nonce_str,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        total_fee,
        trade_type: 'JSAPI'
      }) + "</sign>"
      formData += "</xml>"
      //表单结束
      //发送请求
      let res = await rp({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: 'POST',
        body: formData
      })



      // 处理格式
      let xml = res.toString("utf-8")
      if (xml.indexOf('prepay_id') < 0) throw { code: 7350, data: res, info: '支付失败！' }
      let prepay_id = xml.split("<prepay_id>")[1].split("</prepay_id>")[0].split('[')[2].split(']')[0]
      // 加密字符串
      let paySign = paysign({
        appId: appid,
        nonceStr: nonce_str,
        package: ('prepay_id=' + prepay_id),
        signType: 'MD5',
        timeStamp: timeStamp
      })
      let package = ('prepay_id=' + prepay_id)
      //成功返回
      resolve({
        code: 0,
        data: {
          appid,
          nonce_str,
          timeStamp,
          prepay_id,
          package,
          paySign,
          signType: 'MD5'
        },
        info: '操作成功！'
      })
    } catch (error) {
      console.log("云函数3", formData, data)
      if (!error.code) reject(error)
      resolve(error)
    }
  })
}