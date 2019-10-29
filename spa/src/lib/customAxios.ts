import axios, { AxiosResponse } from 'axios';
import { successCode, unauthorized, internalServerError } from '../../shared/messages';
import { IPostReqResponse } from '../@types';

axios.defaults.withCredentials = true;

const customAxios = axios;

export const postReq = async function (url: string, data: any): Promise<IPostReqResponse> {
  try {
    const res = await axios.post(url, data);
    const resData = res.data;

    if (resData.code === successCode) {
      return { data: resData.data };
    } else {
      return { data: null, error: resData.message || internalServerError };
    }
  } catch (error) {
    const { response } = error;

    if ((response || {}).status === 401) {
      return { data: null, error: unauthorized };
    }

    return { data: null, error: internalServerError };
  }
}

export default customAxios;
