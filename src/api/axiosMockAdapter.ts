/** https://github.com/ctimmerm/axios-mock-adapter */

import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axios';

const axiosMockInstance = new MockAdapter(axiosInstance);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
axiosMockInstance.onGet('/users').reply(200, {
  users: [{ id: 1, name: 'John Smith' }]
});

axiosInstance.get('/users').then(function (response) {
  console.log(response.data);
});
