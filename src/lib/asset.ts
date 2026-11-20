/** Prefixa caminhos de /public com o basePath (necessário no GitHub Pages). */
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
