<template>
  <div>
    <el-button style="margin-left: 10px" size="small" type="success"
      ><download-excel
        class="btn btn-default"
        :data="json_data"
        :fields="json_fields"
        worksheet="My Worksheet"
        name="filefsdaname.xls"
      >
        导出数据
      </download-excel></el-button
    >
  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      json_fields: {
        "Complete name": "name",
        City: "city",
        Telephone: "phone.mobile",
        "Telephone 2": {
          field: "phone.landline",
          callback: (value) => {
            return `Landline Phone - ${value}`;
          },
        },
      },
      json_data: [
        {
          name: "Tony Peña",
          city: "New York",
          country: "United States",
          birthdate: "1978-03-15",
          phone: {
            mobile: "1-541-754-3010",
            landline: "(541) 754-3010",
          },
        },
        {
          name: "Thessaloniki",
          city: "Athens",
          country: "Greece",
          birthdate: "1987-11-23",
          phone: {
            mobile: "+1 855 275 5071",
            landline: "(2741) 2621-244",
          },
        },
      ],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8",
          },
        ],
      ],
    };
  },

  methods: {},
  mounted() {},
};
</script>

<style></style>
