<template>
  <div class="body">
    <div class="top">{{fontMsg.top}}</div>
    <div class="mid">{{fontMsg.mid}}</div>
    <img :src="img1">
  </div>  
</template>

<script>
import {} from '../axios/api.js'
import {mapState} from "vuex"
import { TabContainer, TabContainerItem } from 'mint-ui';
import {volPercentfire,signafire} from '../axios/filer.js'
import unlock from '../../static/images/unlock.png'
import lock from '../../static/images/lock.png'

export default {
  name: 'fingerprint',
  data () {
    return {
      img1:unlock,
      img2:lock,
      fontMsg:{
        top:"锁未链接",
        mid:"请在锁黑屏情况下长按“#”号键3秒"
      },
      fontMsgOn:{
        top:"锁已链接",
        mid:"请根据语音提示操作"
      }
    }
  },
  computed:{
    ...mapState(["openId"])
  },
  components:{
      history
  },
  created:function () {
  },
  beforeDestroy () {
  },
  methods:{

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
  // padding-top: 68px;
}
.body img{
  width: 100%;
  position: absolute;
  left: 0;
  top:0;
}
.top{
  font-size: 20px;
  color: #666666;
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top:86px;
}
.mid{
  font-size: 17px;
  width: 100%;
  color: #666666;
  text-align: center;
  margin-top:20px;
  position: absolute;
  left: 0;
  top:106px;
}
</style>
