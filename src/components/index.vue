<template>
  <div class='minio-upload'>
    <el-upload
      ref='upload'
      v-model:file-list='fileList'
      :accept='accept'
      :show-file-list='false'
      :auto-upload='false'
      :on-change='handleChange'
      :on-exceed='handleExceed'
      :limit='limit'
      :multiple='multiple'
    >
      <template #trigger>
        <el-button type='primary'>
          {{ ct('uploadFile') }}
        </el-button>
      </template>
    </el-upload>
    <c-file-list v-if='fileList.length>0'>
      <template v-for='file in fileList' :key='file.uid'>
        <file-item
          :name='file.name'
          :progress='fileMap[file.uid]?.progress'
          :success='fileMap[file.uid]?.success'
          :error='fileMap[file.uid]?.error'
          :complete='fileMap[file.uid]?.complete'
          :download-url='fileMap[file.uid]?.downloadUrl'
          @remove='onRemove(file)' />
      </template>
    </c-file-list>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue';
import { ElMessage, genFileId, UploadFile, type UploadInstance, type UploadProps, type UploadRawFile } from 'element-plus';
import { useMinioUpload } from './use-minio-upload';
import CFileList from './file-list.vue';
import FileItem from './file-item.vue';
import { UploadService, UploadState } from '@/types';
import sizeLocale from '@/utils/size';
import { ct } from '@/locales';
import { useProvideLocal } from '@/locales';
import { DefaultUploadService } from '@/services/default-upload-service';

useProvideLocal();
const props = defineProps({
  exceedClear: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: undefined
  },
  maxSize: {
    type: Number,
    default: 0
  },
  service: {
    type: Object as PropType<UploadService>,
    default: undefined
  },
  uploadType: {
    type: String as PropType<'PUT'|'POST'>,
    default: 'POST'
  },
  url: {
    type: String,
    default: ''
  }
});

let uploadService = props.service!;

if (uploadService === undefined) {
  uploadService = new DefaultUploadService({ url: props.url });
}

const emit = defineEmits(['success', 'change']);

const fileList = ref<UploadFile[]>([]);
const fileMap = ref({});
const upload = ref<UploadInstance>();

console.log('aaa', ct('warning.type'));


const status = computed<UploadState>(() => fileList.value.reduce<UploadState>((acc, file) => {
  acc.success = acc.success && !!fileMap.value[file.uid]?.success;
  acc.complete = acc.complete && !!fileMap.value[file.uid]?.complete;
  return acc;
}, {
  success: true,
  complete: true 
}));

watch(() => status.value.success, (val) => {
  if (val === true) {
    emit('success', fileList.value.map(file => fileMap.value[file.uid]?.downloadUrl).filter(url => !!url));
  }
}, { deep: true });

watch(() => fileList.value.map(item => item.raw!.uid).join('_'), () => {
  emit('change', fileList.value.reduce((acc, item) => {
    acc[item.raw!.uid] = fileMap.value[item.raw!.uid];
    return acc;
  }, {}));
}, {
  deep: true,
  immediate: true
});

const handleExceed: UploadProps['onExceed'] = (files) => {
  if (props.exceedClear === true && props.limit === 1) {
    upload.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
  } else {
    // ElMessage.warning(`文件超出最大数量，只允许选择${props.limit}个文件`);
    ElMessage.warning(ct('warning.maxLimit', { limit: props.limit! }));
  }
};

const handleChange: UploadProps['onChange'] = (file) => {
  if (props.maxSize > 0 && file.size! > props.maxSize) {
    fileMap.value[file.raw!.uid] = {
      // error: new Error(`文件超出大小限制, 最大${sizeLocale(props.maxSize)}`),
      error: new Error(ct('warning.maxSize', { maxSize: sizeLocale(props.maxSize) })),
      success: ref(false),
      complete: ref(true)
    };
  } else if (props.accept && !props.accept.split(',').some(item => file.name.endsWith(item))) {
    fileMap.value[file.raw!.uid] = {
      // error: new Error('文件类型不符合要求'),
      error: new Error(ct('warning.type')),
      success: ref(false),
      complete: ref(true)
    };
  } else {
    fileMap.value[file.raw!.uid] = useMinioUpload(uploadService!, {
      file: file.raw,
      uploadType: props.uploadType 
    });
  }
};

const onRemove = (file: UploadFile) => {
  upload.value!.handleRemove(file);
  const { abort, complete } = fileMap.value[file.raw!.uid];
  if (complete === false) {
    abort();
  }
};

const getFileMap = () => fileList.value.reduce((acc, item) => {
  acc[item.raw!.uid] = fileMap.value[item.raw!.uid];
  return acc;
}, {});
const getStatus = () => status;

const clear = () => {
  fileList.value = [];
  fileMap.value = {};
};

defineExpose({
  getFileMap,
  getStatus,
  clear
});

</script>
