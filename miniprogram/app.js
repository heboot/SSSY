//app.js
App({
  onLaunch: function () {

  


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })

    

      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })


      console.log("场景值:", wx.getLaunchOptionsSync())
      //判断场景值 去不同的页面
      //1011	扫描二维码	 1012	长按图片识别二维码  1013	扫描手机相册中选取的二维码 1017	前往小程序体验版的入口页 1007	单人聊天会话中的小程序消息卡片 1008	群聊会话中的小程序消息卡片
      //以上页面
      if (wx.getLaunchOptionsSync().scene == 1007
        || wx.getLaunchOptionsSync().scene == 1008
        || wx.getLaunchOptionsSync().scene == 1001
        || wx.getLaunchOptionsSync().scene == 1012
        || wx.getLaunchOptionsSync().scene == 1012
        || wx.getLaunchOptionsSync().scene == 1013
        || wx.getLaunchOptionsSync().scene == 1017) {
      
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'login',
            complete: res => {

              console.log("hehehehe" ,res)

              const db = wx.cloud.database()
              const _ = db.command
              //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
              const tbUser = db.collection('tb_user').where({
                wx_code: _.eq(res.result.openid)
              }).get({
                success: function (queryRes) {
                  if (queryRes.data == null || queryRes.data.length == 0) {
                     //没有查到用户什么都不处理
                  } else {
                    // isReister = true
                    // that.setData({
                    //   isReister: true
                    // })
                    // that.setData({
                    //   vipNo: res.result.data.phoneNumber
                    // })
                    // getApp().globalData.phone = res.result.data.phoneNumber
                    console.log("数据库查到用户了", queryRes.data[0])
                    getApp().globalData.sessionCode = queryRes.data[0].wx_code
                    getApp().globalData.dbId = queryRes.data[0]._id
                    getApp().globalData.phone = queryRes.data[0].mobile
                    getApp().globalData.userInfo = queryRes.data[0]
                    if (getApp().globalData.phone ==null){
                      
                    }else{
                      console.log("手机号不为空哦")
                      //有手机号注册过 然后还经过这些场景值进来 直接去支付页面
                      wx.navigateTo({
                        url: '../pay/pay'
                      })
                    }
                  }
                }
              })
            }
          })
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      })

    }

    }
  },
  globalData: {
    dbId:null,
    userInfo: null,
    sessionCode: null,
    phone: null
  }
})
