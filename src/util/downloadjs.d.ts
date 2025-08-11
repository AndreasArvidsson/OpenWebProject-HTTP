declare module "downloadjs" {
    type Downloadjs = (data: any, filename?: string, mimeType?: string) => void;
    const downloadjs: Downloadjs;
    export default downloadjs;
}
