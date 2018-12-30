//     rld.js 1.0.0
//     https://jfprogrammer.altervista.org/rld
//     (c) 2018-2018 Giuseppe Ferri
//     Rld (Ready Loaded Document) may be freely distributed under the GNU AGPLv3 license.

/** @license Rld (Ready Loaded Document) may be freely distributed under the GNU AGPLv3 license. (c) 2018-2018 Giuseppe Ferri */

// * [Home](https://jfprogrammer.altervista.org/rld/index.html  "Home")
// * [rld.1.0.0.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.js  "Rld")
// * [rld.1.0.0.min.js](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.min.js  "Rld minimized")
// * [rld.1.0.0.min.js.map](https://jfprogrammer.altervista.org/rld/dist/rld.1.0.0.min.js.map  "Rld map")

/*
 | script:{
 |           "name":"rld",
 |           "author":"Giuseppe Ferri",
 |           "version":"1.0.0",
 |           "copyright":"2018",
 |           "license":"https://www.gnu.org/licenses/agpl.html",
 |           "required":"ECMAScript(JavaScript) v.2016"
 |         }
*/

/*!
 * Rld JavaScript Code v1.0.0
 * https://jfprogrammer.altervista.org/rld
 *
 * Copyright (C) 2018 Giuseppe Ferri
 * 
 * Released under the GNU AGPLv3 license
 * https://www.gnu.org/licenses/agpl.html
 * 
 * Rld is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * Rld is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program (see file COPYING).  If not, see <http://www.gnu.org/licenses/>.
 *
 * Required: ECMAScript(JavaScript) v.2016
 * Date: 2018-12-23T00:00Z
 */

// Rld (Ready Loaded Document) allows you to dynamically load javascript scripts.
// Once the initial event has been chosen (ready DOM or loaded resources)
// the next script is inserted in the DOM and loaded only after the previous one has been loaded.
(function(win, doc, path) {
    if (!(win && doc)) throw new Error("rld needs a window and a document!");
    if (!doc.querySelector('html')) throw new Error("rld needs a html element!");

    // custom options
    var rld = typeof win.rld === "object" ? win.rld : {

        // default location of the rld.json file
        path: typeof path === "string" ? path : "rld.json"
    };

    // `itself` is the starting point for any new script element inserted.
    // You must enter the rld code in a script tag.
    // This tag has a `data-rld` attribute to find itself.
    // Alternatively, use the document.currentScript property or a new script.
    var itself = doc.querySelector("script[data-rld]") || doc.currentScript || null;

    // document.currentScript does not have good support
    if (itself === null) {

        // Create a new script element as a starting point
        itself = doc.createElement("script");
        itself.setAttribute("data-rld", "auto");

        // Insert the new script element into the body, head or html element
        var el = document.querySelector('body') || document.querySelector('head') || document.querySelector('html');
        el.insertAdjacentElement('beforeend ', itself);
    }

    // ## Events

    var
    // if the addEventListener function is supported, it prefers it
    //
    // @see [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener "addEventListener")
        addELSupport = (win.addEventListener) ? true : false,

        // only for old versions of Internet Explorer
        ieSupport = (win.attachEvent) ? true : false,

        // Sets up a function that will be called whenever the specified event is delivered to the target.
        //
        // @return none
        // * *elem* the target may be any object that supports events
        // * *type* a case-sensitive string representing the event type to listen for (without the "on" prefix).
        // * *listener* the function which receives a notification when an event of the specified type occurs.
        // * *options* an options object (or one boolean value) that specifies characteristics about the event listener. 
        addEvent = function(elem, type, listener, options) {

            // default target is `window`
            elem = elem || win;

            // as default it uses capture, a Boolean indicating that events of this type
            // will be dispatched to the registered listener before
            // being dispatched to any EventTarget beneath it in the DOM tree.
            options = options || false;

            // uses the correct procedure
            addELSupport ? elem.addEventListener(type, listener, options) :
                ieSupport ? elem.attachEvent("on" + type, listener) :
                elem["on" + type] = listener;

        },

        // Sets up a function that will be called whenever the `load` event is delivered to the target.
        //
        // @return none
        // * *elem* the target may be any object that supports events
        // * *listener* the function which receives a notification when the `load` event occurs.
        // * *options* an options object (or one boolean value) that specifies characteristics about the event listener. 
        addOnLoad = function(elem, listener, options) {

            // *elem* is optional
            if (typeof elem === "function") {
                options = listener;
                listener = elem;
                elem = undefined;
            }

            // add event listener
            addEvent(elem, "load", listener, options);
        },

        // Sets up a function that will be called whenever the `ready` event is delivered to the document.
        //
        // @see [readyState](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState "readyState")
        //
        // @return none
        // * *listener* the function which receives a notification when the `ready` event occurs.
        // * *options* an options object (or one boolean value) that specifies characteristics about the event listener. 
        addOnReady = function(listener, options) {

            // wraps the listener for `ieSupport` as the loading of the dom may have already been done
            var fn = function(event) {
                if (doc.readyState === "complete" || doc.readyState === "interactive") {
                    listener(event);
                    return true;
                }
            };

            // if loading hasn't finished yet
            if (addELSupport && doc.readyState === "loading") {
                addEvent("DOMContentLoaded", listener, options);
            } else if (ieSupport && doc.readyState === "loading") {
                addEvent("readystatechange", fn);
            } else {
                // `DOMContentLoaded` has already fired
                listener();
            }
        },

        // ## Utility

        // Given a node, it correctly formats the path it contains.
        //
        // @return {string} a path correctly formatted
        // * *node* the object with the path information
        getPath = function(node) {

            // initialize the path
            var path = node.path || "";

            // by default the path is "./name-script.js"
            if (path === "") return node.name + ".js";
            // ".js" corresponds to a javascript file
            if (path.endsWith(".js")) return path;
            // adds "name-script.js"" to the path
            if (path.endsWith("/")) return path + node.name + ".js";
            // in the future it could return an array
            // `[path + ".js", path + "/" + node.name + ".js"]`
            if (path.endsWith(node.name)) return path + "/" + node.name + ".js";

            return path + "/" + node.name + ".js";
        },

        // Inserts a script into the document.
        //
        // @see [insertAdjacentElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement "insertAdjacentElement")
        //
        // @return none
        // * *next* the object with the script reference and with the insert position information
        insertAdjacentScript = function(next) {
            if (next) {
                var elem = doc.querySelector(next.insert.element);
                elem.insertAdjacentElement(next.insert.position, next.script);
            }
        },

        // object that will contain information about the scripts to be inserted in the document
        pathsJSON = {
            // the "empty" property will be deleted after the parsing of rld.json
            empty: true
        },


        // ## Core

        // When the ajax procedure is successfully terminated,
        // this function takes care of the actual insertion of the scripts.
        //
        // @return none
        run = function() {
            // assertion: the `empty` property of the `pathsJSON` variable must have been deleted!
            if (typeof pathsJSON.empty === "undefined") {
                // names of the scripts
                var keys = Object.keys(pathsJSON),
                    // it will split the scripts in relation to the event
                    nodes = {
                        onready: [],
                        onload: []
                    },
                    // contains the information to insert a single script
                    node = {},
                    // contains the information to insert the next script
                    next = null,
                    i = 0;

                // Initializes and modifies data for insertion or creates them if missing.
                // Then sorts the nodes in two arrays (`onready` and `onload`)
                for (i = 0; i < keys.length; i++) {
                    // gets data information
                    node = pathsJSON[keys[i]];
                    // assigns a name
                    node.name = keys[i];
                    // assigns a valid path
                    node.path = getPath(node); // it could be an array in the future?

                    // Initializes, modifies, creates data for insertion

                    // default event: `load`
                    if (typeof node.event === "undefined" || node.event === "") node.event = "load";
                    if (node.event !== "ready" && node.event !== "load") node.event = "load";
                    // default insertion: `body`,`beforeend`
                    if (typeof node.insert === "undefined" || Object.keys(node.insert).length === 0) node.insert = {
                        element: "body",
                        position: "beforeend"
                    };
                    if (typeof node.insert.element === "undefined") node.insert.element = "body";
                    if (typeof node.insert.position === "undefined") node.insert.position = "beforeend";
                    if (!/beforebegin|afterbegin|beforeend|afterend/.test(node.insert.position)) node.insert.position = "beforeend";

                    // creates a new script element
                    node.script = document.createElement("script");
                    /*node.script.src = node.path;*/ // moved! the script can not be loaded

                    // sorts the nodes
                    if (node.event === "ready") nodes.onready.push(node);
                    else nodes.onload.push(node);
                }

                // a useful function to avoid a closure error
                var getListener = function(next) {
                    return function() {
                        insertAdjacentScript(next);
                    }
                }

                // creates a load chain after the `ready` event (only if `nodes.onready.length > 1`)
                for (i = 0; i < (nodes.onready.length - 1); i++) {
                    node = nodes.onready[i];
                    next = nodes.onready[i + 1];
                    var listener = getListener(next);
                    addOnLoad(node.script, listener);
                }

                // creates a load chain after the `load` event (only if `nodes.onload.length > 1`)
                for (i = 0; i < (nodes.onload.length - 1); i++) {
                    node = nodes.onload[i];
                    next = nodes.onload[i + 1];
                    var listener = getListener(next);
                    addOnLoad(node.script, listener);
                }

                // assigns the corresponding path (`src`) to each script
                for (i = 0; i < keys.length; i++) {
                    var node = pathsJSON[keys[i]];
                    node.script.src = node.path;
                }

                // creates and starts the initial insertion points
                if (nodes.onready.length > 0) addOnReady(function() {
                    if (nodes.onload.length > 0) {
                        var node = nodes.onready[nodes.onready.length - 1];
                        var next = nodes.onload[0];
                        var listener = getListener(next);
                        // if there are any scripts to insert after the `load` event
                        // and all the resources are loaded
                        // it connects the last script of the `onready` array to the
                        // first script of the `onload` array
                        if (doc.readyState === "complete") addOnLoad(node.script, listener);
                        // otherwise it connects the first script of the `onload` array to `window`
                        else addOnLoad(listener);
                    }
                    // inserts the first script
                    insertAdjacentScript(nodes.onready[0]);
                });
                else if (nodes.onload.length > 0) {
                    // if all the resources are loaded it immediately inserts the first script
                    if (doc.readyState === "complete") insertAdjacentScript(nodes.onload[0]);
                    else addOnLoad(function() {
                        // inserts the first script
                        insertAdjacentScript(nodes.onload[0]);
                    });
                }
            }
        },

        // for the AJAX procedure
        xmlhttp = new XMLHttpRequest();

    // ## AJAX

    // function to be executed when the readyState changes.
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // parses the contents of the "rld.json" file. The `empty` property is deleted.
            pathsJSON = JSON.parse(this.responseText);
            // performs the main function of rld
            run();
        }
    };

    // specifies the type of request (synchronous is deprecated)
    xmlhttp.open("GET", rld.path, true);
    // sends the request to the server
    xmlhttp.send();

}(window, document));