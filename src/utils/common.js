// 深拷贝对象
export function deepClone (obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}
//判断是否IE浏览器  
export function IEVersion () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion === 7) {
      return 7;
    } else if (fIEVersion === 8) {
      return 8;
    } else if (fIEVersion === 9) {
      return 9;
    } else if (fIEVersion === 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge';//edge
  } else if (isIE11) {
    return 11; //IE11  
  } else {
    return -1;//不是ie浏览器
  }
}

// 下拉数据根据对应关系转换为label与value
export function selectTransform (data, config) {
  config = JSON.parse(config)
  if (Object.keys(config).length) {
    return data.map(item => {
      return {
        label: item[config.labelCol],
        value: item[config.valueCol]
      }
    })
  }
}
// 树形下拉数据根据对应关系进行处理
export const selectGenerateTree = (data, config) => {
  const configParams = JSON.parse(config)
  const pidName = configParams.pidCol
  const labelName = configParams.labelCol
  const valueName = configParams.valueCol
  /**
   * 1. 平行数组
   * 2. 树形数组
   */
  const pidNameStr = pidName != null && pidName !== '' ? pidName : 'pId'
  // 把跟节点首先放进数组
  const tmpTree = data.filter(node => !node[pidNameStr])
  if (!tmpTree.length) {
    console.log('tree-select:', 'not found 父节点')
  }
  // 递归生成节点及子节点数据
  const findChildren = (tree) => {
    tree.forEach(node => {
      node.label = node[labelName]
      node.value = node[valueName]
      node.children = data.filter(cNode => cNode[pidNameStr] === node[valueName])
      if (node.children.length) {
        findChildren(node.children)
      }
    })
  }

  findChildren(tmpTree)
  return tmpTree
}

/**
 * 获取url参数
 * @param {*} name
 */
export function getUrlParam (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) // 匹配目标参数
  if (r != null) return unescape(r[2])
  return null // 返回参数值
}

