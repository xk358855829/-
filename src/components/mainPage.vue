<template>
  <div class="body">
    <div class="top">
      <div class="center" @click="openDoor">
        <div class="centerPic">
          <img v-if="online" src="../../static/images/move/locl@2x.png">
          <img v-else src="../../static/images/move/lock@3x.png">
        </div>
        <div class="centerSpan" v-if="online">锁未连接</div>
        <div class="centerSpanLock" v-else>锁已连接</div>
      </div>
      <div class="topName">
        <img src="../../static/images/move/sang.png">已为您守护：<span>{{saveDate}}</span> 天
      </div>
      <div class="topType">{{deviceType}}</div>
      <!-- <div class="topID">{{deviceId}}</div> -->
      <div class="topPow">
        <div class="topPowL"><img src="../../static/images/move/dian@2x.png">电量:<span>{{volPercent|volPercentfire}}</span></div>
        <div class="topPowR"><img src="../../static/images/move/xinh@2x.png">信号：<span>{{signalStrength|signafire}}</span></div>
      </div>
      <div class="centerErr">连接锁，请在亮屏情况下长按#号键5秒</div>
      <div class="topSet" @click="toSet">
        <img src="../../static/images/zhuang.png" class="fallow">
        <img src="../../static/images/move/shez.png" class="setImg">
        <span>设置</span>
      </div>
    </div>
    <div class="control">
      <div class="condiv"><div class="conBox" @click="lockPassList"><img src="../../static/images/move/24@2x1.png"><span>我的密码</span></div></div>
      <div class="condiv"><div class="conBox" @click="finger"><img src="../../static/images/move/zhiw@2x1.png"><span>我的指纹</span></div></div>
      <div class="condiv"><div class="conBox" @click="nfc"><img src="../../static/images/move/nfc 2@2x1.png"><span>我的NFC卡</span></div></div>
      <div class="condiv"><div class="conBox" @click="history"><img src="../../static/images/move/cs@2x1.png"><span>操作记录</span></div></div>
      <div class="condiv"><div class="conBox" @click="share"><img src="../../static/images/move/fen@2x1.png"><span>分享房间</span></div></div>
      <div class="condiv"></div>
    </div> 
    <!-- <div class="bottom" @click="warrMsg">
      <mt-cell title="异常警报">
        <span class="cellSpan">暂无异常</span>
        <img slot="icon" src="../../static/images/3x.png" width="20" height="20">
      </mt-cell>
    </div> -->
  </div>  
</template>

<script>
import {openOrClose,getDoorOperateResult,getLockByOpenIdAndDeviceId,getOnlineStatusByDeviceId,getConfigBydeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast,Indicator,MessageBox } from 'mint-ui';
import {volPercentfire,signafire} from '../axios/filer.js'

export default {
  name: 'mainPage',
  data () {
    return {
      online:true,
      saveDate:'',
      volPercent:'',
      volPercent1:'',
      deviceId:'',
      deviceType:'',
      intervalID:'',
      time:1,
      signalStrength:'',
      signalStrength1:'',
      lockMsg:'',
      msgId:'',
      onlod:''
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  created:function () {
    document.title=this.$route.meta.title
    this.onlodaing();
    this.onlodaingOnline();
    this.onlod=setInterval(()=>{
      this.onlodaingOnline()
    },1000)
  },
  beforeDestroy () {
  clearInterval(this.onlod)
  },
  methods:{
    onlodaing(){
      let lockMsg =JSON.parse(sessionStorage.getItem("lockMsg"));
      console.log(lockMsg);
      sessionStorage.setItem("deviceId",lockMsg.deviceInfo.deviceId) 
      sessionStorage.setItem("deviceVer",lockMsg.deviceInfo.deviceVer) 
      sessionStorage.setItem("protocolVer",lockMsg.deviceInfo.protocolVer) 
      sessionStorage.setItem("level",lockMsg.level) 
      for(let i=0;i<lockMsg.bindingInfo.length;i++){
        console.log(lockMsg.bindingInfo[i].openId)
        if(lockMsg.bindingInfo[i].openId==this.openId){
          sessionStorage.setItem("level",lockMsg.bindingInfo[i].level) 
        }
      }
      let data={
        // openId: this.openId,
        deviceId:lockMsg.deviceInfo.deviceId
      }
      getLockByOpenIdAndDeviceId(data).then(res=>{
          console.log(res)
          this.lockMsg=res.data.result;
          console.log(this.lockMsg);
          sessionStorage.setItem("simCCID",lockMsg.deviceInfo.simCCID) 
          this.deviceId=this.lockMsg.deviceInfo.deviceId;
          // if(this.lockMsg.deviceInfo.onlineStatus=='0'){
          //   // this.online=true;
          //   this.signalStrength1="null"
          //   this.volPercent1="null";
          // }else{
          //   // this.online=false;
          //   this.signalStrength1=this.lockMsg.deviceInfo.signalStrength
          //   this.volPercent1=this.lockMsg.deviceInfo.volPercent;
          // }
          this.signalStrength1=this.lockMsg.deviceInfo.signalStrength
          this.volPercent1=this.lockMsg.deviceInfo.volPercent;
          this.saveDate=parseInt((parseInt(Date.parse(new Date()))-this.lockMsg.inserttime_)/(1000 * 60 * 60 * 24))
          if(lockMsg.deviceInfo.type==1){
            this.deviceType="suriot"
          }else if(lockMsg.deviceInfo.type==2){
            this.deviceType="移动版"
          }else{
            this.deviceType="联通版"
          }
          // this.signalStrength=this.lockMsg.deviceInfo.signalStrength
          // this.volPercent=this.lockMsg.deviceInfo.volPercent;
      });
    },
    onlodaingOnline(){
      let lockMsg =JSON.parse(sessionStorage.getItem("lockMsg"));
      let data={
        deviceId:lockMsg.deviceInfo.deviceId
      }
      getOnlineStatusByDeviceId(data).then(res=>{
        console.log(res);
        if(res.data.result==0){
          this.online=true;
          this.signalStrength="null"
          this.volPercent="null";
        }else{
          console.log(this.signalStrength1)
          this.online=false;
          this.signalStrength=this.signalStrength1
          this.volPercent=this.volPercent1;
        }
      })
    },
    lockPassList(){
      this.$router.push({path:'/passWordList'})
    },
    finger(){
      this.$router.push({path:'/fingerprint'})
    },
    nfc(){
      this.$router.push({path:'/nfc'})
    },
    share(){
      if(sessionStorage.getItem("level")==2){
        Toast("无权限");
        return;
      }
      this.$router.push({path:'/share'})
    },
    history(){
      // if(sessionStorage.getItem("level")==2){
      //   Toast("无权限");
      //   return;
      // }
      sessionStorage.setItem("getTYpe","history")
      this.$router.push({path:'/mianHist'})
    },
    toSet(){
       console.log(sessionStorage.getItem("level"))
      if(sessionStorage.getItem("level")==2){
        Toast("无权限");
        return;
      }
      this.$router.push({path:'/set'})
    },
    warrMsg(){
      sessionStorage.setItem("getTYpe","warr")
      this.$router.push({path:'/mianHist'})
    },
    openDoor(){
      if(this.online==true){
        Toast("请按照说明激活门锁！")
        return;
      }else{
        let prom={
          deviceId:this.deviceId
        }
        getConfigBydeviceId(prom).then(res=>{
          console.log(res)
          let result=res.data.result;
          if(result.openDoorSetEn==1){
            Toast("门锁已常开，可直接开门！")
            return;
          }else{
            Indicator.open({
              text: '正在开门中，请稍后...',
              spinnerType: 'fading-circle'
            });
            clearInterval(this.onlod);
            let data={
              isOpenDoor:true,
              deviceId:this.deviceId,
              openId:this.openId
            }
            console.log(data);
            let that=this;
            openOrClose(data).then(res=>{
              console.log(res)
              if(res.data.resCode==0){
                that.msgId=res.data.msgId;
                console.log(that.msgId)
                that.intervalID = setInterval(()=>{
                  that.funSever()
                }, 1000);
              }else{
                Toast(res.data.result);
                Indicator.close();
                that.onlod=setInterval(()=>{
                  that.onlodaingOnline()
                },1000)
              }
            });
          }
        })
        
      }
    },
    funSever(){
      // console.log(msgId);
      this.time++;
      this.timeTo();
      console.log(this.time)
      let data={
        deviceId:this.deviceId,
        msgId:this.msgId
      }
      getDoorOperateResult(data).then(res=>{
        console.log(res);
        if(res.data.result =="1"){
          clearInterval(this.intervalID);
          Indicator.close();
          this.time=1;
          Toast("开门成功");
          this.onlod=setInterval(()=>{
             this.onlodaingOnline()
          },1000)
        }else if(res.data.result =="2"){
          clearInterval(this.intervalID);
          Indicator.close();
          this.time=1;
          Toast("开门失败，请重试");
          this.onlod=setInterval(()=>{
             this.onlodaingOnline()
          },1000)
        }else{
          console.log(0);
        }
      })
    },
    timeTo(){
      if(this.time==60){
        clearInterval(this.intervalID);
        Indicator.close();
        Toast("开锁超时，请稍后再试！")
        this.time=1;
        this.onlod=setInterval(()=>{
              this.onlodaingOnline()
          },1000)
      }else{
        console.log(this.time);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";
.conBox{
  width:70px;
  height:70px;
  // border-radius:50%;
  // background:$backgroundColor;
  @extend .boxAround; 
  position:relative;
}
.conBox img{
  width:50px;
}
.conBox span{
  display: inline-block;
  width: 100px;
  text-align: center;
  position:absolute;
  // left:8px;
  bottom:-19px;
  @extend .fontSet;
}
.control{
  width:100%;
  // height:63px;
  flex-wrap: wrap;
  // margin-top:15%;
  @extend .boxAround; 
  padding-bottom: 30px;
  background: #F2F2F2;
}
.condiv{
  width: 33.3%;
  height: 108px;
  @extend .boxCenter;
}
.topID{
  width:$width;
  height:16px;
  @extend .boxCenter; 
  position:absolute;
  bottom:29px;
  left:4%;
  z-index: 999;
  color:#fff
}
.topPow{
  width:$width;
  height:16px;
  @extend .boxCenter; 
  position:absolute;
  bottom:29px;
  left:4%;
}
.setImg{
  width:18px;
  position:absolute;
  left:29px;
  bottom:35px;
}
.fallow{
  width: 100%;
  position: absolute;
  left: -10px;
  top:10px;
  // -webkit-transform: rotate(360deg);
  animation: rotation 30s linear infinite;
  -moz-animation: rotation 30s linear infinite;
  -webkit-animation: rotation 30s linear infinite;
  -o-animation: rotation 30s linear infinite;
}
@-webkit-keyframes rotation {
  from {
    transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }to {
    transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }to {
    transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotation {
  from {
    transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }to {
    transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
.topSet span{
  color:#fff;
  font-size:0.9rem;
  position:absolute;
  left:27px;
  bottom:15px;
}
.topSet{
  width:120px;
  height:120px;
  border-radius:50%;
  // background:#13739E;
  position:absolute;
  right:-60px;
  top:-60px;
  transform: perspective(1000)
}
.topPow div{
  width:50%;
  height:100%;
  font-size:1.2rem;
  color:#fff;
}
.topPowR{
  text-align:right;
}
.topPow img{
  height:11px;
  margin-right:5px;
}
.topName{
  width:100%;
  height:14px;
  position:absolute;
  left:0;
  top:32px;
  @extend .boxCenter;  
  color:#fff;
  font-size:1.3rem;
}
.topType{
  width:100%;
  height:14px;
  position:absolute;
  left:0;
  top:52px;
  @extend .boxCenter;  
  color:#fff;
  font-size:1.3rem;
}
.topName img{
  margin-right:10px;
  width:14px;
}
.top{
  width:100%;
  height:342px;
  background:$backgroundColor;
  position: relative;
  @extend .boxCenter;
  overflow:hidden;
}
.center div{
  width:100%;
}
.centerSpan{
  font-size:1.6rem;
  color:#999999;
  height:46px;
  text-align:center;
}
.centerSpanLock{
  font-size:1.6rem;
  color:$backgroundColor;
  height:36px;
  text-align:center;
}
.centerPic{
  height:92px;
  @extend .boxCenter;
}
.centerPic img{
  width:50px;
}
.center{
  width:138px;
  height:138px;
  border-radius:50%;
  background:#fff;
  @extend .boxCenter;
  flex-flow: row wrap;
  position:relative;
}
.centerErr{
  width:100%;
  height:12px;
  position:absolute;
  bottom:70px;
  left:0px;
  text-align:center;
  line-height:12px;
  font-size:1.1rem;
  color:#CFF0FF;
}
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
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
  font-size:1.3rem
}
</style>
