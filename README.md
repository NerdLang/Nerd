# Why Nerd Lang ?

Nerd Lang is an(other) attempt to have an efficient and yet simple language, where everything is a variable. Nerd has no superlative: it's not the fastest, it's not the best, it's not the easiest... It's Nerd.

One of the objective is to have a versatile tool that we can interpret, compile, or transpile. Nerd tries to have one way to do something, we will see after how to do OOP, FP or other stuffs.

# The Grammar / Syntax

Nerd is close to C/C++ and JS syntax: brackets, comma, and classical expressions.

## Declare a variable

`var a = "ok";`

## Assign a variable

`a = 3;`

## Declare a constant

A constant is a variable whose name starts with `_`:

`var _myConst = "Hello";`

## Declare a function

A function is also a variable, so you declare a function as a variable:

```
var myFunction = function(_arg1, _arg2)
{
  // function's body 
};
```

There is no function hoisting in Nerd, so you need to declare a function before you can use it.

## for loop

```
for(var i = 0; i < 10; i++)
{
  // for body
}
```

## while / do while loop

```
while(1)
{
  // while body
};

do
{

} while(1);

```
## if / else if / else

```
if(1)
{

}
else if(2)
{

}
else
{

}
```

## Array

```
var anArray = [];
```

## Object

```
var anObject = {};
var _aConstObject =
{
  property: "Hello",
  _constProperty: "World",
}
```

# Concepts

## OOP

You can emulate classes and OOP by creating a function returning an object containing a list of function modifying an internal value:

```
var _aHuman = function(_name, _age)
{
	var this = 
  {
    name: _name,
		age: _age,
    _pi: 3.14116, // constant property
  };
  
  var _addYear = function()
  {
    this.age++;
  }
  
  var _changeName = function(_name)
  {
    this.name = _name;
  }
  
	var toReturn =
	{
		addYear: _addYear,
		changeName: _changeName,
	};
	return value;
}

var _me = _aHuman("John Doe", 40);
_me.addYear();
```

## FP

```
var _chainedFunction = function()
{
   var this = {};
   var then = function()
   {
      return this;
   }
   
   var end = function()
   {
      // the end
   }
   
   this.then = then;
   this.end = end;
   return this;
}

_chainedFunction().then().then().end();
```
