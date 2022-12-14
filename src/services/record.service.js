import axios from "@/axios";

// const API_URL = "http://127.0.0.1:8080/info/";
const API_URL = "http://localhost:5000/record/";

class RecordService {
  getRecordList(page, itemPerPage) {
    return axios
      .get(API_URL + "all/", {
        params: {
          p: page,
          itemPerPage: itemPerPage,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  getRecordFile(id) {
    return axios.get(API_URL + "download/" + id).then((response) => {
      return response.data.file;
    });
  }

  getRecordCount() {
    return axios.get(API_URL + "count/").then((response) => {
      return response.data.count;
    });
  }
}

export default new RecordService();
