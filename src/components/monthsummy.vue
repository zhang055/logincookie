<template>
  <div>
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
      <el-button
        style="margin-left: 10px"
        size="small"
        type="primary"
        plain
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="datasummy"
        >数据汇总</el-button
      ><el-button
        style="margin-left: 10px"
        size="small"
        type="primary"
        plain
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="netpro"
        >网商</el-button
      ><el-button
        style="margin-left: 10px"
        size="small"
        type="primary"
        plain
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="fxpro"
        >返工品</el-button
      >
      <el-button style="margin-left: 10px" size="small" type="success" plain
        ><download-excel
          class="btn btn-default"
          :data="onlineTableDataArr"
          :fields="json_fields"
          worksheet="alldata"
          name="alldata.xls"
        >
          导出全部数据
        </download-excel></el-button
      >
      <el-button style="margin-left: 10px" size="small" type="success" plain
        ><download-excel
          class="btn btn-default"
          :data="netdata"
          :fields="json_fields"
          worksheet="netdata"
          name="netdata.xls"
        >
          导出网商数据
        </download-excel></el-button
      >
      <el-button style="margin-left: 10px" size="small" type="success" plain
        ><download-excel
          class="btn btn-default"
          :data="fxdata"
          :fields="json_fields"
          worksheet="fgdata"
          name="fgdata.xls"
        >
          导出返工品数据
        </download-excel></el-button
      >
    </el-upload>
    <el-table :data="showdata" height="800">
      <!-- style="width: 100%" stripe header-align="right" height="800" -->
      <!-- <el-table-column label="机型信息"> -->
      <el-table-column fixed prop="pid" label="料号" min-width="2">
      </el-table-column>
      <el-table-column fixed prop="modelname" label="机型" min-width="4">
      </el-table-column>
      <el-table-column fixed prop="dayin" label="今日收入" min-width="2"> </el-table-column>
      <el-table-column prop="dayout" label="今日发出" min-width="2"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as d3 from "d3-dsv";

export default {
  name: "monthsummy",
  data() {
    return {
      json_fields: {
        料号: {
          field: "pid",
          callback: (value) => {
            return "&nbsp;" + value + "&nbsp;";
          },
        },
        机型: "modelname",
        今日收入: "dayin",
        今日发出: "dayout",
      },
      showdata: [],
      productList: [],
      fullscreenLoading: false,
      onlineTableDataArr: [],
      netdata: [],
      fxdata: [],
      a: -1,
    };
  },
  methods: {
    testmethod() {
      this.newStatus = new Date();
    },
    // 展示汇总数据
    datasummy() {
      this.showdata = this.onlineTableDataArr;
    },
    // 展示网商数据
    netpro() {
      console.log("2");
      this.showdata = this.netdata;
    },
    // 展示返工品数据
    fxpro() {
      console.log("3");
      this.showdata = this.fxdata;
    },
    // 文件处理
    async submitUpload() {
      const me = this;
      const files = this.$refs.upload.uploadFiles;
      console.log(files);
      var initfilename = ["156MX.tsv", "157MX.tsv"].sort().toString();
      //   获取文件名
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
        var allnetdataarr = [];
        var allfxdataarr = [];

        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          var fileString = await readFileAsync(element.raw);
          var data = d3.tsvParse(fileString);
          var filename = element.name.split(".")[0].toString();
          if (filename == "156MX") {
            // 处理156MX文件
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              //   每条新数据初始化数据
              var newobj = this.funobj(item);
              var newnetobj = this.funobj(item);
              var newfxobj = this.funobj(item);
              // 总表逻辑--->今日收入逻辑:事务处理事项>0且  转移子库存不为空或来源类型为RMA
              if (Number(item["事务处理数量"]) > 0) {
                if (
                  item["转移 子库存"].replace(/\s*/g, "") != "" ||
                  item["来源类型"].replace(/\s*/g, "") == "RMA"
                ) {
                  newobj["dayin"] = Number(item["事务处理数量"]);
                  alldataarr.push(newobj);
                }
              } else if (
                // 总表逻辑--->发出逻辑：事务处理事项<=0且转移子库存不为空且转移子库存不在TP155/TP122中
                (item["转移 子库存"].replace(/\s*/g, "") != "") &
                (initarr.indexOf(item["转移 子库存"]) == -1)
              ) {
                newobj["dayout"] = Number(item["事务处理数量"]);
                alldataarr.push(newobj);
              }

              //   网商逻辑--->今日收入逻辑：事务处理事项>0且转移子库存为TP155
              if (Number(item["事务处理数量"]) > 0) {
                if (item["转移 子库存"].replace(/\s*/g, "") == "TP155") {
                  newnetobj["dayin"] = Number(item["事务处理数量"]);
                  allnetdataarr.push(newnetobj);
                }
                // 网商逻辑--->今日发出逻辑：事务处理事项<=0且转移子库存为TP153
              } else if (item["转移 子库存"].replace(/\s*/g, "") == "TP153") {
                newnetobj["dayout"] = Number(item["事务处理数量"]);
                allnetdataarr.push(newnetobj);
              }

              //   返修逻辑--->今日收入逻辑：转移子库存为TP154且事务处理数量>0
              if (item["转移 子库存"].replace(/\s*/g, "") == "TP154") {
                if (Number(item["事务处理数量"]) > 0) {
                  newfxobj["dayin"] = Number(item["事务处理数量"]);
                  allfxdataarr.push(newfxobj);
                } else {
                  // 返修逻辑--->今日发出逻辑：转移子库存为TP154且事务处理数量<=0
                  newfxobj["dayout"] = Number(item["事务处理数量"]);
                  allfxdataarr.push(newfxobj);
                }
              }
            }
          } else if (filename == "157MX") {
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              var newobj1 = this.funobj(item);
              var newnetobj1 = this.funobj(item);
              var newfxobj1 = this.funobj(item);
              //   总表逻辑--->今日发出逻辑：转移子库存不为空且不在TP155/TP122中且事务处理事项<0
              if (
                (item["转移 子库存"].replace(/\s*/g, "") != "") &
                (initarr.indexOf(item["转移 子库存"]) == -1) &
                (Number(item["事务处理数量"]) < 0)
              ) {
                newobj1["dayout"] = Number(item["事务处理数量"]);
                alldataarr.push(newobj1);
              }

              //   网商逻辑--->今日发出逻辑：转移子库存为TP153且事务处理事项<0
              if (
                (item["转移 子库存"].replace(/\s*/g, "") == "TP153") &
                (Number(item["事务处理数量"]) < 0)
              ) {
                newnetobj1["dayout"] = Number(item["事务处理数量"]);
                allnetdataarr.push(newnetobj1);
              }

              //   返修逻辑--->今日发出逻辑：转移子库存为TP154且事务处理事项<0
              if (
                (item["转移 子库存"].replace(/\s*/g, "") == "TP154") &
                (Number(item["事务处理数量"]) < 0)
              ) {
                newfxobj1["dayout"] = Number(item["事务处理数量"]);
                allfxdataarr.push(newfxobj1);
              }
            }
            this.$message({
              message: "数据已成功处理，可执行预览或导出",
              type: "success",
            });
            this.fullscreenLoading = false;
          }
        }
        console.log(alldataarr);
        var newarr = me.dataaddhandle(alldataarr);
        console.log(newarr);
        var newnetarr = me.dataaddhandle(allnetdataarr);
        var newfxarr = me.dataaddhandle(allfxdataarr);
        this.onlineTableDataArr = newarr;
        this.netdata = newnetarr;
        this.fxdata = newfxarr;
      } else {
        alert("文件不正确，请重新选择156MX.tsv，157MX.tsv");
      }
      this.fileclear();
    },
    cbfun2() {
      alert("数据处理失败，请进行数据回退并重新操作");
      this.fullscreenLoading = false;
    },
    funobj(item) {
      var newfxobj = {
        pid: item["物料"].toString(),
        modelname: item["描述"],
        dayin: 0,
        dayout: 0,
        initstock: item["子库存"] ? item["子库存"] : "",
        transstock: item["转移 子库存"] ? item["转移 子库存"] : "",
      };
      return newfxobj;
    },
    fileclear() {
      this.$refs.upload.clearFiles();
    },
    dataaddhandle(arr) {
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
