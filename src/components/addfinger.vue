<template>
  <div class="body">
    <div class="start" v-if='showSta'>
    <div v-if="finger=='1'">
      <div class="urgent">紧急联系人</div>
      <div class="urgdiv">
        <span>*</span>电话
        <input type="text" v-model="phone" name="" class="urgInput" placeholder="请输入紧急联系人电话" maxlength="20">
      </div>
      <div class="urgdiv">
        <span>&nbsp;&nbsp;</span>姓名
        <input type="text" v-model="name" name="" class="urgInput" placeholder="请输入紧急联系人姓名" maxlength="20">
      </div>
      <div class="lineMsg">添加或修改紧急联系人后请及时告知对方</div>
    </div>
    <div class="urgent">指纹信息</div>
      <div class="urgdiv">
        <span>*</span>指纹名称
        <input type="text" v-model="fingerName" name="" class="urgInput" placeholder="请输入指纹名称">
      </div>
      <!-- <div class="urgdiv" @click='routeSent'>
        <div class="setFinger">录入指纹</div><img src="../../static/images/fish.png" v-if='showInput'>
      </div> -->
    <div class="save" v-if="addOrchange=='0'" @click="sub()">完成</div>
    <div class="changeMsg" v-if="addOrchange=='1'">
      <div class="changede" @click="deleteMsg">删除</div>
      <div class="changesh" @click="revise">修改</div>
    </div>
    <div class="img" v-show='online'><div class="lineFont">门锁未联网<p>请在门锁黑屏状态下长按#键5秒，等待语音提示</p></div><img src="../../static/images/outline.png"></div>
    <div class="img" v-show='!online'><img src="../../static/images/online.png"></div>
    </div>
    <div class="start" v-if='!showSta'>
      <div class="top">{{fontMsgOn.top}}</div>
      <div class="mid">{{fontMsgOn.mid}}</div>
      <img :src="img2" class="img2">
    </div>
  </div>  
</template>

<script>
import {getOnlineStatusByDeviceId,addfinger,addemergencyContantPerson,showAddfinger,getLockByOpenIdAndDeviceId,findById,deleteFingerPrint,update,updateTs,getDelStatus} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast ,MessageBox,Indicator} from 'mint-ui';
import lock from '../../static/images/lock.png'

export default {
  name: 'add',
  data () {
    return {
      addMsg:{
        openId:''
      },
      resultData:[],
      showSta:true,
      phone:'',
      name:'',
      fingerName:'',
      addOrchange:'0',
      check:false,
      deviceId:'',
      online:'',
      // fingers:'1',
      showInput:false,
      selTime:'',
      delTime:'',
      time:1,
      Deltime:1,
      lockMsg:'',
      img2:lock,
      fontMsgOn:{
        top:"锁已链接",
        mid:"请根据语音提示操作"
      },
      onlod:''
    }
  },
  computed:{
    ...mapState(["openId","finger","id"])
  },

destroyed() {
  Indicator.close();
  clearInterval(this.onlod);
},
  created:function () {
    this.addOrchange=sessionStorage.getItem("addOrchange")
    if(this.addOrchange==1){
      let data={
        id:this.id
      }
      findById(data).then(res=>{
        console.log(res);
        this.resultData=res.data.result;
        this.phone=res.data.result.phone;
        this.name=res.data.result.name;
        this.fingerName=res.data.result.alias;
      })
    }
     this.onlodaingOnline();
      this.onlod=setInterval(()=>{
        this.onlodaingOnline()
      },1000)
  },
  mounted:function () {
    document.title=this.$route.meta.title;
    this.deviceId = sessionStorage.getItem("deviceId");
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
        let regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!regPhone.test(this.phone)&&this.phone!=='') {
          Toast('手机号码格式有误');
          return;
        } 
        getLockByOpenIdAndDeviceId(dataDate).then(res=>{
          console.log(res)
          this.lockMsg=res.data.result;
          if(this.lockMsg.deviceInfo.onlineStatus=='0'){
            Toast('设备未联网，请按长按#键5秒');
            return;
          }else{
            let that=this;
            let urlFing='/mobile/fingerprint/startInputFingerprint';
            clearInterval(that.onlod)
            if(that.finger=='1'){
              if(that.phone==''||that.name==''||that.fingerName==''){
                Toast('必填不能为空');
                return;
              }
              let data={
                phone:that.phone,
                name:that.name
              }
              data.createdBy=that.openId;
              let url='/mobile/emergencyContantPerson/add';
              addemergencyContantPerson(data,url).then(res=>{
                console.log(res)
                if(res.data.resCode==0){
                    let data={
                      deviceId:that.deviceId,
                      isSpeFinger:true,
                      emergency_person_id:res.data.result,
                      fingerName:that.fingerName
                    }
                    data.createdBy=that.openId;
                    that.showSta=false;
                    Indicator.open({
                      text: '请录入指纹...',
                      spinnerType: 'fading-circle'
                    });
                    clearInterval(that.selTime);
                    addfinger(data,urlFing).then(res=>{
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
                            showAddfinger(data).then(res=>{
                              if(res.data.result=='录入完成'){
                                 Toast("指纹录入完成!");
                                 that.time=1;
                                 clearInterval(that.selTime);
                                 that.showSta=true;
                                 Indicator.close();
                                 that.$router.push({path:'/fingerprint'})
                              }else if(res.data.resCode==1){
                                Toast(res.data.result);
                                that.time=1;
                                 clearInterval(that.selTime);
                                 that.showSta=true;
                                 Indicator.close();
                                 that.$router.push({path:'/fingerprint'})
                              }
                            })
                          },1000)
                        },8000)
                      }else{
                        Indicator.close();
                        that.showSta=true;
                          // Toast("设备离线,请激活设备!");         
                      }
                    });
                }else{
                  Toast('设备离线,请激活设备');
                  that.onlod=setInterval(()=>{
                    that.onlodaingOnline()
                  },1000)
                }
              })
            }else{
              if(that.fingerName==''){
                Toast('必填不能为空');
                return;
              }
              let data={
                deviceId:that.deviceId,
                isSpeFinger:false,
                emergency_person_id:0,
                fingerName:that.fingerName
              }
              data.createdBy=that.openId;
              that.showSta=false;
              Indicator.open({
                text: '请录入指纹...',
                spinnerType: 'fading-circle'
              });
              clearInterval(that.onlod)
              clearInterval(that.selTime);
              addfinger(data,urlFing).then(res=>{
                      if(res.data.resCode == 0){
                        setTimeout(()=>{
                          that.selTime=setInterval(()=>{
                            that.time++;
                            that.timeTo();
                            let data={
                              key:res.data.key_cmd_res,
                              deviceId:that.deviceId
                            }
                            showAddfinger(data).then(res=>{
                              if(res.data.resCode==0){
                                if(res.data.result=='录入完成'){
                                   Toast("指纹录入完成!");
                                   that.time=1;
                                   clearInterval(that.selTime);
                                   that.showSta=true;
                                   Indicator.close();
                                   that.$router.push({path:'/fingerprint'})
                                }
                              }else{
                                 Toast(res.data.result);
                                 that.time=1;
                                 clearInterval(that.selTime);
                                 that.showSta=true;
                                 Indicator.close();
                                 that.$router.push({path:'/fingerprint'})
                              }
                            })
                          },1000)
                        },8000)
                      }else{
                        Indicator.close();
                        Toast(res.data.result);
                        that.showSta=true;
                        that.onlod=setInterval(()=>{
                          that.onlodaingOnline()
                        },1000)     
                      }
              });
            }
          } 
      });
    },
    timeTo(){
      if(this.time==65){
        clearInterval(this.selTime);
        Indicator.close();
        Toast("录入超时，请稍后再试！")
        this.showSta=true;
        this.time=1;
        this.onlod=setInterval(()=>{
          this.onlodaingOnline()
        },1000)
      }else{
        // console.log(this.time);
      }
    },
    deleteMsg(){
       MessageBox.confirm('确定删除吗?').then(action => {
          console.log(this.resultData)
          let data={
            deviceId:this.deviceId,
            fpNo:this.resultData.fpNo
          }
          if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
          }else{
            data.createdBy=this.openId
          }
          clearInterval(this.onlod)
          deleteFingerPrint(data).then(res=>{
             console.log(res);
             let that=this;
             if(res.data.resCode==0){
              Indicator.open({
                      text: '正在删除指纹...',
                      spinnerType: 'fading-circle'
                    });
              that.delTime=setInterval(()=>{
                            that.Deltime++;
                            that.timeToDel();
                            let data={
                              key:res.data.key_cmd_res,
                              deviceId:that.deviceId
                            }
                            getDelStatus(data).then(res=>{
                              if(res.data.result=='删除完成'){
                                 Toast("指纹删除完成!");
                                 that.Deltime=1;
                                 clearInterval(that.delTime);
                                 Indicator.close();
                                 that.$router.push({path:'/fingerprint'})
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
          console.log(this.resultData)
          let data={
            fingerName:this.fingerName,
            id:this.resultData.id
          }
          if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
          }else{
            data.createdBy=this.openId
          }
          update(data).then(res=>{
             console.log(res);
             if(res.data.resCode==0){
              if(this.finger==1){
                let regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!regPhone.test(this.phone)&&this.phone!=='') {
                  Toast('手机号码格式有误');
                  return;
                } 
                let data={
                  id:this.resultData.emergencyPersonId,
                  phone:this.phone,
                  name:this.name
                }
                updateTs(data).then(res=>{
                  if(res.data.resCode==0){
                     Toast("指纹修改成功")
                     this.$router.push({path:'/fingerprint'})
                  }else{
                    Toast(res.data.result);
                  }
                })
              }else{
                Toast("指纹修改成功")
                this.$router.push({path:'/fingerprint'})
              }
             }else{
              Toast(res.data.result)
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
  font-size:1.7rem;
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
  font-size: 1.5rem;
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
  font-size: 1.3rem;
  color:#666666;
}
.setFinger{
  display: inline-block;
  color:#09A3FC;
  font-size:1.5rem;
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
.img2{
  width: 100%;
  position: absolute;
  left: 0;
  top:0;
}
.top{
  font-size: 20px;
  color: #666666;
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top:86px;
}
.mid{
  font-size: 17px;
  width: 100%;
  color: #666666;
  text-align: center;
  margin-top:20px;
  position: absolute;
  left: 0;
  top:106px;
}
.img{
  width: 100%;
  height: 369px;
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
