

//api.js
import service from './request'

// 锁列表
export const getLocksByOpenId = data => {
    return service({
        url: '/mobile/manage/getLocksByOpenId',
        method: 'post',
        data
    })
};

// 查找单个设备

export const getLockByOpenIdAndDeviceId = data => {
    return service({
        url: '/mobile/manage/getLockByOpenIdAndDeviceId',
        method: 'post',
        data
    })
};

export const getOnlineStatusByDeviceId = data => {
    return service({
        url: '/mobile/manage/getOnlineStatusByDeviceId',
        method: 'post',
        data
    })
};

// 新增密码
export const addLock = data => {
    return service({
        url: '/mobile/manage/addLock',
        method: 'post',
        data
    })
};
// 密码列表

export const getPswdByDeviceId = data => {
    return service({
        url: '/mobile/manage/getPswdByDeviceId',
        method: 'post',
        data
    })
};


// 设置密码

export const setPassWord = (data,url) => {
    return service({
        url: url,
        method: 'post',
        data
    })
};

// 远程开门

export const openOrClose = (data,url) => {
    return service({
        url: '/mobile/manage/openOrClose',
        method: 'post',
        data
    })
};



// 查询开门结果

export const getDoorOperateResult = (data,url) => {
    return service({
        url: '/mobile/manage/getDoorOperateResult',
        method: 'post',
        data
    })
};

// 扫一扫
export const getJSDK = (params,url) => {
    return service({
        url: '/mobile/scan/getJSSDKTicket',
        method: 'get',
        params
    })
};


// 微信号信息
export const getWeChatInfo = (data,url) => {
    return service({
        url: '/mobile/user/getWeChatInfo',
        method: 'post',
        data
    })
};

// 开门信息
export const getDoorOpenInfo = (data,url) => {
    return service({
        url: '/mobile/manage/getDoorOpenInfo',
        method: 'post',
        data
    })
};


// 异常报警
export const getWarningMsg = (data,url) => {
    return service({
        url: '/mobile/manage/getWarningMsg',
        method: 'post',
        data
    })
};


// 异常报警openid
export const getWarningMsgByOpenId = (data,url) => {
    return service({
        url: '/mobile/manage/getWarningMsgByOpenId',
        method: 'post',
        data
    })
};


// 设备设置
export const getConfigBydeviceId = (data,url) => {
    return service({
        url: '/mobile/config/getConfigBydeviceId',
        method: 'post',
        data
    })
};


export const userEnable = (data,url) => {
    return service({
        url: '/mobile/config/userEnable',
        method: 'post',
        data
    })
};


export const userParam = (data,url) => {
    return service({
        url: '/mobile/config/userParam',
        method: 'post',
        data
    })
};

export const deleteLockBinding = (data,url) => {
    return service({
        url: '/mobile/manage/deleteLockBinding',
        method: 'post',
        data
    })
};
// 远程开门记录

export const getDoorOper = (data,url) => {
    return service({
        url: '/mobile/manage/getDoorOperateHis',
        method: 'post',
        data
    })
};

// 查看绑定用户

export const getBindersByDeviceId = (data,url) => {
    return service({
        url: '/mobile/manage/getBindersByDeviceId',
        method: 'post',
        data
    })
};


// 设置IP端口

export const ipPort = (data,url) => {
    return service({
        url: '/mobile/config/ipPort',
        method: 'post',
        data
    })
};

// 设置心跳周期

export const heartCycle = (data,url) => {
    return service({
        url: '/mobile/config/heartCycle',
        method: 'post',
        data
    })
};

// 设置电压阀值

export const volThreshold = (data,url) => {
    return service({
        url: '/mobile/config/volThreshold',
        method: 'post',
        data
    })
};

// 指纹列表

export const listFingerPrints = (data) => {
    return service({
        url: '/mobile/fingerprint/listFingerPrints',
        method: 'post',
        data
    })
};

// 设置指纹

export const addfinger = (data,url) => {
    return service({
        url: url,
        method: 'post',
        data
    })
};

// 设置紧急联系人

export const addemergencyContantPerson = (data,url) => {
    console.log(url)
    return service({
        url: url,
        method: 'post',
        data
    })
};

// 设置紧急联系人

export const showAddfinger = (data) => {
    return service({
        url: "/mobile/fingerprint/getInputStatus",
        method: 'post',
        data
    })
};

// 获取指纹信息

export const findById = (data) => {
    return service({
        url: "/mobile/fingerprint/findById",
        method: 'post',
        data
    })
};

// 删除指纹

export const deleteFingerPrint = (data) => {
    return service({
        url: "/mobile/fingerprint/deleteFingerPrint",
        method: 'post',
        data
    })
};

// 修改指纹

export const update = (data) => {
    return service({
        url: "/mobile/fingerprint/update",
        method: 'post',
        data
    })
};

// 修改指纹

export const updateTs = (data) => {
    return service({
        url: "/mobile/emergencyContantPerson/update",
        method: 'post',
        data
    })
};


// 获取删除指纹

export const getDelStatus = (data) => {
    return service({
        url: "/mobile/fingerprint/getDelStatus",
        method: 'post',
        data
    })
};


// 获取NFC列表

export const nfclist = (data) => {
    return service({
        url: "/mobile/nfc/list",
        method: 'post',
        data
    })
};

// 开始录入NFC

export const startInput = (data) => {
    return service({
        url: "/mobile/nfc/startInput",
        method: 'post',
        data
    })
};

// 查询录入NFC

export const getInputStatus = (data) => {
    return service({
        url: "/mobile/nfc/getInputStatus",
        method: 'post',
        data
    })
};


// 删除NFC

export const deleteNFC = (data) => {
    return service({
        url: "/mobile/nfc/deleteNFC",
        method: 'post',
        data
    })
};

// 获取删除NFC

export const getDelStatusNFC = (data) => {
    return service({
        url: "/mobile/nfc/getDelStatus",
        method: 'post',
        data
    })
};

// 获取NFC信息

export const findByIdnfc = (data) => {
    return service({
        url: "/mobile/nfc/findById",
        method: 'post',
        data
    })
};

// 修改NFC信息

export const nfcupdate = (data) => {
    return service({
        url: "/mobile/nfc/update",
        method: 'post',
        data
    })
};

// 获取门锁通知状态

export const getCfgDataInApp = (data) => {
    return service({
        url: "/mobile/manage/getCfgDataInApp",
        method: 'post',
        data
    })
};

// 设置门锁通知状态

export const enableNotifyInAppWhenDoorOpened = (data) => {
    return service({
        url: "/mobile/manage/enableNotifyInAppWhenDoorOpened",
        method: 'post',
        data
    })
};