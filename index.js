var css = require('css');
var fs = require('fs');
var _ = require('underscore');

function Astobj(path) {
  if (fs.existsSync(path)) {
    
    var style_content = fs.readFileSync(path).toString('utf8');
    this.ast = css.parse(style_content , { source: path });
    
  } else {
    this.ast = undefined;
  }
}


Astobj.prototype.get_rules_for_selector = function(selector) {
  
  var ok_rules = _.filter(this.ast["stylesheet"]["rules"], function(item){
    
    if (item.type == "rule") {
      if (_.indexOf(item.selectors,selector) != -1) {
        return true;
      }
    }
    
    return false;
  })
  
  return ok_rules;
}

Astobj.prototype.get_declarations_for_selector = function(selector) {
  var rules = this.get_rules_for_selector(selector);
  
  var declarations = _.map(rules,function(r) {
    return r.declarations;
  });
  
  return _.flatten(declarations);
}

Astobj.prototype.selector_has_property_anyvalue = function(selector, property) {

  var declarations = this.get_declarations_for_selector(selector);
  
  var found = _.find(declarations,function(decl) {
     if (decl.property == property) {
       return true;
     } else {
       return false;
     }
  });
  
  return (found !== undefined);
  
}


Astobj.prototype.selector_has_property = function(selector, property, property_value) {

  var declarations = this.get_declarations_for_selector(selector);
  
  var found = _.find(declarations,function(decl) {
     if ((decl.property == property)&&(decl.value == property_value)) {
       return true;
     } else {
       return false;
     }
  });
  
  return (found !== undefined);
  
}


var _get_ast = function(path) {
  return new Astobj(path);
}


module.exports = {
  "get_ast" : _get_ast
}