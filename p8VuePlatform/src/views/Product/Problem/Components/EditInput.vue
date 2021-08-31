<template>
  <div class="edit-input-cell">
    <div v-if="visibility" class="text"><span>{{modelText}}</span></div>
    <el-input v-model="modelText" v-if="!visibility" @change="onchangeHandle">
      <template #suffix>
        <i class="el-icon-check" @click="onchangeHandle"></i>
      </template>
    </el-input>
    <div class="icon-con" v-if="iconShow">
      <i class="el-icon-edit" @click="onEditCell"></i>
      <el-popconfirm
        title="确定要删除?"
        confirmButtonText="好"
        cancelButtonText="取消"
        @onConfirm="onDeleteCell">
        <i class="el-icon-delete" slot="reference"></i>
      </el-popconfirm>
    </div>
  </div>
</template>
<script>
import { Input, Popconfirm } from '~/index'
export default {
  name: 'EditInputView',
  props: {
    textValue: {
      type: String
    },
    record: {
      type: Object
    },
    iconShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visibility: true,
      modelText: ''
    }
  },
  watch: {
    textValue: {
      handler (newValue) {
        this.modelText = newValue
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  },
  methods: {
    onEditCell () {
      this.visibility = !this.visibility
    },
    onDeleteCell () {
      this.$emit('delete')
    },
    onchangeHandle () {
      this.visibility = !this.visibility
      this.$emit('onChange', this.modelText, this.record)
    }
  },
  components: {
    'el-input': Input,
    'el-popconfirm': Popconfirm
  }
}
</script>
<style lang="scss">
  .edit-input-cell {
    width: 90%;
    padding: 0 2px;
    display: flex;
    align-items: center;
    div.text {
      flex: 1
    }
    .el-input {
      flex: 1;
      input {
        height: 28px;
        line-height: 28px;
      }
      .el-input__suffix {
        line-height: 28px;
      }
    }
    .icon-con {
      i {
        color: #46a6ff !important;
      }
    }
  }
</style>
