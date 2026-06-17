export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type PersonaPromptJson = {
  identity?: {
    name?: string;
    role?: string;
    core_traits?: string[];
  };
  scenario?: {
    opening_scene?: string;
    relationship_hook?: string;
    desktop_presence?: string;
  };
  backstory?: {
    summary?: string;
    emotional_core?: string;
  };
  world_lore?: {
    type?: string;
    notes?: string;
  };
  speech_style?: {
    language?: string;
    register?: string;
    signature?: string[];
    avoid?: string[];
    sentence_shape?: string;
  };
  first_message: string;
  safety_boundary?: Record<string, string>;
  forbidden_claims?: string[];
  example_dialogues?: string[];
  negative_behavior?: string[];
  relationship_boundary?: {
    allowed?: string[];
    not_allowed?: string[];
  };
};

export type Persona = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  base_tone: string;
  relationship_type: string;
  world_type: string;
  static_prompt_json: PersonaPromptJson;
  version: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PersonaState = {
  id: string;
  user_id: string;
  persona_id: string;
  relationship_stage: string;
  affinity: number;
  trust_state: string;
  recent_mood: string;
  open_loops: string[];
  last_major_event: string | null;
  boundary_overrides: Record<string, unknown>;
  state_source: string;
  version: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  is_current: boolean;
};

export type CloudConversation = {
  id: string;
  user_id: string;
  persona_id: string;
  title: string | null;
  active_surface: string | null;
  summary: string | null;
  chat_mode: ChatMode;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CloudMessage = {
  id: string;
  user_id: string;
  conversation_id: string;
  persona_id: string;
  role: "user" | "assistant" | "system_summary";
  content: string;
  provider: string | null;
  surface: string;
  source_device_id?: string | null;
  local_message_id?: string | null;
  idempotency_key?: string | null;
  safety_grade?: string | null;
  client_created_at: string;
  client_sequence?: number | null;
  server_received_at?: string | null;
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
  chat_mode: ChatMode;
  last_message_at: string;
  created_at: string;
};

export type ChatMode = "simple" | "long" | "exciting";

export type JamBalance = {
  user_id: string;
  balance: number;
  last_daily_claim: string | null;
  created_at: string;
};

export type CharacterMemory = {
  id: string;
  conversation_id: string;
  content: string;
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

export type ConversationWithPersona = CloudConversation & {
  personas: Persona;
  persona_states: PersonaState | null;
};

export type ConversationWithCharacter = Conversation & {
  characters: Character;
  intimacy_states: IntimacyState | null;
};
