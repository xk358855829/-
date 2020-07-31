<template>
 <div class="body">
  <!-- <video class="video" controls>
  <source src="../../static/media/video.mp4" type="video/mp4"> -->
    <video
        id="myVideo"
        class="video-js"
        >
        <source
            src="http://xlife.sokeed.com/video.mp4"
            type="video/mp4"
        >
    </video>
 </div>
</template>

<script>
export default {
    data () {
        return {
            firstFlag: false,
            deviceWidth:''
        }
    },
    methods: {
        initVideo() {
        //初始化视频方法

        let myPlayer = this.$video(myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: "320px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "500px"
        });
      }
    },
    created () {
    },
    mounted() {
      this.initVideo();
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
  @extend .boxCenter; 
  // padding-top: 68px;
}
.video{
  width:100%;
  height: 400px;
  margin-top: 50px;
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
