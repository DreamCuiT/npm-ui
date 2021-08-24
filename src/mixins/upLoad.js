import { IEVersion } from "~/utils/common";

export default {
  data() {},
  methods: {
    uploadUrl() {
      const { API_DEFAULT_CONFIG } = this.$sysConfig;
      let { devBaseUrl, prodBaseUrl, isDevMode } = API_DEFAULT_CONFIG;
      let urlPrefix = isDevMode ? `${devBaseUrl}` : `${prodBaseUrl}`;
      return urlPrefix + "/attachment/upload";
    },
    downloadFile(
      file,
      comp,
      bindKey = {
        fileIdKey: "id",
        fileNameKey: "fileName",
        confValueKey: "confidentialite"
      }
    ) {
      if (!comp) {
        console.error("downloadFile : 文件下载方法缺少指定参数-comp[this对象]");
        return;
      }
      // const normalKey = { fileIdKey: 'id', fileNameKey: 'fileName', confValueKey: 'confidentialite' }
      // bindKey = { ...normalKey, ...bindKey }
      const userConfidentialiteList =
        comp.$store.getters.userInfo.confidentialiteList || [];
      if (file[bindKey.confValueKey]) {
        let filter = userConfidentialiteList.filter(
          item => item.id === file[bindKey.confValueKey]
        );
        if (!filter.length) {
          comp.$message({
            type: "error",
            message: "密级权限不足，无法下载查看"
          });
          return;
        }
      }
      if (!file[bindKey.fileIdKey]) {
        comp.$message({
          type: "error",
          message: "文件Id不存在, 请先保存数据"
        });
        return;
      }
      comp.$api["SystemSettings.getFileUrl"](
        { attachmentId: file[bindKey.fileIdKey] },
        { responseType: "blob" }
      )
        .then(backJson => {
          if (IEVersion !== -1) {
            "msSaveOrOpenBlob" in navigator &&
              window.navigator.msSaveOrOpenBlob(
                backJson.data,
                file[bindKey.fileNameKey]
              );
          } else {
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([backJson.data]));
            link.download = file[bindKey.fileNameKey];
            document.body.appendChild(link);

            link.click();
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          }
        })
        .catch(err => {
          if (err.type === "application/json") {
            comp.$message({
              type: "error",
              message: "文件不存在"
            });
          }
        })
        .finally(() => {
          // this.search.exportLoading = false
        });
    },
    uploadDefaultRules() {
      return [
        {
          validator: (rule, value) => {
            return new Promise((resolve, reject) => {
              if (value && value.length) {
                let temp = 0;
                value.forEach(file => {
                  if (!file.confidentialite) {
                    temp += 1;
                  }
                });
                if (temp) {
                  let rejectMsg = "请选择文件对应密级";
                  reject(rejectMsg);
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            });
          }
        }
      ];
    },
    getConfidentialiteLabel(file, confValueKey = "confidentialite") {
      const systemSecrets = this.$store.getters.systemSecretConfig;
      let filter = systemSecrets.filter(
        item => item.value === file[confValueKey]
      );
      if (filter.length) {
        return filter[0].label;
      }
    }
  }
};
