<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import Pagination from "@/components/Pagination.vue";
import InfoService from "@/services/info.service";
import FavoriteService from "@/services/favorites.service";
import ProblemService from "@/services/problem.service";
import BattleFileService from "@/services/battlefile.service";
import { ref } from "vue";
import { Edit, Refresh, Delete, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            <el-main>
              <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="资讯管理" name="info">
                  <div class="app-container">
                    <div class="filter-container">
                      <el-button
                        class="filter-item"
                        type="danger"
                        :icon="Delete"
                        size="small"
                        @click="handleBatchDelete"
                      >
                        批量删除
                      </el-button>
                      <el-button
                        class="filter-item"
                        style="margin-left: 10px"
                        type="primary"
                        size="small"
                        :icon="Edit"
                        @click="addInfo"
                      >
                        添加
                      </el-button>
                    </div>

                    <el-table
                      :key="tableKey"
                      v-loading="listLoading"
                      ref="mutipleTableRef"
                      :data="list"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @sort-change="sortChange"
                    >
                      <el-table-column type="selection" width="55" />
                      <el-table-column
                        label="序号"
                        prop="id"
                        sortable="custom"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{ $index + 1 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="标题"
                        min-width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.title }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="日期"
                        width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.date }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="center"
                        width="330"
                        class-name="small-padding fixed-width"
                      >
                        <template v-slot="{ row }">
                          <el-button type="primary" @click="checkInfo(row)">
                            查看
                          </el-button>
                          <el-button type="danger" @click="deleteInfo(row)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                    <pagination
                      v-show="total > 0"
                      :total="total"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateProblemList"
                    />

                    <el-dialog
                      title="新建资讯"
                      v-model="InfoDialogVisible"
                      :append-to-body="true"
                    >
                      <el-form
                        ref="dataForm"
                        :model="InfoModel"
                        label-position="left"
                        label-width="70px"
                        style="width: 400px; margin-left: 50px"
                      >
                        <el-form-item label="标题" prop="title">
                          <el-input
                            v-model="InfoModel.title"
                            style="width: 140px"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                          <el-input
                            v-model="InfoModel.content"
                            :autosize="{ minRows: 6, maxRows: 10 }"
                            type="textarea"
                            style="width: 140px"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="置顶" prop="top">
                          <el-switch
                            v-model="InfoModel.top"
                            class="filter-item"
                          />
                        </el-form-item>
                      </el-form>
                      <div class="dialog-footer">
                        <el-button
                          @click="InfoDialogVisible = false"
                          size="small"
                        >
                          取消
                        </el-button>
                        <el-button
                          type="primary"
                          @click="createInfo"
                          size="small"
                        >
                          确定
                        </el-button>
                      </div>
                    </el-dialog>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="题库管理" name="problem">
                  <div class="app-container">
                    <div class="filter-container">
                      <el-button
                        class="filter-item"
                        type="danger"
                        :icon="Delete"
                        size="small"
                        @click="handleBatchDelete"
                      >
                        批量删除
                      </el-button>
                      <el-button
                        class="filter-item"
                        style="margin-left: 10px"
                        type="primary"
                        size="small"
                        :icon="Edit"
                        @click="addProblem"
                      >
                        添加
                      </el-button>
                    </div>

                    <el-table
                      :key="tableKey"
                      v-loading="listLoading"
                      :data="list"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @sort-change="sortChange"
                    >
                      <el-table-column
                        label="序号"
                        prop="id"
                        sortable="custom"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{ $index + 1 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="日期"
                        width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.date }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="标题" width="150px">
                        <template v-slot="{ row }">
                          <span class="link-type">{{ row.title }}</span>
                          <el-tag v-if="row.type === 1">单选题</el-tag>
                          <el-tag v-else-if="row.type === 2">一般多选题</el-tag>
                          <el-tag v-else-if="row.type === 3">程序多选题</el-tag>
                          <el-tag v-else>其他题型</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="内容"
                        min-width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.content }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="center"
                        width="330"
                        class-name="small-padding fixed-width"
                      >
                        <template v-slot="{ row }">
                          <el-button type="primary" @click="checkProblem(row)">
                            查看
                          </el-button>
                          <el-button type="danger" @click="deleteProblem(row)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                    <pagination
                      v-show="total > 0"
                      :total="total"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateProblemList"
                    />

                    <el-dialog
                      title="题目"
                      v-model="ProblemDialogVisible"
                      :append-to-body="true"
                    >
                      <el-form
                        ref="dataForm"
                        :model="ProblemModel"
                        label-position="left"
                        label-width="70px"
                        style="width: 400px; margin-left: 50px"
                      >
                        <el-form-item label="题目类型" prop="type">
                          <el-select
                            v-model="ProblemModel.type"
                            style="width: 140px"
                            class="filter-item"
                          >
                            <el-option :label="单选题" :value="0" />
                            <el-option :label="一般多选题" :value="1" />
                            <el-option :label="程序多选题" :value="2" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                          <el-input
                            v-model="ProblemModel.title"
                            style="width: 140px"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="题目" prop="content">
                          <el-input
                            v-model="ProblemModel.content"
                            :autosize="{ minRows: 6, maxRows: 10 }"
                            type="textarea"
                            style="width: 140px"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="选项" prop="options">
                          <el-radio-group
                            v-model="ProblemModel.answer"
                            size="large"
                            style="width: 140px"
                            class="filter-item"
                          >
                            <el-radio label="A">{{
                              ProblemModel.options[0]
                            }}</el-radio>
                            <el-radio label="B">{{
                              ProblemModel.options[1]
                            }}</el-radio>
                            <el-radio label="C">{{
                              ProblemModel.options[2]
                            }}</el-radio>
                            <el-radio label="D">{{
                              ProblemModel.options[3]
                            }}</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                      <div class="dialog-footer">
                        <el-button
                          @click="ProblemDialogVisible = false"
                          size="small"
                        >
                          取消
                        </el-button>
                        <el-button
                          type="primary"
                          @click="createProblem"
                          size="small"
                        >
                          确定
                        </el-button>
                      </div>
                    </el-dialog>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="对战记录" name="battle">
                  <div class="app-container">
                    <div class="filter-container">
                      <el-button
                        class="filter-item"
                        type="primary"
                        :icon="Refresh"
                        size="small"
                        @click="updateList"
                      >
                        刷新
                      </el-button>
                    </div>

                    <el-table
                      :key="tableKey"
                      v-loading="listLoading"
                      :data="list"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @sort-change="sortChange"
                    >
                      <el-table-column
                        label="序号"
                        prop="id"
                        sortable="custom"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{ $index + 1 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="获胜方ID"
                        min-width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.winner_id }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="失败方ID"
                        min-width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.loser_id }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="比赛时间"
                        width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.date }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="比赛日志"
                        align="center"
                        width="330"
                        class-name="small-padding fixed-width"
                      >
                        <template v-slot="{ row }">
                          <el-button
                            type="primary"
                            @click="handleDownload(row)"
                            :icon="Download"
                          >
                            下载
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                    <pagination
                      v-show="total > 0"
                      :total="total"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateProblemList"
                    />

                    <el-dialog
                      title="移动问题至"
                      v-model="ProblemDialogVisible"
                      :append-to-body="true"
                    >
                      <el-form
                        ref="dataForm"
                        :model="moveFavoriteModel"
                        label-position="left"
                        label-width="70px"
                        style="width: 400px; margin-left: 50px"
                      >
                        <el-form-item label="命名" prop="name">
                          <el-select
                            v-model="moveFavoriteModel.name"
                            style="width: 140px"
                            class="filter-item"
                          >
                            <el-option
                              v-for="item in favoriteList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="是否复制" prop="shouldDelete">
                          <el-select
                            v-model="moveFavoriteModel.shouldDelete"
                            style="width: 140px"
                            class="filter-item"
                          >
                            <el-option :label="'是'" :value="true" />
                            <el-option :label="'否'" :value="false" />
                          </el-select>
                        </el-form-item>
                      </el-form>
                      <div class="dialog-footer">
                        <el-button
                          @click="ProblemDialogVisible = false"
                          size="small"
                        >
                          取消
                        </el-button>
                        <el-button
                          type="primary"
                          @click="MoveProblem"
                          size="small"
                        >
                          确定
                        </el-button>
                      </div>
                    </el-dialog>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-main>
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: ref("info"),
      mutipleTableRef: ref([0]),
      tableKey: 0,
      list: [
        // {
        //   title: "test", //string
        //   id: 1, //string
        //   content: "This is a test problem", //20-30 characters
        //   type: 1, //
        //   date: "2022-09-19",
        // },
      ],
      listLoading: false,
      total: 1,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      sortOptions: [
        { label: "升序", key: "+id" },
        { label: "降序", key: "-id" },
      ],
      InfoModel: {
        title: "0",
        content: "",
        top: false,
        rules: [],
        create: false,
      },
      ProblemModel: {
        title: "",
        content: "This is a test problem",
        options: [],
        answer: ref("A"),
        type: 1, //
      },
      InfoDialogVisible: false,
      ProblemDialogVisible: false,
    };
  },
  created() {
    this.updateList();
  },
  methods: {
    updateList() {
      this.listLoading = true;
      switch (this.activeName) {
        case "info":
          break;
        case "problem":
          FavoriteService.getProblemScratch(
            this.listQuery.page,
            this.listQuery.limit,
            this.favoriteId
          ).then((list) => {
            if (list != null) {
              this.list = list;
            } else {
              ElMessageBox.alert("加载题目列表失败！", "错误", {
                confirmButtonText: "OK",
              });
            }
            this.listLoading = false;
          });
          break;
        case "battle":
          break;
        default:
          break;
      }
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleBatchDelete() {
      ElMessageBox.alert("您确定要删除所选项目吗？该操作不可恢复！", "警告", {
        cancelButtonText: "Cancel",
        confirmButtonText: "OK",
        callback: () => {
          switch (this.activeName) {
            case "info":
              break;
            case "problem":
              break;
            case "battle":
              break;
            default:
              break;
          }
        },
      });
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    addInfo() {
      this.InfoModel = {
        title: "0",
        content: "",
        top: false,
        rules: [],
        create: true,
      };
      this.InfoDialogVisible = true;
    },
    createInfo() {
      //TODO: row -> param
      if (this.InfoModel.create) {
        InfoService.addNews().then();
      } else {
        InfoService.modifyNews().then();
      }
    },
    checkInfo(row) {
      //TODO: row -> param
      InfoService.getNewsDetail(row).then((detail) => {
        if (detail == null) {
          ElMessage({
            message: "获取资讯详情发生错误",
            type: "error",
          });
        } else {
          this.InfoModel.title = detail.title;
          this.InfoModel.content = detail.content;
          this.InfoModel.top = detail.top;
          this.InfoModel.create = false;
          this.InfoDialogVisible = true;
        }
      });
    },
    deleteInfo(row) {
      //TODO: row -> param
      InfoService.deleteNews(row).then();
    },
    addProblem() {
      this.ProblemModel = {
        title: "",
        content: "",
        options: ["", "", "", ""],
        answer: ref("A"),
        type: 0, //
        create: true,
      };
      this.ProblemDialogVisible = true;
    },
    createProblem() {
      //TODO: row -> param
      if (this.ProblemModel.create) {
        ProblemService.addProblem().then();
      } else {
        ProblemService.modifyProblem().then();
      }
    },
    checkProblem(row) {
      //TODO: row -> param
      ProblemService.getProblemDetail(row).then((detail) => {
        if (detail == null) {
          ElMessage({
            message: "获取题目详情发生错误",
            type: "error",
          });
        } else {
          this.ProblemModel.title = detail.title;
          this.ProblemModel.content = detail.content;
          this.ProblemModel.type = detail.type;
          this.ProblemModel.options = detail.subproblem;
          this.ProblemModel.answer = detail.answer;
          this.ProblemModel.create = false;
          this.ProblemDialogVisible = true;
        }
      });
    },
    deleteProblem(row) {
      //TODO: row -> param
      ProblemService.deleteProblem(row).then();
    },
    handleDownload(row) {
      //TODO: row -> param
      BattleFileService.download().then();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
</style>
