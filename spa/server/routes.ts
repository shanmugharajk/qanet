import axios from 'axios';
import express from 'express';
import Cookies from 'cookies';
import { baseUrl, internalServerError, successCode } from '../shared/endpoints';

const success = 'SUCCESS';
const failure = 'ERROR';

const router = express.Router();

const siginInUrl = `${baseUrl}/signin`;
const siginUpUrl = `${baseUrl}/signup`;

// routes
router.post('/signin', async (req, res) => {
  try {
    const apiRes = await axios.post(siginInUrl, req.body);

    if (apiRes.status !== 200) {
      throw new Error('internal server error');
    }

    const resData = apiRes.data;

    if (resData.code !== successCode) {
      return res.send({ code: failure, data: resData.data });
    }

    const token = resData.data.token;

    delete resData.data.token;

    new Cookies(req, res)
      .set('token', token, { httpOnly: true })
      .set('userInfo', JSON.stringify(apiRes.data.data), { httpOnly: false })
      .set('isSignedIn', 'true', { httpOnly: false });

    return res.send({ code: success, data: apiRes.data.data });
  } catch (error) {
    // TODO: include a logger
    console.log(error);
    return res.send({ code: failure, data: { message: internalServerError } });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const apiRes = await axios.post(siginUpUrl, req.body);

    if (apiRes.status !== 200) {
      throw new Error('internal server error');
    }

    const resData = apiRes.data;

    if (resData.code !== successCode) {
      return res.send({ code: failure, data: resData.data });
    }

    const token = apiRes.data.data.token;

    delete apiRes.data.data.token;

    new Cookies(req, res)
      .set('token', token, { httpOnly: true })
      .set('userInfo', JSON.stringify(apiRes.data.data), { httpOnly: false })
      .set('isSignedIn', 'true', { httpOnly: false });

    return res.send({ code: success, data: apiRes.data.data });
  } catch (error) {
    // TODO: include a logger
    console.log(error);
    return res.send({ code: failure, data: { message: internalServerError } });
  }
});

export default router;
