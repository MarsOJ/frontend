import axios from "@/axios";

const API_URL = "http://localhost:5000/question/";

class ProblemService {
  addProblem(problem) {
    return axios.post(API_URL + "insert/", problem).then((response) => {
      return response.status;
    });
  }

  deleteProblem(problem_id) {
    return axios
      .delete(API_URL + "delete/", { data: { problemID: problem_id } })
      .then((response) => {
        console.log(response.data);
        return response.status;
      });
  }

  modifyProblem(problem) {
    return axios.post(API_URL + "update/", problem).then((response) => {
      return response.status;
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
