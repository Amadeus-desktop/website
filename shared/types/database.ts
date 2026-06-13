export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Character = {
  id: string;
  creator_id: string | null;
  name: string;
  avatar_url: string | null;
  personality: string;
  backstory: string;
  greeting: string;
  gender: string | null;
  is_public: boolean;
  is_official: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  character_id: string;
  last_message_at: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type IntimacyState = {
  conversation_id: string;
  score: number;
  level: IntimacyLevel;
  updated_at: string;
};

export type IntimacyLevel =
  | "stranger"
  | "acquaintance"
  | "close"
  | "partner";

export type ConversationWithCharacter = Conversation & {
  characters: Character;
  intimacy_states: IntimacyState | null;
};
