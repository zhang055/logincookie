<template>
  <div>
    <databack
      :dialogVisible="newStatus"
      :modelList="productList"
      @latestStatus="updateList"
    ></databack>
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      :multiple="true"
      :auto-upload="false"
      accept=".tsv"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >数据处理</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="exportXLSX"
        >导出</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="queryData"
        >数据回退</el-button
      >
    </el-upload>
    <el-table :data="onlineTableDataArr" height="800">
      <!-- style="width: 100%" stripe header-align="right" height="800" -->
      <!-- <el-table-column label="机型信息"> -->
      <el-table-column fixed prop="pid" label="料号" width="150">
      </el-table-column>
      <el-table-column fixed prop="modelname" label="机型" width="300">
      </el-table-column>
      <el-table-column prop="preonline" label="前段在线"> </el-table-column>
      <el-table-column fixed prop="endonline" label="后段在线">
      </el-table-column>
      <el-table-column fixed prop="dayin" label="今日收入"> </el-table-column>
      <el-table-column prop="dayout" label="今日发出"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Axios from "axios";
import * as d3 from "d3-dsv";
import qs from "qs";
import databack from "./databack";
export default {
  name: "filehandle",
  components: {
    databack: databack,
  },
  data() {
    return {
      newStatus: false,
      productList: [],
      onlineTableDataArr: [],
    };
  },
  methods: {
    async submitUpload() {
      const me = this;
      const files = this.$refs.upload.uploadFiles;
      console.log(files);
      var initfilename = ["156.tsv", "157.tsv", "156MX.tsv", "157MX.tsv"]
        .sort()
        .toString();
      var allfilename = files
        .map((item) => {
          return item.name;
        })
        .sort()
        .toString();
      if ((files.length != 0) & (initfilename === allfilename)) {
        const readFileAsync = (file) =>
          new Promise((resolve) => {
            var reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target.result);
            reader.readAsText(file);
          });
        var initarr = ["TP120", "TP153", "TP154", "TP122"];
        var alldataarr = [];
        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          var fileString = await readFileAsync(element.raw);
          var data = d3.tsvParse(fileString);
          var arr = [];

          var filename = element.name.split(".")[0].toString();
          if (filename == "156") {
            arr = data.map((item) => {
              var newobj = {
                pid: "",
                modelname: "",
                preonline: 0,
                endonline: 0,
                dayin: 0,
                dayout: 0,
              };
              newobj["pid"] = item["料号"];
              newobj["modelname"] = item["品规"];
              newobj["preonline"] = Number(item["当前结余"]);
              return newobj;
            });
          } else if (filename == "157") {
            arr = data.map((item) => {
              var newobj = {
                pid: "",
                modelname: "",
                preonline: 0,
                endonline: 0,
                dayin: 0,
                dayout: 0,
              };
              newobj["pid"] = item["料号"];
              newobj["modelname"] = item["品规"];
              newobj["endonline"] = Number(item["当前结余"]);
              return newobj;
            });
          } else if (filename == "156MX") {
            arr = data.map((item) => {
              var newobj = {
                pid: "",
                modelname: "",
                preonline: 0,
                endonline: 0,
                dayin: 0,
                dayout: 0,
              };
              newobj["pid"] = item["物料"];
              newobj["modelname"] = item["描述"];
              if (
                item["来源类型"] == "RMA" ||
                initarr.indexOf(item["转移 子库存"]) != -1
              ) {
                if (Number(item["事务处理数量"]) > 0) {
                  newobj["dayin"] = Number(item["事务处理数量"]);
                } else {
                  newobj["dayout"] = Number(item["事务处理数量"]);
                }
              }
              return newobj;
            });
          } else if (filename == "157MX") {
            arr = data.map((item) => {
              var newobj = {
                pid: "",
                modelname: "",
                preonline: 0,
                endonline: 0,
                dayin: 0,
                dayout: 0,
              };
              newobj["pid"] = item["物料"];
              newobj["modelname"] = item["描述"];
              if (
                item["来源类型"] == "RMA" ||
                initarr.indexOf(item["转移 子库存"]) != -1
              ) {
                newobj["dayout"] = Number(item["事务处理数量"]);
              }
              return newobj;
            });
          }
          // console.log(arr)
          alldataarr = alldataarr.concat(arr);
        }
        alldataarr = alldataarr.sort(function(a, b) {
          return a["pid"] - b["pid"];
        });
        console.log(alldataarr);
        var newarr = me.dataaddhandle(alldataarr);
        // var tempdata = {
        //   type: "inserttempdata",
        //   params: JSON.stringify(newarr),
        // };
        console.log(newarr);
        this.onlineTableDataArr = newarr;
        // this.insertData(tempdata);
        this.queryData();
        this.testmethod();
        // this.datahandleunion(tempdata, this.cbfun2);
      } else {
        alert("文件不正确，请重新选择156.tsv,157.tsv,156MX.tsv，157MX.tsv");
      }
      this.fileclear();
    },
    updateList() {
      var _this = this;
      _this.newStatus = new Date();
    },
    dataroll() {
      var _this = this;
      _this.newStatus = new Date();
    },
    testmethod() {
      Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/api/modifydata",
        data: qs.stringify({ type: "deletefxtempdata", params: "" }),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    insertData(data) {
      Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/api/modifyrowsdata",
        data: qs.stringify(data),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    queryData() {
      Axios.get("/api/simplequery", {
        params: {
          type: "queryfxtempdata",
          params: "",
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // datahandleunion(data, cb2) {
    //   Axios({
    //     headers: {
    //       deviceCode: "A95ZEF1-47B5-AC90BF3",
    //     },
    //     method: "post",
    //     url: "/api/modifydata",
    //     data: qs.stringify({ type: "deletefxtempdata", params: "" }),
    //   })
    //     .then((res) => {
    //       console.log(res);
    //       Axios({
    //         headers: {
    //           deviceCode: "A95ZEF1-47B5-AC90BF3",
    //         },
    //         method: "post",
    //         url: "/api/modifyrowsdata",
    //         data: qs.stringify(data),
    //       })
    //         .then(() => {
    //           Axios.get("/api/simplequery", {
    //             params: {
    //               type: "queryfxtempdata",
    //               params: "",
    //             },
    //           })
    //             .then((res) => {
    //               console.log(res);
    //               Axios({
    //                 headers: {
    //                   deviceCode: "A95ZEF1-47B5-AC90BF3",
    //                 },
    //                 method: "post",
    //                 url: "/api/modifydata",
    //                 data: qs.stringify({
    //                   type: "updatefxdatastatus",
    //                   params: "",
    //                 }),
    //               })
    //                 .then(() => {
    //                   alert("数据已处理");
    //                 })
    //                 .catch(cb2);
    //             })
    //             .catch(cb2);
    //         })
    //         .catch(cb2);
    //     })
    //     .catch(cb2);
    // },
    // cbfun2() {
    //   alert("数据处理失败，请进行数据回退并重新操作");
    // },

    // updateDataStatus(data, cb1, cb2) {
    //   Axios({
    //     headers: {
    //       deviceCode: "A95ZEF1-47B5-AC90BF3",
    //     },
    //     method: "post",
    //     url: "/api/modifydata",
    //     data: qs.stringify(data),
    //   })
    //     .then(cb1)
    //     .catch(cb2);
    // },
    // insertData(data, cb1, cb2) {
    //   Axios({
    //     headers: {
    //       deviceCode: "A95ZEF1-47B5-AC90BF3",
    //     },
    //     method: "post",
    //     url: "/api/modifyrowsdata",
    //     data: qs.stringify(data),
    //   })
    //     .then(cb1)
    //     .catch(cb2);
    // },
    // queryData(cb1, cb2) {
    //   Axios.get("/api/simplequery", {
    //     params: {
    //       type: "queryfxtempdata",
    //       params: "",
    //     },
    //   })
    //     .then(cb1)
    //     .catch(cb2);
    // },
    exportXLSX() {},
    fileclear() {
      this.$refs.upload.clearFiles();
    },
    dataaddhandle(arr) {
      var previous = {
        pid: "",
      };
      var newarr = [];
      arr.map((item) => {
        if (item["pid"] != previous["pid"]) {
          var newmodel = {
            pid: item["pid"],
            modelname: item["modelname"],
            preonline: 0,
            endonline: 0,
            dayin: 0,
            dayout: 0,
          };
          previous["pid"] = item["pid"];
          newarr.push(newmodel);
        }
        newarr[newarr.length - 1]["preonline"] += item["preonline"];
        newarr[newarr.length - 1]["endonline"] += item["endonline"];
        newarr[newarr.length - 1]["dayin"] += item["dayin"];
        newarr[newarr.length - 1]["dayout"] += item["dayout"];
      });
      return newarr;
    },
  },
};
</script>
