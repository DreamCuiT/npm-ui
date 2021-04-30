export default {
  options (h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      list.push(<el-option label={item.label} value={String(item.value)} disabled={item.disabled}></el-option>)
    })
    return list
  }
}
