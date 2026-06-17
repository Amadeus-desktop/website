import type { IconType } from "react-icons";
import {
  HiArrowDownTray,
  HiChatBubbleLeft,
  HiCog6Tooth,
  HiHome,
  HiMagnifyingGlass,
} from "react-icons/hi2";

export const NAV_ICONS: Record<
  "home" | "chat" | "install" | "settings",
  IconType
> = {
  home: HiHome,
  chat: HiChatBubbleLeft,
  install: HiArrowDownTray,
  settings: HiCog6Tooth,
};

export { HiMagnifyingGlass };
