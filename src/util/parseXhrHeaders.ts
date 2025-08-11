export function parseXhrHeaders(xhr: XMLHttpRequest): Record<string, string> {
    const result: Record<string, string> = {};
    const headerStrings = xhr.getAllResponseHeaders().split("\r\n");

    for (const header of headerStrings) {
        if (header) {
            const parts = header.split(":");
            if (parts.length === 2) {
                const key = parts[0].trim().toLowerCase();
                result[key] = parts[1].trim();
            }
        }
    }

    return result;
}
