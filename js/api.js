const API_BASE_URL = "http://localhost:8080/api/v1"; // WILL BE USING AS A BASE URL

const api = {
  request: async function (url, method = "GET", data = null, auth = false) {
    console.log(method);

    const headers = {
      "Content-Type": "application/json",
    };

    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const options = {
      method,
      headers,
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(API_BASE_URL + url, options);
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    return result;
  },
};
