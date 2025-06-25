<template>
  <div class="tuzhi-management">
    <div class="action-bar">
      <el-input
        v-model="queryParams.tuzhimingcheng"
        placeholder="请输入图纸名称搜索"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getTuzhiList"
        @keyup.enter="getTuzhiList"
      />
      <el-button type="primary" @click="getTuzhiList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
    </div>

    <el-table :data="tuzhiList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="tuzhibianhao" label="图纸编号" />
      <el-table-column prop="tuzhimingcheng" label="图纸名称" />
      <el-table-column prop="tuzhizuozhe" label="图纸作者" />
      <el-table-column prop="chuangzuoriqi" label="创作日期" />
      <el-table-column prop="tuzhimiaoshu" label="图纸描述" />
      <el-table-column label="图纸文件">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.tuzhiurl || '[]')" :key="index">
            <span class="file-link" @click="downloadFile(file.url, file.name)">{{ file.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" />
      <el-table-column prop="writer" label="录入者" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleSelect(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getTuzhis } from '@/api/tuzhi/tuzhi'
import { Refresh } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const emits = defineEmits(['selectTuzhi']);

const baseUrl = 'http://127.0.0.1:8099'

// 引入用户store
const userStore = useUserStore()

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  tuzhimingcheng: ''
})

// 用户信息
const userInfo = computed(() => ({
  username: userStore.username || '未登录'
}))

// 图纸列表数据
const tuzhiList = ref([])
const total = ref(0)
const loading = ref(false)

// 表单验证规则
const rules = {}

// 获取图纸列表
const getTuzhiList = async () => {
  loading.value = true
  try {
    const res = await getTuzhis(queryParams)
    tuzhiList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取图纸列表失败', error)
    ElMessage.error('获取图纸列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getTuzhiList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getTuzhiList()
}

// 选择图纸
const handleSelect = (row) => {
  console.log('选中的图纸:', row)
  ElMessage.success(`已选择图纸: ${row.tuzhimingcheng}`)
  emits('selectTuzhi', row);
}

// 下载文件
const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
  }, 100)
}

const handleRefresh = () => {
  queryParams.tuzhimingcheng = ''
  queryParams.pageNumber = 1
  getTuzhiList()
}

// 页面初始化
onMounted(() => {
  getTuzhiList()
})
</script>

<style scoped>
.tuzhi-management {
  padding: 20px;
}
.action-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}
.file-link:hover {
  text-decoration: underline;
}
</style>