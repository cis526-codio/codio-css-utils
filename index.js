var css = require('css');
var fs = require('fs');
var pa = require('path')
var _ = require('underscore');
var cheerio = require('cheerio')

function Astobj(path) {
  if (fs.existsSync(path)) {
    
    var extname = pa.extname(path);
    
    if (extname == ".css") {
      var style_content = fs.readFileSync(path).toString('utf8');
      this.ast = css.parse(style_content , { source: path });
    } else if (extname == ".html" || extname == ".htm") {
      var html_content = fs.readFileSync(path).toString('utf8');
      var $ = cheerio.load(html_content);
      var style_content = "";
      
      $("style").each(function() {
        style_content+=$(this).text();
      });
      
      this.ast = css.parse(style_content);
    }
    
   
    
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

Astobj.prototype.selector_or_has_property = function(selectors_or, property, property_value) {
  
 var that = this;

 return _.any(selectors_or,function(sel){
   return that.selector_has_property(sel, property, property_value)
 })
  
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

Astobj.prototype.style_string_to_obj = function(style_string) {
    var parts = style_string.split(";")
    var style_obj = {};
    _.each(parts,function(item,index,list) {
        
        var elems = item.trim().split(":");
        
        if (elems && (elems.length == 2)) {
            var prop = elems[0].trim();
            var val = elems[1].trim();
        
            style_obj[prop] = ""+val;
        }
        

    });
    
    return style_obj;
}

Astobj.prototype.check = function(check_rules,errors) {
    
    var that = this;
    var selector = check_rules.selector;
    var check = null;
    
    if (typeof check_rules.check === "string") {
        check = that.style_string_to_obj(check_rules.check);
    } else if (typeof check_rules.check === "object") {
        check = check_rules.check;
    }
    
    if (!check) {
        return;
    }
    
    
    _.each(check,function(value, key, list){
        if (!that.selector_has_property(selector,key,value)) {
            errors.push(selector + " should have "+ key + " " + value);
        }
    })
    
}


var _get_ast = function(path) {
  return new Astobj(path);
}


module.exports = {
  "get_ast" : _get_ast
}