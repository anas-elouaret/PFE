const dns = require("dns");

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

  const records = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);

  const hosts = records
    .sort((a, b) => a.priority - b.priority)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const auth = authPart ? `${authPart}@` : "";

  return `mongodb://${auth}${hosts}${dbPart}?tls=true&retryWrites=true&w=majority&authSource=admin`;
}

module.exports = resolveMongoUri;
