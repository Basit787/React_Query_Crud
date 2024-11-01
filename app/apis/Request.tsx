import axios from "axios";

const ApiRequest = axios.create({
  baseURL: "http://localhost:4000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default ApiRequest;
