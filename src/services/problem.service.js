import axios from "@/axios";

const API_URL = "http://localhost:5000/question/";

class ProblemService {
  addProblem(problem) {
    return axios.post(API_URL + "/insert", problem).then((response) => {
      return response.status;
    });
  }

  deleteProblem(problem_id) {
    return axios
      .delete(API_URL + "/delete", { id: problem_id })
      .then((response) => {
        return response.status;
      });
  }

  modifyProblem(problem) {
    return axios.post(API_URL + "/update", problem).then((response) => {
      return response.status;
    });
  }

  getProblemDetail() {
    return axios.get(API_URL + "/details").then((response) => {
      return response.data;
    });
  }
}

export default new ProblemService();
