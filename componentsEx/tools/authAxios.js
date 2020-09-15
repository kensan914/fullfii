import axios from "axios";


const authAxios = (token) => {
  _authAxios = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    }
  });

  _authAxios.interceptors.request.use(request => {
    console.log('リクエストは: ', request)
    return request
  })

  return _authAxios;
}

export default authAxios;