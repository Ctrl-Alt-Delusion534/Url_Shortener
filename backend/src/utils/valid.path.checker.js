const ipToUint32 = (ip) => {
  const parts = ip.split(".").map(Number);
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
};

const PRIVATE_SUBNETS = [
  { network: 0x0a000000, mask: 0xff000000 },
  { network: 0xac100000, mask: 0xfff00000 },
  { network: 0xc0a80000, mask: 0xffff0000 },
  { network: 0x7f000000, mask: 0xff000000 },
  { network: 0xa9fe0000, mask: 0xffff0000 },
  { network: 0x00000000, mask: 0xff000000 },
];

const HIGH_RISK_TLDS = new Set([
  "zip",
  "mov",
  "top",
  "click",
  "gq",
  "cf",
  "tk",
  "ml",
]);

const SECURITY_RULES = [
  (url) => ["http:", "https:"].includes(url.protocol),

  (url) =>
    !["localhost", "metadata.google.internal", "[::1]"].includes(
      url.hostname.toLowerCase(),
    ),

  (url) => {
    const hostname = url.hostname.toLowerCase();
    const parts = hostname.split(".");

    if (
      parts.length === 4 &&
      parts.every((part) => !isNaN(part) && !isNaN(parseFloat(part)))
    ) {
      try {
        const ipVal = ipToUint32(hostname);
        for (const subnet of PRIVATE_SUBNETS) {
          if ((ipVal & subnet.mask) === subnet.network) {
            return false;
          }
        }
      } catch {
        return false;
      }
      return true;
    }

    if (
      parts.length === 1 &&
      !isNaN(hostname) &&
      !isNaN(parseFloat(hostname))
    ) {
      return false;
    }

    return true;
  },

  (url) => {
    const hostname = url.hostname.toLowerCase();
    const domainParts = hostname.split(".");
    const tld = domainParts[domainParts.length - 1];
    return !HIGH_RISK_TLDS.has(tld);
  },
];

export const isUrlSafe = (destinationUrl) => {
  try {
    const parsed = new URL(destinationUrl);
    return SECURITY_RULES.every((rule) => rule(parsed));
  } catch {
    return false;
  }
};
