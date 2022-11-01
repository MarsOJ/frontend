<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import axios from "axios";
import { Back } from '@element-plus/icons-vue'
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <NaviBar />
      <el-main class="main">
        <div class="block">
          <div class="title">
            <el-button circle id="back-button" :icon="Back" @click="$router.push('/home')" />
            <span id="headline">
              {{ newsId }} CSP-JS 2022第一轮认证电子证书申领通知
            </span>
            <div id="created-time">2022年10月24日 13:29</div>
          </div>
          <hr />
          <div class="content">
            <ol type="1">
              <li v-for="line in contents">
                {{ line }}
              </li>
            </ol>
          </div>
        </div>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "NewsView",
  data() {
    return {
      newsId: null,
      contents: [],
    }
  },
  mounted() {
    this.newsId = this.$route.params.id;
    axios.get("https://baconipsum.com/api/?type=meat-and-filler").then(
      (result) => {
        this.contents = result.data;
      }
    )
  },
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}

.block {
  margin: 5em;
  padding: 5em;
  width: 50%;
  min-width: 500px;
  background-color: white;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  /* box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.2); */
}

.title {
  margin: 2em;
}

#headline {
  margin: 16px;
  font-weight: bold;
  font-size: x-large;
  color: #4A5259;
}

#created-time {
  text-align: right;
  font-size: small;
}

.content {
  margin: 2em;
}
</style>
