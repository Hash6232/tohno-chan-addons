# tohno-chan-tweaks

Collection of tweaks for tohno-chan (vichan).

## Form

- Paste files from clipboard into a post
- Rename files before uploading them
- File toolbar (preview, upload from URL, remove file)
- Auto-compression of images exceeding 10MB in size

## Posts

- Relative time when hovering on a post timestamp

## Quickreply

> [!IMPORTANT]
> Depends on [jquery.min.js](https://github.com/vichan-devel/vichan/blob/master/js/jquery.min.js), [quick-reply.js](https://github.com/vichan-devel/vichan/blob/master/js/quick-reply.js) and [jquery-ui.custom.min.js](https://github.com/vichan-devel/vichan/blob/master/js/jquery-ui.custom.min.js) 

- Clear all forms when closing the modal
- Spawn an empty modal by pressing `q`
- Auto-focus textarea when the modal appears

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
