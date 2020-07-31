import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import add from '@/components/add'
import mainPage from '@/components/mainPage'
import passWordList from '@/components/passWordList'
import addPass from '@/components/addPass'
import share from '@/components/share'
import calendar from '@/components/calendar'
import history from '@/components/history'
import set from '@/components/set'
import mianHist from '@/components/mianHist'
import check from '@/components/check'
import parameter from '@/components/parameter'
import fingerprint from '@/components/fingerprint'
import addfinger from '@/components/addfinger'
import sent from '@/components/sent'
import nfc from '@/components/nfc'
import addnfc from '@/components/addnfc'
import test from '@/components/test'
import testPage from '@/components/testPage'
import video from '@/components/video'
import kaikong from '@/components/kaikong'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        title:"家用锁"
      }
    },
    {
      path: '/add',
      name: 'add',
      component: add,
      meta: {
        title:"添加门锁"
      }
    },
    {
      path: '/check',
      name: 'check',
      component: check,
      meta: {
        title:"绑定用户"
      }
    },
    {
      path: '/mianHist',
      name: 'mianHist',
      component: mianHist,
      meta: {
        title:"操作记录"
      }
    },{
      path: '/parameter',
      name: 'parameter',
      component: parameter,
      meta: {
        title:"关于设备"
      }
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: mainPage,
      meta: {
        title:"家用锁"
      }
    },{
      path: '/passWordList',
      name: 'passWordList',
      component: passWordList,
      meta: {
        title:"我的密码"
      }
    },{
      path: '/addPass',
      name: 'addPass',
      component: addPass,
      meta: {
        title:"密码"
      }
    },{
      path: '/share',
      name: 'share',
      component: share,
      meta: {
        title:"分享房间"
      }
    },{
      path: '/calendar',
      name: 'calendar',
      component: calendar
    },{
      path: '/history',
      name: 'history',
      component: history,
      meta: {
        title:"记录"
      }
    },{
      path: '/fingerprint',
      name: 'fingerprint',
      component: fingerprint,
      meta: {
        title:"我的指纹"
      }
    },{
      path: '/addfinger',
      name: 'addfinger',
      component: addfinger,
      meta: {
        title:"指纹"
      }
    },{
      path: '/sent',
      name: 'sent',
      component: sent,
      meta: {
        title:"指纹"
      }
    },{
      path: '/nfc',
      name: 'nfc',
      component: nfc,
      meta: {
        title:"我的NFC卡"
      }
    },{
      path: '/addnfc',
      name: 'addnfc',
      component: addnfc,
      meta: {
        title:"NFC卡"
      }
    },{
      path: '/set',
      name: 'set',
      component: set,
      meta: {
        title:"门锁设置"
      }
    },{
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        title:"说明"
      }
    },{
      path: '/testPage',
      name: 'testPage',
      component: testPage,
      meta: {
        title:"说明"
      }
    },{
      path: '/video',
      name: 'video',
      component: video,
      meta: {
        title:"视频教程"
      }
    },{
      path: '/kaikong',
      name: 'kaikong',
      component: kaikong,
      meta: {
        title:"开孔图"
      }
    }
  ]
})
