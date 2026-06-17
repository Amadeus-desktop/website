import type { IconType } from "react-icons";
import {
  HiChatBubbleLeft,
  HiCog6Tooth,
  HiHome,
  HiMagnifyingGlass,
  HiPlus,
} from "react-icons/hi2";

export const NAV_ICONS: Record<
  "home" | "chat" | "create" | "settings",
  IconType
> = {
  home: HiHome,
  chat: HiChatBubbleLeft,
  create: HiPlus,
  settings: HiCog6Tooth,
};

export { HiMagnifyingGlass };
