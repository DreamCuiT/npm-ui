<template>
  <div class="second-page">
    <el-row type="flex" justify="center" style="width:100%;">
      <el-col :span="10">
        <h2>The Second Page</h2>
        <el-form >
          <el-form-item label="some value from prev page">
            <el-input v-model="text" readonly ></el-input>
            <el-input v-model="text2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showNext">Click To Show Next Page</el-button>
            <el-button @click="back">Back to Prev</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Form, FormItem, Input, Button, Row, Col } from '~/index'
import NextTwo from './NextTwo'

export default {
  name: 'NextOne',
  props: {
    text: String
  },
  data () {
    return {
      text2: ''
    }
  },
  methods: {
    showNext () {
      this.$nextPage({
        title: '第三页',
        props: {
          text: this.text2,
          abc: '123'
        },
        beforeClose: (comp, params) => {
          console.log(comp)
          console.log(params)
        },
        cache: true,
        component: NextTwo
      })
    },
    back () {
      this.closeNextPage(this, this.text2)
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
