<template>
 <div class="body">
  <img src="../../static/images/kaikong.png">
 </div>
</template>

<script>
export default {
    data () {
        return {
            images: "../../static/images/kaikong.png",
            deviceWidth:''
        }
    },
    methods: {
    },
    created () {
    },
    mounted() {
      // this.initVideo();
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
  // @extend .boxCenter; 
  // padding-top: 68px;
}
.body img{
  width:80%;
  margin:10px 10% 0 10%;
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
