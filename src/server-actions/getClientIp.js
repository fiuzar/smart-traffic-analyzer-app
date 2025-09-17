function normalizeIp(ip) {
    if (!ip) return "";
    if (ip.startsWith("::ffff:")) {
        ip = ip.substring(7);
    }
    // Get the first IP if there are multiple
    let firstIp = ip.split(',')[0].trim();
    // Remove port if present (for IPv4)
    if (firstIp.includes(':') && !firstIp.includes('::')) {
        firstIp = firstIp.split(':')[0];
    }
    return firstIp;
}

export function getClientIp(headers, socketRemoteAddress) {
    const headerCandidates = [
        'x-client-ip',
        'x-forwarded-for',
        'cf-connecting-ip',
        'fastly-client-ip',
        'true-client-ip',
        'x-real-ip',
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'forwarded'
    ];

    let ip = null;
    for (const header of headerCandidates) {
        const value = headers[header];
        if (value) {
            ip = value.split(',')[0].trim();
            break;
        }
    }

    if (!ip && socketRemoteAddress) {
        ip = socketRemoteAddress;
    }
    return normalizeIp(ip);
}