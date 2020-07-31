<template>
  <div class="body">
    <div class="top">
      <img src="../../static/images/1911.jpg">
    </div>
    <div class="setMess">
    <mt-field label="姓名" placeholder="请输入姓名(必填)"  v-model="addMsg.alias"></mt-field>
    <mt-field label="手机" placeholder="请输入手机号(必填)"  v-model="addMsg.phone"></mt-field>
    <mt-field label="地址" placeholder="请输入地址"  v-model="addMsg.address"></mt-field>
    </div>
    <div class="tomain">
    <div class="main">
      <div class="mainBox">
        <div class="lineBox topborder">
          <div class="lineBoxLeft">门的材质</div>
          <div class="lineBoxRight">
            <mt-radio
              v-model="valueDoor"
              :options="['木门', '不锈钢']">
            </mt-radio>
          </div>
        </div>
        <div class="lineBox">
          <div class="lineBoxLeft">开门方向</div>
          <div class="lineBoxRight">
            <div class="lineBoxRightBox">
              <mt-radio
              v-model="valueOpen"
              :options="['左内开', '左外开']">
            </mt-radio>
            </div>
            <div class="lineBoxRightBox">
              <mt-radio
              v-model="valueOpen"
              :options="['右内开', '右外开']">
            </mt-radio>
            </div>
          </div>
        </div>
        <div class="lineBox">
          <div class="lineBoxLeft">面板类型</div>
          <div class="lineBoxRight">
            <div class="lineBoxRightBox">
              <mt-radio
              v-model="valueType"
              :options="['直双孔', '直单孔']">
            </mt-radio>
            </div>
            <div class="lineBoxRightBox">
              <mt-radio
              v-model="valueType"
              :options="['圆双孔', '圆单孔']">
            </mt-radio>
            </div>
          </div>
        </div>
      </div>
      <div class="mainBox">
        <div class="lineBox rightborder topborder">
          <div class="lineBoxLeft">天地钩</div>
          <div class="lineBoxRight">
            <mt-radio
              v-model="valueUp"
              :options="['有', '无']">
            </mt-radio>
          </div>
        </div>
        <div class="lineBox2 rightborder">
          <div class="lineBoxLeft2">门的厚度</div>
          <div class="lineBoxRight">
            <input type="text" name="" class="testClass">mm
          </div>
        </div>
        <div class="lineBox2 rightborder">
          <div class="lineBoxLeft2">面板宽度</div>
          <div class="lineBoxRight">
            <input type="text" name="" class="testClass">mm
          </div>
        </div>
        <div class="lineBox2 rightborder">
          <div class="lineBoxLeft2">面板长度</div>
          <div class="lineBoxRight">
            <input type="text" name="" class="testClass">mm
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="save" @click="sub()">提交</div>
  </div>  
</template>

<script>
import {getLocksByOpenId} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast,Radio  } from 'mint-ui';

export default {
  name: 'add',
  data () {
    return {
      addMsg:{
        openId:'',
        address:'',
        phone:'',
        alias:''
      },
      valueDoor:'',
      valueOpen:'',
      valueType:'',
      valueUp:'',
      check:false
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  mounted:function () {
    document.title=this.$route.meta.title
  },
  methods:{
      sub(){
        if(this.addMsg.alias==''||this.addMsg.phone==''){
          Toast('必填不能为空');
          return;
        }
        this.addMsg.openId=this.openId;
        const data = this.addMsg;
        console.log(data);
        // addLock(data).then(res=>{
        //   console.log(res)
        //   if(res.data.resCode == 0){
        //       Toast("添加成功！");
        //       this.$router.push({path:'/'})
        //   }else{
        //       Toast("添加失败！");         
        //   }
        // });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";
// @import "../assets/css/mint.scss";//全局修改mint-UI样式
.lineBoxRight /deep/ .mint-cell:last-child{
  background-size: 100% 0px;
}
.lineBoxRight /deep/ .mint-cell-wrapper{
  padding: 0!important;
  background-size:120% 0;
}
.lineBoxRight /deep/ .mint-radiolist{
  margin-top:10px;
  padding-left: 2px;
}
.lineBoxRight /deep/ .mint-radio-label{
  margin: 0;
}
.lineBoxRight /deep/ .mint-radiolist-label{
  padding: 0;
}
.lineBoxRight /deep/ .mint-cell:last-child{
  background-size: 100% 0;
}
.setMess /deep/ .mint-cell:last-child{
  background-size: 100% 0;
}
.lineBoxRight /deep/ .mint-cell{
  min-height: 20px;
}
.lineBoxRight /deep/ .mint-radiolist-title{
  margin: 0;
}
.lineBoxRight /deep/ .mint-radio-label{
  font-size:1rem;
}
.lineBoxRight /deep/ .mint-radio-core{
  width: 10px!important;
  height: 10px!important;
}
.lineBoxRight /deep/ .mint-radio-core::after{
  top:15px!important;
}
.top{
  width: 100%;
}
.top img{
  width: 100%;
}
.save{
  width: 91%;
  margin:16px auto 0 auto;
  margin-bottom: 20px;
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
.wechart{
  padding: 0 10px;
  width: 100%; 
  background: #fff;
  height: 48px;
  line-height: 48px;
  font-size:1.5rem;
  position: relative;
}
.weRight{
  @extend .boxCenter;
  width: 50px;
  height: 100%;
  position: absolute;
  top:0;
  right: 10px;
}
.tomain{
  width: 100%;
  background: #fff;
  padding-top:10px;
  background: #fff; 
}
.main{
  width:98%;
  margin: 0 auto;
  @extend .boxCenter;  
}
.mainBox{
  width: 50%;
}
.lineBox{
  width: 100%;
  height: 60px;
  @extend .boxCenter;  
  border-bottom: 1px solid $borderColor;
}
.lineBox2{
  width: 100%;
  height: 40px;
  @extend .boxCenter;  
  border-bottom: 1px solid $borderColor;
}
.lineBoxLeft{
  width: 32%;
  height: 100%;
  line-height: 60px;
  text-align: center;
  background: #5b5a58;
  color: #fff;
  font-size:1.2rem
}
.lineBoxLeft2{
  width: 32%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  background: #5b5a58;
  color: #fff;
  font-size:1.2rem
}
.lineBoxRight{
  width: 68%;
  height: 100%;
}
.topborder{
  border-top: 1px solid $borderColor;
}
.lineBoxRightBox{
  width: 50%;
  height: 100%;
  float: left;
  display: inline-block;
}
.rightborder{
  border-right: 1px solid $borderColor;
}
.testClass{
  width: 60%;
  // border-bottom: 1px solid $borderColor;
  border:0;
  border-bottom: 1px solid $borderColor;
  padding: 0;
  margin: 0;
  outline: 0;
  -webkit-appearance: none;
  -webkit-box-flex: 1;
  flex: 1;
  margin-top:15px;
  margin-left: 5px;
  // padding-left: 5px;
}
.setMess{
  width: $width;
  padding: 0 4%;
  background: #ffffff;
  border-bottom: 4px solid #f2f2f2;
  padding-bottom: 10px;
  // margin:0 auto;
}
</style>
