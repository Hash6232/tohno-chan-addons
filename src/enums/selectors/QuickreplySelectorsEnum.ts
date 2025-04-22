const enum Selectors {
    ROOT = "#quick-reply",
    CLOSE = Selectors.ROOT + " a.close-btn",
    TEXTAREA = Selectors.ROOT + " textarea[name='body']",
    UPLOADROW = Selectors.ROOT + " tr#upload",
    FILEINPUT = Selectors.ROOT + " input#upload_file",
}

export { Selectors as QuickreplySelectors };