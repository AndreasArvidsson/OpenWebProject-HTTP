declare module "downloadjs" {
    type Downloadjs = (
        data: Blob,
        filename?: string,
        mimeType?: string,
    ) => void;
    const downloadjs: Downloadjs;
    export default downloadjs;
}
