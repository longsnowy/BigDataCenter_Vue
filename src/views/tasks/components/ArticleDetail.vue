<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!--        <CommentDropdown v-model="postForm.comment_disabled"/>-->
        <!--        <PlatformDropdown v-model="postForm.platforms"/>-->
        <!--        <SourceUrlDropdown v-model="postForm.source_uri"/>-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
<!--        <el-button v-loading="loading" type="warning" @click="draftForm">-->
<!--          结束-->
<!--        </el-button>-->
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning/>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="taskName">
              <MDinput v-model="postForm.taskName" :maxlength="100" name="name" required>
                任务名称/代号
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="80px" label="发布人:" class="postInfo-container-item">
                    <el-select v-model="postForm.sender" :remote-method="getRemoteUserList" filterable
                               default-first-option remote placeholder="选择发布人(可搜索)">
                      <el-option v-for="item in userListOptions" :key="item.personID" :label="item.personName"
                                 :value="item.personID"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="80px" label="执行人:" class="postInfo-container-item">
                    <el-select v-model="postForm.recipients" :remote-method="getRemoteUserList" filterable
                               default-first-option remote multiple placeholder="选择执行人(可搜索)">
                      <el-option v-for="item in userListOptions" :key="item.personID" :label="item.personName"
                                 :value="item.personID"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="80px" label="开始时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.beginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择任务开始时间"/>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px" label="结束时间:" class="postInfo-container-item"
                                style="margin-left: -100px">
                    <el-date-picker v-model="postForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择任务结束时间"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="80px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="5"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <!--        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="概要:">-->
        <!--          <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize-->
        <!--                    placeholder="请简述任务内容"/>-->
        <!--          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item style="margin-bottom: -5px; margin-top: -20px" label-width="80px" label="任务详情:"></el-form-item>-->

        <el-form-item prop="text" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.text" :height="400"/>
        </el-form-item>

        <!--        <el-form-item prop="image_uri" style="margin-bottom: 30px;">-->
        <!--          <Upload v-model="postForm.image_uri"/>-->
        <!--        </el-form-item>-->
      </div>

    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { createTask,fetchTask,deleteTaskById } from '@/api/task-admin'
import { fetchList } from '@/api/user-admin'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { addPerson } from '@/api/user-admin'

const defaultForm_old = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}
const defaultForm = {
  id: undefined,
  taskName: '',
  sender: '',
  text: '',
  beginTime: '',
  endTime: '',
  recipients: [],
  importance: 0,
  status: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: {
        id: undefined,
        taskName: '',
        sender: '',
        text: '',
        beginTime: '',
        endTime: '',
        recipients: [],
        importance: 0,
        status: 1
      },
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        text: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      listQuery: {
        name: '',
        sex: '',
        department: '',
        page: 1,
        num: 20
      },
      id:undefined
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    this.getRemoteUserList()
  },
  methods: {
    fetchData(id) {
      this.id = id;
      // console.log(this.id)
      fetchTask(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`


        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑任务'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑任务'
      document.title = `${title} - ${this.postForm.id}`
    },
    addTask() {

    },
    submitForm() {
      // console.log(this.postForm)
      var vm = this
      this.$refs.postForm.validate(valid => {
        if (valid) {

          deleteTaskById(this.id).then(response => {
            if (response.code!=20000){
              vm.$notify({
                title: '成功',
                message: '重新发布不成功',
                type: 'success',
                duration: 2000
              })
              return
            }
            vm.loading = false
          })

          createTask(this.postForm).then(() => {
            vm.$notify({
              title: '成功',
              message: '发布任务成功',
              type: 'success',
              duration: 2000
            })
            vm.loading = false
          })

          // this.postForm.status = 'published'
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.text.length === 0 || this.postForm.taskName.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      // this.postForm.status = 'draft'
    },
    getRemoteUserList(name) {
      this.listQuery.name = name
      fetchList(this.listQuery).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items
        // .map(v => v.personName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
