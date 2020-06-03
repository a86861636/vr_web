<template>
  <div class="table" :style="'width: '+width+'px;'">
    <table style="width: 100%;" v-if="tableData">
      <thead>
      <tr>
        <th v-for="(item, index) in tableData.title" :key="index">{{item}}</th>
      </tr>
      </thead>
      <div style="height: 2px"></div>
      <tbody>
      <tr v-for="(list, listIndex) in tableData.list" :key="listIndex">
        <td v-for="(item, itemIndex) in list" :key="itemIndex">
          {{item}}
        </td>
        <td v-if="tableData.btn" class="btn-box">
          <span v-for="(btn,btnIndex) in tableData.btn" :key="btnIndex" class="btn" @click="handle(btn,JSON.stringify(tableData.date[listIndex]))">
            [{{btn}}]
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'table',
  props: ['tableData', 'width'],
  data () {
    return {
    }
  },
  methods: {
    handle (name, id) {
      this.$emit('tableBtn', name, id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

table {
  box-sizing: border-box;
  table-layout: fixed;

  thead {
    background-color: #FA7060;

    th {
      color: #fff;
      line-height: 17px;
      font-weight: normal;
    }
    th:nth-child(2n) {
      background-color: #FCBDA7;
    }
  }

  tbody {
    background-color: #eaf2ff;

    tr {
      background: #FFDDB6;
    }
    tr:nth-child(2n){
      background: #FCBDA7;
    }
    td {
      color: #393836;
      line-height: 12px;
    }
  }

  th,
  td {
    width: 60px;
    padding: 12px 2px;
    font-size: 12px;
    text-align: center;
  }
}
.btn{
  cursor: pointer;
}
</style>
