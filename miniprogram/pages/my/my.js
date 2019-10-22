          
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    showView: false,
    isReister:false,
    vipNo:null
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
        console.log("check成功 获取code>", that.data.vipNo)
        // that.doLogin()
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
        
          console.log(res.result.userInfo.openId)
         
          const db = wx.cloud.database()
          const _ = db.command
          //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
          const tbUser = db.collection('tb_user').where({
            wx_code: _.eq(res.result.userInfo.openId)
          }).get({
              success: function (queryRes) {
                console.log("query ok", queryRes,queryRes.data.length)
                if (queryRes.data == null || queryRes.data.length == 0) {
                  console.log("exe add")
                  db.collection('tb_user').add({
                    // data 字段表示需新增的 JSON 数据
                    data: {
                      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                      create_time: new Date(),
                      wx_code: res.result.userInfo.openId,
                      source:0
                    },
                    success: function (addRes) {
                      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                      console.log(addRes)
                    }
                  })
                } else {
                  // isReister = true
                  // that.setData({
                  //   isReister: true
                  // })
                  // that.setData({
                  //   vipNo: res.result.data.phoneNumber
                  // })
                  // getApp().globalData.phone = res.result.data.phoneNumber
                  console.log("login suc",queryRes.data[0].wx_code)
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
      let that = this
      this.setData({
        showView: false
      })

     
      
      wx.cloud.callFunction({
        name: 'getPhone',
        data:{
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionCode: getApp().globalData.sessionCode
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
          db.collection('tb_user').where({
            wx_code: _.eq(res.result.openid)
          }).update({
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
        fail: console.error
         
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