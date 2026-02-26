/* eslint-disable no-restricted-syntax */
import {Plugin, OutputOptions, OutputBundle} from 'rollup';

interface CustomSizeLimit {
  fileName: string;
  maxSize: number;
}

interface SizeLimitPluginOptions {
  maxSizeInKB: number;
  customSizeLimits?: CustomSizeLimit[];
  messageType?: 'warning' | 'error';
}

interface OutputFile {
  code: string;
}

function getFileSizeInKB(file: OutputFile): number {
  return Buffer.byteLength(file.code, 'utf8') / 1024;
}

function sizeLimitPlugin(options: SizeLimitPluginOptions): Plugin {
  const {maxSizeInKB, customSizeLimits = [], messageType = 'error'} = options;

  function getSizeLimit(fileName: string) {
    // allow for custom size limits per file
    const fileSizeLimit = customSizeLimits.find((limit) => limit.fileName === fileName);
    // if no file limit is found then we will use the default limit
    return fileSizeLimit ? fileSizeLimit.maxSize : maxSizeInKB;
  }

  return {
    name: 'size-limit-plugin',
    generateBundle(outputOptions: OutputOptions, bundle: OutputBundle) {
      for (const fileName of Object.keys(bundle)) {
        const file = bundle[fileName];

        if (!file) break;

        if (file.type === 'asset' || !file.code) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const sizeInKB = getFileSizeInKB(file);
        const limit = getSizeLimit(fileName);

        if (sizeInKB > limit) {
          const message = `Bundle size exceeds the limit of ${limit} KB. ${fileName} is ${sizeInKB.toFixed(2)} KB.`;
          if (messageType === 'error') {
            throw new Error(message);
          } else {
            // eslint-disable-next-line no-console
            console.log(`\n\n\u001b[1;43m Warning: ${message}\u001b[0m\n`);
          }
        }
      }
    }
  };
}

export default sizeLimitPlugin;
