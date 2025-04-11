import type { Database } from "./supabase/database.types";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"] & {
  arguments: Database["public"]["Tables"]["arguments"]["Row"][];
};
