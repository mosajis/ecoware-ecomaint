import Axios from "axios";
import qs from "qs";
import isEmpty from "lodash/isEmpty";
import { configAxios } from "@/config";
import { LOCAL_STORAGE } from "@/const";
export default class Api {
    axios;
    get;
    delete;
    head;
    options;
    post;
    put;
    patch;
    constructor() {
        this.axios = Axios.create({
            baseURL: configAxios.httpURL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            paramsSerializer: (params) => qs.stringify(params, { encode: false, arrayFormat: "brackets" }),
            transformRequest: [
                (data, headers) => {
                    if (headers["Content-Type"] !== "multipart/form-data") {
                        return JSON.stringify(data);
                    }
                    return data;
                },
            ],
            validateStatus: (status) => status >= 200 && status < 300,
            transformResponse: [
                (data) => {
                    if (isEmpty(data))
                        return data;
                    return JSON.parse(data);
                },
            ],
        });
        // Authorization interceptor
        this.axios.interceptors.request.use((config) => {
            const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        });
        // Response interceptor for 401
        this.axios.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401 &&
                window.location.pathname !== "/auth/login") {
                localStorage.removeItem(LOCAL_STORAGE.ACCESS_KEY);
                window.location.pathname = "/auth/login";
            }
            return Promise.reject(error);
        });
        this.get = this._fetch("get");
        this.delete = this._fetch("delete");
        this.head = this._fetch("head");
        this.options = this._fetch("options");
        this.post = this._fetch("post");
        this.put = this._fetch("put");
        this.patch = this._fetch("patch");
    }
    _fetch = (method) => async (url, { data, params, ...options } = {}) => {
        try {
            const response = await this.axios({
                method,
                url,
                data,
                params: params || {},
                ...options,
            });
            return response.data;
        }
        catch (err) {
            console.error(err);
            throw err; // مناسب برای استفاده در TanStack Query
        }
    };
}
export const api = new Api();
