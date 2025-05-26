import { defineStore } from 'pinia'
import { getAllTerms } from '@/api/system/term'
import { ElMessage } from 'element-plus'

export const useTermStore = defineStore('term', {
  state: () => ({
    terms: [], // 所有期间列表，仍然存储完整对象以供选择
    currentTerm: null, // 当前选中的期间，仅存储 term 字符串
    term: null, // 当前期间，仅存储 term 字符串（iscurrent 为 1 的 term 值）
    loading: false, // 加载状态
    error: null, // 错误信息
  }),
  actions: {
    async fetchTerms() {
      this.loading = true
      this.error = null
      try {
        const response = await getAllTerms()
        console.log('fetchTerms: API response', response) // 调试日志
        if (response.success) {
          this.terms = response.data.list || []
          console.log('fetchTerms: terms loaded', this.terms) // 调试日志

          // 设置 term 为 iscurrent === 1 的 term 值
          const currentTermObj = this.terms.find(term => term.iscurrent === 1)
          if (currentTermObj) {
            this.term = currentTermObj.term
            // 初始化 currentTerm 为 term 的值（如果 currentTerm 未被设置）
            if (!this.currentTerm) {
              this.currentTerm = this.term
            }
            console.log('获取期间，存储当前期间和当前选中的区间', { term: this.term, currentTerm: this.currentTerm }) // 调试日志
          } else {
            // 如果没有 iscurrent === 1 的 term，则选择 ID 最大的 term
            if (this.terms.length > 0 && !this.currentTerm) {
              const maxTerm = this.terms.reduce((max, term) =>
                term.id > max.id ? term : max, this.terms[0])
              this.term = maxTerm.term
              this.currentTerm = maxTerm.term
              console.log('没有当前期间设置id最大的为当前区间', this.term) // 调试日志
            } else if (this.terms.length === 0) {
              this.error = '未找到可用期间'
              ElMessage.warning('未找到可用期间，请联系管理员')
            }
          }
        } else {
          this.error = response.data.msg || '获取期间失败'
          ElMessage.error(this.error)
        }
      } catch (error) {
        this.error = error.message || '网络错误'
        ElMessage.error('获取期间列表失败: ' + this.error)
      } finally {
        this.loading = false
      }
    },
    setCurrentTerm(termValue) {
      console.log('setCurrentTerm: new term value', termValue) // 调试日志
      this.currentTerm = termValue
      ElMessage.success(`当前期间已切换为: ${termValue}`)
    },
  },
})