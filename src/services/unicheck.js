const axios = require("axios");
const path = require("path");
const fs = require("fs");
const qs = require("qs");
const FormData = require("form-data");
const clientId = "3973b1aa1fcd69c677b5";
const clientSecret = "8a6ff76bbb735ded85208afaf52b98e34d603869";
const grantType = "client_credentials";
const baseUrl = "https://api.unicheck.com";
const dir = "src/public/files";
const { Unicheck } = require("../database/models");

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response && error.response.data) {
      return Promise.reject(error.response);
    }
    if (error.data) {
      return Promise.reject(error.data);
    }
    return Promise.reject(error.message);
  }
);

module.exports = class {
  static async auth() {
    try {
      const header = {
        headers: {},
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      };
      const params = {
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
      };

      const { data } = await axios.post(
        `${baseUrl}/oauth/access-token`,
        qs.stringify(params),
        header
      );
      //   console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async uploadFile(fileName, fileId, courseId, studentId) {
    try {
      const auth = await this.auth();
      const accessToken = auth.access_token;
      var dirname = path.resolve(dir, fileName);

      const form = new FormData();
      form.append("file", fs.readFileSync(dirname), fileName);

      const header = {
        headers: {
          ...form.getHeaders(),
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: form,
        timeout: 50000,
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      };

      const { data } = await axios.post(`${baseUrl}/files`, form, header);

      const paramsBody = {
        fileId: fileId,
        courseId: courseId,
        studentId: studentId,
        unicheckId: data.data.id,
        status: "Pending",
      };
      await Unicheck.create(paramsBody);
    } catch (error) {
      console.log(error);
    }
  }

  static async startCheck(workId, fileId) {
    try {
      const auth = await this.auth();
      const accessToken = auth.access_token;

      const header = {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/vnd.api+json",
        },
        timeout: 50000,
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      };

      const params = {
        data: {
          type: "similarityCheck",
          attributes: {
            search_types: {
              web: true,
              library: false,
            },
            parameters: {
              sensitivity: {
                percentage: 0,
                words_count: 8,
              },
              export: {
                format: "pdf",
                locale_code: "EN"
              },
            },
          },
        },
        relationships: {
          file: {
            data: {
              id: fileId,
              type: "file",
            },
          },
        },
      };

      const { data } = await axios.post(
        `${baseUrl}/similarity/checks`,
        params,
        header
      );
      const paramsBody = {
        similarityId: data.data.id,
        status: "Initiate",
      };
      await Unicheck.update(paramsBody, { where: { id: workId } });
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async confirmCheck(workId, checkId) {
    try {
      const auth = await this.auth();
      const accessToken = auth.access_token;
      const header = {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 50000,
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      };
      const header2 = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 50000,
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
        responseType: "stream",
      };

      const { data } = await axios.get(
        `${baseUrl}/similarity/checks/${checkId}`,
        header
      );

      const state = data.data.attributes.state;

      if (state != "built") {
        return false;
      }

      const exportLink = data.data.links.pdf_report;
      const percentage = data.data.meta.originality.sources_count;

      var filePath = "src/public/files/exports";
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }

      var fileName = `${Date.now()}-export` + ".pdf";
      var pathImage = path.resolve(filePath, fileName);
      const response = await axios.get(`${exportLink}`, header2);
      const saveNewFile = response.data.pipe(fs.createWriteStream(pathImage));

      const paramsBody = {
        exportFile: fileName,
        status: "Checked",
        percentage: percentage,
      };
      await Unicheck.update(paramsBody, { where: { id: workId } });
    } catch (error) {
      console.log(error);
    }
  }
};
