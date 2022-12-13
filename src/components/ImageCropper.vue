<script setup>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
</script>

<template>
  <div id="cropper" class="fade-in">
    <div class="cropper-block fade-in">
      <input
        id="file-browser"
        ref="input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      />
      <div class="cropper-wrapper">
        <VueCropper ref="cropper" :aspectRatio="1" :src="imgSrc" />
      </div>
      <div>
        <el-button @click="browseFile" type="info">上传图片</el-button>
        <el-button @click="cropAvatar" type="primary">确定</el-button>
        <el-button @click="cancel" type="danger">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imgSrc: "",
    };
  },
  watch: {
    src: {
      handler() {
        this.imgSrc = this.src;
        // this.$refs.cropper.replace(this.imgSrc);
      },
      immediate: true,
    },
  },
  emits: ["submit", "cancel"],
  methods: {
    cropAvatar() {
      this.$emit("submit", this.$refs.cropper.getCroppedCanvas().toDataURL());
    },
    browseFile() {
      this.$refs.input.click();
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          this.$refs.cropper.replace(this.imgSrc);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
#cropper {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cropper-block {
  width: 300px;
  padding: 2em;
  color: #21202e;
  background-color: white;
  /* border: #21202e 3px solid; */
  /* border-radius: 10px; */
  box-shadow: 0px 0px 20px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

#file-browser {
  display: none;
}

.cropper-wrapper {
  height: 300px;
  width: 300px;
}
</style>
