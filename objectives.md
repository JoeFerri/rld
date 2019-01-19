# rld v1.1.x

* **rld.json**
  * - [ ] beforeInsert
  * - [ ] afterInsert
  * - [ ] async
  * - [ ] defer
  * - [ ] charset
  * - [ ] type
  * - [ ] src
  * - [ ] priority

* **event**
  * - [ ] now (add to [ready, load])

* **rld**
  * - [ ] `var rld`
  * - [ ] `rld.ready = function _f_(...) return rld`
  * - [ ] `rld.load = function _f_(...) return rld`
  * - [ ] `rld.now = function _f_(...) return rld`
  * - [ ] `rld.concat = function _fc_(...) return rld`
  * - [ ] `_f_({function} fn, {string} ev, {object} data)`
  * - [ ] `_f_({string} str, {string} ev, {object} data)`
  * - [ ] `_f_({HTMLElement} el, {string} ev, {object} data)`
  * - [ ] `_fc_([{function} fn, {string} ev, {object} data])`

## rld.json

```
{
  "_name_": {
    "path": "_available_path_",
    "event": "_available_event_",
    "insert": {
      "element": "_available_element_",
      "position": "_available_position_"
    },
    "beforeInsert": "_fn_bf_name_",
    "afterInsert": "_fn_af_name_",
    "async": "_async_flag_",
    "defer": "_defer_flag_",
    "charset": "_charset_",
    "type": "_type_",
    "src": "_full_src_",
    "priority": "_priority_"
  },
}
```

### beforeInsert

* _fn_bf_name_ = a global function name to be run before insertion.

### afterInsert

* _fn_af_name_ = a global function name to be run after insertion.

### async

* Adds the "async" attribute.
* _async_flag_ = true | false | empty
  * empty -> false 

### defer

* Adds the "defer" attribute.
* _defer_flag_ = true | false | empty
  * empty -> false 

### charset

* Specifies the character encoding used in an external script file.
  * "ISO-8859-1" - Standard encoding for the Latin alphabet
  * "UTF-8" - Character encoding for Unicode. Compatible with ASCII 

### type

* Specifies the media type of the script.
  * "application/javascript"
  * "application/ecmascript"

### src

* Specifies the URL of the external script file.
* If it is specified it has priority over *"path"*
* It must be a complete URL including the file name and extension (unlike "path").

### priority

* Insertion ordering
* _priority_ = int value
* Scripts with the same priority are sorted by reading order.

## event

### now

* instant execution

## rld


### `var rld`

* create global object *rld*

### `rld.ready = function _f_(...) return rld`

* add *ready* method
* ev = "ready"

### `rld.load = function _f_(...) return rld`

* add *load* method
* ev = load"

### `rld.now = function _f_(...) return rld`

* add *now* method
* ev = "now"

### `rld.concat = function _fc_(...) return rld`

* add *concat* method

### `_f_({function} fn, {string} ev, {object} data)`

* fn = function to be performed after the event "ev"
* ev = "ready" | "load" | "now"
* - [ ] data = `{args: [...], ?}`
  * args = the real values passed to (and received by) the function *fn*.

### `_f_({string} str, {string} ev, {object} data)`

* str = path | script | html
  * - [ ] path: `"../dir/script.js"`
  * script:
    * - [ ] `'<script src="../dir/script.js"></script>'`
    * - [ ] `'var x = {p: y.getFlag()}; if (x.p) ...'` -> `<script>'var x = {p: y.getFlag()}; if (x.p) ...</script>'`
  * html:
    * - [ ] `<p>demo</p>`
    * - [ ] `<div><p>demo</p></div>`
* ev = "ready" | "load" | "now"
* - [ ] data = `{?}`

### `_f_({HTMLElement} el, {string} ev, {object} data)`

* el = html element to insert after the event "ev"
* ev = "ready" | "load" | "now"
* - [ ] data = `{attrs: [...], ?}`
  * attrs = attribute for additional information about the element 

### `_fc_([{function} fn, {string} ev, {object}`

* It concatenates the insertion of the elements or the execution of the functions.
* The next script / element is inserted into the DOM and loaded only after loading the previous one.
The next function is executed after the previous one has been executed or after the previous element has been loaded.
