<!-- Module icon by Icons8 -->
# <img src="https://maxcdn.icons8.com/iOS7/PNG/100/Programming/module-100.png" title="Module" width="100" height="100"> Ingect.js

An ultra minimal DI library.

[![Build Status](https://travis-ci.org/helloIAmPau/ingect.svg?branch=master)](https://travis-ci.org/helloIAmPau/ingect)
![Tag](https://img.shields.io/github/tag/helloiampau/ingect.svg)

## Get the library
You can download Ingect framework by using the direct links to this repo dist folder:

- [ingect.min.js](https://raw.githubusercontent.com/helloIAmPau/ingect/master/dist/ingect.min.js)
- [ingect.js](https://raw.githubusercontent.com/helloIAmPau/ingect/master/dist/ingect.js)

or by using [Bower](https://bower.io/) from your project root folder:
```bash
bower install ingect
```

## Usage
As first step, you have to import the library by using the script tag:
```html
<script src="/path/to/ingect.min.js"></script>
```

then you can create a new _module container_ using the ingect factory:
```js
var myApp = G();
```

and finally you can define a module by registering its factory into the module container instance:
```js
var myModuleFactory = function() {
  var myModule = {};

  myModule.action = function() {
    console.log('I\'m doing stuff...');
  };

  return myModule;
};

myApp('myModule', myModuleFactory);
```

Where is the funny part? I'm glad you asked! All the dependencies are automagically resolved and injected into your module factory. You just have to ask for them when you define the new module:
```js
var otherModuleFactory = function(myModule) {
  // hello myModule :)
  myModule.action();
};

myApp('otherModule', otherModuleFactory, ['myModule']);
```

If you put the keyword `$global` into the dependency array, the _window_ global object is injected.

This pattern makes your application testable by allowing the developer with the ability to inject mocks. This is an example using the mocha framework:
```js
var aModuleFactory = function(dep) {
  var module = {};

  module.action = function() {
    // use dep
  }

  return module;
};
myApp('aModule', aModuleFactory, ['theDep']);

describe('aModule', function() {

  var mut;
  var aMock;

  beforeEach(function(done) {
    aMock = {};

    mut = aModuleFactory(aMock);
  });

  it('should pass', function(done) {
    // here mut is using the mocked dep
    mut.action();
    done();
  });
});
```
