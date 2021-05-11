/**
 *
 */

export const platformApi = {
  menu: [
    {
      name: 'list',
      method: 'POST',
      path: '/menu/list',
      mockPath: '/menu/list',
      params: {
        role: []
      },
      desc: '获取菜单列表'
    },
    {
      name: 'download',
      method: 'POST',
      path: '/attachment/download',
      mockPath: '/attachment/download',
      params: {},
      desc: '下载'
    }
  ]
}
