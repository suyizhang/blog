declare module 'remark-prism' {
  import { Plugin } from 'unified';

  interface PrismOptions {
    plugins?: string[];
    [key: string]: unknown;
  }

  const prism: Plugin<[PrismOptions] | []>;

  export default prism;
}