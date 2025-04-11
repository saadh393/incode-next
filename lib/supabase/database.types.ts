export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          color: string
        }
        Insert: {
          id: string
          title: string
          description: string
          icon: string
          color: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          color?: string
        }
      }
      lessons: {
        Row: {
          id: string
          game_id: string
          title: string
          command: string
          description: string
          order: number
        }
        Insert: {
          id?: string
          game_id: string
          title: string
          command: string
          description: string
          order: number
        }
        Update: {
          id?: string
          game_id?: string
          title?: string
          command?: string
          description?: string
          order?: number
        }
      }
      arguments: {
        Row: {
          id: string
          lesson_id: string
          flag: string
          description: string
          order: number
        }
        Insert: {
          id?: string
          lesson_id: string
          flag: string
          description: string
          order: number
        }
        Update: {
          id?: string
          lesson_id?: string
          flag?: string
          description?: string
          order?: number
        }
      }
    }
  }
}