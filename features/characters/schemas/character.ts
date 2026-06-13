import { z } from "zod";

export const characterSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  avatarUrl: z.string().url("유효한 URL을 입력해주세요").optional().or(z.literal("")),
  personality: z.string().min(10, "성격은 10자 이상 입력해주세요").max(500),
  backstory: z.string().min(10, "배경 스토리는 10자 이상 입력해주세요").max(1000),
  greeting: z.string().min(1, "인사말을 입력해주세요").max(300),
  gender: z.enum(["male", "female", "non-binary", "other"]).optional(),
  isPublic: z.boolean().default(true),
});

export type CharacterInput = z.infer<typeof characterSchema>;
