import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.uuid(),
  content: z.string().min(1, "메시지를 입력해주세요").max(2000),
  idempotencyKey: z.string().min(1).max(200).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
