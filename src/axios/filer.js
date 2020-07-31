

//api.js

import Vue from 'vue'
 
// 密码类型
Vue.filter('passType', data => {
    if(data=="100"){
        return "管理员密码"
    }else if(data=="0"){
        return "永久密码"
    }else if(data=="1"){
        return "计次密码"
    }else if(data=="4"){
        return "时效密码"
    }
});


Vue.filter('volPercentfire', data => {
    console.log(data);
    if(data=="null"){
        return "暂无"
    }else{
        if(data<0||data>100){
         return "电量异常";
        }else{
            return data+'%';
        }
    }
});


Vue.filter('signafire', data => {
    console.log(data);
    if(data=="null"){
        return "暂无"
    }else{
      if(data<=2){
        return "弱";
      }else if(data>2&&data<=30){
          return "较强";
      }else if(data>30){
          return "强";
      }
    }
});

Vue.filter('level', data => {
    if(data==1){
        return "管理人员";
    }else{
        return "分享用户";
    }
});


Vue.filter('formatDate', data => {
        var t = new Date(data)
        var year = t.getFullYear()
        var month = t.getMonth() + 1
        if (month < 10) { month = '0' + month }
        var date = t.getDate()
        if (date < 10) { date = '0' + date }
        var hour = t.getHours()
        if (hour < 10) { hour = '0' + hour }
        var minute = t.getMinutes()
        if (minute < 10) { minute = '0' + minute }
        var second = t.getSeconds()
        if (second < 10) { second = '0' + second }
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
});

Vue.filter('openType', data => {
    if(data==1){
        return "密码开门"
    }else if(data==2){
        return "NFC开门"
    }else if(data==4){
        return "指纹开门"
    }
});


Vue.filter('pswdAlias', data => {
    if(data==""){
        return "该密码已删除"
    }else{
        return data;
    }
});


Vue.filter('setTrueOrFalse', data => {
    console.log(data);
    if(data==1){
        return true
    }else{
        return false;
    }
});


Vue.filter('filerSub', data => {
    console.log(data.substring(0,data.length-1));
    return data.substring(data.length-1)=='；'?data.substring(0,data.length-1):data
});

Vue.filter('openStatus', data => {
    // console.log(data);
    if(data=='1'){
        return "开门成功"
    }else{
        return "开门失败";
    }
});

Vue.filter('syTatus', data => {
    // console.log(data);
    if(data=='1'){
        return "已同步"
    }else{
        return "未同步";
    }
});
