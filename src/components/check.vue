<template>
  <div class="body">
    <div class="emp"></div>
    <!-- <div class="pack">返回</div> -->
    <div class="passWord" v-for="item in passW" @click="deleteLev(item)">
      <!-- <mt-cell-swipe :right="[{content: '删除',style: { background: 'red', color: '#fff' },handler: () => deleteLev(item)}]"> -->
        <div class="passPic"><img :src="item.imageUrl"></div>
        <div class="passMain">
          <div class="passName">{{item.nickName}}</div>
          <div class="passType"><img src="../../static/images/xingbie.png"><span>{{item.sex}}</span></div>
          <!-- <img class="passMainPic" src="../../static/images/jiantoiu.png"> -->
          <div class="passStyeN">{{item.level|level}}</div>
        </div>
      <!-- </mt-cell-swipe> -->
    </div>
    <div class="noneMes" v-if="showDiv"><img src="../../static/images/nomess.png"></div>
  </div>  
</template>

<script>
import {getBindersByDeviceId,deleteLockBinding} from '../axios/api.js'
import {mapState} from "vuex"
import {level} from '../axios/filer.js'
import { MessageBox,Toast,CellSwipe} from 'mint-ui';


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
        console.log(params);
        getBindersByDeviceId(params).then(res=>{
          // console.log(res)
          if(res.data.result.length==0){
            this.showDiv=true;
          }
          this.passW=res.data.result;
          console.log(this.passW);
        });
        // console.log(res);
      },
      deleteLev(item){
        console.log(item);
        let that=this;
        if(item.level==1){
          Toast("管理员不能被他人解绑！")
          return;
        }
        MessageBox.confirm('确定立即解除绑定?').then(action => {
          let data={
            deviceId:item.deviceId,
            openId:openId
          }
          deleteLockBinding(data).then(res=>{
            console.log(res)
            if(res.data.resCode==0){
              Toast("解绑成功")
              that.onlodaing();
            }else{
              Toast("解绑失败")
            }
          })
        })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";
@import '../assets/css/mint.scss';//全局修改mint-UI样式
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
.passPic{
  width: 30%;
  height: 100%;
  @extend .boxCenter;
}
.passPic img{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.passMain{
  width:70%;
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
  @extend .boxCenter;
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
  width:110px;
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
