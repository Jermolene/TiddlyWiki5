/*\
title: $:/core/modules/widgets/action-listops.js
type: application/javascript
module-type: widget

Action widget to apply list operations to any tiddler field (defaults to the 'tags' field of the current tiddler)

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  var Widget = require("$:/core/modules/widgets/widget.js").widget;

  var ActionListopsWidget = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  /*
  Inherit from the base widget class
  */
  ActionListopsWidget.prototype = new Widget();

  /*
  Render this widget into the DOM
  */
  ActionListopsWidget.prototype.render = function (parent, nextSibling) {
    this.computeAttributes();
    this.execute();
  };

  /*
  Compute the internal state of the widget
  */
  ActionListopsWidget.prototype.execute = function () {
    // Get our parameters
    this.target = this.getAttribute("$tiddler", this.getVariable("currentTiddler"));
    this.filter = this.getAttribute("$filter");
    this.subfilter = this.getAttribute("$subfilter");
    this.listField = this.getAttribute("$list", "list");
    this.listIndex = this.getAttribute("$index");
    this.filtertags = this.getAttribute("$tags");
  };

  /*
  Refresh the widget by ensuring our attributes are up to date
  */
  ActionListopsWidget.prototype.refresh = function (changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if (changedAttributes.$tiddler || changedAttributes.$filter || changedAttributes.$subfilter || changedAttributes.$list || changedAttributes.$index || changedAttributes.$tags) {
      this.refreshSelf();
      return true;
    }
    return this.refreshChildren(changedTiddlers);
  };

  /*
  Invoke the action associated with this widget
  */
  ActionListopsWidget.prototype.invokeAction = function (triggeringWidget, event) {
    //try this
    var field = this.listField,
        index = undefined,
        type = "!!",
        list = this.listField;
    if (this.listIndex) {
        field = undefined;
        index = this.listIndex; type = "##";
        list = this.listIndex;
    }
    if (this.filter) {
      this.wiki.setText(this.target, field, index, $tw.utils.stringifyList(this.wiki.filterTiddlers(this.filter, this)));
    }
    if (this.subfilter) {
      var subfilter = "[list[" + this.target + type + list + "]] " + this.subfilter;
      this.wiki.setText(this.target, field, index, $tw.utils.stringifyList(this.wiki.filterTiddlers(subfilter, this)));
    }
    if (this.filtertags) {
      var tagfilter = "[list[" + this.target + "!!tags]] " + this.filtertags;
      this.wiki.setText(this.target, "tags", undefined, $tw.utils.stringifyList(this.wiki.filterTiddlers(tagfilter, this)));
    }
    return true; // Action was invoked
  };

  exports["action-listops"] = ActionListopsWidget;

})();
