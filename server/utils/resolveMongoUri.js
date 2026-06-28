const dns = require("dns");

async function resolveSrvViaHTTPS(hostname) {
  const url = `https://dns.google/resolve?name=_mongodb._tcp.${hostname}&type=SRV`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.Answer) {
    const msg = `DNS SRV failed for _mongodb._tcp.${hostname} — Google DNS status: ${data.Status}, no Answer records. Check your cluster hostname in Atlas.`;
    throw new Error(msg);
  }
  return data.Answer.map((r) => ({
    name: r.name.replace(/\.$/, ""),
    port: r.port,
    priority: r.priority || 0,
  }));
}

async function resolveMongoUri(srvUri) {
  if (!srvUri.startsWith("mongodb+srv://")) {
    return srvUri;
  }

  const withoutScheme = srvUri.slice("mongodb+srv://".length);
  const atIndex = withoutScheme.indexOf("@");
  const authPart = atIndex !== -1 ? withoutScheme.slice(0, atIndex) : "";
  const rest = atIndex !== -1 ? withoutScheme.slice(atIndex + 1) : withoutScheme;

  const slashIndex = rest.indexOf("/");
  const hostname = slashIndex !== -1 ? rest.slice(0, slashIndex) : rest;
  const dbPart = slashIndex !== -1 ? rest.slice(slashIndex) : "";

  let records;
  try {
    records = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
  } catch {
    try {
      records = await resolveSrvViaHTTPS(hostname);
    } catch {
      console.warn("SRV resolution failed; falling back to raw URI. Set MONGODB_URI to a direct mongodb:// string for reliability.");
      return srvUri;
    }
  }

  const hosts = records
    .sort((a, b) => a.priority - b.priority)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const auth = authPart ? `${authPart}@` : "";

  return `mongodb://${auth}${hosts}${dbPart}?tls=true&retryWrites=true&w=majority&authSource=admin`;
}

module.exports = resolveMongoUri;
