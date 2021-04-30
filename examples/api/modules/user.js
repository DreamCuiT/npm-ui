/**
 * USER API
 * Namespace: User
 */

export const UserApi = {
  button: [
    {
      name: 'info',
      method: 'POST',
      path: '/button/list',
      mockPath: '/button/list',
      params: {
        role: []
      },
      desc: '获取页面权限按钮'
    },
    {
      name: 'tableButtonLimit',
      method: 'POST',
      path: '/bpm/dmn/button/ButtonDecision/config',
      mockPath: '/bpm/dmn/button/ButtonDecision/config',
      params: {},
      desc: 'table行上权限按钮，置灰/隐藏/悬浮提示'
    }
  ]
}
