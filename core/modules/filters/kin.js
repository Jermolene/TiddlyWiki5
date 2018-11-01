/*\
title: $:/core/modules/filters/kin.js
type: application/javascript
module-type: filteroperator

Filter operator that recursively finds kindred between tiddlers

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  // TODO: Should I set global tw to true?

  function collectFamilyMembers(tiddler, title, fieldname, direction) {
    var family_members_from = [],
      family_members_to = [];

    function addToResultsIfNotFoundAlready(list, title) {
      if (list.includes(title)) {
        return false;
      }
      list.push(title);
      return true
    }

    function findKindredFrom(tiddler, title) {
      if (addToResultsIfNotFoundAlready(family_members_from, title)) {
        if (tiddler) {
          tiddler.getFieldList(fieldname).forEach(function (target_title) {
            findKindredFrom($tw.wiki.getTiddler(target_title), target_title);
          });
        }
      }
    }

    function findKindredTo(title) {
      if (addToResultsIfNotFoundAlready(family_members_to, title)) {
        $tw.wiki.findListingsOfTiddler(title, fieldname).forEach(function (target_title) {
          findKindredTo(target_title);
        });
      }
    }

    if ((direction === 'from') || (direction === 'with')) {
      findKindredFrom(tiddler, title);
    }
    if ((direction === 'to') || (direction === 'with')) {
      findKindredTo(title);
    }
    return uniqueArray(family_members_from.concat(family_members_to));
  }

  // TODO: Is there a better way for unique?
  function uniqueArray(input) {
    var seen = {},
      output = [],
      len = input.length,
      j = 0;
    for (var i = 0; i < len; i++) {
      var item = input[i];
      if (seen[item] !== 1) {
        seen[item] = 1;
        output[j++] = item;
      }
    }
    return output;
  }

  /*
    Export our filter function

    TODO: May I add tests? (editions/test/tiddlers/tests)
    */
  exports.kin = function (source, operator, options) {
    var results = [],
      needs_exclusion = operator.prefix === '!',
      suffix_list = (operator.suffix || '').split(':'),
      fieldname = (suffix_list[0] || 'tags').toLowerCase(),
      direction = (suffix_list[1] || 'with').toLowerCase();

    if ((operator.operand === '') && (needs_exclusion)) {
      return [];
    }

    if (operator.operand !== '') {
      var title_from_family = operator.operand,
        tiddler_from_family = $tw.wiki.getTiddler(title_from_family),
        family_members = collectFamilyMembers(tiddler_from_family, title_from_family, fieldname, direction);

      source(function (tiddler, title) {
        if (needs_exclusion !== family_members.includes(title)) {
          results.push(title);
        }
      });
    } else {
      source(function (tiddler, title) {
        results = results.concat(collectFamilyMembers(tiddler, title, fieldname, direction));
      });
      results = uniqueArray(results);
    }

    return results;
  }
})();
