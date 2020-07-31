<template>
  <div class="body">
     <div class="topbutton">
       <div @click="openO" :class="activeClass?'button':'buttonBorder'">普通指纹</div>
       <div @click="openT" :class="activeClass?'buttonBorder':'button'">特殊指纹</div>
     </div>
     <mt-tab-container class="containerTab" v-model="active">
        <mt-tab-container-item id="container1">
          <div class="mess">
            <div class="messDiv" v-for="(item,index) in resultDateP" @click='rounSing(index)'>{{item.alias}}<img src="../../static/images/jiantoiu.png"></div>
          </div>
          <div class="noneMes" v-if="showDiv"><img src="../../static/images/nomess.png"></div>
          <div class="addfinger" @click='push'>添加指纹</div>
        </mt-tab-container-item>
        <mt-tab-container-item id="container2">
          <div class="textMsg">
            <div class="titleMsg">添加特殊指纹</div>
            <div class="mainMsg">
              <p>·&nbsp;&nbsp;当遇到危险情况时(如遇到坏人尾随、遭人胁迫开门等),使用特殊指纹开锁,会触发门锁危险机制,发出警报,同时将信息发送给紧急联系人,以确保您的居住安全。</p>
              <p>·&nbsp;&nbsp;目前仅支持号码归属地为中国大陆的手机号码</p>
              <p>·&nbsp;&nbsp;添加或修改紧急联系人后请及时告知对方</p>
              <!-- <br />·&nbsp;&nbsp;目前仅支持号码归属地为中国大陆的手机号码<br />·&nbsp;&nbsp;添加或修改紧急联系人后请及时告知对方 -->
            </div>
          </div>
          <div class="messUn">
            <div class="messDiv" v-for="(item,index) in resultDateT" @click='finMsg(index)'>{{item.alias}}<img src="../../static/images/jiantoiu.png"></div>
          </div>
          <div class="noneMes" v-if="showDivUn"><img src="../../static/images/nomess.png"></div>
          <div class="addfinger" @click='pushUn'>添加指纹</div>
        </mt-tab-container-item>
      </mt-tab-container>
     <!--  <history :msgFather="'warr'" v-if="getTYpe=='warr'"></history> -->
  </div>  
</template>

<script>
import {listFingerPrints} from '../axios/api.js'
import {mapState} from "vuex"
import { TabContainer, TabContainerItem } from 'mint-ui';
import {volPercentfire,signafire} from '../axios/filer.js'

export default {
  name: 'fingerprint',
  data () {
    return {
      showDiv:false,
      showDivUn:false,
      active:'container1',
      activeClass:false,
      getTYpe:'',
      resultDate:[],
      resultDateP:[],
      resultDateT:[]
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  components:{
  },
  created:function () {
    this.getTYpe=sessionStorage.getItem("getTYpe");
    this.deviceId=sessionStorage.getItem("deviceId");
    this.onload();
  },
  beforeDestroy () {
  },
  methods:{
    onload(){
      let that=this;
      let data={
        deviceId:that.deviceId
      }
      if(sessionStorage.getItem("level")==1){
        // data.createdBy=null
      }else{
        data.createdBy=that.openId
      }
      listFingerPrints(data).then(res=>{
        console.log(res);
        if(res.data.resCode==0){
          that.resultDate=res.data.result;
          for(let i=0;i<that.resultDate.length;i++){
            if(that.resultDate[i].syncStatus==1){
                if(that.resultDate[i].isEmergency==0){
                  that.resultDateP.push(that.resultDate[i])
                }else{
                  that.resultDateT.push(that.resultDate[i])
                }
            }
          }
          console.log(that.resultDateT)
          if(that.resultDateP.length==0){
            that.showDiv=true
          }else{
            that.showDiv=false
          }
          if(that.resultDateT.length==0){
            that.showDivUn=true
          }else{
            that.showDivUn=false
          }
        }else{
          that.resultDateP=[];
          that.resultDateT=[];
        }
      })
    },
    push(){
      // sessionStorage.setItem("finger",'0')
      this.$store.commit('updatefinger','0')
      sessionStorage.setItem("addOrchange",'0')
      this.$router.push({path:'/addfinger'})
    },
    pushUn(){
      // sessionStorage.setItem("finger",'1')
      this.$store.commit('updatefinger','1')
      sessionStorage.setItem("addOrchange",'0')
      this.$router.push({path:'/addfinger'})
    },
    finMsg(i){
      this.$store.commit('updateid',this.resultDateT[i].id)
      this.$store.commit('updatefinger','1')
      sessionStorage.setItem("addOrchange",'1')
      this.$router.push({path:'/addfinger'})
    },
    rounSing(i){
      this.$store.commit('updateid',this.resultDateP[i].id)
      this.$store.commit('updatefinger','0')
      sessionStorage.setItem("addOrchange",'1')
      this.$router.push({path:'/addfinger'})
    },
    openO(){
      this.active="container1";
      this.activeClass=false
    },
    openT(){
      this.active="container2";
      this.activeClass=true
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
  height: 50px;
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
  // color:#999999;
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
.mess{
  margin-top:63px;
}
.messUn{
  margin-top: 16px;
}
.messDiv{
  width: 100%;
  height: 58px;
  background: #fff;
  padding-left: 15px;
  font-size: 15px;
  color: #303030;
  line-height: 58px;
  position: relative;
  margin-bottom: 1px;
}
.messDiv img{
  width: 14px;
  position: absolute;
  right: 24px;
  top:22px;
}
.addfinger{
  width: 91%;
  margin:16px auto 16px auto;
  background: #09A3FC;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}
.noneMes{
  width: 200px;
  margin: 60px auto;
}
.noneMes img{
  width: 100%;
}
.textMsg{
  background: #fff;
  width: 100%;
  margin-top: 63px;
  height: 171px;
}
.titleMsg{
  margin-left: 16px;
  height: 15px;
  padding-top:20px;
  font-size:15px;
  font-weight: bold;
  color:#303030;
}
.mainMsg{
  margin:13px 27px 20px 18px;
  font-size: 13px;
  color:#666666; 
  line-height:21px;
}
</style>
