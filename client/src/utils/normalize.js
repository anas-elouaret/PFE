export function normalizeId(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeId);
  if (typeof obj === "object") {
    const result = { ...obj };
    if (result._id && !result.id) {
      result.id = result._id;
    }
    return result;
  }
  return obj;
}
