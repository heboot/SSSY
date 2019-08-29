// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const requestSync = require('./requestSync')

var WXBizDataCrypt = require('./WXBizDataCrypt') // 用于手机号解密

cloud.init()

// 云函数入口函数

exports.main = async (event, context) => {

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  const AccessToken_options = {

    method: 'GET',

    url: 'https://api.weixin.qq.com/sns/jscode2session',

    qs: {
      appid:wxContext.APPID,
      secret:'493f3ed3d884a2489ff68e3f95c5d660',  // 微信开发后台可生成，唯有微信认证过的国内主体才可有
      grant_type: 'authorization_code',
      js_code: event.sessionCode // 小程序中获取过来的
    },
    json: true
  };
  const resultValue = await requestSync(AccessToken_options);
  const pc = new WXBizDataCrypt(wxContext.APPID, resultValue.session_key)  // -解密第一步
  const data = pc.decryptData(event.encryptedData, event.iv) // 解密第二步 pc.decryptData(event.encryptedData, event.iv)   
  const aaa= event.sessionCode
  return { data}
}