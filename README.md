Alt - AngularJS
====================================================

A Javascript Client Framework using [AngularJS][angular], a single app that can run in web, mobile using [Cordova][cordova] or [Ionic][ionic], and even desktop using [NW.js][nw].
 
## Purpose

A normal [AngularJS][angular] is enough, why bother use Alt? Alt add many extensions needed to build application, 
create a convention how to code, and do many things. See all features implemented 
 
## Features 

+ [Helper](#helper)
+ [Lazy load controller, directive, service, factory, even module](#lazy-load)
+ [Component using Angular directive](#component)
+ [Alt modules, load what you need](#modules)

## Overview

### Helper

Several helper function and service added in Alt, such as alt.extend, 

### Lazy Load

AngularJS required all files (dependent modules, controllers, directives, etc) to be loaded first before application running.
Imagine if the application is so big that developed by several programmers. For ease purpose, lazy load is required. 
Load only what you need, do not load all things first, is how Alt build.
  
This is a normal Angular application (>1.2.x)

```
<body>
</body>
```

### Component

In this era of software development, component based is one of the most used approach. By creating components, we can 

### Modules

There are several Alt modules included, which you can use in your application.

+ Route
+ Auth
+ Api
+ Export
+ Storage
+ Validation

## Build With Alt

+ Prototyper
+ Uno Multiplayer
+ Capture The Flag - Mobile
+ 

## License

This software is released under the [MIT License][mit_license].

[angular]: https://angularjs.org/
[cordova]: https://cordova.org/
[ionic]: http://ionicframework.com/
[nw]: http://nwjs.io/
[mit_license]: http://opensource.org/licenses/MIT