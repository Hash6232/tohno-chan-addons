# tohno-chan-tweaks

Collection of tweaks for tohno-chan (vichan).

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

I personally use a dummy user script as entrypoint and inject vichan dependencies using `@require` when needed.

> [!TIP]
> You can use [git-hack](https://raw.githack.com/) and directly reference the scripts in this repo using their CDN.

```js
// ==UserScript==
// @name        Tweaks for tohno-chan
// @namespace   tohno-chan-tweaks
// @match       https://www.tohno-chan.org/*
// @grant       none
// @version     1.0
// @run-at      document-end
// ==/UserScript==

const script = document.createElement("script");
script.src = "path/to/script";
document.head.appendChild(script);
```
