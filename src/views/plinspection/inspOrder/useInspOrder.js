// src/views/plinspection/inspOrder/useInspOrder.js
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInspOrderPage, updateInspOrderStatus, deleteInspOrder } from '@/api/plinspection/inspOrder'
import { useUserStore } from '@/store/user'
import dayjs from 'dayjs'

const userStore = useUserStore()

export function useInspOrder(minStatus = null) {
  const query = reactive({
    orderNo: '',
    batchNo: '',
    batchNumber: '',
    status: minStatus !== null ? String(minStatus) : '', // 后端 >= 查询
    pageNumber: 1,
    pageSize: 10
  })

  const list = ref([])
  const total = ref(0)
  const loading = ref(false)

  const getList = async () => {
    loading.value = true
    try {
      const res = await getInspOrderPage(query)
      list.value = res.data.page?.list || []
      total.value = res.data.page?.totalRow || 0
    } catch {
      ElMessage.error('加载失败')
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (row, newStatus, needRemark = false) => {
    let remark = ''
    if (needRemark) {
      const { value } = await ElMessageBox.prompt('请输入原因', '提示', {
        inputValidator: v => v ? true : '必填'
      })
      remark = value
    }
    try {
      await updateInspOrderStatus({
        orderId: row.id,
        newStatus,
        remark,
        operator: userStore.realName
      })
      ElMessage.success('操作成功')
      getList()
    } catch {
      ElMessage.error('操作失败')
    }
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm(`确认删除 "${row.orderNo}"？`, '警告', { type: 'warning' })
      .then(async () => {
        await deleteInspOrder({ id: row.id })
        ElMessage.success('已删除')
        getList()
      })
      .catch(() => {})
  }

  const formatDate = d => d ? dayjs(d).format('YYYY-MM-DD HH:mm') : '-'

  const parseCertificate = s => s ? (Array.isArray(JSON.parse(s)) ? JSON.parse(s) : []) : []
  const openFileInNewWindow = url => url && window.open(url.startsWith('http') ? url : require('@/utils/request').baseURL + url, '_blank')

  return {
    query, list, total, loading, getList,
    updateStatus, handleDelete,
    formatDate, parseCertificate, openFileInNewWindow
  }
}