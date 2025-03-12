---
layout: default
title: RootMe - XSS - Server Side
permalink: /web-server/xss-server-side
---

# XSS - Server Side

## Statement
This platform for issuing certificates of participation has just gone live. The developers assure you that they have followed best practices and escaped all user inputs before using them in their code...

The flag is located in the `/flag.txt` file.

## Analyze

![Home page, Root-Me attestations generator](/assets/img/rootme/xss-server-side-1.png "Home page, Root-Me attestations generator")
The website is an attestation generator, you enter something and it give you a certified PDF from Root-Me.

![Generated pdf, Root-Me attestations generator](/assets/img/rootme/xss-server-side-2.png "Generated pdf, Root-Me attestations generator")

This is a classic case with PDF generators, bad escaped inputs. We need to break it down with custom HTML tag to read the content of **/flag.txt**.

First, let's try with `<b>test</b>` to verify if user inputs are really escaped.
![Generated pdf with <b>test</b>, Root-Me attestations generator](/assets/img/rootme/xss-server-side-3.png "Generated pdf with <b>test</b>, Root-Me attestations generator")

This doesn't work.

Let's explore other functionnalities of the website, we can Log-in and Sign up, let's try to generate a PDF with a logged in account.

To Sign up it asks :
- Login
- First Name
- Last Name
- Password

Let's try with <u>test, test2, test3, test</u>

![Generated pdf with test account, Root-Me attestations generator](/assets/img/rootme/xss-server-side-4.png "Generated pdf with test account, Root-Me attestations generator")

Our First name and Last name is displayed on the generated PDF when logged in, we can try to exploit these inputs.

I created a new account with `<b>hey</b>` as First name.

![Generated pdf with <b>hey</b> first name account, Root-Me attestations generator](/assets/img/rootme/xss-server-side-5.png "Generated pdf with <b>hey</b> first name account, Root-Me attestations generator")

It works !

## Exploitation
Now we need to exploit this to read **/flag.txt**
Here is my payload:

```html
<svg onload="var xhr = new XMLHttpRequest(); xhr.open('GET', '/flag.txt', false); xhr.send(); document.write(xhr.responseText);"> 
```
It's a `<svg>` that execute JS code to read the content of **/flag.txt**

I put the payload in the First name of a new account

Let's generated a new PDF, and we successfuly obtain the flag

`*******************************`

## How does it work ?
This exploit is called **Template based injection**, we send a payload to exploit the server side to make a infested template (here a PDF).