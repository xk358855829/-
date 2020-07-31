<template>
  <div style="position: relative;">
  <div class="calendarBox" ref="calendar" :class="{transition:transition}" :style="{height: calendarHeight == -100 ? 'calc(100% - 30px)':calendarHeight + 'px' }"
       @touchstart.stop="moveStart"
       @touchend.stop="moveEnd"
       @touchmove.stop="move">
    <div style="height: 100%;white-space: nowrap;overflow: hidden;" :class="{transition:transition}" :style="{transform: 'translate3d('+calendarMove.x+'px,'+calendarMove.y+'px,0px)'}" >
      <slot></slot>
    </div>
    
  </div>
  <div class="bott" @click="moveEndClick"><img :src="images"></div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        transition:false,//是否显示动画
        calendarHeight:-100, //日历的高度
        calendarMove:{
          x:0,
          y:0
        },
        move_start_x:0, //开始移动的位置x轴
        move_start_y:0, //开始移动的位置y轴
        move_mode:1,  //移动方式,1左右移动,2上下移动
        can_change_mode:true, //是否可以改变移动方式
        move_start_calendarHeight:0,  //开始移动的高度初始值
        can_move:false, //是否触发move事件
        itemWidth:0,  //窗口的宽度
        move_index:0, // 左右移动 1 向右移动-1向左移动
        line_num:0, //  选中或今天是第几行的周
        is_week:true, //是否是周历模式
        images:"../../static/images/xiajian.png",
        showMou:false,
        nowDate:'2019'
      }
    },
    props:['checkDate'],
    created(){
      this.nowDate=new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"
//      初始化日历宽度和line_num
      this.itemWidth = window.innerWidth
      this.line_num = this.calc_line_num(this.checkDate)
      this.calendarHeight = 60
      this.calendarMove.y = -(60*this.line_num)
      setTimeout(()=>{
        this.$parent.get3week();
      },150)
      this.calendarMove.y = 0;
    },
    watch:{
      checkDate(val){
        if(val){
          this.line_num = this.calc_line_num(val)
          // console.log(this.line_num,'行')
        }
      }
    },
    methods:{
//      PC端为了鼠标移出日历后不能触发mouseup事件而触发的事件
      moveEndClick(){
          console.log(this.calendarHeight);
           this.$parent.get3month()
          if(this.calendarHeight==60){
            var self = this
            self.calendarHeight = -100
            this.calendarMove.y = 0
  //          console.log(self.calendarHeight)
            //日历高度设置为最大高度
            setTimeout(function(){
              // console.log(self.$refs.calendar.offsetHeight);
              self.calendarHeight = 360
              // console.log(self.calendarHeight)
            },10);
            this.images="../../static/images/shangj.png";
            this.showMou=true
            this.is_week=false;
          }else{
            this.calendarHeight = 60
            this.calendarMove.y = -(60*this.line_num)
            setTimeout(()=>{
              this.$parent.get3week();
            },10)
            this.calendarMove.y = 0
            this.images="../../static/images/xiajian.png"
            this.showMou=false;
            this.is_week=true;
          }
      },
      //      手机端端开始移动
      moveStart(e){
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }
        this.move_start_x = touch.clientX
        this.move_start_y = touch.clientY
        this.move_start_calendarHeight = this.calendarHeight
        this.can_move = true
        this.move_mode = 0
        this.$parent.can_click = true
      },
      //      手机端端移动
      move(e){
        if(!this.can_move)return
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }
        this.$parent.can_click = false
        if(this.can_change_mode){
          if(Math.abs(touch.clientX - this.move_start_x) > Math.abs(touch.clientY - this.move_start_y)){
            this.move_mode = 1
          }else{
            this.move_mode = 2
          }
          this.can_change_mode = false
        }
        console.log(this.move_mode)
//        左右移动
        if(this.move_mode == 1){
          this.calendarMove.x = touch.clientX - this.move_start_x;
        }
//        上下移动
        if(this.move_mode == 2){
          this.$parent.get3month()
          let move_width = Math.abs(touch.clientY - this.move_start_y)
          if(touch.clientY > this.move_start_y){
            this.calendarHeight = this.move_start_calendarHeight + move_width
            this.calendarMove.y = -((this.line_num*60 > move_width)?this.line_num*60 - move_width:0)
          }else{
            this.calendarHeight = this.move_start_calendarHeight - move_width
            this.calendarMove.y = -((move_width<=this.line_num*60)?move_width:this.line_num*60)
          }
        }
      },
      //      手机端端结束移动
      moveEnd(e){
        // this.calendarHeight = 40
        //   this.calendarMove.y = -(40*this.line_num)
        //   setTimeout(()=>{
        //     this.$parent.get3week();
        //   },150)
        //   this.calendarMove.y = 0
        this.can_move = false
        if(this.move_mode == 0)return
        var touch;
        if(e.changedTouches){
          touch = e.changedTouches[0];
        }else{
          touch = e
        }
 
        this.can_change_mode = true
        if(this.move_mode == 1){
          if(this.move_start_x < touch.clientX){
            if(this.move_start_x - touch.clientX < -50){
              this.calendarMove.x = this.itemWidth
              this.move_index = -1
            }else{
              this.calendarMove.x = 0
            }
          }else{
            console.log(this.move_start_x - touch.clientX)
            if(this.move_start_x - touch.clientX > 50){
              this.calendarMove.x = -this.itemWidth
              this.move_index = 1
            }else{
              this.calendarMove.x = 0
            }
          }
        }
        if(this.move_mode == 2){
          if(this.move_start_y - touch.clientY < 0){
            if(this.move_start_y - touch.clientY < -50){
              this.move_init(true)
            }else{
              this.move_init(false)
            }
          }else{
            if(this.move_start_y - touch.clientY > 50){
              this.move_init(false)
            }else{
              this.move_init(true)
            }
          }
        }
        this.transition = true
        setTimeout(()=> {
          this.transition = false
          if(this.move_mode == 1){
            this.$emit('on-change',this.move_index,this.is_week)
          }
        },500)
 
      },
      move_change(_index){
        this.transition = false
        this.calendarMove.x = 0
      },
      move_init(mode){
        this.is_week = !mode
        if(mode){
          var self = this
          self.calendarHeight = -100
          this.calendarMove.y = 0
//          console.log(self.calendarHeight)
          //日历高度设置为最大高度
          setTimeout(function(){
            // console.log(self.$refs.calendar.offsetHeight);
            self.calendarHeight = 360
            // console.log(self.calendarHeight)
          },100);
          this.showMou=true;
        }else{
//          恢复高度
          this.calendarHeight = 60
          this.calendarMove.y = -(60*this.line_num)
          setTimeout(()=>{
            this.$parent.get3week();
          },150)
          this.calendarMove.y = 0
          this.showMou=false;
        }
      },
      calc_line_num(day){
        //计算今天在第几行
        var year = day.getFullYear()
        var month = day.getMonth()
        var dt_first = new Date(year,month,1)   //每个月第一天
        var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
        //console.log(space + day.getDate())
        return parseInt((space + day.getDate() - 1) / 7)
      }
    }
  }
</script>
<style scoped>
    body, html, h4, ul, ol, li, a, div, input, p, textarea, button {
        padding: 0;
        margin: 0;
        list-style: none;
        font-style: normal;
        text-decoration: none;
        border: none;
        font-family: "Microsoft Yahei", sans-serif;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
            -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
  .calendarBox{
    height: calc( 100% - 30px );
    background: #fff;
    color:#303030;
    position: relative;
    overflow:hidden; 
  }
  .transition{
    transition: all .2s ease ;
  }
  .bott{
    width: 30px;
    height: 30px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow:0 0 9px rgba(6, 0, 1, .1);
    position: absolute;
    right: 30px;
    bottom:-15px;
  }
  .bott img{
    width: 13px;
  }
  .dateMouth{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color:#303030;
    font-size:1.4rem;
  }
</style>
