# Fork Information

This project was forked from https://bitbucket.org/dwarfy/codio-css-utils/src/master/.

3 new functions were added:

This returns all the CSS rules for a given media query (such as `"(max-width: 1050px)"`) and selector

- `get_rules_for_media_selector(media, selector)`

This returns all the CSS declarations for a given media query (such as `"(max-width: 1050px)"`) and selector

- `get_declarations_for_media_selector(media, selector)`

This returns true if given media query (such as `"(max-width: 1050px)"`) and `selector` has the property given with the value property_value.

- `media_selector_has_property=(media, selector, property, property_value)`

The rest of the documentation below is from the original source package. 

# codio-css-utils

This packages was developed for easing the use of the npm 'css' package.

It was developed for http://codio.com to ease the development of assessing student's code during the web development course.

It takes a css file path and return a AST object (which include the ast parsed by css package)

*Example :*

`var ast_object = cssutils.get_ast(stylepath);`

Then, the ast_object has 1 variable that you can access :

- `ast` which returns the css ast as parsed by the css package

And 4 functions :

 - `get_rules_for_selector = function(selector)`

This returns all the css rules found for a specific selector.

 - `get_declarations_for_selector = function(selector)`

This returns all the declarations found for a specific selector

 - `selector_has_property_anyvalue = function(selector, property)`

This returns true if `selector` has the property given with any value.

 - `selector_has_property = function(selector, property, property_value)`

This returns true if `selector` has the property given with the value property_value.

Here is a full example :



```js
var cssutils = require('codio-css-utils');

var errors = [];
var basepath = '/home/codio/workspace';
var stylepath = basepath + "/9-text-color/style.css";


var ast = cssutils.get_ast(stylepath);

if (ast.ast == undefined) {
    errors.push(stylepath + " doesn't exist or cannot be parsed");   
} else {
    if (!ast.selector_has_property("h1","color","red")) {
      errors.push("h1 doesnt have color red");
    }
  
    if (!ast.selector_has_property("h2","color","orange")) {
      errors.push("h2 doesnt have color orange");
    }
  
    if (!ast.selector_has_property("p","color","blue")) {
      errors.push("p doesnt have color blue");
    }
}

if( errors.length <= 0 ) {
    process.stdout.write('Well done!!!');
    process.exit(0);
}
else {
    process.stdout.write(errors.join("\n"));
    process.exit(1);
}
```