<template>
  <div class="purchase-plan-management">
    <!-- 操作栏：搜索 + 新增按钮 -->
    <div class="action-bar">
      <el-input
        v-model="query.purchaseOrderNo"
        placeholder="请输入采购计划编号搜索"
        style="width: 220px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="openAdd()">
        新增采购计划
      </el-button>
    </div>

    <!-- 采购计划列表 -->
    <el-table 
      :data="tableData" 
      border 
      v-loading="loading" 
      stripe
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.status === 10 ? 'info' : row.status === 20 ? 'warning' : 'success'"
          >
            {{ 
              row.status === 10 ? '草稿' : 
              row.status === 20 ? '确认' : '完成' 
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseOrderNo" label="采购计划编号" width="180" show-overflow-tooltip />
      <el-table-column prop="orderName" label="采购计划名称" width="220" show-overflow-tooltip />
      <el-table-column prop="writer" label="制单人" width="120" />

      <el-table-column prop="memo" label="备注" show-overflow-tooltip />
    <el-table-column prop="createTime" label="创建时间" width="200" />

      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status == 10" type="primary" size="small" @click="openEdit(row)" style="margin-right: 5px;">编辑</el-button>
          <el-button v-if="row.status == 10" type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button v-if="row.status == 10" type="success" size="small" @click="updateStatus(row,20)">确认</el-button>
          <el-button v-if="row.status == 20" type="warning" size="small" @click="updateStatus(row,10)">撤回确认</el-button>
          <el-button v-if="row.status == 20" type="success" size="small" @click="updateStatus(row,30)">制定完成</el-button>
          <el-button v-if="row.status == 30 || row.status == 20" type="primary" size="small" @click="openReadonlyForm(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination" v-if="totalRow > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRow"
      />
    </div>

    <!-- 新增采购计划弹窗 -->
    <AddDialog
    v-model="showAdd"
    :newCode="newCode"
    @update:visible="showAdd = $event"
    @success="getList"
    />
    <!-- 编辑采购计划弹窗 -->
    <EditDialog v-model="showEdit" :order-info="selectedForm" @success="getList" @update:visible="showEdit = $event" />
    <readonlyForm v-model="showReadonlyForm" :order-info="selectedForm" @update:visible="showReadonlyForm = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPurchaseOrderPage,deletePurchaseOrderByOrderNo,updatePurchaseOrderStatus } from '@/api/plmanage/plpurchaseorder'
import { Refresh } from '@element-plus/icons-vue'
import readonlyForm from './readonlyForm.vue'
import { getNewNoNyName } from '@/api/system/basno'
	

// 引入弹窗组件（需自行创建 add.vue 和 edit.vue）
import AddDialog from './addForm.vue'
import EditDialog from './editForm.vue'

// 查询参数
const query = reactive({
  purchaseOrderNo: '', // 采购计划编号
})

// 分页相关
const pageNumber = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const totalRow = ref(0) // 总记录数

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 弹窗相关
const showAdd = ref(false)
const showEdit = ref(false)
const selectedForm = ref(null)
const newCode = ref('')
const showReadonlyForm = ref(false)


const openReadonlyForm = (row) => {
  selectedForm.value = row
  showReadonlyForm.value = true
}
	
	// 生成采购计划编码
	const generateScheduleCode = async () => {
	  try {
	    const res = await getNewNoNyName('cgjh');
	    
	    if (res?.code === 200) {
	      console.log("获取编码成功", res.data.fullNoNyName);
	      return res.data.fullNoNyName;
	    }
	    
	    ElMessage.error(res?.msg || '获取编码失败');
	    return '';
	    
	  } catch (error) {
	    console.error('生成采购计划编码出错:', error);
	    ElMessage.error('请求编码服务时发生错误');
	    return '';
	  }
};
/**
 * 获取采购计划列表
 */
const getList = async () => {
  loading.value = true
  try {
    // 构造请求参数（包含分页和查询条件）
    const params = {
      purchaseOrderNo: query.purchaseOrderNo,
      pageNumber: pageNumber.value,
      pageSize: pageSize.value
    }
    
    const res = await getPurchaseOrderPage(params)
    
    if (res.success && res.data?.page) {
      const pageData = res.data.page
      tableData.value = pageData.list || []
      totalRow.value = pageData.totalRow || 0
      pageNumber.value = pageData.pageNumber || 1
      pageSize.value = pageData.pageSize || 10
    } else {
      ElMessage.warning('获取数据失败')
      tableData.value = []
      totalRow.value = 0
    }
  } catch (err) {
    console.error('获取采购计划列表失败：', err)
    ElMessage.error('加载失败，请重试')
    tableData.value = []
    totalRow.value = 0
  } finally {
    loading.value = false
  }
}

/**
 * 更新采购计划状态10是草稿，20是确认，30是制定完成不可更改
 * 先询问是否更新状态
 */
const updateStatus = async (row,status) => {
  try {
    ElMessageBox.confirm(
      `确认更新采购计划【${row.purchaseOrderNo}】的状态吗？`,
      '更新确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        showClose: false,
      }
    ).then(() => {
      // 确定按钮点击事件
      updatePurchaseOrderStatus({id:row.id,status}).then(() => {
        ElMessage.success('更新成功')
        getList()
      }).catch(() => {
        ElMessage.warning('更新失败')
      })
    })
  } catch (err) {
    console.error('更新采购计划状态失败：', err)
  }
}

/**
 * 刷新列表
 */
const handleRefresh = () => {
  // 重置查询条件和分页
  query.purchaseOrderNo = ''
  pageNumber.value = 1
  pageSize.value = 10
  getList()
}

/**
 * 每页条数改变
 */
const handleSizeChange = (val) => {
  pageSize.value = val
  pageNumber.value = 1 // 重置为第一页
  getList()
}

/**
 * 当前页码改变
 */
const handleCurrentChange = (val) => {
  pageNumber.value = val
  getList()
}

/**
 * 删除采购计划
 */
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除采购计划【${row.purchaseOrderNo} - ${row.orderName}】吗？这会清空已关联的备料列表`,
    '删除确认',
    {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    try {
      // 这里需要替换为实际的删除接口（请根据项目接口调整）
      await deletePurchaseOrderByOrderNo({ purchaseOrderNo: row.purchaseOrderNo })
      ElMessage.success('删除成功')
      getList() // 重新加载列表
    } catch (err) {
      console.error('删除采购计划失败：', err)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    // 取消删除
  })
}

/**
 * 打开编辑弹窗
 */
const openEdit = (row) => {
  // 深拷贝行数据，避免修改原数据
  selectedForm.value = row;
  showEdit.value = true;
}

/**
 * 打开新增弹窗
 */
const openAdd = async() => {
    newCode.value = await generateScheduleCode();
  showAdd.value = true
}

// 监听弹窗关闭，重置编辑表单
watch(showEdit, (val) => {
  if (!val) {
    selectedForm.value = null
  }
})

// 页面挂载时加载列表
onMounted(getList)
</script>

<style scoped>
.purchase-plan-management {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 40px);
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }
  
  .el-button {
    width: 100%;
  }
}
</style>