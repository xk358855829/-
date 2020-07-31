<template>
  <div class="body">
    <div class="emp"></div>
    <!-- <div class="pack">返回</div> -->
    <div class="passWord" v-for="(item,index) in passW" @click='changePass(index)'>
      <div class="passMain">
        <div class="passName">{{item.alias}}</div>
        <div class="passType"><img src="../../static/images/time.png"><span>{{item.passType|passType}}</span></div>
        <img class="passMainPic" src="../../static/images/jiantoiu.png">
        <div class="passStye" v-if="item.syncStatus=='1'&&item.significantStatus=='1'&&item.deleted_=='0'">已同步|有效期内</div>
        <div class="passStyeN" v-if="item.syncStatus=='0'&&item.significantStatus=='1'&&item.deleted_=='0'">未同步|有效期内</div>
        <div class="passStyeN" v-if="item.syncStatus=='1'&&item.significantStatus=='0'&&item.deleted_=='0'">已同步|已失效</div>
        <div class="passStyeN" v-if="item.syncStatus=='0'&&item.significantStatus=='0'&&item.deleted_=='0'">未同步|已失效</div>
        <div class="passStyeN" v-if="item.syncStatus=='0'&&item.significantStatus=='1'&&item.deleted_=='1'">已删除|未同步</div>
      </div>
    </div>
    <div class="noneMes" v-if="showDiv"><img src="../../static/images/nomess.png"></div>
    <div class="save" @click="addPass"><img src="../../static/images/jia.png">添加密码</div>
  </div>  
</template>

<script>
import {getPswdByDeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import {passType} from '../axios/filer.js'

export default {
  name: 'passWordList',
  data () {
    return {
      passW:[],
      showDiv:false
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  mounted:function () {
    this.onlodaing();
    document.title=this.$route.meta.title
  },
  methods:{
      sub(){
      },
      onlodaing(){
        let deviceId = sessionStorage.getItem("deviceId");
        let params = {
            deviceId:deviceId
        };
        console.log(sessionStorage.getItem("level"))
        if(sessionStorage.getItem("level")==1){
          // params.createdBy=null
        }else{
          params.createdBy=this.openId
        }
        console.log(params);
        getPswdByDeviceId(params).then(res=>{
          console.log(res)
          if(res.data.result.length==0){
            this.showDiv=true;
          }
          this.passW=res.data.result;
          console.log(this.passW);
        });
        // console.log(res);
      },
      changePass(index){
        sessionStorage.setItem("changePass",JSON.stringify(this.passW[index]));
        this.$store.commit('updateindex',index)
        this.$router.push({path:'/addPass'})
      },
      addPass(){
        sessionStorage.removeItem("changePass");
        this.$router.push({path:'/addPass'})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";

.save{
  width: 91%;
  margin:26px auto 30px auto;
  background: #09A3FC;
  border-radius: 5px;
  @extend .boxCenter;
  font-size: 1.5rem;
  color:#fff;
  height: 40px;
}
.save img{
  width:16px;
  margin-right:5px;
}
.passName{
  width:100%;
  height:14px;
  @extend .fontSet;
  padding-top:15px;
  margin-bottom:9px;
}
.passMain{
  width:$width;
  height:100%;
  margin:0 auto;
  position:relative;
}
.passMainPic{
  position:absolute;
  right:0;
  top:26px;
}
.passType{
  width:$width;
  font-size:1.2rem;
  color:#787878;
  position: relative;
}
.passType img{
  width:12px;
  margin-right:4px;
  position: absolute;
  left: 0;
  top:5px;
}
.passType span{
  position: absolute;
  left: 16px;
  top:2px
}
.passWord{
  width:$width;
  height:65px;
  margin:8px auto 16px auto;
  background:#fff;
  border-radius:5px;
  position: relative;
}
.emp{
  height:8px;
}
.pack{
  width:58px;
  height:25px;
  background:$backgroundColor;
  color:#fff;
  font-size:1.2rem;
  border-radius:13px;
  margin-left:4%;
  @extend .boxCenter; 
}
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
  overflow-y: auto;
}
.passStye{
  position: absolute;
  right: 20px;
  top:0;
  width: 110px;
  height: 100%;
  text-align: right;
  line-height: 65px;
  font-size: 1.5rem;
  color: $backgroundColor;
}
.passStyeN{
  position: absolute;
  right: 20px;
  top:0;
  width:140px;
  height: 100%;
  text-align: right;
  line-height: 65px;
  font-size: 1.5rem;
  color: #bbb;
}
.noneMes{
  width: 200px;
  margin: 20px auto;
}
.noneMes img{
  width: 100%;
}
</style>
