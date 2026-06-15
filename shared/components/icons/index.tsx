import type { IconType } from "react-icons";
import { GiHoneyJar } from "react-icons/gi";
import {
  HiChatBubbleLeft,
  HiHome,
  HiMagnifyingGlass,
  HiPlus,
  HiUser,
} from "react-icons/hi2";

export const NAV_ICONS: Record<"home" | "chat" | "create", IconType> = {
  home: HiHome,
  chat: HiChatBubbleLeft,
  create: HiPlus,
};

export { GiHoneyJar, HiMagnifyingGlass, HiUser };
