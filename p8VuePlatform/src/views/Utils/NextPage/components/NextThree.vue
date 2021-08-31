<template>
  <div class="second-page">
    <el-row type="flex" justify="center" style="width:100%;">
      <el-col :span="10">
        <h2>The Fourth Page</h2>
        <el-form >
          <el-form-item label="some value from prev page">
            <el-input v-model="text" readonly ></el-input>
            <el-input v-model="text4"></el-input>
          </el-form-item>
          <el-form-item>
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
  name: 'NextThree',
  props: {
    text: String
  },
  data () {
    return {
      text4: ''
    }
  },
  mounted () {
  },
  methods: {

    back () {
      this.closeNextPage(this, this.text4)
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
