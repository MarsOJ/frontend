<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import InfoService from "@/services/info.service";
import { Back } from "@element-plus/icons-vue";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-main class="main">
            <div class="block" v-loading="loading">
              <div class="title">
                <el-button circle id="back-button" :icon="Back" @click="$router.go(-1)" />
                <span id="headline">
                  {{ content.title }}
                </span>
                <div id="subtitle">
                  来源：{{ content.source }}&nbsp;&nbsp;&nbsp;&nbsp;日期：{{
                      content.date
                  }}
                </div>
              </div>
              <hr />
              <div class="content">
                {{ content.content }}
              </div>
            </div>
          </el-main>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "NewsView",
  data() {
    return {
      newsId: null,
      content: "",
      loading: true,
    };
  },
  mounted() {
    this.newsId = this.$route.params.id;
    InfoService.getNewsDetail(this.newsId).then(
      (content) => {
        this.content = content;
        this.loading = false;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.loading = false;
      }
    );
  },
};
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

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

#headline {
  margin: 12px;
  font-weight: bold;
  font-size: x-large;
  color: #4a5259;
}

#subtitle {
  text-align: right;
  font-size: small;
}

.content {
  margin: 2em;
  white-space: pre-line;
}
</style>
