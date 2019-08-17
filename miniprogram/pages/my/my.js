
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    showView: false,
    isReister:false
  },
  attached: function() {
    let that = this
    wx.checkSession({
      success(res) {
        that.doLogin()
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(res) {
            if (res.code) {
              that.doLogin(res.code)
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
    console.log("success")
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function() {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  methods: {
    doLogin: function() {
      let that = this
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'login',
        complete:res=>{
          console.log(res)
          console.log(res.result.userInfo.openId)
          const db = wx.cloud.database()
          const _ = db.command
          //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
          const tbUser = db.collection('tb_user').where({
            wx_code: _.eq(res.result.userInfo.openId)
          }).get({
              success: function (res) {
                console.log("query ok" + res.data)
                if (res.data == null || res.data.length == 0) {
                 
                } else {
                  isReister = true
                  console.log("login suc" + res.code)
                }
              }
            })
        }
      })
    },
    showV:function(){
      display:none
    },
    showV: function () {
      display: block
    },
    showModal: function() {
      console.log("执行显示")
      this.setData({
        showView: true
      })
    },
    hideModal: function() {
      console.log("执行隐藏")
      this.setData({
        showView: false
      })
    },
    toRegister:function(e){
      this.setData({
        showView: false
      })

      console.log(e)
      
      wx.cloud.callFunction({
        name: 'getPhone',
        data:{
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        complete: res => {
          console.log("getP>>>" + res)
        }
      })
      // // 获取用户信息
      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      //       wx.getUserInfo({
      //         success: res => {
      //           // 可以将 res 发送给后台解码出 unionId
      //           getApp().globalData.userInfo = res.userInfo
      //           console.log(res.userInfo)
      //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      //           // 所以此处加入 callback 以防止这种情况
      //           if (this.userInfoReadyCallback) {
      //             this.userInfoReadyCallback(res)
      //           }
      //         }
      //       })
      //     }else{
      //       wx.showToast({
      //         title: '需要提供授权',
      //       })
      //     }
      //   }
      // })
      // wx.navigateTo({
      //   url: '../register/register'
      // })
    },
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      if(!this.isReister){
        this.showModal()
        return
      }
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
        current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
      })
    },
  }
})