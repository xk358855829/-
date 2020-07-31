import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
      openId:sessionStorage.getItem("openId"),
      // openId:"oQbMM1IoNkgwXeDT4lvdsa0KrcfU",
      finger:"1",
      id:1,
      cardid:1,
      index:''
      // http:'http://192.168.2.143:8796',
    },
    mutations:{
    	//数据处理方式
      updatefinger(state,data){
        state.finger=data;
      },
      updatecardid(state,data){
        state.cardid=data;
      },
      updateid(state,data){
        state.id=data;
      },
      updateindex(state,data){
        state.index=data;
      }
    },
    getters:{
    	// 数据包装（过滤器）
    }
})
