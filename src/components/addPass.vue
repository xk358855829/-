<template>
  <div class="body">
    <div class="addPass">
      <div class="passBox">
        <span class="passBoxSpan">设置密码</span>
        <input type="number" pattern="[0-9]*" oninput="if(value.length>6) value=value.slice(0,6)" placeholder="请输入6位数字密码"  v-model="addPass.Password">
        <div class="inner" @click="random">生成随机密码</div>
      </div>
      <div class="passBox borderTop">
        <span class="passBoxSpan">密码名称</span>
        <input type="text" placeholder="点击输入密码名称"  v-model="addPass.alias">
      </div>
      <div class="passBox borderTop" v-show="type=='1'||type=='2'||passType==''">
        <span class="passBoxSpan">密码期限</span>
        <div class="pushDown" v-if="passType==''" @click="popup">
          <span>{{popupValue}}</span>
          <img v-if="popupVisible" src="../../static/images/xiajian.png">
          <img v-else src="../../static/images/shangj.png">
        </div>
      </div>
      <div class="passBoxLin borderTop" v-show="type=='1'||type=='2'">
        <div class="passWordIn" v-show="type=='1'">
          <span>开始时间</span>
          <div class="passWordDiv" v-model="addPass.StartTime" @click="openPickers">{{addPass.StartTime}}</div>
          <template>
            <mt-datetime-picker ref="pickers"  type="datetime" v-model="StartTime" year-format="{value}" @confirm="handleConfirmS"></mt-datetime-picker>
          </template>
        </div>
        <div class="passWordIn passBoxNone" v-show="type=='1'">
          <span>结束时间</span>
          <div class="passWordDiv" v-model="addPass.EndTime" @click="openPickert">{{addPass.EndTime}}</div>
          <template>
            <mt-datetime-picker ref="pickert"  type="datetime" v-model="EndTime" @confirm="handleConfirmT"></mt-datetime-picker>
          </template>
        </div>
        <div class="passWordIn passBoxNone" v-show="type=='2'">
          <span>使用次数</span>
          <input type="number"   placeholder="输入可使用的次数，用完密码立即失效"  v-model="addPass.Times">
        </div>
        <div class="passWordIn passBoxNone" v-show="type=='2'&&passType!==''">
          <span>已用次数</span>
          <div class="timePass">{{usedTimes}}</div>
        </div>
      </div>
    </div>
    <div class="errSpan">密码需1小时生效,如需立即生效可在锁亮屏下长按#号键3秒</div>
    <div class="save" v-if="devValue" @click="sub()">确认生成</div>
    <div v-else>
      <div class="save"  @click="revise()">确认修改</div>
      <div class="saveDet"  @click="deletePass()">删除密码</div>
    </div>
    <mt-popup class="popupVisible" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
      <div class="popup">
        <div class="popupDiv" @click="chespopup('永久')">永久密码</div>
        <div class="popupDiv" @click="chespopup('计次')">计次密码</div>
        <div @click="chespopup('时效')">时效密码</div>
      </div>
    </mt-popup>
  </div>  
</template>

<script>
import {setPassWord,getPswdByDeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast,Popup,MessageBox } from 'mint-ui';

export default {
  name: 'addPass',
  data () {
    return {
      addPass:{
        openId:'',
        Password:'',
        alias:'',
        StartTime:'',
        EndTime:'',
        Times:'',
        deviceId:''
      },
      type:'3',
      StartTime:'',
      EndTime:'',
      popupVisible:false,
      popupValue:'永久',
      passType:'',
      devValue:true,
      PwdNo:'',
      significantStatus:'',
      deleted_:'',
      usedTimes:""
    }
  },
  computed:{
    ...mapState(["openId","index"])
  },
  mounted:function () {
    this.onlodaing();
    document.title=this.$route.meta.title
  },
  methods:{
      onlodaing(){
        let changePass=JSON.parse(sessionStorage.getItem("changePass"));
        let deviceId = sessionStorage.getItem("deviceId");
        this.addPass.deviceId=deviceId;
        if(changePass==null){
          this.passType=""
          this.devValue=true;
          this.addPass.StartTime=this.formatDate(new Date());
          this.addPass.EndTime=this.formatDate(new Date());
          this.StartTime=this.addPass.StartTime
          this.EndTime=this.addPass.EndTime
          return;
        }else{
          this.passType="10"
          this.devValue=false
        }
        this.addPass.alias=changePass.alias;
        this.addPass.Password=changePass.password;
        this.addPass.StartTime=this.formatDate(changePass.startTime);
        this.addPass.EndTime=this.formatDate(changePass.endTime);
        this.StartTime=this.addPass.StartTime
        this.EndTime=this.addPass.EndTime
        this.addPass.Times=changePass.times;
        this.PwdNo=changePass.pwdNo;
        this.significantStatus=changePass.significantStatus;
        this.deleted_=changePass.deleted_;
        // this.usedTimes=changePass.usedTimes
        // console.log(this.deleted_);
        if(changePass.passType=="0"){
          this.type="3"
        }else if(changePass.passType=="1"){
          this.type="2"
        }else if(changePass.passType=="100"){
          this.type="3"
        }else{
          this.type="1"
        }
        let params={
          deviceId:sessionStorage.getItem("deviceId"),
        }
        if(sessionStorage.getItem("level")==1){
          // params.createdBy=null
        }else{
          params.createdBy=this.openId
        }
        getPswdByDeviceId(params).then(res=>{
          this.usedTimes=res.data.result[this.index].usedTimes;
          if(this.usedTimes>this.addPass.Times||this.usedTimes<0||this.usedTimes==""){
            this.$router.push({path:'/passWordList'})
          }
        });
        console.log(this.type)
      },
      chespopup(mes){
        this.popupVisible=false;
        this.popupValue=mes;
        if(mes=="永久"){
          this.type="3"
        }else if(mes=="计次"){
          this.type="2"
        }else{
          this.type="1"
        }
      },
      sub(){
        let data={};
        let url;
        if(this.addPass.Password==''||this.addPass.alias==''){
          Toast("密码或名称必填！")
          return;
        }
        if(this.type=="3"){
           data.deviceId=this.addPass.deviceId;
           data.alias=this.addPass.alias;
           data.Password=this.addPass.Password;
           url="/mobile/manage/addPermPswd";
        }else if(this.type=="2"){
          if(this.addPass.Times==''){
            Toast("次数必填！")
            return;
          }
          if(this.addPass.Times>=255){
            Toast("密码次数不能超过255")
            return;
          }
           data.deviceId=this.addPass.deviceId;
           data.alias=this.addPass.alias;
           data.Password=this.addPass.Password;
           data.Times=this.addPass.Times;
           url="/mobile/manage/addCounttimesPswd";
        }else{
          if(this.addPass.StartTime==''||this.addPass.EndTime==''){
            Toast("时间段必填！")
            return;
          }
          console.log((new Date(this.addPass.EndTime)).getTime())
          console.log((new Date(this.addPass.StartTime)).getTime())
          if((new Date(this.addPass.EndTime)).getTime()-(new Date(this.addPass.StartTime)).getTime()<=0){
              Toast("结束时间必须晚于开始时间！")
              return;
          }
           data.deviceId=this.addPass.deviceId;
           data.alias=this.addPass.alias;
           data.Password=this.addPass.Password;
           data.StartTime=this.addPass.StartTime;
           data.EndTime=this.addPass.EndTime;
           url="/mobile/manage/addAgingPswd";
        }
        
        data.createdBy=this.openId;
        console.log(data);
        setPassWord(data,url).then(res=>{
          console.log(res);
          if(res.data.resCode == 1 || res.data.resCode == 500){
              Toast(res.data.result)
          }else if(res.data.resCode == 0){
              Toast("添加成功")   
              this.$router.push({path:'/passWordList'})       
          }
        })
      },
      revise(){
        MessageBox.confirm('确定修改此密码?').then(action => {
            let data={};
            data.PwdNo=this.PwdNo;
            data.significantStatus=this.significantStatus;
            data.deleted_=this.deleted_;
            data.deviceId=this.addPass.deviceId;
            data.alias=this.addPass.alias;
            data.Password=this.addPass.Password;
            let url;
            if(this.addPass.Password==''||this.addPass.alias==''){
              Toast("密码或名称必填！")
              return;
            }
            if(this.type=="3"){
               url="/mobile/manage/updatePermPswd";
            }else if(this.type=="2"){
              if(this.addPass.Times==''){
                Toast("次数必填！")
                return;
              }
              if(this.addPass.Times>=255){
                Toast("密码次数不能超过255")
                return;
              }
               data.Times=this.addPass.Times;
               url="/mobile/manage/updateCounttimesPswd";
            }else{
              if(this.addPass.StartTime==''||this.addPass.EndTime==''){
                Toast("时间段必填！")
                return;
              }
              if((new Date(this.addPass.EndTime)).getTime()-(new Date(this.addPass.StartTime)).getTime()<=0){
                Toast("结束时间必须晚于开始时间！")
                return;
              }
               data.StartTime=this.addPass.StartTime;
               data.EndTime=this.addPass.EndTime;
               url="/mobile/manage/updateAgingPswd";
            }
            if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
            }else{
              data.createdBy=this.openId
            }
            console.log(data);
            setPassWord(data,url).then(res=>{
              console.log(res);
              if(res.data.resCode == 1 || res.data.resCode == 500){
                  Toast(res.data.result)
              }else if(res.data.resCode == 0){
                  Toast("修改成功")       
                  this.$router.push({path:'/passWordList'})   
              }
            })
        })
      },
      deletePass(){
        MessageBox.confirm('确定删除此密码?').then(action => {
          let data={
          deviceId:this.addPass.deviceId,
          PwdNo:this.PwdNo
          }
          let url;
          if(this.type=="3"){
             url="/mobile/manage/deletePermPswd";
          }else if(this.type=="2"){
             url="/mobile/manage/deleteCounttimesPswd";
          }else{
             url="/mobile/manage/deleteAgingPswd";
          }
          if(sessionStorage.getItem("level")==1){
            // data.createdBy=null
          }else{
            data.createdBy=this.openId
          }
          console.log(data);
          setPassWord(data,url).then(res=>{
            console.log(res);
            if(res.data.resCode == 1 || res.data.resCode == 500){
                Toast(res.data.result)
            }else if(res.data.resCode == 0){
                Toast("删除成功");
                this.$router.push({path:'/passWordList'})       
            }
          })
        });
      },
      popup(){
        this.popupVisible=true;
      },
      random(){
        let Num="";
        for(let i=0;i<6;i++) {
            Num+=Math.floor(Math.random()*10);
        }
        this.addPass.Password=Num;
      },
      openPickers(){
        this.$refs.pickers.open();
      },
      openPickert(){
        this.$refs.pickert.open();
      },
      handleConfirmS(){
        this.addPass.StartTime=this.formatDate(this.StartTime)
      },
      handleConfirmT(){
        this.addPass.EndTime=this.formatDate(this.EndTime)
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
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";

.popupDiv{
  border-bottom: 1px solid #E4E4E4;
}
.popupVisible{
  width: 100%;
  margin:0;
  padding: 0;
}
.popup{
  width: 100%;
}
.popup div{
  height: 40px;
  width: 100%;
  color: #303030;
  font-size: 1.4rem;
  @extend .boxCenter;
}
.errSpan{
  width:92%;
  margin:0 auto;
  text-align:center;
  height:30px;
  color:#999;
  font-size:1rem;
  @extend .boxCenter;
  margin-top:24px;
  white-space:normal
}
.passWordIn span{
  display: inline-block;
  margin-right:10px;
  font-size:1.5rem;
}
.timePass{
  display: inline-block;
  width:70%;
  height:59px;
  line-height: 59px;
  border:0;
  outline:none;
  color:#D4D4D4;
  font-size:1.3rem;
}
.passWordDiv{
  display: inline-block;
  width:70%;
  height:59px;
  line-height: 59px;
  border:0;
  outline:none;
  color:#D4D4D4;
  font-size:1.3rem;
}
.passWordIn input{
  width:70%;
  height:20px;
  padding: 15px 0;
  border:0;
  outline:none;
  color:#D4D4D4;
  font-size:1.3rem;
}
.passWordIn{
  width:$width;
  padding-left:8%;
  height:60px;
  line-height:60px;
   @extend .boxCenter;
  border-bottom:1px solid #E4E4E4;
}
.passBoxNone{
  border:0px!important;
}
.pushDown{
  position:absolute;
  right:0px;
  top:0;
  width:50px;
  height:100%;
  @extend .boxCenter;
  color:#999999;
  font-size:1.3rem;
}
.pushDown img{
  margin-left: 4px;
  width:14px;
}
.addPass{
  width:100%;
  background:#fff;
}
.passBoxLin{
  width:$width;
  margin:0 auto;
  @extend .fontSet;
  position:relative;
}
.borderTop{
  border-top: 1px solid #E4E4E4;
}
.passBox{
  width:$width;
  margin:0 auto;
  height:60px;
  line-height:60px;
  // border-bottom:1px solid #E4E4E4;
  @extend .fontSet;
  position:relative;
}
.inner{
  width:100px;
  height:60px;
  line-height:60px;
  text-align:center;
  color:#00A0E9;
  font-size:1.3rem;
  position:absolute;
  right:0;
  top:0;
  cursor: pointer;
}
.passBoxSpan{
  margin-right:10px;
  font-size:1.5rem;
}
.passBox input{
  height:20px;
  padding: 15px 0;
  border:0;
  outline:none;
  color:#D4D4D4;
  font-size:1.3rem;
  width: 180px;
}
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
}
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
.saveDet{
  width: 91%;
  margin:16px auto 0 auto;
  background: red;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}
</style>
