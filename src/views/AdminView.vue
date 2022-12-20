<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
import Pagination from "@/components/Pagination.vue";
import InfoService from "@/services/info.service";
import ProblemService from "@/services/problem.service";
import RecordService from "@/services/record.service";
import { ref } from "vue";
import {
  Edit,
  Refresh,
  Delete,
  Download,
  Plus,
  Minus,
} from "@element-plus/icons-vue";
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
                      v-loading="listLoading"
                      ref="infoRef"
                      :data="infoList"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column type="selection" width="55" />
                      <el-table-column
                        label="序号"
                        prop="id"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{
                            (listQuery.page - 1) * listQuery.limit + $index + 1
                          }}</span>
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
                        label="标题"
                        width="200px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span class="link-type">{{ row.title }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="来源"
                        width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.source }}</span>
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
                      v-show="infoTotal > 0"
                      :total="infoTotal"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateList"
                    />

                    <el-dialog
                      title="资讯"
                      v-model="InfoDialogVisible"
                      :append-to-body="true"
                    >
                      <el-form
                        ref="dataForm"
                        :model="InfoModel"
                        :rules="InfoRules"
                        label-position="left"
                        label-width="80px"
                        style="margin-left: 50px; margin-right: 50px"
                      >
                        <el-form-item label="标题" prop="title">
                          <el-input
                            v-model="InfoModel.title"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="来源" prop="source">
                          <el-input
                            v-model="InfoModel.source"
                            class="filter-item"
                          />
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                          <el-input
                            v-model="InfoModel.content"
                            :autosize="{ minRows: 6, maxRows: 10 }"
                            type="textarea"
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
                      v-loading="listLoading"
                      ref="problemRef"
                      :data="problemList"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column type="selection" width="55" />
                      <el-table-column
                        label="序号"
                        prop="id"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{
                            (listQuery.page - 1) * listQuery.limit + $index + 1
                          }}</span>
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
                      <el-table-column label="标题" width="200px">
                        <template v-slot="{ row }">
                          <span class="link-type">{{ row.title }}</span>
                          <el-tag v-if="row.type === 0">单选题</el-tag>
                          <el-tag v-else-if="row.type === 1">一般多选题</el-tag>
                          <el-tag v-else-if="row.type === 2">程序多选题</el-tag>
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
                      v-show="problemTotal > 0"
                      :total="problemTotal"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateList"
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
                        label-width="80px"
                        style="margin-left: 50px; margin-right: 50px"
                      >
                        <el-form-item label="题目类型" prop="type">
                          <el-select
                            v-model="ProblemModel.classification"
                            style="width: 140px"
                            class="filter-item"
                          >
                            <el-option :key="0" :label="'单选题'" :value="0" />
                            <el-option
                              :key="1"
                              :label="'一般多选题'"
                              :value="1"
                            />
                            <el-option
                              :key="2"
                              :label="'程序多选题'"
                              :value="2"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="创建者" prop="owner">
                          <el-input
                            v-model="ProblemModel.owner"
                            style="width: 140px"
                            class="filter-item"
                            disabled
                          />
                        </el-form-item>
                        <el-form-item label="题目" prop="content">
                          <el-input
                            v-model="ProblemModel.content"
                            :autosize="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            class="filter-item"
                          />
                        </el-form-item>
                        <div v-if="ProblemModel.classification === 0">
                          <el-form-item label="选项A" prop="choice">
                            <el-input
                              v-model="ProblemModel.subproblem[0].choice[0]"
                              class="filter-item"
                            />
                          </el-form-item>
                          <el-form-item label="选项B" prop="choice">
                            <el-input
                              v-model="ProblemModel.subproblem[0].choice[1]"
                              class="filter-item"
                            />
                          </el-form-item>
                          <el-form-item label="选项C" prop="choice">
                            <el-input
                              v-model="ProblemModel.subproblem[0].choice[2]"
                              class="filter-item"
                            />
                          </el-form-item>
                          <el-form-item label="选项D" prop="choice">
                            <el-input
                              v-model="ProblemModel.subproblem[0].choice[3]"
                              class="filter-item"
                            />
                          </el-form-item>
                          <el-form-item label="答案" prop="answer">
                            <el-radio-group
                              v-model="ProblemModel.answer[0]"
                              size="large"
                            >
                              <el-radio-button label="A" />
                              <el-radio-button label="B" />
                              <el-radio-button label="C" />
                              <el-radio-button label="D" />
                            </el-radio-group>
                          </el-form-item>
                        </div>
                        <el-form-item
                          label="代码"
                          v-if="ProblemModel.classification === 2"
                          prop="code"
                        >
                          <el-input
                            v-model="ProblemModel.code"
                            :autosize="{ minRows: 3, maxRows: 10 }"
                            type="textarea"
                            class="filter-item"
                          />
                        </el-form-item>
                        <div v-if="ProblemModel.classification > 0">
                          <div v-for="(sp, index) in ProblemModel.subproblem">
                            <el-form-item label="子问题">
                              <el-input
                                v-model="sp.content"
                                :autosize="{ minRows: 3, maxRows: 5 }"
                                type="textarea"
                                class="filter-item"
                                prop="content"
                              />
                            </el-form-item>
                            <el-form-item label="选项A" prop="choice">
                              <el-input
                                v-model="sp.choice[0]"
                                class="filter-item"
                              />
                            </el-form-item>
                            <el-form-item label="选项B" prop="choice">
                              <el-input
                                v-model="sp.choice[1]"
                                class="filter-item"
                              />
                            </el-form-item>
                            <el-form-item label="选项C" prop="choice">
                              <el-input
                                v-model="sp.choice[2]"
                                class="filter-item"
                              />
                            </el-form-item>
                            <el-form-item label="选项D" prop="choice">
                              <el-input
                                v-model="sp.choice[3]"
                                class="filter-item"
                              />
                            </el-form-item>
                            <el-form-item label="答案" prop="answer">
                              <el-radio-group
                                v-model="ProblemModel.answer[index]"
                              >
                                <el-radio-button label="A" />
                                <el-radio-button label="B" />
                                <el-radio-button label="C" />
                                <el-radio-button label="D" />
                              </el-radio-group>
                            </el-form-item>
                          </div>
                          <el-form-item :inline="true">
                            <el-button
                              type="primary"
                              :icon="Plus"
                              circle
                              @click="addSubproblem"
                            />
                            <el-button
                              type="primary"
                              :icon="Minus"
                              circle
                              @click="removeSubproblem"
                            />
                          </el-form-item>
                        </div>
                        <el-form-item label="解析" prop="explanation">
                          <el-input
                            v-model="ProblemModel.explanation"
                            :autosize="{ minRows: 6, maxRows: 10 }"
                            type="textarea"
                            class="filter-item"
                          />
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
                <el-tab-pane label="对战记录" name="record">
                  <div class="app-container">
                    <div class="filter-container">
                      <el-button
                        class="filter-item"
                        type="primary"
                        size="small"
                        :icon="Download"
                        @click="handleDownload({ id: undefined })"
                      >
                        下载全部 </el-button
                      ><el-button
                        class="filter-item"
                        style="margin-left: 15px"
                        type="third"
                        :icon="Refresh"
                        size="small"
                        @click="updateList"
                      >
                        刷新
                      </el-button>
                    </div>

                    <el-table
                      v-loading="listLoading"
                      :data="recordList"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%"
                    >
                      <el-table-column
                        label="序号"
                        prop="id"
                        align="center"
                        width="80"
                      >
                        <template v-slot="{ $index }">
                          <span>{{
                            (listQuery.page - 1) * listQuery.limit + $index + 1
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="比赛时间"
                        width="200px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <span>{{ row.date }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="排名"
                        min-width="150px"
                        align="center"
                      >
                        <template v-slot="{ row }">
                          <el-tag v-for="player in row.rank">{{
                            player
                          }}</el-tag>
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
                      v-show="recordTotal > 0"
                      :total="recordTotal"
                      v-model:page="listQuery.page"
                      v-model:limit="listQuery.limit"
                      @pagination="updateList"
                    />
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div ref="codeEditBox"></div>
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
    var validateCode = (rule, value, callback) => {
      var pattern = /^~~~.+~~~$/;
      if (!value.match(pattern)) {
        callback(new Error("请输入markdown格式代码块"));
      } else {
        callback();
      }
    };
    return {
      activeName: ref("info"),
      infoList: [],
      problemList: [],
      recordList: [],
      multiSelection: [],
      listLoading: false,
      infoTotal: 1,
      problemTotal: 1,
      recordTotal: 1,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
      },
      InfoModel: {
        title: "",
        content: "",
        source: "",
        id: 0,
        create: false,
      },
      InfoRules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "资讯内容不能为空",
            trigger: "blur",
          },
        ],
      },
      ProblemModel: {
        id: 0,
        content: "",
        answer: ["A"],
        subproblem: [{ content: "", choice: "" }],
        source: "",
        difficultyInt: 1,
        classification: 2, //
        code: "",
      },
      ProblemRules: {
        content: [
          {
            required: true,
            message: "题目内容不能为空",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "",
            trigger: "change",
          },
        ],
        answer: [
          {
            type: "array",
            required: true,
            message: "请输入正确答案",
            trigger: "change",
          },
        ],
        choice: [
          {
            required: true,
            message: "选项不能为空",
            trigger: "change",
          },
        ],
        code: [
          {
            validator: validateCode,
            trigger: "blur",
          },
        ],
      },
      InfoDialogVisible: false,
      ProblemDialogVisible: false,
    };
  },
  created() {
    InfoService.getNewsCount().then((count) => {
      this.infoTotal = count;
    });
    ProblemService.getProblemCount().then((count) => {
      this.problemTotal = count;
    });
    RecordService.getRecordCount().then((count) => {
      this.recordTotal = count;
    });
    InfoService.getNewsList(this.listQuery.page, this.listQuery.limit).then(
      (data) => {
        this.infoList = data;
      }
    );
    ProblemService.getProblemList(
      this.listQuery.page,
      this.listQuery.limit
    ).then((data) => {
      this.problemList = data;
    });
    RecordService.getRecordList(this.listQuery.page, this.listQuery.limit).then(
      (data) => {
        this.recordList = data;
      }
    );
  },
  methods: {
    updateList() {
      this.listLoading = true;
      switch (this.activeName) {
        case "info":
          InfoService.getNewsCount().then((count) => {
            this.infoTotal = count;
          });
          InfoService.getNewsList(
            this.listQuery.page,
            this.listQuery.limit
          ).then((data) => {
            this.infoList = data;
          });

          break;
        case "problem":
          ProblemService.getProblemCount().then((count) => {
            this.problemTotal = count;
          });
          ProblemService.getProblemList(
            this.listQuery.page,
            this.listQuery.limit
          ).then((data) => {
            this.problemList = data;
          });

          break;
        case "record":
          RecordService.getRecordCount().then((count) => {
            this.recordTotal = count;
          });
          RecordService.getRecordList(
            this.listQuery.page,
            this.listQuery.limit
          ).then((data) => {
            this.recordList = data;
          });
          break;
        default:
          break;
      }
      this.listLoading = false;
    },
    handleSelectionChange(val) {
      this.multiSelection = val;
      console.log(val);
    },
    handleBatchDelete() {
      ElMessageBox.alert("您确定要删除所选项目吗？该操作不可恢复！", "警告", {
        cancelButtonText: "Cancel",
        confirmButtonText: "OK",
        callback: () => {
          var removeList = [];
          for (const el of this.multiSelection) {
            removeList.push(el.id);
          }
          if (removeList.length == 0) return;
          switch (this.activeName) {
            case "info":
              InfoService.deleteNews(removeList).then(
                () => {
                  ElMessage({
                    message: "批量删除成功",
                    type: "success",
                  });
                  this.updateList();
                },
                (error) => {
                  ElMessage({
                    message: "批量删除失败",
                    type: "error",
                  });
                  console.log(error);
                }
              );
              break;
            case "problem":
              ProblemService.deleteProblem(removeList).then(
                () => {
                  ElMessage({
                    message: "批量删除成功",
                    type: "success",
                  });
                  this.updateList();
                },
                (error) => {
                  ElMessage({
                    message: "批量删除失败",
                    type: "error",
                  });
                  console.log(error);
                }
              );
              break;
            default:
              break;
          }
        },
      });
    },
    addInfo() {
      this.InfoModel = {
        title: "",
        content: "",
        top: false,
        rules: [],
        create: true,
      };
      this.InfoDialogVisible = true;
    },
    createInfo() {
      if (this.InfoModel.create) {
        InfoService.addNews(
          this.InfoModel.title,
          this.InfoModel.content,
          this.InfoModel.source
        ).then(
          () => {
            ElMessage({
              message: "添加资讯成功",
              type: "success",
            });
            this.updateList();
          },
          (error) => {
            ElMessage({
              message: "添加失败",
              type: "error",
            });
            console.log(error);
          }
        );
      } else {
        InfoService.modifyNews({
          id: this.InfoModel.id,
          title: this.InfoModel.title,
          content: this.InfoModel.content,
          source: this.InfoModel.source,
        }).then(
          () => {
            ElMessage({
              message: "修改资讯成功",
              type: "success",
            });
            this.updateList();
          },
          (error) => {
            ElMessage({
              message: "修改资讯失败",
              type: "error",
            });
            console.log(error);
          }
        );
      }
      this.InfoDialogVisible = false;
    },
    checkInfo(row) {
      InfoService.getNewsDetail(row.id).then((detail) => {
        if (detail == null) {
          ElMessage({
            message: "获取资讯详情发生错误",
            type: "error",
          });
        } else {
          this.InfoModel.title = detail.title;
          this.InfoModel.content = detail.content;
          this.InfoModel.source = detail.source;
          this.InfoModel.id = detail.id;
          this.InfoModel.create = false;
          this.InfoDialogVisible = true;
        }
      });
    },
    deleteInfo(row) {
      InfoService.deleteNews([row.id]).then(
        () => {
          ElMessage({
            message: "成功删除",
            type: "success",
          });
          this.updateList();
        },
        (error) => {
          ElMessage({
            message: "删除失败",
            type: "error",
          });
          console.log(error);
        }
      );
    },
    addProblem() {
      this.ProblemModel = {
        id: 0,
        content: "",
        answer: ["A"],
        subproblem: [{ content: "", choice: ["", "", "", ""] }],
        source: "",
        difficultyInt: 1,
        classification: 1, //
        explanation: "",
        code: "",
      };
      this.create = true;
      this.ProblemDialogVisible = true;
    },
    createProblem() {
      var problem = this.ProblemModel;
      if (this.create) {
        ProblemService.addProblem(problem).then(
          () => {
            ElMessage({
              message: "成功创建题目",
              type: "success",
            });
            this.updateList();
          },
          (error) => {
            ElMessage({
              message: "添加失败",
              type: "error",
            });
            console.error(error);
          }
        );
      } else {
        ProblemService.modifyProblem(problem).then(
          () => {
            ElMessage({
              message: "成功修改题目",
              type: "success",
            });
            this.updateList();
          },
          (error) => {
            ElMessage({
              message: "修改失败",
              type: "error",
            });
            console.log(error);
          }
        );
      }
      this.ProblemDialogVisible = false;
    },
    checkProblem(row) {
      ProblemService.getProblemDetail(row.id).then((detail) => {
        if (detail == null) {
          ElMessage({
            message: "获取题目详情发生错误",
            type: "error",
          });
        } else {
          this.ProblemModel = detail;
          this.create = false;
          this.type = row.type;
          this.ProblemDialogVisible = true;
        }
      });
    },
    deleteProblem(row) {
      ProblemService.deleteProblem(row.id).then(
        () => {
          ElMessage({
            message: "成功删除",
            type: "success",
          });
          this.updateList();
        },
        (error) => {
          ElMessage({
            message: "删除失败",
            type: "error",
          });
          console.log(error);
        }
      );
    },
    addSubproblem() {
      this.ProblemModel.subproblem.push({
        content: "",
        choice: ["", "", "", ""],
      });
      this.ProblemModel.answer.push("");
    },
    removeSubproblem() {
      this.ProblemModel.subproblem.pop();
      this.ProblemModel.answer.pop();
    },
    handleDownload(row) {
      RecordService.getRecordFile(row.id).then((url) => {
        console.log(url);
        window.open(url);
        ElMessage({
          message: "开始下载",
          type: "success",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
</style>
