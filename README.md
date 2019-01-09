# The Rld (Ready Loaded Document)

**Rld** allows **dynamic loading** of javascript scripts within a web page.

The software consists of 3 elements:
* The *rld code* (in the form of *.js* files or *inline scripts*)
* a *.json* file
* an optional global variable `rld`

## What do these files do?

Using **Rld** we can control the moment in which the external scripts are inserted and loaded on the web page.
* the list of external scripts is delegated to a single file in *json format* (*rld.json*) and subtracted from *html code*
* the scripts are loaded following the reading order of the *rld.json* file
* scripts are loaded after `ready` and`load` events
* simplified maintainability
* cross browser compatibility


# `rld.js`

## Installation

* inline (this is the safest method!)
  * download the file [rld.min.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.min.js) ([rld.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.js) if you are debugging)
  * open the file with a simple text editor
  * copy the contents of the file
  * create a `<script></script>` tag in your *html code*
  * paste the contents of the file into the tag
  > e.g.
  >
  > ```html
  > <script>/** @license Rld (Ready Loaded Document) may be freely distributed under the GNU AGPLv3 license. (c) 2018-2018 Giuseppe Ferri */
  > !function(r,u,e){if(!r||!u)throw new Error("rld needs a window and a document!");if(!u.querySelector("html"))throw new Error("rld needs a html element!"); [...]</script>
  > ```
  > _
* external
  * download the file [rld.min.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.min.js) ([rld.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.js) if you are debugging) or note the file link in the server
  * create a tag `<script src=_path_></script>` into your html code (`_path_` is the address to the *rld.js* file)
  > e.g.
  >
  > ```html
  > <script src="https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.min.js"></script>
  > ```
  > _

## Rld API

Rld works as a simple drop-in solution.

In most cases there is no need to configure Rld.


# rld.json

**Rld** needs a *.json* file.

By default **Rld** searches for and loads a *rld.json* file in the same directory as the *html* page.

It is possible to pass a personalized path in two ways:
1. adding a string with the path as the third argument at the end of the *rld.js* code
2. creating a global `rld` variable with a `path` property before including the code *rld.js* (see below)

> Mode 1 does not work with the minimized file *rld.min.js*

## structure of *rld.json*

The structure is based on this scheme:
```json
{
    "_name_": {
        "path": "_available_path_",
        "event": "_available_event_",
        "insert": { "element": "_available_element_", "position": "_available_position_" }
    },
}
```
* `_name_`: \[required\] the name of the script (it must match the file name without the *.js* extension)
* `_available_path_`: \[optional\] the path to the script. The string can be modified. The default value is `"./_name_.js"`.
  * an empty string `"" -> "./_name_.js"`
  * the string ends with a slash `"dir/" -> "dir/_name_.js"`
  * the string ends with a directory `"dir" -> "dir/_name_.js"`
  * the string ends with *.js*
    * **corrected** `"dir/_name_.js" -> "dir/_name_.js"`
    * **wrong** `"dir/file.js" -> "dir/file.js"`
  * the string ends with `_name_`
    * **corrected** if the script is in a folder with the **same name** as  `"dir/_name_" -> "dir/_name_/_name_.js"`
* `_available_event_`: \[optional\] the event after which to insert the script in the DOM. Valid values ​​are `"ready"`, `"load"`. The default value is `"load"`.
* `insert`: \[optional\]
  * `_available_element_`: \[optional\] the HTML element to refer to when inserting the script. **Rld** uses the [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) function, so the value can be a DOMString containing one or more selectors to match. This string must be a valid CSS selector string. The default value is `"body"`.
  * `_available_position_`: \[optional\] the position relative to `_available_element_` in which to insert the script. **Rld** uses the [insertAdjacentScript](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement) function. The allowed values ​​are: `"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"`. The default value is `"beforeend"`.
  > e.g.
  > ```
  > root/test/index.html
  > root/js/script1.js
  > root/js/script2.js
  > root/js/script3.js
  > root/test/script4.js
  > root/js/script5.js <---- error
  > root/js/script6.js
  > root/js/script7/script7.js
  > root/test/script8.js
  > ```
  > 
  > ```json
  > {
  >     "script1": {
  >         "path": "../js/script1.js",
  >         "event": "ready",
  >       "insert": { "element": "head", "position": "afterbegin" }
  >   },
  >     "script2": {
  >         "path": "../js/",
  >         "event": "ready",
  >         "insert": { "element": "head", "position": "beforeend" }
  >     },
  >     "script3": {
  >         "path": "../js",
  >         "event": "ready",
  >         "insert": { "element": "head", "position": "beforeend" }
  >     },
  >     "script4": {
  >         "path": "",
  >        "event": "ready",
  >         "insert": { "element": "head", "position": "beforeend" }
  >     },
  >     "script5": {
  >         "comment": "Failed to load resource: the server responded with a status of 404 ()",
  >         "path": "../js/script5",
  >         "event": "ready",
  >         "insert": { "element": "head", "position": "beforeend" }
  >     },
  >     "script6": {
  >         "path": "../js/script6.js",
  >         "event": "load",
  >         "insert": { "element": "body", "position": "beforeend" }
  >     },
  >     "script7": {
  >         "path": "../js/script7",
  >         "insert": { "element": "body", "position": "beforeend" }
  >     },
  >     "script8": {
  >     },
  > }
  > ```
  > _

# `window.rld` option

The `rld` option is an object, which describes the **path** to file *.json* containing the information to insert the scripts dynamically.

**Configuring `rld` before `rld.js` is included.**

```js
// create a global rld options object
window.rld = {
  path: _path_json_ 
};
```


## Rld Known Issues and Limitations

At the moment *Rld* is still under testing.


### Why is it called a *rld*?

The term **rld** is the union of the **Ready** **Loaded** **Document** initials and indicates the two events related to the loading of the DOM and `document` resources.

# See also

* [JFProgrammer](https://jfprogrammer.altervista.org/rld/ "Rld")
* [Source code with comments](https://jfprogrammer.altervista.org/rld/docs/rld.1.0.0.html "Source code with comments")
* [Example 1](https://jfprogrammer.altervista.org/rld/test/example1.html "Example 1")
* [Example 1 incorrect](https://jfprogrammer.altervista.org/rld/test/example1_incorrect.html "Example 1 incorrect")
* [Example 2](https://jfprogrammer.altervista.org/rld/test/example2.html "Example 2")
* [Example 3](https://jfprogrammer.altervista.org/rld/test/example3.html "Example 3")
