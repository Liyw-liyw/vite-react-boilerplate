import fs from 'fs';
import { resolve } from 'path';
import { codegen } from 'swagger-axios-codegen';

class RequestClientGenerator {
  config = {};

  constructor(config) {
    this.config = config;
  }

  customInstance(path, fileName) {
    if (!path || !fileName) return '';
    return `import ${fileName} from '${path}';\n`;
  }

  getRemoteFileName(remotePath) {
    if (!remotePath) return '';
    const regUrl =
      /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    return remotePath.replace(regUrl, '$5').split('/')[1];
  }

  generator() {
    const {
      schemaPath,
      outputDir,
      remotePath,
      customInstancePath,
      customInstanceName
    } = this.config;

    // local schema
    if (schemaPath) {
      const files = fs.readdirSync(schemaPath);

      files
        .map((fileName) => {
          const fileNameWithoutType = fileName.replace('.json', '');
          return function () {
            codegen({
              methodNameMode: fileName,
              outputDir,
              source: require(`${schemaPath}/${fileName}`),
              useStaticMethod: true,
              useCustomerRequestInstance: true,
              fileName: `${fileNameWithoutType}.ts`
            });
          };
        })
        .map((func) => func());

      const exportServicesStr = files.map((fileName) => {
        const fileNameWithoutType = fileName.replace('.json', '');

        return `export * as ${fileNameWithoutType} from './${fileNameWithoutType}';\n`;
      });

      fs.writeFileSync(`${outputDir}/index.ts`, exportServicesStr.join(''));
    }

    // remote url
    if (remotePath) {
      const remotePathList =
        remotePath instanceof Array ? remotePath : [remotePath];
      remotePathList
        .map((remotePath) => {
          const fileName = this.getRemoteFileName(remotePath);
          return function () {
            codegen({
              methodNameMode: fileName,
              outputDir,
              remoteUrl: remotePath,
              useStaticMethod: true,
              useCustomerRequestInstance: true,
              fileName: `${fileName}.ts`
            });
          };
        })
        .map((func) => func());

      // only support single axios instance
      const importInstance = this.customInstance(
        customInstancePath,
        customInstanceName
      );

      const importServicesStr = remotePathList.map((remotePath) => {
        if (!customInstancePath || !customInstanceName) return '';
        const localFileName = this.getRemoteFileName(remotePath);
        const importOptions =
          'import { serviceOptions as ' +
          localFileName +
          'ServiceOptions } from ' +
          `'./${localFileName}';\n`;
        return importOptions;
      });

      const setOptionInstanceStr = remotePathList.map((remotePath) => {
        if (!customInstancePath || !customInstanceName) return '';
        const localFileName = this.getRemoteFileName(remotePath);
        const setOptions = `${localFileName}ServiceOptions.axios = ${customInstanceName};\n`;
        return setOptions;
      });

      const exportServicesStr = remotePathList.map((remotePath) => {
        return `export * from './${this.getRemoteFileName(remotePath)}';\n`;
      });

      const ioStr =
        importInstance +
        '\n' +
        importServicesStr.join('') +
        '\n' +
        setOptionInstanceStr.join('') +
        '\n' +
        exportServicesStr.join('');

      fs.writeFileSync(`${outputDir}/index.ts`, ioStr);
    }
  }
}

// demo
const client = new RequestClientGenerator({
  outputDir: resolve('./src/api/services'),
  remotePath: [
    'https://alpha.api.whitematrixdev.com/volunteer/api/v3/api-docs'
  ], // 标准openapi
  customInstancePath: '../axios', // 相对于生成后的文件夹index.ts的path
  customInstanceName: 'axiosInstance'
});

client.generator();
