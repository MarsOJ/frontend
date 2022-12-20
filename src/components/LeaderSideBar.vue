<script setup>
import UserInfo from "@/components/UserInfo.vue";
</script>

<template>
  <div id="leaderboard">
    <UserInfo
      :username="checkUser"
      v-if="showCheckUser"
      @close="this.showCheckUser = false"
    />
    <div class="wrapper">
      <div class="title">
        <slot></slot>
      </div>
      <div class="podium">
        <img class="podium-pic" src="../assets/podium.png" />
        <div class="user-info" id="first-user" v-if="data.length >= 1">
          <img class="user-pic" src="../assets/user.png" />
          <div>{{ data[0].name }}</div>
        </div>
        <div class="user-info" id="second-user" v-if="data.length >= 2">
          <img class="user-pic" src="../assets/user.png" />
          <div>{{ data[1].name }}</div>
        </div>
        <div class="user-info" id="third-user" v-if="data.length >= 3">
          <img class="user-pic" src="../assets/user.png" />
          <div>{{ data[2].name }}</div>
        </div>
      </div>
      <el-table
        id="leader-table"
        :data="data"
        table-layout="auto"
        :row-class-name="tableRowClassName"
        @row-click="rowClicked"
      >
        <el-table-column type="index" label="名次" align="center" width="80" />
        <el-table-column
          v-for="col in columns"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checkUser: "",
      showCheckUser: false,
    };
  },
  methods: {
    tableRowClassName(row) {
      if (row.row.isUser) {
        return "user-row";
      }
      return "";
    },
    rowClicked(row) {
      this.checkUser = row.name;
      this.showCheckUser = true;
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bolder;
  font-size: larger;
}

#leaderboard {
  position: relative;
  margin: 2em 0px 2em;
  border: gray 3px solid;
  border-radius: 28px;
  background-color: white;
  overflow: hidden;
}

#leaderboard .wrapper {
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium {
  height: 150px;
  width: 200px;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.podium-pic {
  width: 100%;
}

.user-info {
  position: absolute;
  text-align: center;
  font-size: small;
}

#first-user {
  left: 76px;
  bottom: 70px;
}

#second-user {
  left: 5px;
  bottom: 50px;
}

#third-user {
  left: 145px;
  bottom: 40px;
}

.user-pic {
  width: 50px;
  border: gray 4px solid;
  border-radius: 29px;
  margin: -5px;
}

#first-user .user-pic {
  border-color: goldenrod;
}

#second-user .user-pic {
  border-color: silver;
}

#third-user .user-pic {
  border-color: maroon;
}

#leader-table {
  text-align: center;
}
</style>

<style>
.el-table .cell {
  white-space: nowrap;
}

.el-table .el-table__row {
  cursor: pointer;
}

.el-table .el-table__row.user-row {
  font-weight: bold;
  background-color: gainsboro;
}
</style>
