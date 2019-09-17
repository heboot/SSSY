//app.js
App({
  onLaunch: function () {

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
        
    }


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

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })

      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    }
  },
  globalData: {
    userInfo: {},
    sessionCode: null,
    phone: null
  }
})
