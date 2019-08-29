// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
let ddd = "嘟嘟嘟"
let ttt = "啦啦啦"
  return {
    ddd,
    ttt
  }
}