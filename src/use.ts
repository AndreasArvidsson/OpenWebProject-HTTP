interface Use {
    downloadjs?: (blob: unknown, filename: string, contentType: string) => void;
}

const use: Use = {};

export default use;
