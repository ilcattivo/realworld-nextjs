import axios from "axios";
import { stringify } from "query-string";
import { API_BASE, ARTICLES_PER_PAGE } from "../utils/constants";

let token;
if (typeof window !== "undefined") token = localStorage.getItem("token");

const articleApi = {
  getAllArticles: (page, tag) => {
    const offset = (page - 1) * ARTICLES_PER_PAGE;
    const stringifiedParams = stringify({
      limit: ARTICLES_PER_PAGE,
      offset,
      tag,
    });

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    return axios
      .get(`${API_BASE}/articles?${stringifiedParams}`, {
        headers,
      })
      .then((res) => res.data);
  },
  getFollowedArticles: (page, tag) => {
    const offset = (page - 1) * ARTICLES_PER_PAGE;
    const stringifiedParams = stringify({
      limit: ARTICLES_PER_PAGE,
      offset,
      tag,
    });
    return axios
      .get(`${API_BASE}/articles/feed?${stringifiedParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage?.getItem("token")}`,
        },
      })
      .then((res) => res.data);
  },
  getArticlesByAuthor: (author) => {
    const stringifiedParams = stringify({
      author,
      offset: 0,
    });
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Token ${token}`;
    }
    return axios
      .get(`${API_BASE}/articles?${stringifiedParams}`, {
        headers,
      })
      .then((res) => res.data);
  },
  getFavoritedArticles: (username) => {
    const stringifiedParams = stringify({
      favorited: username,
      offset: 0,
    });

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    return axios
      .get(`${API_BASE}/articles?${stringifiedParams}`, {
        headers,
      })
      .then((res) => res.data);
  },
  getArticleById: (id) => {
    return axios(`${API_BASE}/articles/${id}`).then((res) => res.data.article);
  },
  getAllTags: () => {
    return axios(`${API_BASE}/tags`).then((res) => res.data);
  },
  postArticle: (article) => {
    return axios.post(
      `${API_BASE}/articles`,
      { article },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage?.getItem("token")}`,
        },
      }
    );
  },
  editArticle: (id, article) => {
    return axios.put(
      `${API_BASE}/articles/${id}`,
      { article },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage?.getItem("token")}`,
        },
      }
    );
  },
  addToFavorite: (id) => {
    return axios
      .post(`${API_BASE}/articles/${id}/favorite`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => res.data);
  },
  removeFromFavorite: (id) => {
    return axios
      .delete(`${API_BASE}/articles/${id}/favorite`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => res.data);
  },
  deleteArticle: (id) => {
    return axios.delete(`${API_BASE}/articles/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
  },
};

export default articleApi;
