"use server";

import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"] & {
  arguments: Database["public"]["Tables"]["arguments"]["Row"][];
};

export async function getGameData(gameId: string): Promise<{ game: Game | null; lessons: Lesson[] }> {
  const supabase = createClient();

  const [gameResponse, lessonsResponse] = await Promise.all([
    supabase.from("games").select("*").eq("id", gameId).single(),
    supabase.from("lessons").select(`*, arguments(*)`).eq("game_id", gameId).order("order"),
  ]);

  // If no game is found, return null for game but don't throw an error
  if (gameResponse.error && gameResponse.error.code === "PGRST116") {
    return {
      game: null,
      lessons: [],
    };
  }

  // For other errors, we should still throw
  if (gameResponse.error) {
    console.error("Error fetching game:", gameResponse.error);
    throw new Error("Failed to fetch game");
  }

  if (lessonsResponse.error) {
    console.error("Error fetching lessons:", lessonsResponse.error);
    throw new Error("Failed to fetch lessons");
  }

  return {
    game: gameResponse.data,
    lessons: lessonsResponse.data as Lesson[],
  };
}
