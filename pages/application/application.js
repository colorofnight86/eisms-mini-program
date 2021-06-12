// pages/application/application.js
import {get_token} from "../../utils/function";
import {request_token} from "../../utils/requests";
import {applicationStatusDict,applicationColorDict} from "../../utils/dictionary";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applicationList:[], //申请列表
    applicationStatusDict:[], //  申请状态字典
    applicationColorDict:[],  //  申请状态颜色字典
    // applicationStatus:'',  //消费类型
    // searchName:'',  //搜索词
    // coverTransform: '', //侧边栏偏移
    // coverTransition: '',  //侧边栏变换
    // show:true, //侧边栏下一次点击显示状态
    // startDate:'', //起始日期
    // endDate:'', //结束日期
    // minExpense:'',  //最小金额
    // maxExpense:'',  //最大金额
    pageSize:10,  //  每页数量
    currentPage:1,  //当前页面
    totalPage:0   //总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      applicationStatusDict:applicationStatusDict,
      applicationColorDict:applicationColorDict
    })
  },

  //  绑定下拉选择器
  bindPickerChange(e) {
    this.setData({
      applicationStatus: parseInt(e.detail.value)+1
    })
    console.log('消费类型改变，携带值为', this.data.purchaseType )
  },
  //  绑定日期选择器
  bindDateChange(event) {
    let type=event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
    console.log(type,'选择改变，携带值为', event.detail.value )
  },


  //  输入框数据绑定
  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  // 重置筛选条件
  resetFilter(){
    this.setData({
      purchaseType:'',
      searchName:'',
      startDate:'',
      endDate:'',
      minExpense:'',
      maxExpense:''
    })
    this.search().then(r=>{

    })
  },
  resetSearch(){
    this.resetFilter()
    this.toggleSider()
  },

  //  改变侧边栏显示方式
  toggleSider(){
    this.setData({
      show:!this.data.show,
      coverTransform:this.data.show?'translateX(-100vw)':'translateX(0)',
      coverTransition:this.data.show?'transform 1s ease-out':'transform 0.2s linear'
    })
  },

  //  阻止滑动穿透
  preventTouchmove(){},

  //  筛选搜索
  confirmSearch(){
    this.search().then(r => {
      this.toggleSider()
    })
  },

  goSearch(){
    this.search().then(r=>{})
  },

  //  搜索
  async search(currentPage= 1,firstTime = true){
    //  获取token
    if(!get_token())  return

    let applicationList = []
    //  数据处理

    console.log("currentPage",currentPage)

    //  查询请求
    let result = await request_token(
        '/application/list?pageSize='+this.data.pageSize+'&currentPage='+currentPage+'&applyDate=null&applyDate=null')
    if(result.code===200){
      if(firstTime) {
        wx.showToast({
          title: '搜索到' + result.data.totalCount + "条记录",
          icon: 'none'
        })
      }else{
        applicationList = this.data.applicationList
      }
      this.setData({
        applicationList:applicationList.concat(result.data.list),
        currentPage:currentPage+1,
        totalPage:result.data.totalPage
      })
      console.log("applicationList",result.data.list)
    }else if(result.code===500){
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'

      })
    }
    return result.data.list
  },

  //  显示使用情况
  showUse(event) {
    let message = event.currentTarget.dataset.use==='1' ? '发票已使用' : '发票未使用'
    wx.showToast({
      title:message,
      icon:'none'
    })
  },

  //  处理touchstart事件
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
    this.startY = e.touches[0].pageY
  },

  //  处理touchend事件
  handleTouchEnd(e) {
    if(Math.abs(e.changedTouches[0].pageX-this.startX)>Math.abs(e.changedTouches[0].pageY-this.startY)) {
      if (e.changedTouches[0].pageX - this.startX <= -40) {
        this.showDeleteButton(e)
      } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 40) {
        this.showDeleteButton(e)
      }else {
        this.hideDeleteButton(e)
      }
    }else {
      this.hideDeleteButton(e)
    }
  },

  //  隐藏删除按钮
  hideDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, 0)
  },

  //  显示删除按钮
  showDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, -120)
  },

  //  设置movable-view位移
  setXmove: function (index, x) {
    let applicationList = this.data.applicationList
    applicationList[index].x = x
    this.setData({
      applicationList: applicationList
    })
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
    console.log("onShow")
    this.search().then(r=>{})
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
    if (this.data.currentPage <= this.data.totalPage) {
      wx.showToast({
        title: '下拉加载',
        icon: 'success'
      })
      this.search(this.data.currentPage,false).then(r => {})
    }else{
      wx.showToast({
        title: '到底了',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
