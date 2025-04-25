import { SelectorsEnum } from "@shared/enums";
import { runOnDOMLoaded } from "@shared/utils";

const main = () => {
  const posts = document.querySelectorAll(SelectorsEnum.POST + ":not(.hidden)") as NodeListOf<HTMLDivElement>;

};

try {
  runOnDOMLoaded(main, SelectorsEnum.POST_FORM);
} catch (err) {
  console.log("[posts-addon]", err);
}
