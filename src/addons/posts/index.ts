import { SelectorsEnum } from "@shared/enums";
import { DOM } from "@shared/utils/globalUtils";
import addRelativeTime from "./features/add-relative-time";

const main = () => {
  const posts = document.querySelectorAll(SelectorsEnum.POST + ":not(.hidden)") as NodeListOf<HTMLDivElement>;

  /* Eager loading */
  /* ... */

  /* Lazy loading */
  posts.forEach((post) => DOM.onElementVisible(post, [addRelativeTime]));
};

try {
  DOM.onContentLoaded(main, SelectorsEnum.FORM);
} catch (err) {
  console.log("[posts-addon]", err);
}
