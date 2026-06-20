import { beaches } from "./beaches";

export async function seedBeaches(db: any, schema: any) {
  for (const beach of beaches) {
    await db.insert(schema.beaches).values(beach).onConflictDoNothing();
  }
}
