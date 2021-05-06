// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    // 兼容浏览器，添加前缀
    'autoprefixer':{
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
        'last 10 versions', // 所有主流浏览器最近10版本用
    ],
    grid: true
  }
  }
}
