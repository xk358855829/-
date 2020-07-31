<template>
  <div class="body">
   <!--  <div class="onfixe">
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
        <div class="searchBox" @click="axiosGet"><div class="search">查询</div></div>
    </div> -->
    <div class="searchBox" @click="axiosGet"><div class="search">查询</div></div>
    <!-- <div class="noMess" v-if="noMess">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div> -->
    <div class="buttDiv" v-if="msgFather=='openM'">
      <div class="noMess" v-if="noMessM">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div>
    <div class="messBox" v-for="(item,index) in messageopenM">
      <div class="messDiv">
        <span>{{item.pwdAlias}}</span><br/><span class="messSmall">{{item.way|openType}}</span>
      </div>
      <div class="messDivTime">{{item.time|formatDate}}</div>
    </div>
    </div>
    <div class="buttDiv" v-else-if="msgFather=='openZ'">
      <div class="noMess" v-if="noMessZ">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div>
    <div class="messBox" v-for="item in messageopenZ">
      <div class="messDiv">
        <span>{{item.pwdAlias}}</span><br/><span class="messSmall">{{item.way|openType}}</span>
      </div>
      <div class="messDivTime">{{item.time|formatDate}}</div>
    </div>
    </div>
    <div class="buttDiv" v-else-if="msgFather=='openN'">
      <div class="noMess" v-if="noMessN">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div>
    <div class="messBox" v-for="item in messageopenN">
      <div class="messDiv">
        <span>{{item.pwdAlias}}</span><br/><span class="messSmall">{{item.way|openType}}</span>
      </div>
      <div class="messDivTime">{{item.time|formatDate}}</div>
    </div>
    </div>
    <div class="buttDiv" v-else-if="msgFather=='open'">
      <div class="noMess" v-if="noMessO">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div>
    <div class="messBox" v-for="item in message" >
      <div class="messDiv">
        <span>{{item.nickName}}</span><br/><span class="messSmall">{{item.status|openStatus}}</span>
      </div>
      <div class="messDivTime">{{item.date|formatDate}}</div>
    </div>
    </div>
    <div class="buttDiv" v-else-if="msgFather=='warr'">
      <div class="noMess" v-if="noMessW">
      <div class="noMessImg"><img src="../../static/images/nomess.png"><div>无数据</div>
      </div>   
    </div>
    <div class="messBox" v-for="item in message">
      <div class="messDiv">
        <span>{{item.msg|filerSub}}</span><br/><span class="messSmall">{{item.deviceId}}</span>
      </div>
      <div class="messDivTime">{{item.inserttime_|formatDate}}</div>
    </div>
    </div>
  </div>  
</template>

<script>
import {getDoorOpenInfo,getWarningMsgByOpenId,getDoorOper} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast,Popup,Indicator } from 'mint-ui';
import {formatDate,openType,pswdAlias,filerSub,openStatus} from '../axios/filer.js'

export default {
  name: 'history',
  data () {
    return {
      addPass:{
        startTime:'',
        endTime:''
      },
      startTime:'',
      endTime:'',
      time:1,
      message:[],
      messageopenN:[],
      messageopenM:[],
      messageopenZ:[],
      noMessM:false,
      noMessZ:false,
      noMessN:false,
      noMessO:false,
      noMessW:false
    }
  },
  props:['msgFather'],
  computed:{
    ...mapState(["openId"])
  },
  mounted:function () {
    let e="";
    this.axiosGetLoad(e);
    document.title=this.$route.meta.title
    console.log(this.msgFather);
  },
  methods:{
      axiosGet(){
        console.log(this.msgFather);
          let data={
            deviceId:sessionStorage.getItem("deviceId"),
            startTime:sessionStorage.getItem("startTime"),
            endTime:sessionStorage.getItem("endTime")
          }
          console.log((new Date(sessionStorage.getItem("startTime"))).getTime())
          console.log((new Date(sessionStorage.getItem("endTime"))).getTime())
          if((new Date(sessionStorage.getItem("endTime"))).getTime()-(new Date(sessionStorage.getItem("startTime"))).getTime()<=0){
                Toast("结束时间必须晚于开始时间！")
                return;
            }
          Indicator.open({
            text: '请稍后...',
            spinnerType: 'fading-circle'
          });
          this.messageopenM=[]
          this.messageopenN=[]
          this.messageopenZ=[]
          if(this.msgFather=="openM"||this.msgFather=="openZ"||this.msgFather=="openN"){
            getDoorOpenInfo(data).then(res=>{
              Indicator.close();
              if(res.data.resCode==1){
                this.messageopenN=[];
                this.messageopenM=[];
                this.messageopenZ=[];
                this.noMessM=true;
                this.noMessZ=true;
                this.noMessN=true;
              }else{
                for(let i=0;i<res.data.result.length;i++){
                  if(res.data.result[i].way==1){
                    // this.$set(this.messageopenM, i, res.data.result[i])
                    this.messageopenM.push(res.data.result[i]);
                  }else if(res.data.result[i].way==2){
                    this.messageopenN.push(res.data.result[i]);
                    // this.$set(this.messageopenN, i, res.data.result[i])
                  }else{
                    this.messageopenZ.push(res.data.result[i]);
                    // this.$set(this.messageopenZ, i, res.data.result[i])
                  }
                }
                if(this.messageopenM.length==0){
                  this.noMessM=true;
                }else{
                  this.noMessM=false;
                }
                if(this.messageopenZ.length==0){
                  this.noMessZ=true;
                }else{
                  this.noMessZ=false;
                }
                if(this.messageopenN.length==0){
                  this.noMessN=true;
                }else{
                  this.noMessN=false;
                }
                // console.log(this.messageopenN)
                // console.log(this.messageopenM)
                // console.log(this.messageopenZ)
                // this.noMess=false;
              }
            });
          }else if(this.msgFather=="open"){
            let level=sessionStorage.getItem("level");
            console.log(level);
            if(level==2){
              data.openId=this.openId;
            }
            getDoorOper(data).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.resCode==1){
                this.message=[];
                this.noMessO=true;
              }else{
                this.message=res.data.result;
                this.noMessO=false;
              }
              console.log(this.message)
            });
          }else{
            let parms={
              openId:this.openId,
              startTime:sessionStorage.getItem("startTime"),
              endTime:sessionStorage.getItem("endTime")
            }
            getWarningMsgByOpenId(parms).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.result.length==0){
                this.message=[];
                this.noMessW=true;
              }else{
                this.message=res.data.result;
                this.noMessW=false;
              }
              console.log(this.message)
            });
          }
          this.$forceUpdate();
        },
      axiosGetLoad(e){
        console.log(this.msgFather);
        if(e==""){
          e=this.msgFather
        }
        console.log(e)
        let that=this;
         Indicator.open({
            text: '请稍后...',
            spinnerType: 'fading-circle'
          });
          let data={
            deviceId:sessionStorage.getItem("deviceId"),
            number:10
          }
          let level=sessionStorage.getItem("level")
          if(level==2){
              data.openId=that.openId;
          }
          that.messageopenM=[]
          that.messageopenN=[]
          that.messageopenZ=[]
          if(e=="openM"){
            data.doorOpenWay=1
            getDoorOpenInfo(data).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.resCode==1){
                that.messageopenM=[];
                that.noMessM=true;
              }else{
                for(let i=0;i<res.data.result.length;i++){
                  that.$set(this.messageopenM,i,res.data.result[i])
                }
                // that.messageopenM=res.data.result
                if(that.messageopenM.length==0){
                  that.noMessM=true;
                }else{
                  that.noMessM=false;
                }
                that.$forceUpdate();
              }
            });
          }else if(e=="openN"){
            data.doorOpenWay=2
            getDoorOpenInfo(data).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.resCode==1){
                that.messageopenN=[];
                that.noMessN=true;
              }else{
                that.messageopenN=res.data.result
                console.log(that.messageopenN)
                if(that.messageopenN.length==0){
                  that.noMessN=true;
                }else{
                  that.noMessN=false;
                }
                that.$forceUpdate();
              }
            });
          }else if(e=="openZ"){
            data.doorOpenWay=4
            getDoorOpenInfo(data).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.resCode==1){
                that.messageopenZ=[];
                that.noMessZ=true;
              }else{
                that.messageopenZ=res.data.result
                if(that.messageopenZ.length==0){
                  that.noMessZ=true;
                }else{
                  that.noMessZ=false;
                }
                that.$forceUpdate();
              }
              console.log(that.messageopenZ)
            });
          }else if(e=="open"){  
            console.log(that.addPass.endTime)
            let level=sessionStorage.getItem("level");
            console.log(level)
            getDoorOper(data).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.resCode==1){
                that.message=[];
                that.noMessO=true;
              }else{
                that.message=res.data.result;
                that.noMessO=false;
              }
              console.log(this.message)
            });
          }else{
            let parms={
              openId:that.openId,
              number:10
            }
            getWarningMsgByOpenId(parms).then(res=>{
              console.log(res);
              Indicator.close();
              if(res.data.result.length==0){
                that.message=[];
                that.noMessW=true;
              }else{
                that.message=res.data.result;
                that.noMessW=false;
              }
              console.log(that.message)
            });
          }
          that.$forceUpdate();
        },
      format(year,month,day){
        month++
        month<10&&(month='0'+month)
        day<10&&(day='0'+day)
        return year + '-' + month + '-' + day;
      },
      openPickers(){
        this.$refs.pickers.open();
      },
      openPickert(){
        this.$refs.pickert.open();
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
.passBox{
  width:$width;
  margin:0 auto;
  height:60px;
  line-height:60px;
  border-bottom:1px solid #E4E4E4;
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
  .timeMouth{
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color:#303030;
    font-size:1.4rem;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeUp{
    width: 50%;
    height: 100%;
    line-height: 60px;
  }
  .messBox{
    width: 96.8%;
    height: 65px;
    background: #fff;
    border-radius: 5px;
    margin:6px auto;
    position: relative;
    // overflow: hidden;
  }
  .buttDiv{
    // overflow: hidden;
    // height: 300px;
  }
  .messDiv{
    width: 96%;
    height: 45px;
    color:#303030;
    font-size:1.4rem;
    line-height: 22px;
    position: absolute;
    top:10px;
    left: 2%
  }
  .messSmall{
    color:#999;
    font-size:1.3rem
  }
  .messDivTime{
    // width: 160px;
    height: 100%;
    position: absolute;
    top:0;
    right: 2%;
    color:#999;
    font-size:1.2rem;
    line-height:65px;
    text-align: center;
    overflow: hidden;
    // z-index: 999;
  }
  .noMess{
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 200px;
    color:#999;
    font-size:1.8rem
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
    position: fixed;
    left: 0px;
    top:142px;
    width: 100%;
    background: #fff;
    height: 60px;
    padding-top:20px; 
    z-index: 999
  }
  .onfixe{
    position: fixed;
    left: 0;
    top:61px;
    z-index: 9999;
    width: 100%;
  }
  .noMess{
    margin-top:220px;
  }
  .noMessImg{
    width: 200px;
    height: 200px;
    margin:0 auto;
    position: relative;
  }
  .noMessImg img{
    width: 100%;
  }
  .noMessImg div{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .buttDiv{
    margin-top:230px;
  }
  .body{
    overflow-y: auto;
  }
</style>
