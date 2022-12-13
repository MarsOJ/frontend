import axios from "@/axios";

const API_URL = "http://localhost:5000/record/";

class RecordService {
  getRankings() {
    return axios.get(API_URL + "rank/").then((response) => {
      return response.data;
    });
  }

  getPersonalRecords(lastId) {
    return axios
      .post(API_URL + "personal/", {
        lastID: lastId,
      })
      .then((response) => {
        return response.data;
      });
  }

  getAllRecords() {
    return axios
      .post(API_URL + "all/", {
        lastID: lastId,
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new RecordService();
