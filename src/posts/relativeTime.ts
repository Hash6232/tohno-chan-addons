import { DateUtils } from "@shared/utils/globalUtils";

const handleCursorHover = (e: MouseEvent) => {
  const time = e.currentTarget as HTMLTimeElement | null;

  if (!time) return;

  time.title = DateUtils.toRelative(new Date(time.dateTime));
};

const relativeTimeFeature = (post: Element) => {
  const time = post.querySelectorAll("time") as NodeListOf<HTMLTimeElement>;

  if (time.length < 1) return;

  time.forEach(el => el.addEventListener("mouseenter", handleCursorHover));
};

export default relativeTimeFeature;
