<template>
  <div>
    <minio-upload ref='uploadRef' :max-size='10*1024*1024' accept='.xlsx' />
  </div>
  <div>
    {{ status }}
  </div>
  <div>
    {{ fileMap }}
  </div>
  <div>
    <el-button @click='onPresignedGetObject'>
      presignedGetObject
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import MinioUpload, { presignedGetObject } from 'lc-vue-minio-upload';

const uploadRef = ref();

const status = ref({});
const fileMap = ref([]);

onMounted(() => {
  const _status = uploadRef.value.getStatus();
  watch(() => _status.value, () => {
    status.value = _status.value;
    fileMap.value = uploadRef.value.getFileMap();
  }, {
    deep: true,
    immediate: true
  });
});

const onPresignedGetObject = async () => {
  const res = await presignedGetObject('aaa/bbb');
  console.log(res);
  
};

</script>

<style scoped>

</style>