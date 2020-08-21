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
            <el-button size="mini" v-for="(btn,btnIndex) in tableData.btn" :key="btnIndex" class="btn" @click="handle(btn,JSON.stringify(tableData.data[listIndex]))">
              {{btn}}
            </el-button>
          </td>
        </tr>
        <tr v-if="this.isadd===true">
          <td style="font-size: 22px;color: #333333;" @click="adddata"> [+] </td>
          <td v-for="(item,index) in tableData.title.length-1" :key="index"></td>
        </tr>
      </tbody>
    </table>
    <img v-if="tableData.list.length==0" class="nodata" src="@/assets/classFunciton/none.png" />
  </div>
</template>

<script>
export default {
  name: 'normalTable',
  props: {
    tableData: {
      default: () => {}
    },
    width: {
      default: () => {}
    },
    isadd: {
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handle (name, id) {
      this.$emit('tableBtn', name, id)
    },
    adddata () {
      this.$emit('postdata')
    }
  },
  mounted () {
    console.log(this.tableData.title.length)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
      line-height: 15px;
    }
  }

  th,
  td {
    width: 60px;
    padding: 8px 2px;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.btn{
  box-shadow:0px 1px 2px 0px rgba(155,155,155,0.5);
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  margin: 5px 10px;
}
.nodata{
  width: 300px;
  display: block;
  margin: auto;
}
</style>
