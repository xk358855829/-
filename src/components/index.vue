<template>
  <div class="body">
    <img class="topImg" src="../../static/images/3_03.png">
    <div class="component">
    <div class="top">
      <div class="topMain">
        <div class="topL">
          <div class="topLcur"><img :src="imageUrl"></div>
        </div>
        <div class="topMdle">{{nickname}}</div>
        <div class="topR" @click="my"></div>
      </div>
    </div>
    <div class="myName">我的锁</div>
    </div>
    <div class="main">
      <div v-for="(item,index) in locks" class="mainDiv door" @click="takeDevice(index)" @touchstart="gotouchstart(index)" @touchmove="gotouchmove(index)" @touchend="gotouchend(index)">
        <div class="lockPic"><img src="../../static/images/3_06.png"></div>
        <div class="lockName">
          <div class="lockFont"><p>{{item.alias}}</p></div>
          <div class="lockpow"><img src="../../static/images/icon2x.png">{{item.deviceInfo.volPercent}}%</div>
        </div>
      </div>
      <div class="empty mainDiv" @click="addDevice"><img src="../../static/images/2x.png">添加锁</div>
    </div>
    <div class="bottom" @click="warrMsg">
      <mt-cell>
        <div class="celldiv">异常报警</div>
        <div class="cellSpan">{{erryMag}}</div>
        <img class="cellImg" src="../../static/images/3x.png" width="20" height="20">
      </mt-cell>
    </div>
    <div class="mark" v-show="markShow">
      <div class="markDiv">
        <div class="markTop">是否解除绑定设备</div>
        <div class="markTopMain">
          <div class="markTopDiv" @click="markShow=false">取消</div>
          <div class="markTopDivPost" @click="delebind">确定</div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import {getLocksByOpenId,getWeChatInfo,deleteLockBinding,getWarningMsgByOpenId} from '../axios/api.js'
import { Cell,MessageBox,Toast} from 'mint-ui';
import {mapState} from "vuex"
import {formatDate} from '../axios/filer.js'

export default {
  name: 'index',
  data () {
    return {
      locks:[],
      imageUrl:'',
      nickname:'',
      erryMag:'',
      timeOutEvent:0,
      markShow:false,
      lockmesge:'',
      lockFontSt:''
    }
  },
  mounted:function () {
    this.onlodaing();
    document.title=this.$route.meta.title;
  },
  computed:{
    ...mapState(["openId"])
  },
  methods:{
      delebind(){
        let data={
          deviceId:this.lockmesge.deviceInfo.deviceId,
          openId:this.openId
        }
        let that=this;
        console.log(data)
        deleteLockBinding(data).then(res=>{
          console.log(res)
          if(res.data.resCode==0){
            Toast("解绑成功")
            that.markShow=false;
            that.onlodaing();
          }else{
            that.markShow=false;
            Toast("解绑失败")
          }
        })
      },
      gotouchstart(index){
         let that = this;
         clearTimeout(that.timeOutEvent);//清除定时器
         that.timeOutEvent = 0;
         that.timeOutEvent = setTimeout(function(){
              //执行长按要执行的内容，
          that.lockmesge=that.locks[index]
          that.markShow=true;
           },500);//这里设置定时
       },
            //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gotouchend(index){
          clearTimeout(this.timeOutEvent);
            if(this.timeOutEvent!=0){
           }
      },
      //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
      gotouchmove(index){
           clearTimeout(this.timeOutEvent);//清除定时器
           this.timeOutEvent = 0;
      },
      onlodaing(){
        this.imageUrl=sessionStorage.getItem("imageUrl");
        this.nickname=sessionStorage.getItem("nickname");
        const params = {
            openId: this.openId
        };
        console.log(params);
        getLocksByOpenId(params).then(res=>{
          console.log(res)
          this.locks=res.data.result;
          let startTime = this.formatDate(new Date().setHours(0, 0, 0, 0));
          let endTime=this.formatDate(new Date())
          let parms={
              openId:this.openId,
              startTime:startTime,
              endTime:endTime
            }
            getWarningMsgByOpenId(parms).then(res=>{
              console.log(res);
              if(res.data.result.length==0){
                this.erryMag="暂无异常";
              }else{
                this.erryMag="今日异常数："+res.data.result.length+"条";
              }
            });
        });
      },
      formatDate(secs) {
        var t = new Date(secs)
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
      },
      my(){
        console.log(11);
      },
      addDevice(){
         this.$router.push({path:'/add'})
      },
      takeDevice(index){
        console.log(this.locks[index]);
        sessionStorage.setItem("lockMsg",JSON.stringify(this.locks[index]));
        this.$router.push({path:'/mainPage'})
      },
      warrMsg(){
        sessionStorage.setItem("getTYpe","warr")
        this.$router.push({path:'/mianHist'})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";
* {
-webkit-touch-callout:none;
-webkit-user-select:none;
-khtml-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;
}
.mark{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top:0;
  // opacity: 0.2;
  background: rgba(0,0,0,0.5);
  // @extend .boxCenter;
  z-index: 200199
}
.markDiv{
  width: 80%;
  height: 130px;
  background: #fff;
  border-radius: 5px;
  position: fixed;
  left: 10%;
  top:5%;
}
.markTop{
  width: 100%;
  height: 89px;
  @extend .boxCenter;
  color:#999;
  border-bottom:1px solid #ddd;
  font-size:1.6rem;
}
.markTopMain{
  width: 100%;
  height: 40px;
  @extend .boxCenter;
  font-size:1.4rem;
}
.markTopDiv{
  width: 50%;
  height: 100%;
  border-right: 1px solid #ddd;
  @extend .boxCenter;
}
.markTopDivPost{
  width: 50%;
  height: 100%;
  color:#26a2ff;
  @extend .boxCenter;
}
// input{
// -webkit-user-select: auto;
// }
.body{
  width: 100%;
  height: 100%;
  background: #F5FCFF;
  overflow-y:auto 
}
.component{
  width: 100%;
  height: 203px;
  position: fixed;
  left: 0;
  top:0;
  background:#F5FCFF;
  z-index: 10;
}
.topL{
  width: 65px;
  margin-left: 32px;
  height: 100%;
  @extend .boxCenter;
}
.topLcur{
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #fff;
  @extend .boxCenter;
  // margin-left: 15px;
  overflow: hidden;
}
.topLcur img{
  width: 65px;
}
.topMdle{
  width: 64%;
  height: 100%;
  margin-left: 8px;
  line-height: 100%;
  font-size:1.6rem;
  color: #fff;
  @extend .boxBetween;
  z-index: 99999
}
.topMain{
  width: 100%;
  height: 56%;
  @extend .boxCenter;
}
.topR{
  width: 10%;
  height: 100%;
  @extend .boxCenter;
  z-index: 999;
}
.top{
  width: 100%;
  height: 125px;
  background: $backgroundColor;
  @extend .boxCenter;
  overflow: hidden;
  position: relative;
  position: fixed;
  left: 0;
  top: 0;
}
.topImg{
  width: 177px;
  position: fixed;
  right: 0;
  top: 52px;
  z-index: 99;
}
.myName{
  width: $width;
  margin:0 auto;
  height: 20px;
  font-size: 1.4rem;
  line-height: 20px;
  position: fixed;
  top:173px;
  left: 4%;
  margin-bottom: 10px;
}
.main{
  width: $width;
  margin:0 auto;
  padding: 0 2%;
  @extend .boxBetween;
  flex-flow: row wrap;
  background: #F5FCFF;
  margin-top:203px;
  padding-bottom: 49px;
}
.mainDiv{
  width: 48%;
  height: 88px;
  border-radius: 5px;
  @extend .boxCenter;
  margin-bottom: 10px;
}
.empty{
  border:1px dashed $borderColor;
  @extend .boxCenter;
  font-size: 1.6rem;
  color:#303030;
}
.empty img{
  width: 16px;
  margin-right: 5px;
}
.door{
  background: #fff;
  box-shadow:0 2px 12px rgba(11,138,161, .16);
  user-select: none;
}
.door div{
  pointer-events: none;
}
.door:hover{
  box-shadow: 0 8px 8px rgba(10, 16, 20, .24), 0 0 8px rgba(10, 16, 20, .12);
}
.lockPic{
  width: 38%;
  height: 100%;
  position: relative;
}
.lockPic img{
  height: 100%;
  position: absolute;
  right: 0;
  top: 0
}
.lockName{
  width: 55%;
  margin-left: 7%;
  height: 100%;
}
.lockFont{
  width: 100%;
  height: 50%;
  @extend .boxBetween;
  font-size:1.4rem;
  color: #303030;
  overflow:hidden;  
  white-space: nowrap;                
  text-overflow:ellipsis;
}
.lockFont p{
  overflow:hidden;  
  white-space: nowrap;                
  text-overflow:ellipsis;
}
.lockpow{
  width: 100%;
  height: 50%;
  @extend .boxStart;
}
.lockpow img{
  width: 26px;
  margin-right: 7px;
}
.bottom{
  width: 100%;
  height: 49px;
  background:#fff;
  position: fixed;
  bottom: -2px;
  font-size:1.4rem
}
.cellSpan{
  // width: 170px;
  height: 100%;
  font-size:1.3rem;
  color:#303030;
  line-height: 49px;
  text-align: center;
  position: absolute;
  right:20px;
  top:0px;
}
.celldiv{
  width: 80px;
  height: 100%;
  font-size:1.3rem;
  color:#303030;
  line-height: 49px;
  text-align: center;
  position: absolute;
  left:30px;
  top:0px;
}
.cellImg{
  position: absolute;
  left:2%;
  top:15px; 
}
.mint-msgbox{
  top:15%!important;
}
</style>
