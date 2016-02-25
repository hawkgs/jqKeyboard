![jqKeyboard](https://raw.githubusercontent.com/hAWKdv/jqKeyboard/master/misc/logo.png)

====

jQuery-based virtual keyboard.

**V1.0.0 Beta**

## Demo

[Try it](http://htmlpreview.github.io/?https://raw.githubusercontent.com/hAWKdv/jqKeyboard/master/demos/main.html)

## How to use?

In order to implement jqKeyboard in your project you have to:

**1\. Include jQuery and jQuery UI libraries to your code:**
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
```

**2\. Pick a theme from** `themes` **folder and load it.**
```
<link rel="stylesheet" href=".../css/jqkeyboard.css" />
```

**3\. Include jqKeyboard library:**
```
<script src=".../scripts/jqkeyboard.min.js"></script>
```

**4\. Go to** `layouts` **folder and pick your desired one (If you want to create your own, check _Custom Layouts_ below):**
```
<scripts src=".../scripts/jqk.layout.en.js"></script>
```Note that the loading order of the library and layout doesn't matter.

**5\. Configure and run:**
In order to run the keyboard you have to call the `.init()` function which is part of the `jqKeyboard` object after the page loaded:
```
$(function () {
    "use strict";

    jqKeyboard.init();
});
```

The API of the library provides few options which can be passed to `.init()` function as an object.

*   `containment` - _DOM element (string)_ - By default, the containment is set to `body` (i.e. whole page). You can specify your own containment by providing a DOM element. That way your keyboard could be dragged only in that element.
*   `allowed` - _Array of DOM input elements (strings_) - This option allows only listed elements to be jqKeyboard-active meaning that you won't be able to use the keyboard for the rest of the input elements. By default, jqKeyboard will work for all input elements on the page.
*   `icon` - _"dark" or "light" (string)_ - Depending on your prevailing page design color (being darker or lighter), you could use this option in order to change the color of the icon in order to achieve better contrast. The default value is "light".

Here is a sample code with the options:
```
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
```
var jqKeyboard = jqKeyboard || {}; // trying not to override the jqKeyboard object.

jqKeyboard.layouts = [/* In this array we will put all layout objects */];
```
**Layout Objects**

After we are ready with the initial script file, we can proceed with filling the layouts array with our objects. Each layout object has two properties - `lang`, which must be unique and identifies the language (we suggest you keeping it short, eg. EN for English) and `layout`, which represents the layout itself.

`layout` **Property**

As you probably already noted, the `layout` is an array of strings where each string represents a line, a new row of the keyboard. Each letter is separated by space. Special keys are wrapped in `<<KEY_NAME>>`. Currently, these are available ones:

_\<\<capslock\>\>, \<\<shift\>\>, \<\<tab\>\>, \<\<enter\>\>, \<\<space\>\>, \<\<backspace\>\>_

**Shift and Caps Lock**

If the letter you entered supports lower/upper case, it will get automatically changed whenever you press Shift or Caps Lock. In the cases, where you want change the button sign completely whenever you press Shift you have to implicitly describe it in the letter string by separating the signs with |. An example - let's say we have the following string with letters:

```
<<shift>> a b c d +|-
```
In its normal state, the keyboard will render "a b c d +" (so in this case the left side of the sign combination). Whenever we press Shift, the keyboard will change to "A B C D -" (letters gets automatically uppercase where the sign changes to minus - right side). Summarized: Normal state - plus sign; Shift is active: minus sign.

**Non-ASCII Characters**

In order to render characters from different languages part of UTF-8 encoding, you should escape them accordingly. You can check English-Bulgarian layout for example.

## License

MIT