const FALLBACK_SLUG = "app";

export function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || FALLBACK_SLUG;
}

export function pickFreeSlug(base: string, takenSlugs: string[]) {
  const taken = new Set(takenSlugs);
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
