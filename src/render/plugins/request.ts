import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import db from './database';
import { Toast } from 'vant';

// const status = (status: number) => {
//   let msg = ''
//   switch (status) {
//     case 400:
//       msg = '请求错误(400)'
//       break
//     case 401:
//       msg = '未授权，请重新登录(401)'
//       break
//     case 403:
//       msg = '拒绝访问(403)'
//       break
//     case 404:
//       msg = '请求出错(404)'
//       break
//     case 408:
//       msg = '请求超时(408)'
//       break
//     case 500:
//       msg = '服务器错误(500)'
//       break
//     case 501:
//       msg = '服务未实现(501)'
//       break
//     case 502:
//       msg = '网络错误(502)'
//       break
//     case 503:
//       msg = '服务不可用(503)'
//       break
//     case 504:
//       msg = '网络超时(504)'
//       break
//     case 505:
//       msg = 'HTTP 版本不受支持(505)'
//       break
//     default:
//       msg = `连接出错(${status})!`
//   }
//   return `${msg}，请检查网络或联系管理员！`
// }

const pending = new Map();

const pushPending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pending.has(url)) {
        pending.set(url, cancel);
      }
    });
};

const popPending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  if (pending.has(url)) {
    const cancel = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};

const service = axios.create({
  baseURL: 'https://service-hdenic3v-1253220536.sh.apigw.tencentcs.com/release/api',
  // baseURL: 'http://localhost:9612/api',
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  withCredentials: true,
  timeout: 30000
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    popPending(config);
    pushPending(config);
    config.params.app_version = '2.8.018';
    if (config.url !== '/signup/login') {
      const token = localStorage.getItem('token');
      const account = localStorage.getItem('account');
      if (token) config.params['login_token'] = String(token);
      if (account) config.params['account'] = String(account);
    }
    return config;
  },
  (err) => {
    (err.data = null), (err.msg = '出错啦~');
    return Promise.resolve(err);
  }
);

service.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log(config);
  //http://xiaovv-web.com/javascript/#%E7%AE%80%E5%8D%95%E5%B0%81%E8%A3%85
  return config;
});

service.interceptors.response.use(
  (res: AxiosResponse) => {
    popPending(res);
    if (res.data.code !== '100000') {
      Toast(res.data.tip);
      return Promise.reject(res.data.tip);
    } else {
      if (res.config.url === '/signup/login') {
        const token = res.data.data.login_token;
        const account = res.data.data.reader_info.account;
        localStorage.setItem('token', token);
        localStorage.setItem('account', account);
      }
      db.set(res.config.url, res.data.data, res.config.params);
      return res.data.data;
    }
  },
  (err) => {
    if (axios.isCancel(err)) {
      console.log('repeated request:' + err.message);
    } else {
      err.data = null;
      err.msg = '请求超时或服务异常';
    }
    return Promise.reject(err);
  }
);

export const get = (url: string, params = {}) => {
  return service.get(url, {
    params
  });
};

export default service;
