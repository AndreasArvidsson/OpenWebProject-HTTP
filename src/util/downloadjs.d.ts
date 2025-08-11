declare module "downloadjs" {
    type Downloadjs = (
        data: unknown,
        filename?: string,
        mimeType?: string,
    ) => void;
    const downloadjs: Downloadjs;
    export default downloadjs;
}
