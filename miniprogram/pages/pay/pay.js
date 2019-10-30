 Page({

   /**
    * 页面的初始数据
    */
   data: {
     getMoney: null,
     inputMoney: null,
     source: null,
     payMoney: null,
     orderNo:null,
     saleTime:null
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {

   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
     console.log("检测会员", getApp().globalData.isVip)
     if (!getApp().globalData.isVip){

      wx.navigateTo({
                        url: '../index/mindex'
                      })
     }

    //  wx.checkSession({
    //    success() {
    //      //session_key 未过期，并且在本生命周期一直有效
    //      wx.cloud.callFunction({
    //        // 需调用的云函数名
    //        name: 'login',
    //        complete: res => {

    //          console.log("hehehehe", res)

    //          const db = wx.cloud.database()
    //          const _ = db.command
    //          //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
    //          const tbUser = db.collection('tb_user').where({
    //            wx_code: _.eq(res.result.openid)
    //          }).get({
    //            success: function (queryRes) {
    //              if (queryRes.data == null || queryRes.data.length == 0) {
    //                //没有查到用户什么都不处理
    //              } else {
    //                // isReister = true
    //                // that.setData({
    //                //   isReister: true
    //                // })
    //                // that.setData({
    //                //   vipNo: res.result.data.phoneNumber
    //                // })
    //                // getApp().globalData.phone = res.result.data.phoneNumber
    //                console.log("数据库查到用户了", queryRes.data[0])
    //                getApp().globalData.sessionCode = queryRes.data[0].wx_code
    //                getApp().globalData.dbId = queryRes.data[0]._id
    //                getApp().globalData.phone = queryRes.data[0].mobile
    //                getApp().globalData.userInfo = queryRes.data[0]
    //                if (getApp().globalData.phone == null) {
    //                  getApp().globalData.isVip = false
    //                } else {
    //                  console.log("手机号不为空哦")
    //                  getApp().globalData.isVip = true
    //                  //有手机号注册过 然后还经过这些场景值进来 直接去支付页面
    //                  // wx.navigateTo({
    //                  //   url: '../pay/pay'
    //                  // })
    //                }
    //              }
    //            }
    //          })
    //        }
    //      })
    //    },
    //    fail() {
    //      // session_key 已经失效，需要重新执行登录流程
    //      wx.login({
    //        success(res) {
    //          if (res.code) {
    //            console.log('app.js do wxlogin>>>', res)
    //            getApp().globalData.sessionKeyCode = res.code

    //            wx.cloud.callFunction({
    //              // 需调用的云函数名
    //              name: 'login',
    //              complete: res => {

    //                console.log("hehehehe", res)

    //                const db = wx.cloud.database()
    //                const _ = db.command
    //                //查询云数据库有没有openId为当前登陆者的记录 如果有，则绑定过手机号
    //                const tbUser = db.collection('tb_user').where({
    //                  wx_code: _.eq(res.result.openid)
    //                }).get({
    //                  success: function (queryRes) {
    //                    if (queryRes.data == null || queryRes.data.length == 0) {
    //                      //没有查到用户什么都不处理
    //                    } else {
    //                      // isReister = true
    //                      // that.setData({
    //                      //   isReister: true
    //                      // })
    //                      // that.setData({
    //                      //   vipNo: res.result.data.phoneNumber
    //                      // })
    //                      // getApp().globalData.phone = res.result.data.phoneNumber
    //                      console.log("数据库查到用户了", queryRes.data[0])
    //                      getApp().globalData.sessionCode = queryRes.data[0].wx_code
    //                      getApp().globalData.dbId = queryRes.data[0]._id
    //                      getApp().globalData.phone = queryRes.data[0].mobile
    //                      getApp().globalData.userInfo = queryRes.data[0]
    //                      if (getApp().globalData.phone == null) {
    //                        getApp().globalData.isVip = false
    //                      } else {
    //                        getApp().globalData.isVip = true
    //                        console.log("手机号不为空哦")
    //                        //有手机号注册过 然后还经过这些场景值进来 直接去支付页面
    //                        // wx.navigateTo({
    //                        //   url: '../pay/pay'
    //                        // })
    //                      }
    //                    }
    //                  }
    //                }
    //                )
    //              }
    //            })






    //          } else {
    //            console.log('登录失败！' + res.errMsg)
    //          }
    //        }
    //      })
    //    }
    //  })

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },
   showModal(name) {
     this.setData({
       modalName: name
     })
   },
   
   showRedModal(e) {
     let that = this
     console.log(this.data.inputMoney)

     if (!getApp().globalData.isVip) {
       wx.showToast({
         title: '请先加入会员',
       })
       return
     }

     if (this.data.inputMoney == null || this.data.inputMoney <= 0) {
       wx.showToast({
         title: '请先输入支付金额',
       })
       return
     }

     if (this.data.inputMoney >= 10) {
       if (this.data.saleTime == null){
        this.setData({
          modalName: 'DialogModal3'
        })
         this.setData({
           saleTime: Date.parse(new Date())
         })
        that.showModal(modalName)
      }else{
        this.setData({
          getMoney: 0
        })
        this.setData({
          modalName: 'DialogModal4'
        })
        console.log(modalName)
        that.showModal(e)
      }
      
     } else {
       this.setData({
         getMoney: 0
       })
       this.setData({
         modalName: 'DialogModal4'
       })
       console.log(modalName)
       that.showModal(e)
     }


   },
   hideModal(e) {
     this.setData({
       modalName: null
     })
   },
   toggle(e) {
     console.log(e);
     var anmiaton = e.currentTarget.dataset.class;
     var that = this;
     that.setData({
       animation: anmiaton
     })
     setTimeout(function() {
       that.setData({
         animation: ''
       })
     }, 1000)
   },
   showGetMoney(e) {


     let that = this
     this.setData({
       modalName: 'DialogModal2'
     })
     console.log("get money")
     that.showModal(e)
   },
   doGetMoney(e) {
     let that = this
     this.setData({
       getMoney: (Math.random() * 5).toFixed(1)
     })
     if (that.getMoney <= 0) {
       this.setData({
         getMoney: 0.2
       })
     }
     that.showModal('DialogModal2')
    
     console.log(that.data.getMoney)
   },
   payMoneyInput: function(e) {
     this.setData({
       inputMoney: e.detail.value
     })
   },



   pay: function() {

     wx.showLoading({
       title: '请稍候',
     })

     //支付成功
     this.setData({
       payMoney: (this.data.inputMoney - this.data.getMoney)*10
     })

     let that = this
     //需要上传给云函数的数据
     let uploadData = {
       //此次需要支付的金额，单位是分。例如¥1.80=180
       "total_fee":this.data.payMoney,
       //用户端的ip地址
       "spbill_create_ip": "123.123.123.123"
     }


     //调用云函数
     wx.cloud.callFunction({
       //云函数的名字，这里我定义为payment
       name: "fpayh",
       //需要上传的数据
       data: uploadData
     }).then(res => {
       console.log("调用云函数支付之后的返回", res)
       wx.hideLoading()
       //这个res就是云函数返回的5个参数
       //通过wx.requestPayment发起支付
       this.setData({
         orderNo: res.result.data.out_trade_no,
       })
       wx.requestPayment({
         timeStamp: res.result.data.timeStamp,
         nonceStr: res.result.data.nonce_str,
         package: res.result.data.package,
         signType: res.result.data.signType,
         paySign: res.result.data.paySign,
    
         success: resn => {
           //支付成功
           this.setData({
             source: this.data.payMoney
           }),
           this.setData({
             modalName: 'PaySucDialog'
           })
          //更新用户的积分 ,另外需要插入一条积分记录
           const db = wx.cloud.database()
           const _ = db.command
           let that = this
           db.collection('tb_user').doc(getApp().globalData.dbId).get({
             success: function (res) {
             
               // res.data 包含该记录的数据
               console.log("查询更新积分",res)
               const newSource = res.data.source + that.data.payMoney
               console.log("新积分", newSource)
               db.collection('tb_user').doc(getApp().globalData.dbId).update({
                 // data 传入需要局部更新的数据
                 data: {
                   // 表示将 done 字段置为 true
                   source: newSource
                 },
                 success: function (res) {
                  //  console.log(res.data)
                 }
               })
             }
           })

           db.collection('tb_source').add({
             // data 字段表示需新增的 JSON 数据
             data: {
               // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
               order_id: res.result.data.out_trade_no,
               wx_code: res.result.data.openid,
               source: this.data.payMoney
             },
             success: function (res) {
               // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
               console.log(res)
             }})

           that.showModal(e)
         },
         fail: err => {
           //支付失败
           wx.showToast({
             title: '支付失败',
           })
         }
       })
     })
   },

 })