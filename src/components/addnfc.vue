<template>
  <div class="body">
    <div class="urgent">NFC信息</div>
      <div class="urgdiv">
        <span>*</span>NFC名称
        <input type="text" name="" v-model="alias" class="urgInput" placeholder="请输入NFC名称" maxlength="20">
      </div>
      <!-- <div class="urgdiv" @click='routeSent'>
        <div class="setFinger">录入NFC</div><img src="../../static/images/fish.png">
      </div> -->
    <div class="save" v-if="addOrchange=='0'" @click="sub()">完成</div>
    <div class="changeMsg" v-if="addOrchange=='1'">
      <div class="changede" @click="deleteMsg">删除</div>
      <div class="changesh" @click="revise">修改</div>
    </div>
    <div class="img" v-show='online'><div class="lineFont">门锁未联网<p>请在门锁黑屏状态下长按#键5秒，等待语音提示</p></div><img src="../../static/images/outline.png"></div>
    <div class="img" v-show='!online'><img src="../../static/images/online.png"></div>
  </div>  
</template>

<script>
import {getOnlineStatusByDeviceId,getLockByOpenIdAndDeviceId,startInput,getInputStatus,getDelStatusNFC,deleteNFC,findByIdnfc,nfcupdate} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast ,MessageBox,Indicator} from 'mint-ui';

export default {
  name: 'add',
  data () {
    return {
      addMsg:{
        openId:''
      },
      alias:'',
      addOrchange:'0',
      check:false,
      lockMsg:[],
      selTime:'',
      delTime:'',
      time:1,
      Deltime:1,
      resultData:[],
      onlod:'',
      online:''
    }
  },
  computed:{
    ...mapState(["openId","cardid"])
  },
  destroyed() {
    Indicator.close();
    clearInterval(this.onlod);
  },
  created:function () {
    this.addOrchange=sessionStorage.getItem("addOrchange")
    this.deviceId = sessionStorage.getItem("deviceId");
    if(this.addOrchange==1){
      let data={
        id:this.cardid
      }
      findByIdnfc(data).then(res=>{
        console.log(res);
        this.resultData=res.data.result;
        this.alias=res.data.result.alias;
      })
    }
     this.onlodaingOnline();
      this.onlod=setInterval(()=>{
        this.onlodaingOnline()
      },1000)
  },
  mounted:function () {
    document.title=this.$route.meta.title;
  },
  methods:{
    onlodaingOnline(){
      let data={
        deviceId:this.deviceId
      }
      getOnlineStatusByDeviceId(data).then(res=>{
        console.log(res);
        if(res.data.result==0){
          this.online=true;
        }else{
          this.online=false;
        }
      })
    },
      sub(){
        let dataDate={
          openId: this.openId,
          deviceId:this.deviceId
        }
        getLockByOpenIdAndDeviceId(dataDate).then(res=>{
          this.lockMsg=res.data.result;
          if(this.lockMsg.deviceInfo.onlineStatus=='0'){
            Toast('设备未联网，请按长按#号5秒');
            return;
          }else{
            if(this.alias==''){
              Toast('必填不能为空');
              return;
            }
            let that=this;
            clearInterval(that.onlod)
            Indicator.open({
                text: '请录入卡...',
                spinnerType: 'fading-circle'
              });
            clearInterval(that.selTime);
            let data={
              deviceId:that.deviceId,
              alias:that.alias
            }
            data.createdBy=that.openId;
            startInput(data).then(res=>{
              console.log(res)
              if(res.data.resCode == 0){
                        setTimeout(()=>{
                          that.selTime=setInterval(()=>{
                            that.time++;
                            that.timeTo();
                            let data={
                              key:res.data.key_cmd_res,
                              deviceId:that.deviceId
                            }
                            getInputStatus(data).then(res=>{
                              if(res.data.resCode==0){
                                if(res.data.result=='录入完成'){
                                  Toast("录入完成!");
                                   that.time=1;
                                   clearInterval(that.selTime);
                                   Indicator.close();
                                   that.$router.push({path:'/nfc'})
                                }
                              }else{
                                 Toast(res.data.result);
                                 that.time=1;
                                 clearInterval(that.selTime);
                                 that.showSta=true;
                                 Indicator.close();
                                 that.$router.push({path:'/nfc'})
                              }
                            })
                          },1000)
                        },8000)
                      }else{
                        Indicator.close();
                        Toast(res.data.result);
                        that.onlod=setInterval(()=>{
                          that.onlodaingOnline()
                        },1000)
                          // Toast("设备离线,请激活设备!");         
                      }
            });
          }
        })
    },
    timeTo(){
      if(this.time==65){
        clearInterval(this.selTime);
        Indicator.close();
        Toast("录入超时，请稍后再试！")
        this.time=1;
        this.onlod=setInterval(()=>{
                    this.onlodaingOnline()
                  },1000)
      }else{
        // console.log(this.time);
      }
    },
    routeSent(){
      this.$router.push({path:'/sent'})
    },
    deleteMsg(){
       MessageBox.confirm('确定删除吗?').then(action => {
          let data={
            deviceId:this.deviceId,
            nfcNo:this.resultData.nfcNo
          }
          if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
          }else{
            data.createdBy=this.openId
          }
          clearInterval(this.onlod)
          deleteNFC(data).then(res=>{
            console.log(res);
             let that=this;
             if(res.data.resCode==0){
              Indicator.open({
                      text: '正在删除NFC卡...',
                      spinnerType: 'fading-circle'
                    });
              that.delTime=setInterval(()=>{
                            that.Deltime++;
                            that.timeToDel();
                            let data={
                              key:res.data.key_cmd_res,
                              deviceId:that.deviceId
                            }
                            getDelStatusNFC(data).then(res=>{
                              if(res.data.result=='删除完成'){
                                 Toast("NFC卡删除完成!");
                                 that.Deltime=1;
                                 clearInterval(that.delTime);
                                 Indicator.close();
                                 that.$router.push({path:'/nfc'})
                              }
                            })
                          },1000)
             }else{
              Toast(res.data.result);
              Indicator.close();
              that.onlod=setInterval(()=>{
                    that.onlodaingOnline()
                  },1000)
             }
          })
        });
    },
    timeToDel(){
      if(this.Deltime==65){
        clearInterval(this.delTime);
        Indicator.close();
        Toast("删除超时，请稍后再试！")
        this.Deltime=1;
        this.onlod=setInterval(()=>{
                    this.onlodaingOnline()
                  },1000)
      }else{
        // console.log(this.time);
      }
    },
    revise(){
       MessageBox.confirm('确定修改吗?').then(action => {
          let data={
            id:this.resultData.id,
            alias:this.alias
          }
          if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
          }else{
            data.createdBy=this.openId
          }
          nfcupdate(data).then(res=>{
            if(res.data.resCode==0){
              Toast("NFC修改成功")
              this.$router.push({path:'/nfc'})
            }else{
              Toast("NFC修改失败");
            }
          })
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";

.save{
  width: 91%;
  margin:16px auto 0 auto;
  background: #09A3FC;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
  // overflow:hidden;
}
.urgent{
  padding:24px 0 11px 16px;
  font-size:17px;
  font-weight: bold;
  color:#303030; 
}
.urgdiv{
  width: 100%;
  height: 58px;
  margin-bottom: 1px;
  background: #fff;
  line-height: 58px;
  color:#303030; 
  font-size: 15px;
  position: relative;
}
.urgdiv span{
  color:#F80D0D;
  margin:0 2px 0 7px;
}
.urgInput{
  border:0;
  outline: none;
  width: 50%;
  float: right;
  margin-right: 15px;
  height: 30px;
  line-height: 30px;
  margin-top:14px;
  text-align: right;
  color:#999999;
}
.lineMsg{
  margin:8px 0 0 16px;
  font-size: 13px;
  color:#666666;
}
.setFinger{
  display: inline-block;
  color:#09A3FC;
  font-size:15px;
  margin-left: 16px;
}
.urgdiv img{
  width: 15px;
  position: absolute;
  right: 16px;
  top:21px;
}
.changeMsg{
  width: 100%;
  margin-top:16px;
  @extend .boxAround; 
}
.changede{
  width: 44%;
  height: 40px;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  border:1px solid #FF0000;
  color:#FF0000;
}
.changesh{
  width: 44%;
  height: 40px;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  color:#fff;
  background: #09A3FC;
}
.img{
  width: 100%;
  height: 359px;
  text-align: center;
  background:$mainbc;
}
.img img{
  width: 300px;
  // margin: 0 auto;
  padding-top:50px;
}
.lineFont{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color:#666;
  font-size: 13px;
  margin:10px auto;
}
</style>
