<script setup>
import UserInfo from "@/components/UserInfo.vue";
import AuthService from "@/services/auth.service";
</script>

<template>
  <div id="leaderboard">
    <UserInfo
      :username="checkUser"
      v-if="showCheckUser"
      @close="showCheckUser = false"
    />
    <div class="wrapper">
      <div class="title">
        <slot></slot>
      </div>
      <div class="podium">
        <img class="podium-pic" src="../assets/podium.png" />
        <div
          class="user-info"
          id="first-user"
          v-if="data.length >= 1"
          @click="podiumClicked(data[0].name)"
        >
          <img class="user-pic" :src="podiumProfile[0]" />
          <div>{{ data[0].name }}</div>
        </div>
        <div
          class="user-info"
          id="second-user"
          v-if="data.length >= 2"
          @click="podiumClicked(data[1].name)"
        >
          <img class="user-pic" :src="podiumProfile[1]" />
          <div>{{ data[1].name }}</div>
        </div>
        <div
          class="user-info"
          id="third-user"
          v-if="data.length >= 3"
          @click="podiumClicked(data[2].name)"
        >
          <img class="user-pic" :src="podiumProfile[2]" />
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
      podiumProfile: ["", "", ""],
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
    podiumClicked(name) {
      this.checkUser = name;
      this.showCheckUser = true;
    },
  },
  watch: {
    data: {
      handler: function (newVal) {
        for (let index = 0; index < newVal.length && index < 3; index++) {
          AuthService.userProfile(newVal[index].name).then(
            (content) => {
              if (content != "") {
                this.podiumProfile[index] = content;
              } else {
                this.podiumProfile[index] =
                  "data:image/png;base64,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";
              }
            },
            (error) => {
              var content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              console.log(content);
            }
          );
        }
      },
      immediate: true,
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
  cursor: pointer;
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
