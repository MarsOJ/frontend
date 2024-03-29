import axios from "@/axios";

// const API_URL = "http://localhost:5000/question/";
// const API_URL = `http://${import.meta.env.VITE_APP_BASE_URL}/question/`;

const API_URL = `/api/question/`;

class ProblemService {
  addProblem(problem) {
    return axios.post(API_URL + "insert/", problem).then((response) => {
      return response.data;
    });
  }

  deleteProblem(problem_id) {
    return axios
      .delete(API_URL + "delete/", { data: { problemID: problem_id } })
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  }

  uploadProblem(data) {
    return axios.post(API_URL + "upload/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  modifyProblem(problem) {
    return axios.post(API_URL + "update/", problem).then((response) => {
      return response.data;
    });
  }

  getProblemDetail(id) {
    return axios.get(API_URL + "details/" + id).then((response) => {
      return response.data;
    });
  }

  getProblemList(page, itemPerPage) {
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

  getProblemCount() {
    return axios.get(API_URL + "count/").then((response) => {
      return response.data.count;
    });
  }
}

export default new ProblemService();
