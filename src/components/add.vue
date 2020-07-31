<template>
  <div class="body">
    <mt-field label="门锁名称" placeholder="请输入门锁名称"  v-model="addMsg.alias"></mt-field>
    <mt-field label="所在小区" placeholder="请输入所在小区"  v-model="addMsg.community"></mt-field>
    <mt-field label="楼号" placeholder="请输入楼号"  v-model="addMsg.buildingNo"></mt-field>
    <mt-field label="单元号" placeholder="请输入单元号"  v-model="addMsg.unitNo"></mt-field>
    <mt-field label="房间号" placeholder="请输入房间号" v-model="addMsg.roomNo"></mt-field>
    <mt-field label="门锁编号" placeholder="请输入门锁编号"  v-model="addMsg.deviceId" v-show="check"></mt-field>
 <!--    <mt-field label="微信扫一扫" @click="qrCheck">
      <img src="../../static/images/saoyis.png" height="20px" width="20px">
    </mt-field> -->
    <div class="wechart" @click="qrCheck">
      <div class="weLeft">微信扫一扫</div>
      <div class="weRight"><img src="../../static/images/saoyis.png" height="20px" width="20px"></div>
    </div>
    <div class="save" @click="sub()">保存</div>
  </div>  
</template>

<script>
import {getLocksByOpenId,addLock,getJSDK,getLockByOpenIdAndDeviceId} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast } from 'mint-ui';

export default {
  name: 'add',
  data () {
    return {
      addMsg:{
        openId:'',
        community:'',
        buildingNo:'',
        unitNo:'',
        roomNo:'',
        deviceId:'',
        alias:'',
        level:'1'
      },
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
        if(this.addMsg.alias==''||this.addMsg.community==''||this.addMsg.buildingNo==''||this.addMsg.unitNo==''||this.addMsg.roomNo==''||this.addMsg.deviceId==''){
          Toast('必填不能为空');
          return;
        }
        this.addMsg.openId=this.openId;
        const data = this.addMsg;
        console.log(data);
        addLock(data).then(res=>{
          console.log(res)
          if(res.data.resCode == 0){
              Toast("添加成功！");
              this.$router.push({path:'/'})
          }else{
              Toast(res.data.result);         
          }
        });
      },
      qrCheck(){
        let data={
          url:window.location.href.split('#')[0]
        }
        console.log(data.url);
        let that=this;
        getJSDK(data).then(res=>{
          console.log(res);
          wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端弹出出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.appid, // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                signature: res.data.signature, // 必填，签名，见附录1
                jsApiList: [res.data.jsApiList] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          wx.ready(function(){
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
                console.log(res);
                let resLockId='';
                let state='';
                let level;
                // alert(res.resultStr);
                resLockId=res.resultStr;
                state = resLockId.substring(resLockId.indexOf('state=')+6,resLockId.indexOf('#')-8);
                level = resLockId.substring(resLockId.indexOf('level=')+6,resLockId.indexOf('#'));
                // alert(level);
                that.check=true;
                that.addMsg.level=level
                that.addMsg.deviceId=state;
                // alert(state);
                
                  let data={
                    deviceId:state
                  }
                  getLockByOpenIdAndDeviceId(data).then(res=>{
                    // alert(res.data.result.alias);
                    that.addMsg.alias=res.data.result.alias;
                    that.addMsg.community=res.data.result.community;
                    that.addMsg.buildingNo=res.data.result.buildingNo;
                    that.addMsg.unitNo=res.data.result.unitNo;
                    that.addMsg.roomNo=res.data.result.roomNo;
                    that.addMsg.openId=that.openId;
                    if(that.addMsg.level==2){
                      that.addMsg.level='2';
                      const data = that.addMsg;
                      console.log(data);
                      addLock(data).then(res=>{
                        console.log(res)
                        if(res.data.resCode == 0){
                            Toast("添加成功！");
                            that.$router.push({path:'/'})
                        }else{
                            Toast(res.data.result);         
                        }
                      })
                   }else{} 
                  })
            }
          })
        })
        })
        
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";


.body  /deep/ .mint-cell {
  min-height: 55px;
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
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  @extend .fontSet;
  overflow:hidden;
}
.wechart{
  padding: 0 10px;
  width: 100%; 
  background: #fff;
  height: 55px;
  line-height: 55px;
  font-size:1.5rem;
  position: relative;
  // background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
  // background-size:120% 1px;
border-top:1px solid rgba(217,217,217,0.5) 
}
.weRight{
  @extend .boxCenter;
  width: 50px;
  height: 100%;
  position: absolute;
  top:0;
  right: 10px;
}
</style>
