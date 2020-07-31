<template>
  <div class="body">
   <!--  <div class="bodyDiv"><mt-cell title="工作电压" value="4*1.5V AA电池(5#)"></mt-cell></div>
    <div class="bodyDiv"><mt-cell title="工作湿度" value="20%-95%"></mt-cell></div> -->
    <!-- <div class="bodyDiv"><mt-cell title="工作温度" value="-25℃-55℃"></mt-cell></div> -->
    <!-- <div class="bodyDiv"><mt-cell title="静态电流" value="88uA"></mt-cell></div> -->
    <div class="bodyDiv"><mt-cell title="产品型号" value="">SL-A5-02</mt-cell></div>
    <div class="bodyDiv"><mt-cell title="软件版本号" value="">{{protocolVer}}</mt-cell></div>
    <div class="bodyDiv"><mt-cell title="硬件版本号" value="">{{deviceVer}}</mt-cell></div>
    <div class="bodyDiv"><mt-cell title="密码容量" value="90组"></mt-cell></div>
    <div class="bodyDiv"><mt-cell title="NFC卡容量" value="10张"></mt-cell></div>
    <div class="bodyDiv"><mt-cell title="指纹容量" value="90组"></mt-cell></div>
    <div class="bodyDiv"><mt-cell title="设备ID" value="">{{deviceId}}</mt-cell></div>
    <div class="bodyDiv"><mt-cell title="ICCID" value="">{{iccid}}</mt-cell></div>
<!--     <mt-field v-if="check" label="IP" placeholder="请输入IP"  v-model="addMsg.ip"></mt-field>
    <mt-field v-if="check" label="端口" placeholder="请输入端口"  v-model="addMsg.post"></mt-field>
    <div v-if="check" class="save" @click="subip()">保存</div>
    <mt-field v-if="check" label="心跳周期" placeholder="请输入心跳周期"  v-model="heartBeatSetting"></mt-field>
    <div v-if="check" class="save" @click="subheart()">保存</div>
    <mt-field v-if="check" label="第一阈值" placeholder="请输入第一阈值"  v-model="hold.firThreshold"></mt-field>
    <mt-field v-if="check" label="第二阈值" placeholder="请输入第二阈值"  v-model="hold.secThreshold"></mt-field>
    <mt-field v-if="check" label="第三阈值" placeholder="请输入第三阈值"  v-model="hold.thrThreshold"></mt-field>
    <div v-if="check" class="save" @click="subhold()">保存</div> -->
  </div>  
</template>

<script>
import {ipPort,heartCycle,volThreshold,getConfigBydeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast } from 'mint-ui';

export default {
  name: 'add',
  data () {
    return {
      addMsg:{
        ip:'',
        post:''
      },
      iccid:'',
      deviceId:'',
      deviceVer:'',
      protocolVer:'',
      heartBeatSetting:'',
      hold:{
        firThreshold:'',
        secThreshold:'',
        thrThreshold:''
      },
      check:false
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  mounted:function () {
    this.iccid=sessionStorage.getItem("simCCID") 
    this.deviceId=sessionStorage.getItem("deviceId") 
    this.deviceVer=sessionStorage.getItem("deviceVer") 
    this.protocolVer=sessionStorage.getItem("protocolVer") 
    document.title=this.$route.meta.title;
    if(this.openId=="oQbMM1IoNkgwXeDT4lvdsa0KrcfU"||this.openId=="oQbMM1AZGNx_8u-zMVeZwnJszz4U"||this.openId=="oQbMM1HZAvyEmJFzNjtv175JrRf4"){
      this.check=true;
    }else{
      this.check=false
    }
    let data={
      deviceId:sessionStorage.getItem("deviceId")
    }
    getConfigBydeviceId(data).then(res=>{
      console.log(res);
      if(res.data.resCode==0){
        this.addMsg.ip=res.data.result.ip;
        this.addMsg.post=res.data.result.port;
        this.heartBeatSetting=res.data.result.heartBeatSetting;
        this.hold.firThreshold=res.data.result.firThreshold;
        this.hold.secThreshold=res.data.result.secThreshold;
        this.hold.thrThreshold=res.data.result.thrThreshold;
      }
    })
  },
  methods:{
    subip(){
      let data=this.addMsg;
      data.deviceId=sessionStorage.getItem("deviceId");
      ipPort(data).then(res=>{
        console.log(res);
        if(res.data.resCode ==0){
          Toast("设置成功");
        }else{
          Toast("设置失败");
        }
      })
    },
    subheart(){
      let data={
        heartBeatSetting:this.heartBeatSetting,
        deviceId:sessionStorage.getItem("deviceId")
      }
      heartCycle(data).then(res=>{
        console.log(res);
        if(res.data.resCode ==0){
          Toast("设置成功");
        }else{
          Toast("设置失败");
        }
      })
    },
    subhold(){
      let data=this.hold;
      data.deviceId=sessionStorage.getItem("deviceId");
      volThreshold(data).then(res=>{
        console.log(res);
        if(res.data.resCode ==0){
          Toast("设置成功");
        }else{
          Toast("设置失败");
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
  // height: 100%;
  background:$mainbc;
  padding-bottom: 16px;
  @extend .fontSet;
  // overflow:hidden;
}
.bodyDiv{
  // border-bottom:1px solid #E4E4E4;
}
.save{
  width: 91%;
  margin:16px auto 16px auto;
  background: #09A3FC;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}

</style>
