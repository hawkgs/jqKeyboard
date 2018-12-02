![jqKeyboard](./misc/logo.png)

---

jQuery-based virtual keyboard.

## v1.0.2

**Changelog**:
- Handle dynamically-created `allowed` elements. (Credits: [avallcanera](https://github.com/avallcanera); [#3](https://github.com/hawkgs/jqKeyboard/issues/3))

## Demo

[Try it](https://hawkgs.github.io/jqKeyboard/)

## Installation

```
npm install jq-keyboard --save
```

Then add below your **jQuery** and **jQuery UI** imports the following HTML:

```html
<!-- CSS theme -->
<link rel="stylesheet" href="/node_modules/jq-keyboard/jqkeyboard.css" />
<!-- Library -->
<script src="/node_modules/jq-keyboard/jqkeyboard.min.js"></script>
<!-- Keyboard layout -->
<script src="/node_modules/jq-keyboard/jqk.layout.en.js"></script>
```

Note that the loading order of the library and layout files doesn't matter.

## Configure and run

In order to run the keyboard you have to call the `.init()` function which is part of the `jqKeyboard` object after the page loaded:
```javascript
$(function () {
    "use strict";

    jqKeyboard.init();
});
```

The API of the library provides few options which can be passed to `.init()` function as an object.

*   `containment` - _DOM element (string)_ - By default, the containment is set to `body` (i.e. whole page). You can specify your own containment by providing a DOM element. That way your keyboard could be dragged only in that element.
*   `allowed` - _Array of DOM input elements (strings_) - This option allows only listed elements to be jqKeyboard-active meaning that you won't be able to use the keyboard for the rest of the input elements. By default, jqKeyboard will work for all input elements on the page.
*   `icon` - _"dark" or "light" (string)_ - Depending on your prevailing page design color (being darker or lighter), you could use this option to change the color of the icon in order to achieve better contrast. The default value is "light".

Here is a sample code with the options:
```javascript
$(function () {
    "use strict";

    jqKeyboard.init({
        containment: "#field",
        allowed: ["input[type='text']", "#username-input"],
        icon: "dark"
    });
});
```
That's it!

## Custom Layouts

If you can't find your needed language layout from the existing ones (which is very likely to be so), you can create your own one. Okay, let's start with the initial layout script file:
```javascript
var jqKeyboard = jqKeyboard || {}; // trying not to override the jqKeyboard object.

jqKeyboard.layouts = [/* In this array we will put all layout objects */];
```

**Layout Objects**

After we are ready with the initial script file, we can proceed with filling the `layouts` array with our objects. Each layout object has two properties - `lang`, which must be unique and identifies the language (we suggest you keeping it short, eg. EN for English) and `layout`, which represents the layout itself.

`layout` **Property**

As you probably already noticed, the `layout` is an array of strings where each string represents a line, a new row of the keyboard. Each character is separated by space. Special keys are wrapped in `<<KEY_NAME>>`. Currently, these are the available ones:

_\<\<capslock\>\>, \<\<shift\>\>, \<\<tab\>\>, \<\<enter\>\>, \<\<space\>\>, \<\<backspace\>\>_

**Shift and Caps Lock**

If the character you entered supports lower/upper case, it will get automatically changed whenever you press Shift or Caps Lock. In the cases where you want to change the button sign completely whenever you press Shift you have to implicitly describe it in the character string by separating the signs with `|` symbol. An example - let's say we have the following string with characters:

```
<<shift>> a b c d +|-
```

In its normal state, the keyboard will render "a b c d +" (so in this case the left side of the sign combination). Whenever we press Shift, the keyboard will change to "A B C D -" (letters gets automatically uppercase where the sign changes to minus - right side). Summarized: Normal state - plus sign; Shift is active: minus sign.

**Non-ASCII Characters**

In order to render characters from different languages part of UTF-8 encoding, you should escape them accordingly. You can check English-Bulgarian layout for example.

## License

MIT
