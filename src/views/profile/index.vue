<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!--              <el-tab-pane label="Activity" name="activity">-->
              <!--                <activity />-->
              <!--              </el-tab-pane>-->
              <!--              <el-tab-pane label="Timeline" name="timeline">-->
              <!--                <timeline />-->
              <!--              </el-tab-pane>-->
              <!--              <el-tab-pane label="Account" name="account">-->
              <!--                <account :user="user" />-->
              <!--              </el-tab-pane>-->
              <el-tab-pane label="个人信息" name="accountinfo">
                <AccountInfo :info="info"/>
              </el-tab-pane>
              <el-tab-pane label="部门信息" name="departmentinfo">
                <DepartmentInfo :info="info"/>
              </el-tab-pane>
              <el-tab-pane label="账户信息" name="userinfo">
                <UserInfo :info="info"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import AccountInfo from './components/AccountInfo'
import DepartmentInfo from './components/DepartmentInfo'
import UserInfo from './components/UserInfo'
import { getSelf } from '@/api/user'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account, AccountInfo, DepartmentInfo, UserInfo },
  data() {
    return {
      user: {
        name: '',
        role: '',
        email: '',
        avatar: ''
      },
      activeTab: 'accountinfo',
      info: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getSelf()
    // this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    getSelf() {
      this.listLoading = false
      getSelf().then(response => {
        this.info = response.data

        this.user = {
          name: this.info.person.personName,
          role: this.info.status,
          email: 'admin@test.com',
          avatar: this.info.avatar
        }

        // console.log(info)
        // console.log(user)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
