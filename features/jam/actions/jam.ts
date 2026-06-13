"use server";

import {
  canClaimDaily,
  DAILY_JAM_REWARD,
} from "@/features/jam/lib/jam";
import { createClient } from "@/shared/lib/supabase/server";
import type { JamBalance } from "@/shared/types/database";
import { revalidatePath } from "next/cache";

export async function getJamBalance(): Promise<JamBalance | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("jam_balances")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getJamBalance error:", error);
    return null;
  }

  if (!data) {
    const { data: created } = await supabase
      .from("jam_balances")
      .insert({ user_id: user.id, balance: DAILY_JAM_REWARD })
      .select("*")
      .single();
    return created;
  }

  return data;
}

export async function deductJam(
  amount: number,
): Promise<{ balance: number } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다" };

  const { data: current } = await supabase
    .from("jam_balances")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  if (!current || current.balance < amount) {
    return { error: `Jam이 부족합니다 (필요: ${amount}, 보유: ${current?.balance ?? 0})` };
  }

  const { data, error } = await supabase
    .from("jam_balances")
    .update({ balance: current.balance - amount })
    .eq("user_id", user.id)
    .select("balance")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { balance: data.balance };
}

export async function claimDailyJam(): Promise<
  { balance: number; claimed: number } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다" };

  const { data: current } = await supabase
    .from("jam_balances")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!current) return { error: "Jam 잔액을 찾을 수 없습니다" };

  if (!canClaimDaily(current.last_daily_claim)) {
    return { error: "오늘은 이미 일일 Jam을 받았어요. 24시간 후에 다시 받을 수 있습니다." };
  }

  const { data, error } = await supabase
    .from("jam_balances")
    .update({
      balance: current.balance + DAILY_JAM_REWARD,
      last_daily_claim: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select("balance")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { balance: data.balance, claimed: DAILY_JAM_REWARD };
}
