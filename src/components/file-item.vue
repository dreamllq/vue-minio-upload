<template>
  <div class='minio-file-item'>
    <div class='minio-file-item__info'>
      <div class='minio-file-item__name'>
        <i class='el-icon-document' />
        <span class='minio-file-item__file-name' :class='{complete: complete}'>
          <el-button
            v-if='complete && success'
            type='primary'
            link
            @click='onDownload'>
            {{ name }}
          </el-button>
          <span v-else>
            {{ name }}
          </span>
        </span>
      </div>
      <div class='minio-file-item__progress'>
        <el-progress v-if='complete === false' :percentage='percentage' />
      </div>
      <div class='minio-file-item__status'>
        <i v-if='complete === false' class='el-icon-loading' />
        <i v-else-if='success' class='el-icon-circle-check' />
        <el-tooltip
          v-else-if='error'
          :content='error.message'
          placement='top'
          effect='light'>
          <el-icon><warning /></el-icon>
        </el-tooltip>
        <el-icon class='el-icon-circle-close' @click='onRemove'>
          <circle-close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import download from '@/utils/download';
import { Warning, CircleClose } from '@element-plus/icons-vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  success: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: () => ({})
  },
  complete: {
    type: Boolean,
    default: false
  },
  downloadUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['remove']);

const percentage = computed(() => Math.floor(props.progress * 100));

const onDownload = () => {
  // window.open(props.downloadUrl, '_blank');
  download(props.downloadUrl, props.name);
};

const onRemove = () => {
  emit('remove');
};
</script>

<style scoped lang="scss">
.minio-file-item {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 5px;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  .minio-file-item__info {
    display: inline-flex;
    justify-content: center;
    width: calc(100% - 30px);
    margin-left: 4px;
    align-items: center;

    .minio-file-item__name {
      color: var(--el-text-color-regular);
      display: inline-flex;
      text-align: center;
      align-items: center;
      padding: 0 4px;
      transition: color var(--el-transition-duration);
      font-size: var(--el-font-size-base);

      .minio-file-item__file-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 8px;
        width: 200px;

        &.complete {
          width: auto;
        }
      }
    }

    .minio-file-item__progress {
      flex: 1;
      padding: 0 8px;
    }

    .minio-file-item__status {
      .el-icon-circle-close {
        cursor: pointer;
        margin-left: 8px;
      }
    }
  }
}
</style>