import fs from "fs";
import path from "path";

const VIEWS_FILE = path.join(process.cwd(), "src", "data", "blog-views.json");

export function getViews(): Record<string, number> {
  try {
    if (!fs.existsSync(VIEWS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(VIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function incrementView(slug: string) {
  try {
    const views = getViews();
    views[slug] = (views[slug] || 0) + 1;
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2), "utf-8");
    return views[slug];
  } catch (err) {
    console.error(`Klaida didinant peržiūras (${slug}):`, err);
    return 0;
  }
}
