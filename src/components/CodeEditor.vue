<script setup>
import { getCurrentInstance, onMounted } from "vue";
import * as monaco from "monaco-editor";
</script>

<template>
  <div ref="editor"></div>
</template>

<script>
export default {
  name: "CodeEditor",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup() {
    onMounted(() => {
      const self = this;
      console.log("done");
      const instance = getCurrentInstance();
      self.monacoEditor = monaco.editor.create(instance?.refs.editor, {
        value: "", //编辑器初始显示文字
        language: "python", //此处使用的python，其他语言支持自行查阅demo
        theme: "vs-dark", //官方自带三种主题vs, hc-black, or vs-dark
        selectOnLineNumbers: true, //显示行号
        roundedSelection: false,
        readOnly: false, // 只读
        cursorStyle: "line", //光标样式
        automaticLayout: true, //自动布局
        glyphMargin: true, //字形边缘
        useTabStops: false,
        fontSize: 15, //字体大小
        autoIndent: true, //自动布局
        quickSuggestionsDelay: 100, //代码提示延时
      });
      self.monacoEditor.onDidChangeModelContent(() => {
        self.content = self.monacoEditor.getValue();
      });
    });
  },
};
</script>

<style lang="scss" scoped>
$dropdown-height: 42px;
</style>
