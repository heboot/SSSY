
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
          })
            .get({
              success: function (res) {
                console.log("query ok" + res.data)
                if (res.data == null || res.data.length == 0) {
                  console.log("query ok" + res.data)
                  that.showModal()
                } else {
                  isReister = true
                  console.log("login suc" + res.code)
                }
              }
            })
        }
      })
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