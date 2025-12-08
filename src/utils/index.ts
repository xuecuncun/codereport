export function findFirstPath(obj: any, target: any, path = ""): string | null {
  const type = Object.prototype.toString.call(obj);

  if (type === "[object Object]") {
    for (const key in obj) {
      const newPath = path ? `${path}.${key}` : key;
      if (obj[key] === target) {
        return newPath;
      }
      const sub = findFirstPath(obj[key], target, newPath);
      if (sub) return sub;
    }
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const newPath = path ? `${path}[${i}]` : `[${i}]`;
      if (obj[i] === target) {
        return newPath;
      }
      const sub = findFirstPath(obj[i], target, newPath);
      if (sub) return sub;
    }
  }

  return null;
}
