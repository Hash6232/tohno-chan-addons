import { getRelativeTime } from "@shared/utils";

const handleCursorHover = (e: MouseEvent) => {
  const time = e.currentTarget as HTMLTimeElement | null;

  if (!time) return;

  time.title = getRelativeTime(time.dateTime);
};

export const addRelativeTime = (post: HTMLElement) => {
  const time = post.querySelector("time") as HTMLTimeElement | null;

  if (!time) return;

  time.addEventListener("mouseenter", handleCursorHover);
};
