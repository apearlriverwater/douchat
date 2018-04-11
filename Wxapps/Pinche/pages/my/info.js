//index.js
//获取应用实例
var app = getApp();
var apiPrefix = '';
var mpid = 0;
var util = require('../../utils/util.js');  
var tcity = require("../../utils/citys.js");

Page({
  data: {
    sex:['保密','男','女'],    
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false
  },
   bindChange: function(e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    
    if(val[0] != t[0]){
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys:citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],0,0],
      })
      
      return;
    }
    if(val[1] != t[1]){
      console.log('city no');
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      
      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],val[1],0]
      })
      return;
    }
    if(val[2] != t[2]){
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  closeErr:function(){ //关闭错误
    //util.clearError(this);
  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  selectsex:function(e){
    this.setData({
        'userInfo.gender':e.detail.value
    })
  },
  dateAvatar:function(){
    var that = this;
    util.uploadPic({sk:app.globalData.sk}, function(res) {
        var data = JSON.parse(res);
        if (data.errcode == 0) {
            that.setData({
                'userInfo.avatarUrl': data.items.url
            })
            util.clearError(that);
        } else {
            util.isError(data.errmsg, that);
        }
    })
  },
  formSubmit: function(e) {
    var that = this;
    if(!(/^1[34578]\d{9}$/.test(e.detail.value.phone))){
      util.isError('手机号码错误', that);
      return false;
    }
    this.setData({
      'userInfo.province':this.data.province,
      'userInfo.city':this.data.city,
      'userInfo.county':this.data.county,
      'userInfo.nickName':e.detail.value.nickName,
      'userInfo.phone':e.detail.value.phone
    })

    var postData = that.data.userInfo;
    postData.sk = app.globalData.sk;
    util.req('updateWeappFans', 'post', postData,
      function(res){
        if(res.errcode == 0){
          util.clearError(that);
          app.setUserInfo(res.items);
            wx.navigateBack({
              delta: 1
            })
        }else{
          util.isError(res.errmsg, that);
        }
      }
    )
  },
  onLoad: function () {
    apiPrefix = app.globalData.apiPrefix;
    mpid = app.globalData.mpid;
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res){
        that.setData({
          userInfo:res.data,
          gender:res.data.gender,
          'province':res.data.province,
          'city':res.data.city,
          'county':res.data.county
        })
      },
      fail: function(res) {
        app.login();
      }
    })
    //console.log(that.userInfo);
    tcity.init(that);

    var cityData = that.data.cityData;

    
    const provinces = [];
    const citys = [];
    const countys = [];

    for(let i=0;i<cityData.length;i++){
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys
    })
    console.log('初始化完成');
  }
})