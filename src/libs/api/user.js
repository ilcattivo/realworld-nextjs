import axios from "axios";
import { API_BASE } from "../utils/constants";

let token;
if (typeof window !== "undefined") token = localStorage.getItem("token");

const userApi = {
  getUserByUsername: (username) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Token ${token}`;
    }
    return axios.get(`${API_BASE}/profiles/${username}`, { headers });
  },
  editUser: (user) => {
    return axios.put(`${API_BASE}/user`, JSON.stringify({ user }), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage?.getItem("token")}`,
      },
    });
  },
  login: (user) => {
    return axios
      .post(`${API_BASE}/users/login`, { user })
      .catch((err) => err.response);
  },
  register: (user) => {
    return axios
      .post(`${API_BASE}/users/login`, { user })
      .catch((err) => err.response);
  },
  follow: (username) => {
    return axios.post(
      `${API_BASE}/profiles/${username}/follow`,
      {},
      {
        headers: {
          Authorization: `Token ${localStorage?.getItem("token")}`,
        },
      }
    );
  },
  unfollow: (username) => {
    return axios.delete(`${API_BASE}/profiles/${username}/follow`, {
      headers: {
        Authorization: `Token ${localStorage?.getItem("token")}`,
      },
    });
  },
};

export default userApi;
