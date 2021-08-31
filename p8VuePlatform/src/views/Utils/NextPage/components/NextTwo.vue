<template>
  <div class="second-page">
    <el-row type="flex" justify="center" style="width:100%;">
      <el-col :span="10">
        <h2>The Third Page</h2>
        <el-form >
          <el-form-item label="some value from prev page">
            <el-input v-model="text" readonly ></el-input>
            <el-input v-model="text3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="next">最后一页</el-button>
            <el-button @click="back">Back to Prev</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Form, FormItem, Input, Button, Row, Col } from '~/index'
export default {
  name: 'NextTwo',
  props: {
    text: String,
    abc: String
  },
  data () {
    return {
      text3: ''
    }
  },
  mounted () {
  },
  methods: {
    next () {
      this.$nextPage({
        title: '第四页',
        props: {
          text: this.text3
        },
        component: () => import('./NextThree.vue')
      })
    },
    back () {
      this.closeNextPage(this, this.text3)
    }
  },
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
    'el-row': Row,
    'el-col': Col
  }
}
</script>
<style>
.second-page {
    padding:100px;
}
.clear {
    margin: 40px 0;
}
</style>
