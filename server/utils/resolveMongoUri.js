const dns = require("dns");

const HELP = `Vercel (AWS Lambda) blocks DNS SRV lookups. Fix:

1. Go to MongoDB Atlas → Clusters → Connect → Connect your application
2. Select Driver: Node.js
3. Copy the "standard connection string" format (starts with mongodb://, NOT mongodb+srv://)
4. Set it as MONGODB_URI in your Vercel environment variables
5. Redeploy

Example: mongodb://user:pass@host1:27017,host2:27017/db?tls=true&retryWrites=true&w=majority&authSource=admin`;

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
      const url = `https://dns.google/resolve?name=_mongodb._tcp.${hostname}&type=SRV`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.Answer) {
        throw new Error(`Google DNS: no SRV record for _mongodb._tcp.${hostname} (Status ${data.Status})`);
      }
      records = data.Answer.map((r) => ({
        name: r.name.replace(/\.$/, ""),
        port: r.port,
        priority: r.priority || 0,
      }));
    } catch {
      throw new Error(`MONGODB_URI uses mongodb+srv:// which requires DNS SRV — blocked on Vercel.\n\n${HELP}`);
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
