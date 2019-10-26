import axios from 'axios';
import express from 'express';
import Cookies from 'cookies';

const success = 'SUCCESS';
const failure = 'ERROR';

const router = express.Router();

// TODO: make dynamic for prod
const baseApiUrl = 'http://localhost:4000/api';
const siginInUrl = `${baseApiUrl}/signin`;

// routes
router.post('/signin', async (req, res) => {
  try {
    const apiRes = await axios.post(siginInUrl, req.body);

    if (apiRes.status !== 200) {
      throw new Error('internal server error');
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
    return res.send({ code: failure, data: {} });
  }

  res.send('shan');
});

export default router;
