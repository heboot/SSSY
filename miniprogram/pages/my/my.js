          
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 3,
    forksCount: 0,
    visitTotal: 0,
    showView: false,
    isReister:false,
    vipNo:null,
    showGetInfoDialog:false,
    mavatar:"/images/logo.png"
  },
  attached: function() {
    let that = this
    wx.checkSession({
      success(res) {
        that.setData({
          vipNo: getApp().globalData.phone
        })
        if(that.data.vipNo == null){
          //需要点击加入会员
        }else{
          //已经是会有了 有手机号呀
          that.setData({
            isReister: true
          })
        }
        console.log("check成功 获取code>",   that.data.isReister)
        that.doLogin()
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(res) {
            if (res.code) {
              console.log("登录成功 获取code>", res)
              getApp().globalData.sessionCode = res.code
              that.doLogin(res.code)
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
    // wx.showLoading({
    //   title: '数据加载中',
    //   mask: true,
    // })
    let i = 0;
    numDH();

    function numDH() {
      // if (i < 20) {
      //   setTimeout(function() {
      //     that.setData({
      //       starCount: i,
      //       forksCount: i,
      //       visitTotal: i
      //     })
      //     i++
      //     numDH();
      //   }, 20)
      // } else {
        that.setData({
          starCount: that.coutNum(3),//优惠券
          // forksCount: that.coutNum(getApp().globalData.userInfo.source),
          visitTotal: that.coutNum(getApp().globalData.userInfo.source)
        })
      // }
    }
    wx.hideLoading()
  },
  methods: {
    showGetInfoDialog:function(){

    },
    doLogin: function() {
      let that = this
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'login',
        complete:res=>{
          const db = wx.cloud.database()
          const _ = db.command
          console.log("当前登录的openid", res.result.openid)
          //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
          db.collection('tb_user').where({
            wx_code: _.eq(res.result.openid)
          }).get({
              success: function (queryRes) {
                console.log("query ok", queryRes,queryRes.data.length)
                if (queryRes.data == null || queryRes.data.length == 0) {
                  const db = wx.cloud.database()
                  const hhh = db.collection('tb_user')
                    .add({
                      data: {
                        create_time: new Date(),
                        wx_code: res.result.openid,
                        source: 0,
                        mobile:that.data.vipNo
                         
                      },
                      success: res => {
                        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                        getApp().globalData.dbId = res._id
                      },
                      fail: err => {
                        wx.showToast({
                          icon: 'none',
                          title: '新增记录失败'
                        })
                        console.error('[数据库] [新增记录] 失败：', err)
                      }
                    })
                  console.log("heheda1>", hhh)
                  //that.getWxUserInfo()
                } else {
                  // isReister = true
                  that.setData({
                    source: queryRes.data[0].source
                  })
                  that.getWxUserInfo()
                }
              }
            })
        }
        
      })
    },
    getWxUserInfo(){
      // // 获取用户信息
      let that = this
      
      if (getApp().globalData.wxUserInfo != null){
        console.log("本地好像有", getApp().globalData.wxUserInfo)
        that.setData({
          mavatar: getApp().globalData.wxUserInfo.avatarUrl
        })
        return

      }
      
      wx.getSetting({
        success: res => {
          console.log("获取微信用户信息>3")
          if (res.authSetting['scope.userInfo']) {
            console.log("获取微信用户信息>>1223333")
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log("获取微信用户信息>>111", res)
                // 可以将 res 发送给后台解码出 unionId
                getApp().globalData.wxUserInfo = res.userInfo
                console.log(res.userInfo)
                that.setData({
                  mavatar: res.userInfo.avatarUrl
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
    
            })
          } else {
            console.log("获取微信用户信息>>1222")
            that.setData({
              modalName: 'bottomModal'
            })
            that.setData({
              showGetInfoDialog: true
            })
          }
        },
        fail:e=>{
          console.log("获取微信用户信息>>2")
        }
      })

    },
    bindGetUserInfo(e){
      console.log("授权获取微信信息哦",e)
      getApp().globalData.wxUserInfo = e.detail.userInfo
      this.setData({
        mavatar: e.detail.userInfo.avatarUrl
      })
      this.hideGetUser()
    },
    showV:function(){
      display:none
    },
    showV: function () {
      display: block
    },
    toConpon:function(){
      if (!this.data.isReister) {
        this.showModal()
        return
      }
      wx.navigateTo({
        url: '../coupon/coupon'
      })
    },
    showModal: function() {
      console.log("执行显示")
      this.setData({
        showView: true
      })
    },
    hideGetUser:function(){
      console.log("执行隐藏")
      this.setData({
        modalName: null
      })
    },
    hideModal: function() {
      console.log("执行隐藏")
      this.setData({
        showView: false
      })
    },
    toRegister:function(e){
      let that = this
      this.setData({
        showView: false
      })
      console.log("获取到手机之前>", e) 
      console.log("获取到手机之前呀>", getApp().globalData.sessionKeyCode) 
      wx.cloud.callFunction({
        name: 'getPhone',
        data:{
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionCode: getApp().globalData.sessionKeyCode
        },
        success: function (res) {
          console.log("获取到手机号了>", e)
          that.setData({
            isReister: true
          })
          that.setData({
            vipNo: res.result.data.phoneNumber
          })
          getApp().globalData.phone = res.result.data.phoneNumber
          console.log(res.result.data.phoneNumber) 
          //更新这个用户的手机号 这个用户在进入这个页面的时候已经做过入库操作了
          const db = wx.cloud.database()
          const _ = db.command
          that.getWxUserInfo()
          db.collection('tb_user').doc(getApp().globalData.dbId).update({
            data:{
              mobile: res.result.data.phoneNumber
            },
            success: function () {
              wx.showToast({
                title: '加入成功',
              })
            
              this.setData({
                isReister: true
              })
              this.setData({
                vipNo: getApp().globalData.phone
              })
               
             
            }
             
          })
           
        },
        fail: function(e){
          console.log(e,">>>")
        }
         
      })
    
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