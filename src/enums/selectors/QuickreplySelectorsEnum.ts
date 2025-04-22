export const enum Selectors {
    ROOT = "#quick-reply",
    TEXTAREA = Selectors.ROOT + " textarea[name='body']",
    UPLOADROW = Selectors.ROOT + " tr#upload",
    FILEINPUT = Selectors.ROOT + " input#upload_file",
}