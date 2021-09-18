/*\
module-type: utils
title: $:/core/modules/utils/linkedlist.js
type: application/javascript

This is a doubly-linked indexed list intended for manipulation, particularly
pushTop, which it does with significantly better performance than an array.

\*/
(function(){

function LinkedList() {
	this.clear();
};

LinkedList.prototype.clear = function() {
	// LinkedList performs the duty of both the head and tail node
	this.next = new OurMap();
	this.prev = new OurMap();
	this.first = undefined;
	this.last = undefined;
	this.length = 0;
};

LinkedList.prototype.remove = function(value) {
	if($tw.utils.isArray(value)) {
		for(var t=0; t<value.length; t++) {
			_assertString(value[t]);
		}
		for(var t=0; t<value.length; t++) {
			_removeOne(this,value[t]);
		}
	} else {
		_assertString(value);
		_removeOne(this,value);
	}
};

/*
Push behaves like array.push and accepts multiple string arguments. But it also
accepts a single array argument too, to be consistent with its other methods.
*/
LinkedList.prototype.push = function(/* values */) {
	var values = arguments;
	if($tw.utils.isArray(values[0])) {
		values = values[0];
	}
	for(var i = 0; i < values.length; i++) {
		_assertString(values[i]);
	}
	for(var i = 0; i < values.length; i++) {
		_linkToEnd(this,values[i]);
	}
	return this.length;
};

LinkedList.prototype.pushTop = function(value) {
	if($tw.utils.isArray(value)) {
		for (var t=0; t<value.length; t++) {
			_assertString(value[t]);
		}
		for(var t=0; t<value.length; t++) {
			_removeOne(this,value[t]);
		}
		for(var t=0; t<value.length; t++) {
			_linkToEnd(this,value[t]);
		}
	} else {
		_assertString(value);
		_removeOne(this,value);
		_linkToEnd(this,value);
	}
};

LinkedList.prototype.each = function(callback) {
	var visits = Object.create(null),
		value = this.first;
	while(value !== undefined) {
		callback(value);
		var next = this.next.get(value);
		if(typeof next === "object") {
			var i = visits[value] || 0;
			visits[value] = i+1;
			value = next[i];
		} else {
			value = next;
		}
	}
};

LinkedList.prototype.toArray = function() {
	var output = new Array(this.length),
		index = 0;
	this.each(function(value) { output[index++] = value; });
	return output;
};

LinkedList.prototype.makeTiddlerIterator = function(wiki) {
	var self = this;
	return function(callback) {
		self.each(function(title) {
			callback(wiki.getTiddler(title),title);
		});
	};
};

function _removeOne(list,value) {
	var prevEntry = list.prev.get(value),
		nextEntry = list.next.get(value),
		prev = prevEntry,
		next = nextEntry;
	if(typeof nextEntry === "object") {
		next = nextEntry[0];
		prev = prevEntry[0];
	}
	// Relink preceding element.
	if(list.first === value) {
		list.first = next
	} else if(prev !== undefined) {
		if(typeof list.next.get(prev) === "object") {
			if(next === undefined) {
				// Must have been last, and 'i' would be last element.
				list.next.get(prev).pop();
			} else {
				var i = list.next.get(prev).indexOf(value);
				list.next.get(prev)[i] = next;
			}
		} else {
			list.next.set(prev,next);
		}
	} else {
		return;
	}
	// Now relink following element
	// Check "next !== undefined" rather than "list.last === value" because
	// we need to know if the FIRST value is the last in the list, not the last.
	if(next !== undefined) {
		if(typeof list.prev.get(next) === "object") {
			if(prev === undefined) {
				// Must have been first, and 'i' would be 0.
				list.prev.get(next).shift();
			} else {
				var i = list.prev.get(next).indexOf(value);
				list.prev.get(next)[i] = prev;
			}
		} else {
			list.prev.set(next,prev);
		}
	} else {
		list.last = prev;
	}
	// Delink actual value. If it uses arrays, just remove first entries.
	if(typeof nextEntry === "object") {
		nextEntry.shift();
		prevEntry.shift();
	} else {
		list.next.set(value,undefined);
		list.prev.set(value,undefined);
	}
	list.length -= 1;
};

// Sticks the given node onto the end of the list.
function _linkToEnd(list,value) {
	if(list.first === undefined) {
		list.first = value;
	} else {
		// Does it already exists?
		if(list.first === value || list.prev.get(value) !== undefined) {
			if(typeof list.next.get(value) === "string") {
				list.next.set(value,[list.next.get(value)]);
				list.prev.set(value,[list.prev.get(value)]);
			} else if(typeof list.next.get(value) === "undefined") {
				// list.next[value] must be undefined.
				// Special case. List already has 1 value. It's at the end.
				list.next.set(value,[]);
				list.prev.set(value,[list.prev.get(value)]);
			}
			list.prev.get(value).push(list.last);
			// We do NOT append a new value onto "next" list. Iteration will
			// figure out it must point to End-of-List on its own.
		} else {
			list.prev.set(value,list.last);
		}
		// Make the old last point to this new one.
		if(typeof list.next.get(list.last) === "object") {
			list.next.get(list.last).push(value);
		} else {
			list.next.set(list.last,value);
		}
	}
	list.last = value;
	list.length += 1;
};

function _assertString(value) {
	if(typeof value !== "string") {
		throw "Linked List only accepts string values, not " + value;
	}
};

var OurMap;

if (typeof Map === "function") {
	OurMap = Map;
} else {
	// Create a simple backup map for IE and such which handles undefined.
	OurMap = function() {
		this.map = Object.create(null);
	};

	OurMap.prototype.set = function(key,value) {
		(key === undefined) ? (this.undef = value) : (this.map[key] = value);
	};

	OurMap.prototype.get = function(key) {
		return (key === undefined) ? this.undef : this.map[key];
	};
}

exports.LinkedList = LinkedList;

})();
