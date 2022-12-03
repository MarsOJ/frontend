import axios from "@/axios";

// const API_URL = "http://127.0.0.1:8080/info/";
const API_URL = "http://localhost:5000/favorite/";

class FavoriteService {
  getFavoriteList() {
    return axios
      .get(API_URL + "list/")
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        return null;
      });
  }

  deleteFavorite(id) {
    return axios
      .delete(API_URL + "list/", { data: { id: id } })
      .then((response) => {
        return response.status;
      });
  }

  renameFavorite(id, name) {
    return axios
      .put(API_URL + "list/", { id: id, newName: name })
      .then((response) => {
        return response.status;
      });
  }

  addFavorite(name) {
    return axios.post(API_URL + "list/", { name: name }).then((response) => {
      return response.status;
    });
  }

  getProblemScratch(page, itemPerPage, id) {
    return axios
      .get(API_URL + "problem/", {
        params: {
          p: page,
          itemPerPage: itemPerPage,
          id: id,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  moveProblem(srcId, destId, problemId, del) {
    return axios
      .put(API_URL + "problem/", {
        sourceID: srcId,
        destID: destId,
        problemID: problemId,
        delete: del,
      })
      .then((response) => {
        return response.status;
      });
  }

  deleteProblem(srcId, problemId) {
    if (!(problemId instanceof Array)) problemId = [problemId];
    return axios
      .delete(API_URL + "problem/", {
        data: {
          sourceID: srcId,
          problemID: problemId,
        },
      })
      .then((response) => {
        return response.status;
      });
  }

  addProblem(destId, problemId) {
    return axios
      .post(API_URL + "problem/", {
        destID: destId,
        problemID: problemId,
      })
      .then((response) => {
        return response.status;
      });
  }
}

export default new FavoriteService();
