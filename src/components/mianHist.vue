<template>
  <div class="body">
     <div class="topbutton" v-if="getTYpe=='history'">
       <div @click="openM" :class="activeClass=='container1'?'buttonBorder':'button'">密码开门</div>
       <div @click="openZ" :class="activeClass=='container2'?'buttonBorder':'button'">指纹开门</div>
       <div @click="openN" :class="activeClass=='container3'?'buttonBorder':'button'">NFC开门</div>
       <div @click="openT" :class="activeClass=='container4'?'buttonBorder':'button'">远程开门</div>
     </div>
     <div class="onfixe">
        <div class="passWordIn">
          <span>开始时间</span>
        <div class="passWordDiv" v-model="addPass.startTime" @click="openPickers">{{addPass.startTime}}</div>
          <template>
            <mt-datetime-picker ref="pickers"  type="datetime" v-model="startTime" year-format="{value}" @confirm="handleConfirmS"></mt-datetime-picker>
          </template>
        </div>
        <div class="passWordIn passBoxNone">
          <span>结束时间</span>
          <div class="passWordDiv" v-model="addPass.endTime" @click="openPickert">{{addPass.endTime}}</div>
          <template>
            <mt-datetime-picker ref="pickert"  type="datetime" v-model="endTime" @confirm="handleConfirmT"></mt-datetime-picker>
          </template>
        </div>
        <!-- <div class="searchBox" @click="axiosGets" ref="mychild"><div class="search">查询</div></div> -->
    </div>
     <div class="topbutton" v-if="getTYpe=='warr'">异常报警</div>
     <mt-tab-container class="containerTab" v-model="active" v-if="getTYpe=='history'">
        <mt-tab-container-item :id="id">
          <history :msgFather="msgFather" ref="history"></history>
        </mt-tab-container-item>
        <!-- <mt-tab-container-item id="container2">
          <history :msgFather="'openZ'" ref="history"></history>
        </mt-tab-container-item>
        <mt-tab-container-item id="container3">
          <history :msgFather="'openN'" ref="history"></history>
        </mt-tab-container-item>
        <mt-tab-container-item id="container4">
          <history :msgFather="'open'" ref="history"></history>
        </mt-tab-container-item> -->
      </mt-tab-container>
      <history :msgFather="'warr'" v-if="getTYpe=='warr'"></history>
  </div>  
</template>

<script>
import history from  '../components/history'
import {openOrClose,getDoorOperateResult,getLockByOpenIdAndDeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import { TabContainer, TabContainerItem } from 'mint-ui';
import {volPercentfire,signafire} from '../axios/filer.js'

export default {
  name: 'mainPage',
  data () {
    return {
      online:true,
      active:'container1',
      activeClass:"container1",
      getTYpe:'',
      addPass:{
        startTime:'',
        endTime:''
      },
      startTime:'',
      endTime:'',
      id:'container1',
      msgFather:'openM'
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  components:{
      history
  },
  created:function () {
    this.getTYpe=sessionStorage.getItem("getTYpe");
    this.addPass.startTime=this.formatDate(new Date().setHours(0, 0, 0, 0))
    this.addPass.endTime=this.formatDate(new Date());
    this.startTime=this.addPass.startTime
    this.endTime=this.addPass.endTime
    sessionStorage.setItem("startTime",this.addPass.startTime)
    sessionStorage.setItem("endTime",this.addPass.endTime)
  },
  beforeDestroy () {
  },
  methods:{
    openM(){
      this.id="container1"
      this.msgFather="openM";
      this.active="container1";
      this.activeClass="container1";
      this.addPass.endTime=this.formatDate(new Date())
      this.$refs.history.axiosGetLoad("openM");  // 调用子组件的方法childClick
    },
    openZ(){
      this.id="container2"
      this.msgFather="openZ";
      this.active="container2";
      this.activeClass="container2"
      this.addPass.endTime=this.formatDate(new Date())
      this.$refs.history.axiosGetLoad("openZ");  // 调用子组件的方法childClick
    },
    openN(){
      this.id="container3"
      this.msgFather="openN";
      this.active="container3";
      this.activeClass="container3"
      this.addPass.endTime=this.formatDate(new Date())
      this.$refs.history.axiosGetLoad("openN");  // 调用子组件的方法childClick
    },
    openT(){
      this.id="container4"
      this.msgFather="open";
      this.active="container4";
      this.activeClass="container4"
      this.addPass.endTime=this.formatDate(new Date())
      this.$refs.history.axiosGetLoad("open");  // 调用子组件的方法childClick
    },
    // axiosGets(){
    //   this.$refs.mychild.axiosGetLoad("open");
    // },
     handleConfirmS(){
        this.addPass.startTime=this.formatDate(this.startTime)
        sessionStorage.setItem("startTime",this.addPass.startTime)
      },
      handleConfirmT(){
        this.addPass.endTime=this.formatDate(this.endTime)
        sessionStorage.setItem("endTime",this.addPass.endTime)
      },
      openPickers(){
        this.$refs.pickers.open();
      },
      openPickert(){
        this.$refs.pickert.open();
      },
      format(year,month,day){
        month++
        month<10&&(month='0'+month)
        day<10&&(day='0'+day)
        return year + '-' + month + '-' + day;
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
.body{
  width: 100%;
  height: 100%;
  background:#F2F2F2;
}
.topbutton{
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #E4E4E4;
  background: #fff;
  @extend .boxAround;
  z-index: 999;
  position: fixed;
  left: 0;
  top:0;
  font-size:1.4rem;
}
.topbutton div{
  cursor: pointer;
}
.button{
  width: 20%;
  height: 90%;
  // color:$backgroundColor;
  font-size:1.4rem;
  @extend .boxCenter;
}
.buttonBorder{
  width: 20%;
  height: 90%;
  color:$backgroundColor;
  font-size:1.4rem;
  @extend .boxCenter;
  border-bottom: 1px solid $backgroundColor;
}
.onfixe{
    position: fixed;
    left: 0;
    top:61px;
    z-index: 9999;
    width: 100%;
  }
  .passWordIn span{
  display: inline-block;
  margin-right:10px;
  font-size:1.3rem;
}
.passWordDiv{
  display: inline-block;
  width:70%;
  height:39px;
  line-height: 39px;
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
  width:98%;
  padding-left:2%;
  height:40px;
  line-height:40px;
   @extend .boxCenter;
   background:#fff;
  border-bottom:1px solid #E4E4E4;
}
.passBoxNone{
  border:0px!important;
}
.search{
  width: $width;
  height: 40px;
  background:$backgroundColor;
  margin:0 auto;
  @extend .boxCenter;
  color:#fff;
  font-size:1.6rem;
  border-radius: 5px;
}
.searchBox{
  background: #fff;
  height: 60px;
  padding-top:20px; 
}
</style>
