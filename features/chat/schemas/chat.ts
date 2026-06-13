import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.uuid(),
  content: z.string().min(1, "메시지를 입력해주세요").max(2000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
