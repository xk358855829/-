<template>
  <div class="body">
    <div class="user">
      <div class="userl">上报记录<span class="usspan">开启上报开门记录--{{syncStatusEn|syTatus}}</span></div>
      <div class="userr">
        <mt-switch v-model="openDoorMsgEn" @change="turn"></mt-switch>
      </div>
    </div>
    <div class="user">
      <div class="userl">警报信息<span class="usspan">开启上报警报信息--{{syncStatusEn|syTatus}}</span></div>
      <div class="userr">
        <mt-switch v-model="warningMsgEn" @change="turn"></mt-switch>
      </div>
    </div>
    <div class="user">
      <div class="userl">门锁常开<span class="usspan">开启处于常开状态--{{syncStatusEn|syTatus}}</span></div>
      <div class="userr">
        <mt-switch v-model="openDoorSetEn" @change="turn"></mt-switch>
      </div>
    </div>
    <div class="user">
      <div class="userl">通知设置<span class="usspan">开启微信通知</span></div>
      <div class="userr">
        <mt-switch v-model="getCfgDataInApp" @change="turnCode"></mt-switch>
      </div>
    </div>
    <div class="user">
      <div class="userl">屏幕亮度<span>{{screenLumSetting}}</span><span class="usspanV">{{syncStatusSv|syTatus}}</span></div>
      <div class="userrS">
       <mt-range v-model="screenLumSetting" :min="1" :max="5" :step="1" :bar-height="5" @change="sentuserParam" @input="inputscreen()"></mt-range>
      </div>
    </div>
    <div class="user">
      <div class="userl">门锁音量<span>{{volumeSetting}}</span><span class="usspanV">{{syncStatusSv|syTatus}}</span></div>
      <div class="userrS">
        <mt-range v-model="volumeSetting" :min="1" :max="15" :step="1" :bar-height="5" @change="sentuserParam" @input="inputvolume()"></mt-range>
      </div>
    </div>
    <div class="user" @click="linkparameter">
      <div class="userl">关于门锁</div>
      <div class="userr">
        <img src="../../static/images/jiantoiu.png">
      </div>
    </div>
    <div class="saveDet"  @click="setCheck()">查看绑定人员</div>
  </div>  
</template>

<script>
import {getConfigBydeviceId,userEnable,userParam,deleteLockBinding,getOnlineStatusByDeviceId,getCfgDataInApp,enableNotifyInAppWhenDoorOpened} from '../axios/api.js'
import {mapState} from "vuex"
import {syTatus} from "../axios/filer.js"
import { Toast,Switch,Indicator,Range,MessageBox} from 'mint-ui';

export default {
  name: 'add',
  data () {
    return {
      openDoorMsgEn:'',
      warningMsgEn:'',
      openDoorSetEn:'',
      screenLumSetting:1,
      volumeSetting:1,
      syncStatusEn:'',
      syncStatusSv:'',
      getCfgDataInApp:'',
      getCfg:''
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  mounted:function () {
    this.onload();
    this.getCfgDataInAppLoad();
    document.title=this.$route.meta.title
  },
  methods:{
      linkparameter(){
        this.$router.push({path:'/parameter'})
      },
      onload(){
        let data={
          deviceId:sessionStorage.getItem("deviceId"),
        }
        getConfigBydeviceId(data).then(res=>{
          console.log(res);
          let result=res.data.result;
          this.openDoorMsgEn=this.setTrueOrFalse(result.openDoorMsgEn);
          this.warningMsgEn=this.setTrueOrFalse(result.warningMsgEn);
          this.openDoorSetEn=this.setTrueOrFalse(result.openDoorSetEn);
          this.screenLumSetting=result.screenLumSetting
          this.volumeSetting=result.volumeSetting
          this.syncStatusEn=result.syncStatusEn
          this.syncStatusSv=result.syncStatusSv
          // console.log(this.volumeSetting)
        })
      },
      getCfgDataInAppLoad(){
        let data={
          deviceId:sessionStorage.getItem("deviceId"),
          openId:this.openId
        }
        getCfgDataInApp(data).then(res=>{
          console.log(res);
          let result=res.data.result;
          this.getCfgDataInApp=this.setTrueOrFalse(result.notifyWhenDoorOpened);
          // console.log(this.volumeSetting)
        })
      },
      inputscreen(){
        console.log(this.screenLumSetting);
      },
      inputvolume(){
        console.log(this.volumeSetting);
      },
      setTrueOrFalse(data){
        if(data==1){
            return true
        }else{
            return false;
        }
      },
      setFalseOrTrue(data){
        if(data==true){
            return 1
        }else{
            return 0;
        }
      },
      turnCode(){
        let data={
            deviceId:sessionStorage.getItem("deviceId"),
            enable:this.getCfgDataInApp,
            openId:this.openId
          }
          console.log(data);
        enableNotifyInAppWhenDoorOpened(data).then(res=>{
          console.log(res)
          if(res.data.resCode==0){
            Toast(res.data.result)
            this.onload();
            this.getCfgDataInAppLoad();
          }else{
            Toast(res.data.result)
            this.onload();
            this.getCfgDataInAppLoad();
          }
        })
      },
      turn(){
          let data={
            deviceId:sessionStorage.getItem("deviceId"),
            openDoorMsgEn:this.setFalseOrTrue(this.openDoorMsgEn),
            warningMsgEn:this.setFalseOrTrue(this.warningMsgEn),
            openDoorSetEn:this.setFalseOrTrue(this.openDoorSetEn)
          }
          console.log(data);
        userEnable(data).then(res=>{
          console.log(res)
          if(res.data.resCode==0){
            // Toast("设置成功")
            let data={
              deviceId:sessionStorage.getItem("deviceId")
            }
            getOnlineStatusByDeviceId(data).then(res=>{
              console.log(res);
              if(res.data.result==0){
                Toast("未联网，联网后数据进行同步")
              }else{
                // Toast("设置成功")
              }
              this.onload();
            })
          }else{
            Toast("请重试")
          }
        })
      },
      setCheck(){
        this.$router.push({path:'/check'})
      },
      sentuserParam(){
          let data={
            deviceId:sessionStorage.getItem("deviceId"),
            screenLumSetting:this.screenLumSetting,
            volumeSetting:this.volumeSetting
          }
          console.log(data);
        userParam(data).then(res=>{
          console.log(res)
          if(res.data.resCode==0){
            // Toast("设置成功");
            let data={
              deviceId:sessionStorage.getItem("deviceId")
            }
            getOnlineStatusByDeviceId(data).then(res=>{
              console.log(res);
              if(res.data.result==0){
                Toast("未联网，联网后数据进行同步")
              }else{
                // Toast("设置成功")
              }
              this.onload();
            })
          }else{
            Toast("请重试")
          }
        })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";


.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
  overflow:hidden;
}
.user{
  width: $width;
  margin-top:10px;
  padding: 0 4%;
  height: 60px;
  background: #fff;
  @extend .boxAround;
}
.user div{
  width: 50%;
  height: 100%;
}
.userl{
  @extend .boxStart;
  position: relative;
}
.usspanV{
  // display: inline-block;
  width: 100%;
  height: 100%;
  // text-align: center;
  // line-height: 60px;
  @extend .boxCenter;
  position: absolute;
  bottom: 0;
  right: -53%;
  font-size: 10px;
  color:$borderColor;
}
.usspan{
  // display: inline-block;
  width: 105%;
  height: 100%;
  // text-align: center;
  // line-height: 30px;
  @extend .boxCenter;
  position: absolute;
  bottom: 0;
  right: -53%;
  font-size: 10px;
  color:$borderColor;
}
.userr{
  @extend .boxEnd;
}
.userrS{
  @extend .boxEnd;
  height: 30px!important;
}
// .mint-switch-core{
//   height: 28px!importantz
// }
.userl span{
  margin-left: 20px;
}
.saveDet{
  width: 91%;
  margin:16px auto 0 auto;
  background: $backgroundColor;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}
</style>
