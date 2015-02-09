(function () {
  "use strict";
  
  angular.module("AutoCompleter", [])
    .factory("Trie", function (){
      function Trie(){
        this.characters = {};
      };

      Trie.prototype.push = function(word, index){
        index = index || 0;
        var letter = word[index];
        if (index < word.length) {
          // recursive condition
          if (this.characters[letter] === undefined) {
            this.characters[letter] = new Trie();
          }
          // recursively learn at next char position
          this.characters[letter].push(word, index + 1);
        } else {
          // terminal condition
          this.isWord  = true;
        }
        return this;
      };

      Trie.prototype.getWords = function(words, currentWord){
        words = words || [];
        currentWord = currentWord || "";

        // checking to see if `this` node is a word
        if (this.isWord) {
          words.push(currentWord);
        }
        for (var character in this.characters){
          this.characters[character].getWords(words, currentWord + character);
        }
        return words;
      };

      Trie.prototype.find = function(word, index){
        index = index || 0;
        if (index === word.length) {
          return this;
        }

        if (this.characters[word[index]] !== undefined && index < word.length) {
            return this.characters[word[index]].find(word, index + 1);
        }
      };

      Trie.prototype.autoComplete = function(prefix){
        var foundNode = this.find(prefix);
        var words = [];
        if(foundNode) {
          foundNode.getWords(words, prefix);
        }
        return words;
      };
      return Trie;
    })
    .directive("autoComplete", ["$timeout", "Trie", "$parse", function ($timeout, Trie, $parse){
      
         var config = (function(Storage, $timeout){
          
           Config.Storage = Storage;
           
           function Config(){
           
             var inputTag       =  "<input type='text' " + 
                                    " ng-model='searchWord' " + 
                                    " ng-blur='handleBlur()' " + 
                                    " ng-focus='handleFocus()'/> ";

             var resultsTag     =  "<div class='results' " + 
                                    " ng-repeat='result in results' " + 
                                     "ng-show='showResults'>" +
                                        "{{result}}" +
                                   "</div>";

             this.template      = "<div>" +
                                    inputTag +
                                    resultsTag +
                                 "</div>";

             this.scope         = {
                                  seedWords: "=",
                                  suggest: "&onChange",
                                  loadHandler: "="
                                 };

             this.restrict      = "AEC";

          }

          var setupUI = function () {
              var scope = this;
            
              var toggleResults    = function () {
                scope.showResults = !scope.showResults;
              };
            
              this.handleBlur   = function () {
                $timeout(function(){ 
                  toggleResults();
                }, 500);
              };
            
              this.handleFocus  = function () {
                $timeout(toggleResults,0, true);
              };
            
          };
          
          var loadWords = function(scope, words){
            if (arguments.length < 2){
              var called = 0;
              return function(words){ 
                called += 1;
                loadWords.call(scope, scope, words);
              };
            }
     
            words.forEach(function (word) {
              scope.storage.push(word);
            });
            
            scope.$watch("searchWord", function (value) {
              if (value) {
                scope.showResults  = true;
                scope.results      = scope.storage.autoComplete(value);
                scope.suggest({words: scope.results});
              }
            });  
          };
          
           
          var setupEvents = function () {
              this.storage       = new Config.Storage();
             var results         = this.loadHandler(loadWords(this));
          };
           
          Config.prototype.link = function (scope, element, attrs) {
            setupEvents.call(scope);
            setupUI.call(scope);   
          };

           return new Config();
         })(Trie, $timeout);
      
         return config;
       
     }]);
})();
