import router from './index'

// 布局组件映射
const layoutComponents = {
  'default': () => import('@/components/layout/DefaultLayout.vue'),
  'simple': () => import('@/components/layout/SimpleLayout.vue'),
  'none': null
}

// 定义一个组件映射对象，将路径映射到实际的导入函数
// 这样我们可以避免使用变量动态导入
const viewComponents = {
  // 仪表盘
  'dashboard/index': () => import('@/views/dashboard/index.vue'),

  // 系统管理
  'system/user': () => import('@/views/system/user.vue'),
  'system/menu': () => import('@/views/system/menu.vue'),
  'system/department': () => import('@/views/system/department.vue'),
  'system/basorg': () => import('@/views/system/basorg.vue'),//组织管理
  'system/basno': () => import('@/views/system/basno.vue'),//编号管理

  'system/basorgType1': () => import('@/views/system/basorgType1.vue'),//type=1表示供应商管理


  //物料管理
  'item/basitem': () => import('@/views/item/basitem.vue'),
  //合同管理
  'contract/list': () => import('@/views/contract/bascontract/contractList.vue'),
  'contract/baspurchase': () => import('@/views/contract/baspurchaseorder/index.vue'),
  //图纸管理
  'tuzhi/tuzhi': () => import('@/views/tuzhi/tuzhi.vue'),
  //人员管理
  'hruser/hruserlist': () => import('@/views/hruser/hruserlist.vue'),
  //实物ID
  'plmanage/plentityid': () => import('@/views/plmanage/plentityid/plentityid.vue'),


  //生产订单--新
  'plmanage/plproductionorder': () => import('@/views/plmanage/plproductionorder/orderList.vue'),

  //生产工单---新
  'plmanage/plworkorder': () => import('@/views/plmanage/plworkorder/orderList.vue'),


  //排产计划--新
  'plmanage/plscheduleplan': () => import('@/views/plmanage/plscheduleplan/planList.vue'),

    //报工单新
  'plmanage/plreportworkorder': () => import('@/views/plmanage/plreportworkorder/orderList.vue'),
  //供货单
  'plmanage/plgonghuodan': () => import('@/views/plmanage/plgonghuodan/gonghuodan.vue'),


  //通知管理
  'tongzhi/tongzhilist': () => import('@/views/tongzhi/tongzhilist.vue'),

  //确认通知功能
  'tongzhi/querentongzhi': () => import('@/views/tongzhi/querentongzhi.vue'),
  //校验通知功能
  'tongzhi/jiaoyantongzhi': () => import('@/views/tongzhi/jiaoyantongzhi.vue'),
  //审核通知功能
  'tongzhi/shenhetongzhi': () => import('@/views/tongzhi/shenhetongzhi.vue'),
  //按照审核后通知生成提料单
  'tongzhi/tongzhibeiliaodan': () => import('@/views/tongzhi/tongzhibeiliaodan.vue'),
  //  'tongzhi/tongzhitiliaodan': () => import('@/views/tongzhi/tongzhitiliaodan.vue'), 


  //备品备件库存管理
  'kucun/beijian': () => import('@/views/kucun/beijian.vue'),
  //产成品库存管理
  'kucun/chengpin': () => import('@/views/kucun/chengpin.vue'),
  //重点原材料库存管理
  'kucun/yuancailiao': () => import('@/views/kucun/yuancailiao.vue'),


    //原材料入库单据列表
  'kucun/matInList': () => import('@/views/plstoreinout/matinout/matInList.vue'),
  //原材料入库审核
  'kucun/matInListReview': () => import('@/views/plstoreinout/matinout/matInListReview.vue'),
  //原材料出库明细
  'kucun/matItemInoutPage': () => import('@/views/plstoreinout/matinout/matItem/matItemInoutPage.vue'),



  // 材料数据检验--学妹 芯
  'clmanage/clproductiondata': () => import('@/views/clmanage/clproductiondata/clproductiondata.vue'),

  //刘国奇，出厂抽检检验
  'plchuchangchoujian/chuchangchoujian': () => import('@/views/plchuchangchoujian/chuchanchoujian.vue'),

  
  //铝锭检验数据录入
  'clmanage/clld/checkDataEntry': () => import('@/views/clmanage/cl-ld/checkData/checkDataEntry.vue'),
  //铝锭检验数据审核
  'clmanage/clld/checkDataReview': () => import('@/views/clmanage/cl-ld/checkData/checkDataReview.vue'),
  //铝锭请检单录入
  'clmanage/clld/checkRequestEntry': () => import('@/views/clmanage/cl-ld/requestCheck/checkRequestEntry.vue'),
  //铝锭请检单审核
  'clmanage/clld/checkRequestReview': () => import('@/views/clmanage/cl-ld/requestCheck/checkRequestReview.vue'),
    //无缝钢管检验数据录入
  'clmanage/clwfg/checkDataEntry': () => import('@/views/clmanage/cl-wfg/checkData/checkDataEntry.vue'),
  //无缝钢管检验数据审核
  'clmanage/clwfg/checkDataReview': () => import('@/views/clmanage/cl-wfg/checkData/checkDataReview.vue'),
  //无缝钢管请检单录入
  'clmanage/clwfg/checkRequestEntry': () => import('@/views/clmanage/cl-wfg/requestCheck/checkRequestEntry.vue'),
  //无缝钢管请检单审核
  'clmanage/clwfg/checkRequestReview': () => import('@/views/clmanage/cl-wfg/requestCheck/checkRequestReview.vue'),


 
    //圆钢检验
  'clmanage/clyg': () => import('@/views/clmanage/cl-yg/list.vue'),
  //钢板检验
  'clmanage/clgb': () => import('@/views/clmanage/cl-gb/list.vue'),
  //无缝刚
  // 'clmanage/clwfg': () => import('@/views/clmanage/cl-wfg/list.vue'),
  
 
  //橡胶检验--刘国奇
  //橡胶检验数据录入
  'clmanage/clxj/checkRequestEntry': () => import('@/views/clmanage/cl-xj/requestCheck/checkRequestEntry.vue'),
  //橡胶检验数据审核
  'clmanage/clxj/checkRequestReview': () => import('@/views/clmanage/cl-xj/requestCheck/checkRequestReview.vue'),
  //橡胶检验数据录入
  'clmanage/clxj/checkDataEntry': () => import('@/views/clmanage/cl-xj/checkData/checkDataEntry.vue'),
  //橡胶检验管理
  
  'clmanage/clxj': () => import('@/views/clmanage/cl-xj/list.vue'),

}

// 动态导入组件函数 - 使用预定义的映射
const importComponent = (componentPath) => {
  if (!componentPath) {
    // console.warn('未提供组件路径')
    return null
  }

  // 检查映射中是否存在该组件
  if (viewComponents[componentPath]) {
    // console.log(`导入预定义组件: ${componentPath}`)
    return viewComponents[componentPath]
  } else {
    console.warn(`组件路径 ${componentPath} 未在映射表中定义，无法导入`)
    return null
  }
}

// 将菜单树转换为路由配置
const generateRoutesFromMenu = (menuTree) => {
  // console.log('开始转换菜单树为路由配置', menuTree)
  const routes = []

  const createRouteWithLayout = (menuItem, parentLayout = null) => {
    // console.log(`为 ${menuItem.title} 创建路由 (路径: ${menuItem.path}, 组件: ${menuItem.component})`)

    // 只使用component字段导入组件
    if (!menuItem.component) {
      // console.warn(`警告: 菜单项 ${menuItem.title} 没有提供 component 字段`)
      return null
    }

    const pageComponent = importComponent(menuItem.component)

    // 检查组件是否存在
    if (!pageComponent) {
      // console.warn(`警告: 无法导入组件 ${menuItem.component}，请确保已在 viewComponents 映射中定义`)
      return null
    }

    // 使用菜单项中的layout，如果没有则使用父菜单的layout或默认值
    const layoutType = menuItem.layout || parentLayout || 'default'
    const layoutComponent = layoutComponents[layoutType]

    let route

    // 如果需要布局，创建带布局的路由结构
    if (layoutComponent) {
      route = {
        path: menuItem.path,
        name: menuItem.title.replace(/\s/g, ''),
        component: layoutComponent,
        meta: {
          title: menuItem.title,
          requiresAuth: true,
          layout: layoutType,
          icon: menuItem.icon
        },
        children: [
          {
            path: '',
            name: `${menuItem.title.replace(/\s/g, '')}Page`,
            component: pageComponent,
            meta: {
              title: menuItem.title,
              requiresAuth: true,
              icon: menuItem.icon
            }
          }
        ]
      }
    } else {
      // 不需要布局的路由
      route = {
        path: menuItem.path,
        name: menuItem.title.replace(/\s/g, ''),
        component: pageComponent,
        meta: {
          title: menuItem.title,
          requiresAuth: true,
          layout: 'none',
          icon: menuItem.icon
        }
      }
    }

    return route
  }

  const processMenuItem = (menuItem, parentLayout = null) => {
    // 获取当前菜单项的layout，如果没有则使用父菜单的layout
    const currentLayout = menuItem.layout || parentLayout

    // 如果菜单项有子菜单，处理子菜单并传递当前layout
    if (menuItem.children && menuItem.children.length > 0) {
      // console.log(`处理父菜单 ${menuItem.title}，有 ${menuItem.children.length} 个子菜单`)

      // 如果父菜单也有自己的组件，需要添加到路由
      if (menuItem.component) {
        const parentRoute = createRouteWithLayout(menuItem, parentLayout)
        if (parentRoute) {
          routes.push(parentRoute)
        }
      }

      // 处理所有子菜单
      menuItem.children.forEach(child => {
        const childRoute = createRouteWithLayout(child, currentLayout)
        if (childRoute) {
          routes.push(childRoute)
        }
      })
    } else {
      // 如果没有子菜单，直接处理当前菜单项
      const route = createRouteWithLayout(menuItem, parentLayout)
      if (route) {
        routes.push(route)
      }
    }
  }

  menuTree.forEach(menuItem => {
    processMenuItem(menuItem)
  })

  // console.log('最终生成的路由配置:', routes)
  return routes
}

// 初始化动态路由（提供给 store 调用的主函数）
export const initDynamicRoutes = async (menuTree) => {
  // console.log('开始初始化动态路由', menuTree)
  // 
  try {
    const dynamicRoutes = generateRoutesFromMenu(menuTree)

    // 添加路由到路由表
    dynamicRoutes.forEach(route => {
      // console.log(`添加路由: ${route.path}`)
      router.addRoute(route)
    })

    // console.log('动态路由添加完成，当前路由表:', router.getRoutes())
    return true
  } catch (error) {
    // console.error('初始化动态路由失败:', error)
    throw error
  }
}

// 清除动态路由（可用于退出登录时）
export const clearDynamicRoutes = () => {
  // Vue Router 4 没有直接的 removeRoute，需要手动管理
  const routes = router.getRoutes()

  // 查找所有动态添加的路由
  routes.forEach(route => {
    // 这里可以加入逻辑来判断哪些是动态添加的路由
    // 例如：检查meta或路径特征
    if (route.meta?.requiresAuth) {
      router.removeRoute(route.name)
      // console.log(`移除路由: ${route.path}`)
    }
  })

  // console.log('动态路由已清除')
}