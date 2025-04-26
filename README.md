# tohno-chan-addons

Collection of atomic injectble tweaks for tohno-chan (vichan).

## Posts

- Relative time when hovering on a post timestamp

## Quickreply

> [!IMPORTANT]
> Depends on [jquery.min.js](https://github.com/vichan-devel/vichan/blob/master/js/jquery.min.js), [quick-reply.js](https://github.com/vichan-devel/vichan/blob/master/js/quick-reply.js) and [jquery-ui.custom.min.js](https://github.com/vichan-devel/vichan/blob/master/js/jquery-ui.custom.min.js) 

- Renameable file attachments
- Copy-paste images from clipboard
- Clear form when pressing the close button
- Additional toolbar buttons (preview, remove attachment, etc..)

## Hot to use

Inject the scripts however you prefer. I personally use a dummy user script and inject vichan dependencies using the `@require` rule when needed.

> [!TIP]
> You can use [git-hack](https://raw.githack.com/) and directly reference the scripts in this repo using their CDN.

```js
// ==UserScript==
// @name        Inject vichan scripts
// @namespace   vichan-scripts-inject
// @match       https://www.tohno-chan.org/*
// @grant       none
// @version     1.0
// @run-at      document-end
// ==/UserScript==

const script1 = document.createElement("script");
script1.src = "path/to/script1";
document.head.appendChild(script1);
```