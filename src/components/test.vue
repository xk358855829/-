<template>
 <div class="body">
  <div class="top">
    <div class="topFront"><p>智能门锁</p><p>锁体类型判断与门锁安装信息</p></div>
    <img src="../../static/images/12185947.png">
  </div>
  <div class="main">
    <div class="box" @click="runt">
       填写门锁信息</br>(非报装)
    </div>
  </div>
 </div>
</template>

<script>
export default {
    data () {
        return {
            firstFlag: false
        }
    },
    methods: {
       runt(){
        this.$router.push({path:'/testPage'})
      }
    },
    created () {
    },
    mounted() {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
@import "../../static/reset.scss";
.body{
  width: 100%;
  height: 100%;
  background:$mainbc;
  // padding-top: 68px;
}
.main{
  width:90%;
  height: 70%;
  background: #fff;
  border-radius:10px;
  position: absolute;
  top:150px;
  left: 5%;
}
.box{
  width: 50%;
  height: 83px;
  background: #5cc28b;
  position: absolute;
  left: 25%;
  bottom: 50%;
  // line-height: 83px;
  @extend .boxCenter; 
  text-align: center;
  color: #fff;
  font-size: 1.5rem
}
.top{
  width: 100%;
  position: relative;
}
.topFront{
  position: absolute;
  left: 0;
  top:50px;
  width: 100%;
  font-size: 1.8rem;
  color: #fff;
  text-align: center;
  line-height: 30px;
}
.top img{
  width: 100%;
}
</style>
