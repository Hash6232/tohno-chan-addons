import { Time } from "@shared/utils/globalUtils";

const handleCursorHover = (e: MouseEvent) => {
  const time = e.currentTarget as HTMLTimeElement | null;

  if (!time) return;

  time.title = Time.dateStringToRelative(time.dateTime);
};

const addRelativeTime = (post: HTMLElement) => {
  const time = post.querySelector("time") as HTMLTimeElement | null;

  if (!time) return;

  time.addEventListener("mouseenter", handleCursorHover);
};

export default addRelativeTime;
