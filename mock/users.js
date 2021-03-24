const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    name: '@cname',
    'sex|1':['男','女'],
    'id|10000000000000000-50000000000000000':341623200009064450,
    'politic|1':['党员','群众'],
    'status|1':['股所所长','副局长','干事'],
    'speciality|1':['数据分析','团队交流'],
    'department|1':['办公室','股所','市政','市容','环卫'],
    'score|0-100.0-100':88
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/users/list',
    type: 'get',
    response: config => {
      const { name, sex, department, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
         if (name && item.name.indexOf(name) < 0) return false
         if (sex && item.sex.indexOf(sex) < 0) return false
         if (department && item.department.indexOf(department) < 0) return false
        return true
      })

      if (sort === '-score') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/users/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/users/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/users/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/users/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

