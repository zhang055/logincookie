<template>
  <div>
    <databack :dialogVisible="newStatus" @latestStatus="updateList"></databack>
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
        type="primary"
        plain
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="submitUpload"
        >数据处理</el-button
      >
      <el-button style="margin-left: 10px" size="small" type="success" plain
        ><download-excel
          class="btn btn-default"
          :data="onlineTableDataArr"
          :fields="json_fields"
          worksheet="fxonline"
          stringifyLongNum:true
          name="fxonline.xls"
        >
          导出数据
        </download-excel></el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="warning"
        plain
        @click="testmethod"
        >数据回退</el-button
      >
    </el-upload>
    <el-table :data="onlineTableDataArr" height="800">
      <!-- style="width: 100%" stripe header-align="right" height="800" -->
      <!-- <el-table-column label="机型信息"> -->
      <el-table-column prop="pid" label="料号" min-width="1"> </el-table-column>
      <el-table-column prop="modelname" label="机型" min-width="2">
      </el-table-column>
      <el-table-column prop="preonline" label="前段在线" min-width="1">
      </el-table-column>
      <el-table-column prop="endonline" label="后段在线" min-width="1">
      </el-table-column>
      <el-table-column prop="allonline" label="总在线" min-width="1">
      </el-table-column>
      <el-table-column prop="dayin" label="今日收入" min-width="1">
      </el-table-column>
      <el-table-column prop="dayout" label="今日发出" min-width="1">
      </el-table-column>
      <el-table-column prop="accuin" label="累计收入" min-width="1">
      </el-table-column>
      <el-table-column prop="accuout" label="累计发出" min-width="1">
      </el-table-column>
      <el-table-column prop="simplegroup" label="引用" min-width="1">
      </el-table-column>
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
      json_fields: {
        料号: {
          field: "pid",
          callback: (value) => {
            return '&nbsp;'+value+'&nbsp;';
          },
        },
        机型: "modelname",
        今日收入: "dayin",
        今日发出: "dayout",
        前段在线: "preonline",
        后段在线: "endonline",
        总在线: "allonline",
        累计收入: "accuin",
        累计发出: "accuout",
        引用: "simplegroup",
      },
      newStatus: false,
      fullscreenLoading: false,
      onlineTableDataArr: [],
      a: -1,
    };
  },
  methods: {
    testmethod() {
      this.newStatus = new Date();
    },
    // 插入引用标准表
    // async insertsc(){
    //   // const me = this;
    //   const files = this.$refs.upload.uploadFiles;
    //   const readFileAsync = (file) =>
    //       new Promise((resolve) => {
    //         var reader = new FileReader();
    //         reader.onload = (evt) => resolve(evt.target.result);
    //         reader.readAsText(file);
    //       });
    //       var fileString = await readFileAsync(files[0].raw);
    //       var data = d3.csvParse(fileString);
    //       console.log(data)
    //       var tempdata = {
    //       type: "testtemp",
    //       params: JSON.stringify(data),
    //     };
    //       Axios({
    //         headers: {
    //           deviceCode: "A95ZEF1-47B5-AC90BF3",
    //         },
    //         method: "post",
    //         url: "/modifyrowsdata",
    //         data: qs.stringify(tempdata),
    //       })

    // },
    async submitUpload() {
      const me = this;
      const files = this.$refs.upload.uploadFiles;
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
        this.fullscreenLoading = true;
        const readFileAsync = (file) =>
          new Promise((resolve) => {
            var reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target.result);
            reader.readAsText(file);
          });
        var initarr = ["TP155", "TP122"];
        var alldataarr = [];
        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          // 读取文件
          var fileString = await readFileAsync(element.raw);
          var data = d3.tsvParse(fileString);
          var arr = [];
          // 获取文件名
          var filename = element.name.split(".")[0].toString();
          // 处理156文件
          if (filename == "156") {
            arr = data.map((item) => {
              var newobj = this.newonlineobj(item);
              newobj["pid"] = item["料号"].toString();
              newobj["modelname"] = item["品规"] ? item["品规"] : "";
              newobj["preonline"] = Number(item["当前结余"]);
              return newobj;
            });
            console.log(arr);
          } else if (filename == "157") {
            // 处理157文件
            arr = data.map((item) => {
              var newobj = this.newonlineobj(item);
              newobj["pid"] = item["料号"].toString();
              newobj["modelname"] = item["品规"];
              newobj["endonline"] = Number(item["当前结余"]);
              return newobj;
            });
          } else if (filename == "156MX") {
            // 处理156MX文件
            arr = data.map((item) => {
              var newobj = this.newonlineobj(item);
              newobj["pid"] = item["物料"].toString();
              newobj["modelname"] = item["描述"] ? item["描述"] : "";
              // 156MX收入逻辑：事务处理事项>0且  转移子库存不为空或事务来源为RMA
              if (Number(item["事务处理数量"]) > 0) {
                if (
                  item["转移 子库存"].replace(/\s*/g, "") != "" ||
                  item["来源类型"].replace(/\s*/g, "") == "RMA"
                ) {
                  newobj["dayin"] = Number(item["事务处理数量"]);
                }
              } else if (
                // 156MX发出逻辑:事务处理事项<=0且转移子库存不为空且转移子库存不在TP155及TP122中
                (item["转移 子库存"].replace(/\s*/g, "") != "") &
                (initarr.indexOf(item["转移 子库存"]) == -1)
              ) {
                newobj["dayout"] = Number(item["事务处理数量"]);
              }
              return newobj;
            });
          } else if (filename == "157MX") {
            // 处理157MX文件
            arr = data.map((item) => {
              var newobj = this.newonlineobj(item);
              newobj["pid"] = item["物料"].toString();
              newobj["modelname"] = item["描述"] ? item["描述"] : "";
              if (
                // 157MX发出逻辑:事务处理事项<=0且转移子库存不为空且转移子库存不在TP155及TP122中
                (item["转移 子库存"].replace(/\s*/g, "") != "") &
                (initarr.indexOf(item["转移 子库存"]) == -1) &
                (Number(item["事务处理数量"]) < 0)
              ) {
                newobj["dayout"] = Number(item["事务处理数量"]);
              }
              return newobj;
            });
          }
          alldataarr = alldataarr.concat(arr);
          arr = [];
        }

        // 数据汇总处理
        var newarr = me.dataaddhandle(alldataarr);
        var tempdata = {
          type: "inserttempdata",
          params: JSON.stringify(newarr),
        };

        // 联动数据库处理
        this.datahandleunion(tempdata, this.cbfun2);
      } else {
        alert("文件不正确，请重新选择156.tsv,157.tsv,156MX.tsv，157MX.tsv");
      }
      // 清除文件列表
      this.fileclear();
    },
    // 数据初始化
    newonlineobj(item) {
      var newobj = {
        pid: "",
        modelname: "",
        preonline: 0,
        endonline: 0,
        dayin: 0,
        dayout: 0,
        datastatus: 0,
        initstock: item["子库存"] ? item["子库存"] : "",
        transstock: item["转移 子库存"] ? item["转移 子库存"] : "",
      };
      return newobj;
    },

    // 数据回退后更新列表数据
    updateList() {
      var _this = this;
      Axios.get("/simplequery", {
        params: {
          type: "queryfxtempdata",
          params: "{}",
        },
      }).then((res) => {
        console.log("查询已执行");
        console.log(res);
        _this.onlineTableDataArr = res.data;
      });
    },
    // 数据回退
    dataroll() {
      var _this = this;
      _this.newStatus = new Date();
    },
    // 联动数据库
    datahandleunion(data, cb2) {
      // 清除数据库中状态为0的数据
      Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/modifydata",
        data: qs.stringify({ type: "deletefxtempdata", params: "{}" }),
      })
        .then(() => {
          // 插入数据,标记状态为0
          Axios({
            headers: {
              deviceCode: "A95ZEF1-47B5-AC90BF3",
            },
            method: "post",
            url: "/modifyrowsdata",
            data: qs.stringify(data),
          })
            .then(() => {
              // 联动数据库查询
              Axios.get("/simplequery", {
                params: {
                  type: "queryfxtempdata",
                  params: "{}",
                },
              })
                .then((res) => {
                  // 将数据传递至前端并渲染
                  this.onlineTableDataArr = res.data;
                  Axios({
                    headers: {
                      deviceCode: "A95ZEF1-47B5-AC90BF3",
                    },
                    method: "post",
                    url: "/modifydata",
                    data: qs.stringify({
                      type: "updatefxdatastatus",
                      params: "{}",
                    }),
                  })
                    .then(() => {
                      this.$message({
                        message: "数据已成功处理，可执行导出",
                        type: "success",
                      });
                      this.fullscreenLoading = false;
                    })
                    .catch(cb2);
                })
                .catch(cb2);
            })
            .catch(cb2);
        })
        .catch(cb2);
    },
    cbfun2() {
      alert("数据处理失败，请进行数据回退并重新操作");
      this.fullscreenLoading = false;
    },
    fileclear() {
      this.$refs.upload.clearFiles();
    },
    dataaddhandle(arr) {
      // 第一步进行数据排序
      arr = arr.sort(function(a, b) {
        return a["pid"] - b["pid"];
      });
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
            datastatus: 0,
            initstock: item["initstock"] ? item["initstock"] : "",
            transstock: item["transstock"] ? item["transstock"] : "",
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
