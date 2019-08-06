// app_web.js
var pathList1 = [
  "http://7xniy1.com1.z0.glb.clouddn.com/pc1.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/t1.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/t2.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc5.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc2.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc6.jpg",
]
var pathList2 = [
  "http://7xniy1.com1.z0.glb.clouddn.com/pc1.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc2.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/t2.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/t3.jpg",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc3.png",
  "http://7xniy1.com1.z0.glb.clouddn.com/pc4.jpg",
]
Page({

  /**
   * 页面的初始数据
   */
  data: {


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  picTap: function (e) {
    console.log(e);
    wx.previewImage({
      current: pathList1[e.target.dataset.path - 1],
      urls: pathList1,
    })

  },
  picTap2: function (e) {
    console.log(e);
    wx.previewImage({
      current: pathList2[e.target.dataset.path - 1],
      urls: pathList2,
    })

  }
})