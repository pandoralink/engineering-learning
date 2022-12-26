export default function vitePluginPrintName() {
  let config = undefined;
  let reqCount = 0;

  return {
    name: "vite-plugin-print-name",
    config: (config, env) => {},
    configResolved: (resolvedConfig) => {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        next();
      });
    },
    transformIndexHtml(html) {},
    transform(code, id) {
      if (config.mode === "development") {
        // 开发环境
        const rootPath = process.cwd().replace(/\\/g, "/");
        if (id.indexOf(rootPath + "/src") !== -1) {
          console.log(id.replace(rootPath + "/src", ""));
        }
      } else {
        // 生产环境
      }
    },
  };
}
