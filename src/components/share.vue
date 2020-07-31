<template>
  <div class="body">
    <div class="top">分享锁的二维码</div>
    <div class="topName">使对方也成为锁的管理者</div>
    <div class="qrBox">
      <div class="qr">
        <canvas id="qrcode"></canvas>
        <div class="mydoor">
          <div class="line"></div>
          <div class="mydoorName">{{alias}}</div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import {getLocksByOpenId,addLock} from '../axios/api.js'
import {mapState} from "vuex"
import { Toast } from 'mint-ui';
import QRCode from 'qrcode';

export default {
  name: 'share',
  data () {
    return {
      alias:'',
      lockMsg:''
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  components: {
      QRCode: QRCode
    },
  mounted:function () {
    let lockMsg =JSON.parse(sessionStorage.getItem("lockMsg"));
    this.alias=lockMsg.alias;
    this.lockMsg=lockMsg;
    this.qrcode ();
    document.title=this.$route.meta.title
  },
  methods:{
      qrcode () {  
        console.log(this.lockMsg);
      var canvas = document.getElementById('qrcode')
       QRCode.toCanvas(canvas, 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd8e7ebece32609d1&redirect_uri=http://cloud.sokeed.com/mp/lock/newLockUDP/codeLock.html&response_type=code&scope=snsapi_userinfo&state='+this.lockMsg.deviceInfo.deviceId+'&level=2#wechat_redirect', function (error) {
          // if (error) console.error(error)
          console.log('success!');
        })

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
  background:#fff;
  @extend .fontSet;
  overflow: hidden;
}
.top{
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 1.5rem;
  color:#303030;
  margin-top: 94px;
}
.topName{
  width: 100%;
  height: 15px;
  @extend .boxCenter;
  color:#787878;
  font-size:1.3rem;
  margin-top:14px;
}
.qrBox{
  width: 100%;
  height: 254px;
  margin-top:43px;
}
.qr{
  width: 214px;
  height: 234px;
  margin:0 auto;
  box-shadow: 0 0 29px rgba(0, 113, 228, .31)
}
#qrcode{
  width: 178px!important;
  height: 178px!important;
  margin:13px 18px 0 18px;
}
.mydoor{
  width: 178px;
  height: 20px;
  @extend .boxAround;
  margin:0 auto
}
.line{
  width: 31px;
  height: 1px;
  background: #787878;
}
.mydoorName{
  width: 74px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #303030;
  font-size: 1.3rem;
}
</style>
