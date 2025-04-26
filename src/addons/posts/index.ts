import { SelectorsEnum } from "@shared/enums";
import { lazyLoading, runOnDOMLoaded } from "@shared/utils/globalUtils";
import { addRelativeTime } from "./features/add-relative-time";

const main = () => {
  const posts = document.querySelectorAll(SelectorsEnum.POST + ":not(.hidden)") as NodeListOf<HTMLDivElement>;

  /* One-timers */
  /* ... */

  /* On-demand features */
  lazyLoading(posts, [
    addRelativeTime
  ]);
};

try {
  runOnDOMLoaded(main, SelectorsEnum.FORM);
} catch (err) {
  console.log("[posts-addon]", err);
}
