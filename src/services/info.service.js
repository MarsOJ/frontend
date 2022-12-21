import axios from "@/axios";

// const API_URL = "http://localhost:5000/info/";
const API_URL = `http://${import.meta.env.VITE_APP_BASE_URL}/info/`;

class InfoService {
  getLastestNews(lastId) {
    return axios
      .post(API_URL + "get-latest/", {
        lastId: lastId,
      })
      .then((response) => {
        return response.data;
      });
  }

  getNewsDetail(id) {
    return axios.get(API_URL + "details/" + id).then((response) => {
      return response.data;
    });
  }

  addNews(title, content, source) {
    return axios
      .post(API_URL + "insert/", {
        title: title,
        content: content,
        source: source,
      })
      .then((response) => {
        return response.data;
      });
  }

  modifyNews(news) {
    return axios.post(API_URL + "update/", news).then((response) => {
      return response.data;
    });
  }

  deleteNews(news_id) {
    return axios
      .delete(API_URL + "delete/", {
        data: {
          id: news_id,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  getNewsList(page, itemPerPage) {
    return axios
      .get(API_URL + "list/", {
        params: {
          p: page,
          itemPerPage: itemPerPage,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  getNewsCount() {
    return axios.get(API_URL + "count/").then((response) => {
      return response.data.count;
    });
  }
}

export default new InfoService();
