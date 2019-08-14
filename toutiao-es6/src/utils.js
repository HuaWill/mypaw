const SERVER_PORT = '8081'; // keep it same with the PORT definition in server/index.js

/**
 * @desc request封装
 * @param {Object} [params] - 发请求用的参数
 * @return {Promise} 请求的Promise任务对象 
 */
export const request = params => {
    const reqParams = {
        ...params,
        method: (params.method && params.method.toUpperCase()) || 'GET'
    };

    return fetch(
        `http://localhost:${SERVER_PORT}${reqParams.url}`,
        reqParams
    ).then(res => res.json());
}