/**
 * 业务流程管理
 */

export const thirdpartApi = {
  ThirdpartPlan: [
    {
      name: 'sendAll',
      method: 'POST',
      path: '/product/courtyardthirdpart/yardPlan/send',
      mockPath: '/product/courtyardthirdpart/yardPlan/send',
      desc: '第三方接口调用->院所计划->原计划下发'
    }, {
      name: 'getFactoryTask',
      method: 'POST',
      path: '/product/courtyardthirdpart/controller/get',
      mockPath: '/product/courtyardthirdpart/controller/get',
      desc: '原计划详情查看'
    }
  ]
}
