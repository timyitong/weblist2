module.exports = {
    toTitleCase: function (str) {
      var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

      return str.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
          match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
          title.charAt(index - 1).search(/[^\s-]/) < 0) {
          return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
          return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
      });
    },

    toHtmlParagraph: function (str) {
      return str.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    },

    extractNameFromEmail: function (str) {
      var reg = /([^@]*)@([^@]*)/g;
      var group = reg.exec(str);
      if (group == undefined || group.length < 2) {
        return undefined;
      }
      return group[1];
    },

    validEmail: function (email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}