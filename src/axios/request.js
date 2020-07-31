//request.js
import axios from "axios";
import qs from "qs";


/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: process.env.API_ROOT,  // api的base_url
    timeout: 55000  // 请求超时时间
});


/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(function (config) {
　　config.method=='post'?config.data=qs.stringify({...config.data}):config.params={...config.params};
config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
　　return config
}, function (error) {
　　// 对请求错误做些什么
return Promise.reject(error)
});

service.interceptors.response.use(function (response) {
　　// 对响应数据做点什么
　　return response
}, function (error) {
　　if(error){
// Vue.prototype.$message({
// type: "error",
// message: "请求错误"
// })
// alert('操作失败')
}
　　return Promise.reject(error)
});



export default service;