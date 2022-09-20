<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="treeJson"
          show-checkbox
          node-key="name"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :render-content="renderContent"
          ref="tree">
        </el-tree>
      </div>
    </div>

  </div>
</template>

<script>


import { getDictionary, tableTree } from '@/api/datasource'

export default {
  name: 'tableTree',
  data() {
    return {

      filterText: '',
      treeJson: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {

    getData() {
      var vm = this
      tableTree().then(response => {
        vm.treeJson = response.data.data
      })
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={() => this.remove(node, data)}> Delete</el-button>
            </span>
          </span>)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    push() {
      this.$router.push('/tablerela/' + this.table1_id + '/' + this.table2_id)
    }

  }

}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
