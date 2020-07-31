<template>
  <div class="calendar-box">

    <ul class="calendar-head">
      <li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li>
    </ul>
    <div class="dateMouth" >{{nowDate}}</div>
    <calendarContent ref="calendar_swiper" :checkDate="current_day" @on-change="changeIndex">
      <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
        <ul v-for="(week,weekindex) in month" :key="weekindex">
          <li v-for="(day,dayindex) in week" @click="chooseDay(day.year,day.month,day.day,day.othermonth,day.mode)">
            <div class="week-day">
              <span style="display:block;" class="weekSpan" :class="{ischecked:checkedDay==day.date,othermonth:day.othermonth,istoday:day.istoday}">
  				    	<i class="day">{{day.day}}</i>
  				    	<!-- <i>{{day.nongli.old_str}}</i> -->
              </span>
              <div class="thing">
                <a :style="{color:thing.color}" v-for="thing in day.thing">{{thing.title}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </calendarContent>
<!--     <div class="timeMouth" >
      <div class="timeUp">起始时间:<span>{{startTime}}</span></div>
      <div class="timeUp">结束时间:<span>{{endTime}}</span></div>
    </div> -->
    <div class="noMess" v-if="noMess">无数据</div>
    <div class="buttDiv" v-if="getTYpe=='history'">
    <div class="messBox" v-for="item in message">
      <div class="messDiv">
        <span>{{item.pwdNo}}</span><br/><span class="messSmall">{{item.way|openType}}</span>
      </div>
      <div class="messDivTime">{{item.time|formatDate}}</div>
    </div>
    </div>
    <div class="buttDiv" v-else="getTYpe=='warr'">
    <div class="messBox" v-for="item in message">
      <div class="messDiv">
        <span>{{item.msg}}</span><br/><span class="messSmall">{{item.deviceId}}</span>
      </div>
      <div class="messDivTime">{{item.inserttime_|formatDate}}</div>
    </div>
    </div>
  </div>
</template>
<script>
  import calendarContent from '../axios/swiper_monthweek.vue'
  import format from '../axios/calendar.js'
  import {getDoorOpenInfo,getWarningMsg} from '../axios/api.js'
  import {formatDate,openType} from '../axios/filer.js'
  import { Toast } from 'mint-ui';
  
  export default{
    data(){
      return{
        disp_date:new Date(),
        today:new Date(),
        current_day:new Date(),
        monthList:[],
        checkedDay:'0000-00-00',
        can_click:true,
        nowDate:'',
        startTime:'',
        endTime:'',
        time:1,
        message:[],
        noMess:false,
        getTYpe:''
      }
    },
    created(){
      this.get3month()
      this.nowDate=new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"
      this.startTime=this.format(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
      this.endTime=this.format(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
      this.axiosGet();
      this.getTYpe=sessionStorage.getItem("getTYpe")
    },
    methods:{
      chooseDay(year,month,day,othermonth,mode){
//        为了PC端点击事件和移动冲突
        if(!this.can_click)return
        this.current_day = new Date(year,month,day)
        this.checkedDay = this.format(year,month,day)
        if(othermonth && mode == 'month'){
          var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()-othermonth,0)
          var maxday = _tmpdt.getDate()
          var _day = maxday<day?maxday:day
          this.disp_date = new Date(year,month-othermonth,_day)
          this.changeIndex(othermonth,false,true)
        }else if(othermonth && mode == 'week'){
          this.disp_date = this.current_day
        }else{
          this.disp_date = this.current_day
        }
          this.startTime=this.format(year,month,day);
          this.endTime=this.format(year,month,day);
          this.axiosGet();
      },
      axiosGet(){
          let data={
            deviceId:sessionStorage.getItem("deviceId"),
            startTime:this.startTime,
            endTime:this.endTime
          }
          console.log(data);
          if(this.getTYpe=="history"){
            getDoorOpenInfo(data).then(res=>{
              console.log(res);
              Toast("已刷新")
              if(res.data.resCode==1){
                this.message=[];
                this.noMess=true;
              }else{
                this.message=res.data.result;
                this.noMess=false;
              }
              console.log(this.message)
            });
          }else{
            getWarningMsg(data).then(res=>{
              console.log(res);
              Toast("已刷新")
              if(res.data.result.length==0){
                this.message=[];
                this.noMess=true;
              }else{
                this.message=res.data.result;
                this.noMess=false;
              }
              console.log(this.message)
            });
          }
        },
      format(year,month,day){
        month++
        month<10&&(month='0'+month)
        day<10&&(day='0'+day)
        return year + '-' + month + '-' + day;
      },
      getWeek(year,month,day){
        var dt = new Date(year,month,day)
        var weekArr = []
        var dt_first = new Date(year,month,day-((dt.getDay()+6) % 7))
        var week = []
//        console.log(year,month,day)
        for(var j=0;j<7;j++){
          var newdt = new Date(dt_first.getFullYear(),dt_first.getMonth(),dt_first.getDate()+j)
          var _year = newdt.getFullYear()
          var _month = newdt.getMonth()
          var _day = newdt.getDate()
          week.push({
            mode:'week',
            day:_day,
            year:_year,
            month:_month,
            date:this.format(_year,_month,_day),
            nongli:format.solar2lunar(_year,_month+1,_day),
            istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
            ischecked:false,
            othermonth:_month!=month
          })
        }
        weekArr.push(week)
        return weekArr
      },
      getMonth(year,month){  //创建单月历
        var monthArr = []
        var dt_first = new Date(year,month,1)   //每个月第一天
        var dt_last = new Date(year,month+1,0)   //每个月最后一天
        var monthLength = dt_last.getDate()-dt_first.getDate()+1
        var daylist =[];
        var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
        //console.log(year,month)
        for(var i = -space;i<36;i+=7){
          var week = []
          for(var j=0;j<7;j++){
            var day = i+j+1
            if(day>0 && day<=monthLength){
              week.push({
                mode:'month',
                day:day,
                year:year,
                month:month,
                date:this.format(year,month,day),
//                日历要显示的其他内容
                thing:(day == 22 || day == 4) ? []:[],
                nongli:format.solar2lunar(year,month+1,day),
                istoday:(this.today.getFullYear()==year && this.today.getMonth()==month && this.today.getDate() == day)?true:false,
                ischecked:false
              })
            }else{
              //其它月份
              //week.push({})
              var newdt = new Date(year,month,day)
              var _year = newdt.getFullYear()
              var _month = newdt.getMonth()
              var _day = newdt.getDate()
              week.push({
                mode:'month',
                day:_day,
                year:_year,
                month:_month,
                date:this.format(year,month,day),
                nongli:format.solar2lunar(_year,_month+1,_day),
                istoday:(this.today.getFullYear()==_year && this.today.getMonth()==_month && this.today.getDate() == _day)?true:false,
                ischecked:false,
                othermonth:day<=0?-1:1,
              })
            }
          }
          monthArr.push(week)
        }
        return monthArr
      },
      get3month(){
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        this.monthList = []
        this.monthList.push(this.getMonth(year,month-1))
        this.monthList.push(this.getMonth(year,month))
        this.monthList.push(this.getMonth(year,month+1))
      },
      get3week(){
        var year = this.disp_date.getFullYear()
        var month = this.disp_date.getMonth()
        var day = this.disp_date.getDate()
        this.monthList = []
        this.monthList.push(this.getWeek(year,month,day-7))
        this.monthList.push(this.getWeek(year,month,day))
        this.monthList.push(this.getWeek(year,month,day+7))
        console.log(this.monthList)
      },
      changeIndex(index,is_week,is_click = false){
        console.log(index)
        console.log(is_week)
        if(index){
          if(is_week){
            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate()+(7*(index)))
            this.checkedDay = this.format(this.disp_date.getFullYear(), this.disp_date.getMonth(), this.disp_date.getDate())
            this.current_day = this.disp_date
            this.get3week()
          }else{
//            console.log(this.disp_date.getMonth()+index)
            var _tmpdt = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,0)
            var maxday = _tmpdt.getDate()
            var _day = maxday<this.disp_date.getDate()?maxday:this.disp_date.getDate()
            console.log(_day)
 
            this.disp_date = new Date(this.disp_date.getFullYear(),this.disp_date.getMonth()+index,_day)
            if(!is_click){
              this.checkedDay = this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),this.disp_date.getDate())
              console.log(this.checkedDay)
              this.nowDate=this.disp_date.getFullYear()+"年"+(this.disp_date.getMonth()+1)+"月";
            }
//            console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
            this.get3month()
 
            console.log('move_change')
          }
          this.$refs.calendar_swiper.move_change()
        }
      }
    },
    components:{
      calendarContent
    }
  }
</script>
<style lang="scss"  scoped>
@import "../../static/reset.scss";
/*  body{
    background: #f2f2f2;
  }*/
  .calendar-box{
    background: #f2f2f2;
    position: relative;
    height:100%;
    z-index:99;
    overflow-y:auto;
  }
  .calendar-head{
    background: #fff;
    display: flex;
    height:50px;
    line-height: 50px;
    list-style: none;
    padding: 0;
    margin:0;
    color: #999;
    font-size: 1.3rem;
    width: 100%;
    position: fixed;
    top:0;
    left: 0;
    z-index: 9999;
  }
  .calendar-head li{
    flex-grow: 1;
    text-align: center;
  }
  .swiper-item{
    position: absolute;
    width:100%;
    height:360px;
    top:0;
  }
  .swiper-item:nth-child(1){
    left: -100%;
  }
  .swiper-item:nth-child(2){
    left:0;
  }
  .swiper-item:nth-child(3){
    left: 100%;
  }
  .month ul{
    display:flex;
    margin:0;
    padding:0;
    width: 100%;
    height:60px;
    /*min-height:60px;*/
    border-right:1px solid #eee;
  }
  .month li{
    flex: 1;
    flex-grow: 1;
    overflow: hidden;
  }
  .week-day{
    position: relative;
    margin: auto;
    font-size:12px;
    text-align: center;
    line-height: 10px;
    overflow: hidden;
    z-index: 1;
    height:60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .week-day i{
    display:block;
    text-align: center;
    font-size: 1.5rem;
    font-style:normal;
    /*padding:1px;*/
    line-height:30px;
    height:30px;
  }
  .thing a {
    cursor: pointer;
    display: block;
    width: 100%;
    overflow: hidden;
    word-break: break-all;
    line-height: 16px;
    height: 16px;
  }
  .thing{
    margin-top: 3px;
  }
  .othermonth{
    color: #999999;
  }
  .istoday{
    background: #00A0E9!important;
    color:#fff;
  }
  .ischecked{
    background-color: #f17117!important;
    color:#fff;
  }
  .weekSpan{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .dateMouth{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color:#303030;
    font-size:1.4rem;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:50px;
  }
  .timeMouth{
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color:#303030;
    font-size:1.4rem;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeUp{
    width: 50%;
    height: 100%;
    line-height: 60px;
  }
  .messBox{
    width: 96.8%;
    height: 65px;
    background: #fff;
    border-radius: 5px;
    margin:6px auto;
    position: relative;
    // overflow: hidden;
  }
  .buttDiv{
    // overflow: hidden;
    // height: 300px;
  }
  .messDiv{
    width: 96%;
    height: 45px;
    color:#303030;
    font-size:1.4rem;
    line-height: 22px;
    position: absolute;
    top:10px;
    left: 2%
  }
  .messSmall{
    color:#999;
    font-size:1.3rem
  }
  .messDivTime{
    width: 120px;
    height: 100%;
    position: absolute;
    top:0;
    right: 2%;
    color:#999;
    font-size:1.2rem;
    line-height:65px;
    text-align: center;
    overflow: hidden;
  }
  .noMess{
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 200px;
    color:#999;
    font-size:1.8rem
  }
</style>
