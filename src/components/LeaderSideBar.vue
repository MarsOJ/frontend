<script setup></script>

<template>
  <div id="leaderboard">
    <div class="title">排行榜</div>
    <div class="podium">
      <img class="podium-pic" src="../assets/podium.png" />
      <div class="user-info" id="first-user">
        <img class="user-pic" src="../assets/user.png" />
        <div>{{ data[0].name }}</div>
      </div>
      <div class="user-info" id="second-user">
        <img class="user-pic" src="../assets/user.png" />
        <div>{{ data[1].name }}</div>
      </div>
      <div class="user-info" id="third-user">
        <img class="user-pic" src="../assets/user.png" />
        <div>{{ data[2].name }}</div>
      </div>
    </div>
    <el-table id="leader-table" :data="data" table-layout="auto" :row-class-name="tableRowClassName">
      <el-table-column type="index" label="名次" align="center" width="80" />
      <el-table-column prop="name" label="用户名" align="center" />
      <el-table-column prop="points" label="积分" align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    userRank: Number,
  },
  methods: {
    tableRowClassName(row) {
      if (row.rowIndex === this.userRank - 1) {
        return "user-row";
      }
      return "";
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
  margin: 2em 0px 2em;
  padding: 2em;
  border: gray 3px solid;
  border-radius: 10px;
  width: 80%;
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
.el-table .user-row {
  font-weight: bold;
  background-color: gainsboro;
}
</style>
