<template>
  <div class="body">
     <div class="topbutton">
       <div  class="">NFC卡</div>
     </div>
          <div class="mess">
            <div class="messDiv" v-for="(item,index) in resultDate" @click='rounSing(index)'>{{item.alias}}<img src="../../static/images/jiantoiu.png"></div>
          </div>
          <div class="noneMes" v-if="showDiv"><img src="../../static/images/nomess.png"></div>
          <div class="addfinger" @click='push'>添加NFC卡</div>
  </div>  
</template>

<script>
import {nfclist} from '../axios/api.js'
import {mapState} from "vuex"
import { TabContainer, TabContainerItem } from 'mint-ui';
import {volPercentfire,signafire} from '../axios/filer.js'

export default {
  name: 'nfc',
  data () {
    return {
      showDiv:false,
      showDivUn:false,
      getTYpe:'',
      deviceId:'',
      resultDate:[]
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  components:{
  },
  created:function () {
    this.deviceId=sessionStorage.getItem("deviceId");
    this.onloading();
  },
  beforeDestroy () {
  },
  methods:{
    onloading(){
      let data={
        deviceId:this.deviceId
      }
      if(sessionStorage.getItem("level")==1){
        // data.createdBy=''
      }else{
        data.createdBy=this.openId
      }
      nfclist(data).then(res=>{
        console.log(res);
        if(res.data.resCode==0){
          for(let i=0;i<res.data.result.length;i++){
            if(res.data.result[i].syncStatus==1){
              this.resultDate.push(res.data.result[i])
            }
          }
          console.log(this.resultDate.length)
          if(this.resultDate.length==0){
            this.showDiv=true;
          }else{
            this.showDiv=false
          }
        }else{
          this.resultDate=[];
          this.showDiv=true;
        }
      })
    },
    push(){
      sessionStorage.setItem("addOrchange",'0')
      this.$router.push({path:'/addnfc'})
    },
    rounSing(i){
      this.$store.commit('updatecardid',this.resultDate[i].id)
      sessionStorage.setItem("addOrchange",'1')
      this.$router.push({path:'/addnfc'})
    },
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
  color:#999999;
  font-size:1.4rem;
  @extend .boxCenter;
}
.buttonBorder{
  width: 20%;
  height: 90%;
  // color:$backgroundColor;
  font-size:1.4rem;
  @extend .boxCenter;
  // border-bottom: 2px solid $backgroundColor;
}
.mess{
  padding-top:63px;
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
  margin-top: 66px;
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
