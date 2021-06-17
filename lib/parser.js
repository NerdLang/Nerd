/*
	Copyright (c) 2021 NerdLang - Adrien THIERRY and contributors

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/

var flowBracket = 0;
var flowParenthesis = 0;
var flowAccessor = 0;

var isNumber = require("./check/isNumber.js");
var isVariable = require("./check/isVariable.js");
var isString = require("./check/isString.js");
var isOperator = require("./check/isOperator.js");
var isInitOperator = require("./check/isInitOperator.js");
var isObjectOperator = require("./check/isObjectOperator.js");
var isKeyword = require("./check/isKeyword.js");
var isDelimiter = require("./check/isDelimiter.js");
var isIncrement = require("./check/isIncrement.js");
var isAssignment = require("./check/isAssignment.js");
var isSemi = require("./check/isSemi.js");
var isNative = require("./check/isNative.js");

var CHECKERS = [ isSemi, isNumber, isAssignment, isKeyword, isVariable, isString, isDelimiter, isIncrement, isObjectOperator, isOperator, isInitOperator, isNative, ];

function addToken(_code, _env)
{
	if(_code == "\n") return;
	if(_code.length > 0)
	{
		if(!_env.TOKENS[_env.POSITION])
		{
			_env.TOKENS[_env.POSITION] = [];
		}
		if(!_env.TOKENSMAP[_env.POSITION])
		{
			_env.TOKENSMAP[_env.POSITION] = [];
		}
		_env.TOKENS[_env.POSITION].push(_code);
		_env.TOKENSMAP[_env.POSITION].push( {line: _env.LINE, position: _env.CURSOR} );
	}
}

function verifyToken(_token, i, j, map)
{
	var check = {check: false, error: false};
	
	for(var k = 0; k < CHECKERS.length; k++)
	{
		check = CHECKERS[k](_token);
		if(check.error)
		{
			error(`[!] ${check.message}: ${_token} line:${map[i][j].line + 1} position:${map[i][j].position}${os.EOL}=> ${array_of_code[map[i][j].line]}`);
		}
		else if(check.check)
		{
			return check.type;
		}
	}
		
	if(!check.check)
	{
		error(`[!] Unknown token: ${_token} line:${map[i][j].line + 1} position:${map[i][j].position}${os.EOL}=> ${array_of_code[map[i][j].line]}`);
	}
}

var SYNTAX =
{
	CALL:
	[
		["VARIABLE", "(", "CALL", ")"],
		["VARIABLE", "(", "EXPRESSION", ")"],
		["VARIABLE", "(", "VARIABLE", ")"],
		["VARIABLE", "(", "NUMBER", ")"],
		["VARIABLE", "(", "STRING", ")"],
		["VARIABLE", "(", "BOOLEAN", ")"],
		["VARIABLE", "(", ")"],
		
		["ASSIGNMENT", "(", "CALL", ")"],
		["ASSIGNMENT", "(", "EXPRESSION", ")"],
		["ASSIGNMENT", "(", "VARIABLE", ")"],
		["ASSIGNMENT", "(", "NUMBER", ")"],
		["ASSIGNMENT", "(", "STRING", ")"],
		["ASSIGNMENT", "(", "BOOLEAN", ")"],
		["ASSIGNMENT", "(", ")"],
	],
	EXPRESSION:
	[
		["NULL"],
		
		["NUMBER", "OPERATOR", "NUMBER"],
		["NUMBER", "OPERATOR", "STRING"],
		["NUMBER", "OPERATOR", "BOOLEAN"],
		["NUMBER", "OPERATOR", "VARIABLE"],
		["NUMBER", "OPERATOR", "EXPRESSION"],
		["NUMBER", "INCREMENT"],
		
		["STRING", "OPERATOR", "NUMBER"],
		["STRING", "OPERATOR", "STRING"],
		["STRING", "OPERATOR", "BOOLEAN"],
		["STRING", "OPERATOR", "VARIABLE"],
		["STRING", "OPERATOR", "EXPRESSION"],
		
		["BOOLEAN", "OPERATOR", "NUMBER"],
		["BOOLEAN", "OPERATOR", "STRING"],
		["BOOLEAN", "OPERATOR", "BOOLEAN"],
		["BOOLEAN", "OPERATOR", "VARIABLE"],
		["BOOLEAN", "OPERATOR", "EXPRESSION"],
	
		["VARIABLE", "OPERATOR", "NUMBER"],
		["VARIABLE", "OPERATOR", "STRING"],
		["VARIABLE", "OPERATOR", "BOOLEAN"],
		["VARIABLE", "OPERATOR", "VARIABLE"],
		["VARIABLE", "OPERATOR", "EXPRESSION"],
		["VARIABLE", "OPERATOR", "CALL"],
		["VARIABLE", "INCREMENT"],
		
		["EXPRESSION", "OPERATOR", "NUMBER"],
		["EXPRESSION", "OPERATOR", "STRING"],
		["EXPRESSION", "OPERATOR", "BOOLEAN"],
		["EXPRESSION", "OPERATOR", "VARIABLE"],
		["EXPRESSION", "OPERATOR", "EXPRESSION"],
	],
};

var GRAMMAR = 
{
	VARIABLE:
	[
		["VARIABLE", ".", "VARIABLE"],
		["VARIABLE", "[", "NUMBER", "]"],
		["VARIABLE", "[", "STRING", "]"],
		["VARIABLE", "[", "BOOLEAN", "]"],
		["VARIABLE", "[", "VARIABLE", "]"],
		["VARIABLE", "[", "EXPRESSION", "]"],
		["[", "]"],
		["{", "}"],
	],
	ASSIGNMENT:
	[
		["VARIABLE", ":", "NUMBER"],
		["VARIABLE", ":", "STRING"],
		["VARIABLE", ":", "BOOLEAN"],
		["VARIABLE", ":", "VARIABLE"],
		["VARIABLE", ":", "EXPRESSION"],
		["VARIABLE", ":", "CALL"],
		
		["STRING", ":", "NUMBER"],
		["STRING", ":", "STRING"],
		["STRING", ":", "BOOLEAN"],
		["STRING", ":", "VARIABLE"],
		["STRING", ":", "EXPRESSION"],
		["STRING", ":", "CALL"],
		
		["NUMBER", ":", "NUMBER"],
		["NUMBER", ":", "STRING"],
		["NUMBER", ":", "BOOLEAN"],
		["NUMBER", ":", "VARIABLE"],
		["NUMBER", ":", "EXPRESSION"],
		["NUMBER", ":", "CALL"],
		
		["VAR", "ASSIGNMENT"],
		
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "LIST", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "NUMBER", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "STRING", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "BOOLEAN", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "VARIABLE", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", "EXPRESSION", ")"],
		["VARIABLE", "ASSIGNMENT", "FUNCTION", "(", ")", "{"],
		["VARIABLE", "ASSIGNMENT", "[", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "LIST", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "NUMBER", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "STRING", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "BOOLEAN", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "VARIABLE", "]"],
		["VARIABLE", "ASSIGNMENT", "[", "EXPRESSION", "]"],
		["VARIABLE", "ASSIGNMENT", "{", "}"],
		["VARIABLE", "ASSIGNMENT", "{", "ASSIGNMENT", "}"],
		["VARIABLE", "ASSIGNMENT", "{", "ASSIGNMENT", ",", "}"],
		["VARIABLE", "ASSIGNMENT", "{", "LIST", "}"],
		["VARIABLE", "ASSIGNMENT", "{", "LIST", ",", "}"],
		["VARIABLE", "ASSIGNMENT", "NUMBER"],
		["VARIABLE", "ASSIGNMENT", "STRING"],
		["VARIABLE", "ASSIGNMENT", "BOOLEAN"],
		["VARIABLE", "ASSIGNMENT", "VARIABLE"],
		["VARIABLE", "ASSIGNMENT", "EXPRESSION"],
		["VARIABLE", "ASSIGNMENT", "CALL"],
		
		["CALL", ".", "VARIABLE"],
		
	],
	CALL:
	[
		["VARIABLE", "(", "CALL", ")"],
		["VARIABLE", ".", "CALL"],
		["VARIABLE", "(", "EXPRESSION", ")"],
		["VARIABLE", "(", "VARIABLE", ")"],
		["VARIABLE", "(", "NUMBER", ")"],
		["VARIABLE", "(", "STRING", ")"],
		["VARIABLE", "(", "BOOLEAN", ")"],
		["VARIABLE", "(", "LIST", ")"],
		["VARIABLE", "(", ")"],
		
		["ASSIGNMENT", "(", "CALL", ")"],
		["ASSIGNMENT", "(", "EXPRESSION", ")"],
		["ASSIGNMENT", "(", "VARIABLE", ")"],
		["ASSIGNMENT", "(", "NUMBER", ")"],
		["ASSIGNMENT", "(", "STRING", ")"],
		["ASSIGNMENT", "(", "BOOLEAN", ")"],
		["ASSIGNMENT", "(", "LIST", ")"],
		["ASSIGNMENT", "(", ")"],
	],
	LIST:
	[
		["NUMBER", ",", "NUMBER"],
		["NUMBER", ",", "STRING"],
		["NUMBER", ",", "BOOLEAN"],
		["NUMBER", ",", "VARIABLE"],
		["NUMBER", ",", "EXPRESSION"],
		
		["STRING", ",", "NUMBER"],
		["STRING", ",", "STRING"],
		["STRING", ",", "BOOLEAN"],
		["STRING", ",", "VARIABLE"],
		["STRING", ",", "EXPRESSION"],
		
		["BOOLEAN", ",", "NUMBER"],
		["BOOLEAN", ",", "STRING"],
		["BOOLEAN", ",", "BOOLEAN"],
		["BOOLEAN", ",", "VARIABLE"],
		["BOOLEAN", ",", "EXPRESSION"],
	
		["VARIABLE", ",", "NUMBER"],
		["VARIABLE", ",", "STRING"],
		["VARIABLE", ",", "BOOLEAN"],
		["VARIABLE", ",", "VARIABLE"],
		["VARIABLE", ",", "EXPRESSION"],
		
		["EXPRESSION", ",", "NUMBER"],
		["EXPRESSION", ",", "STRING"],
		["EXPRESSION", ",", "BOOLEAN"],
		["EXPRESSION", ",", "VARIABLE"],
		["EXPRESSION", ",", "EXPRESSION"],
		
		["ASSIGNMENT", ",", "ASSIGNMENT"],
		
		["LIST", ",", "NUMBER"],
		["LIST", ",", "STRING"],
		["LIST", ",", "BOOLEAN"],
		["LIST", ",", "VARIABLE"],
		["LIST", ",", "EXPRESSION"],
		["LIST", ",", "ASSIGNMENT"],
		
	],
}

var VALIDATION = 
{
	VAR:
	[
		["VAR", "VARIABLE", "SEMI"],
	],
	VARIABLE:
	[
		["VARIABLE", "SEMI"],
	],
	ASSIGNMENT:
	[
		["ASSIGNMENT", "SEMI"],
		["ASSIGNMENT", "{"],
	],
	EXPRESSION:
	[
		["EXPRESSION", "SEMI"],
	],
	WHILE:
	[
		[ "WHILE", "(", "NUMBER", ")", "{" ],
		[ "WHILE", "(", "STRING", ")", "{" ],
		[ "WHILE", "(", "BOOLEAN", ")", "{" ],
		[ "WHILE", "(", "VARIABLE", ")", "{" ],
		[ "WHILE", "(", "EXPRESSION", ")", "{" ],
		
		[ "WHILE", "(", "NUMBER", ")", "SEMI" ],
		[ "WHILE", "(", "STRING", ")", "SEMI" ],
		[ "WHILE", "(", "BOOLEAN", ")", "SEMI" ],
		[ "WHILE", "(", "VARIABLE", ")", "SEMI" ],
		[ "WHILE", "(", "EXPRESSION", ")", "SEMI" ],
	],
	DO:
	[
		[ "DO", "{" ],
	],
	IF:
	[
		[ "IF", "(", "NUMBER", ")", "{" ],
		[ "IF", "(", "STRING", ")", "{" ],
		[ "IF", "(", "BOOLEAN", ")", "{" ],
		[ "IF", "(", "VARIABLE", ")", "{" ],
		[ "IF", "(", "EXPRESSION", ")", "{" ],
	],
	ELSE:
	[
		[ "ELSE", "IF", "(", "NUMBER", ")", "{" ],
		[ "ELSE", "IF", "(", "STRING", ")", "{" ],
		[ "ELSE", "IF", "(", "BOOLEAN", ")", "{" ],
		[ "ELSE", "IF", "(", "VARIABLE", ")", "{" ],
		[ "ELSE", "IF", "(", "EXPRESSION", ")", "{" ],
		
		[ "ELSE", "{" ],
	],
	FOR:
	[
		["FOR", "(", "ASSIGNMENT", "SEMI", "EXPRESSION", "SEMI", "EXPRESSION", ")", "{"],
		["FOR", "(", "VARIABLE", "SEMI", "EXPRESSION", "SEMI", "EXPRESSION", ")", "{"],
	],
	CALL:
	[
		["CALL", "SEMI"],
	],
	INCLUDE:
	[
		["INCLUDE", "(", "STRING", ")", "SEMI"],
	],
	DEFINE:
	[
		["DEFINE", "(", "STRING", ")", "SEMI"],
	],
	RETURN:
	[
		["RETURN", "NUMBER", "SEMI"],
		["RETURN", "STRING", "SEMI"],
		["RETURN", "BOOLEAN", "SEMI"],
		["RETURN", "VARIABLE", "SEMI"],
		["RETURN", "EXPRESSION", "SEMI"],
		["RETURN", "{", "ASSIGNMENT", ",", "}", "SEMI"],
	],
	TRY:
	[
		["TRY", "{"],
	],
	CATCH:
	[
		["CATCH", "(", "VARIABLE", ")", "{"],
	],
	"NATIVE":
	[
		["NATIVE"],
	],
	"{":
	[
		["{"],
	],
	"}":
	[
		["}"],
	],
	SEMI:
	[
		["SEMI"],
	]
}

function checkExpression(_ast, _flow, _arr)
{
	var _startAst = 0;
	var _endAst = 0;
	var _startGrammar = 0;
	var _match = false;
	
	var _newAst = [];
	for(var g = 0; g < Object.keys(_arr).length; g++)
	{		
		var _grammarName = Object.keys(_arr)[g];
		var _grammar = _arr[_grammarName];

		for(var i = 0; i < _ast.length; i++)
		{
			_startAst = 0;
			_endAst = 0;
			_match = false;
			for(var t = 0; t < _grammar.length; t++)
			{
				if(_ast[i] == _grammar[t][0])
				{
					_match = true;
					_startAst = i;
					_endAst = i;
					for(var m = 0; m < _grammar[t].length; m++)
					{
						if(_ast[i + m] && _ast[i + m] == _grammar[t][m])
						{
							_endAst++;
						}		
						else
						{
							_match = false;
							break;
						}
					}
					if(_match)
					{
						_newAst = _ast.slice(0, _startAst);
						_newAst.push( _grammarName );
						_newAst = _newAst.concat( _ast.slice( _endAst ));
						_ast = _newAst;
						g = 0;
						i--;
						break;
					}
				}
			}
		}
		
	}
	
	return _ast;
}

function checkSyntax(_ast, _flow, _scope)
{
	if(VALIDATION[_ast[0]])
	{
		var _check = VALIDATION[_ast[0]];
		var _good = true;
		
		for(var c = 0; c < _check.length; c++)
		{
			_good = true;
			for(var t = 0; t < _ast.length; t++)
			{
				if(!_check[c][t] || _ast[t] != _check[c][t])
				{
					_good = false;
					break;
				}
			}
			if(_good)
			{
				break;
			}
		}
		
		if(!_good)
		{
			error(`[!] Unexpected token: line: ${_scope[0].line + 1}`);
		}
	}
	else 
	{
		error(`[!] Unexpected token: line: ${_scope[0].line + 1} position: 0`);
	}
}


function addFlow(_env)
{

	if(_env.TOKENS.length > 0 && _env.TOKENS[0])
	{
		var _ast = [];
		for(var i = 0; i < _env.TOKENS.length; i++)
		{
			_ast[i] = [];
			for(var j = 0; j < _env.TOKENS[i].length; j++)
			{
				_ast[i][j] = verifyToken(_env.TOKENS[i][j], i, j, _env.TOKENSMAP);
			}
			_ast[i] = checkExpression(_ast[i], _env.TOKENS[i], SYNTAX);
			_ast[i] = checkExpression(_ast[i], _env.TOKENS[i], GRAMMAR);
			checkSyntax(_ast[i], _env.TOKENS[i], _env.TOKENSMAP[i]);
		}
		
		_env.FLOW = _env.FLOW.concat(_env.TOKENS);
		_env.MAP = _env.MAP.concat(_env.TOKENSMAP);
		_env.AST = _env.AST.concat(_ast);
	}
	_env.TOKENS = [];
	_env.TOKENSMAP = [];
	_env.POSITION = 0;
}

function findNextLine(_code, _from, _env)
{
	for(var i = _from; i < _code.length; i++)
	{
		if(_code[i] == "\r" && _code[i+1] && _code[i+1] == "\n")
		{
			_env.LINE++;
			_env.CURSOR = 0;
			return i+2;
		}
		else if(_code[i] == "\n")
		{
			_env.LINE++;
			_env.CURSOR = 0;
			return i+1;
		}
	}
	// ERROR
	return _code.length - 1;
}

function findEndComment(_code, _from, _env)
{
	for(var i = _from; i < _code.length; i++)
	{
		if(_code[i] == "\n")
		{
			_env.LINE++;
			_env.CURSOR = 0;
		}
		else if(_code[i] == "\r" && _code[i + 1] && _code[i + 1] == "\n")
		{
			_env.LINE++;
			_env.CURSOR = 0;
			i++;
		}
		else if(_code[i] == "*" && _code[i+1] && _code[i+1] == "/")
		{
			return i+2;
		}
		_env.CURSOR++;
	}
	// ERROR
	return _code.length - 1;
}

function setFor(_current, _env)
{
	if(_current == "for" && _env.FOR == 0)
	{
		_env.FOR = 2;
	}
}

function parseCode(_code, _from, _env)
{
	var _current = "";
	_env.POSITION = 0;

	for(var i = _from; i < _code.length; i++)
	{
		var _tokens = _env.TOKENS[_env.TOKENS.length - 1];
		var _before;
		if(_tokens && _tokens[_tokens.length - 1])
		{
			_before = _tokens[_tokens.length - 1];
		}
		
		switch(_code[i])
		{
			case " ":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					setFor(_current, _env);
					addToken(_current, _env);
					_current = "";
				}
				else
				{
					_current += _code[i];
				}
			break;
			case "\t":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					setFor(_current, _env);
					addToken(_current, _env);
					_current = "";
				}
				else if(_env.IN_STRING || _env.IN_NATIVE)
				{
					_current += _code[i];
				}
				else if(_env.IN_BLOCK_QUOTE)
				{
					_current += "\\t";
				}
			break;
			
			case "\n":
				if(!_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					_env.LINE++;
					_env.CURSOR = 0;
					addToken(_current, _env);
					_current = "";
				}
				else if(_env.IN_NATIVE)
				{
					_current += _code[i];
				}
				else 
				{
					_current += "\\n";
				}
			break;
			
			case "\r":
				if(!_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					_env.LINE++;
					_env.CURSOR = 0;
					if(_code[i+1] && _code[i+1] == "\n")
					{
						addToken(_current, _env);
						_current = "";
						i++
						break;
					}
				}
				else if(_env.IN_NATIVE)
				{
					_current += _code[i];
				}
				else 
				{
					_current += "\\r";
				}
			break;
			
			case "\\":
				if(_env.IN_BLOCK_QUOTE)
				{
					_current += "\\\\";
				}
			break;

			case "\"":
				if(_env.IN_STRING && !_env.IN_NATIVE)
				{
					_env.IN_STRING = false;
				}
				else if(!_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					_env.IN_STRING = true;
				}
				if(_env.IN_BLOCK_QUOTE)
				{
					_current += "\\\"";
				}
				else
				{
					_current += _code[i];
				}
			break;
			
			case "`":
				if(_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					_env.IN_BLOCK_QUOTE = false;
					addToken(_current + "\"", _env);
					_current = "";
				}
				else if(!_env.IN_STRING && !_env.IN_NATIVE)
				{
					_env.IN_BLOCK_QUOTE = true;
					addToken(_current, _env);
					_current = "\"";
				}
				else _current += _code[i];
			break;
			
			case "/":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					if(_code[i+1])
					{
						if(_code[i+1] == "/")
						{
							addToken(_current, _env);
							addFlow(_env);
							_current = "";
							parseCode(_code, findNextLine(_code, i, _env), _env);
							return;
						}
						else if(_code[i+1] == "*")
						{
							addToken(_current, _env);
							addFlow(_env);
							_current = "";
							parseCode(_code, findEndComment(_code, i, _env), _env);
							return;
						}
						else 
						{
							addToken(_current, _env);
							addToken(_code[i], _env);
							_current = "";
						}
					}
				}
				else 
				{
					_current += _code[i];
				}
				
			break;
			
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				_current += _code[i];
			break;
			
			case "{":
			case "}":
								
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					if(_code[i] == "{" && _code[i + 1] && _code[i + 1] == _code[i])
					{
						_env.IN_NATIVE = true;
						_current += "{{";
						i++;
					}
					else if(_code[i] == "{" && (_before == "=" || _before == "," || _before == "return"))
					{
						_env.flowBracket++;
						addToken(_current, _env);
						addToken(_code[i], _env);
						_current = "";
					}
					else 
					{
						if(_code[i] == "{")
						{
							_env.flowBracket++;
						}
						else 
						{
							_env.flowBracket--;
						}
						addToken(_current, _env);
						addToken(_code[i], _env);
						if(_code[i] == "{" && _code[i + 1] && _code[i + 1] == "}" && _before && _before != ")") 
						{
							// nothing
						}
						else 
						{
							_env.POSITION++;
						}
						_current = "";
					}
				}
				else if(_env.IN_NATIVE && _code[i] == "}" && _code[i + 1] && _code[i + 1] == _code[i])
				{
					_env.IN_NATIVE = false;
					_current += "}}";
					addToken(_current, _env);
					addFlow(_env);
					_current = "";
					i++;
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			case "[":
			case "]":
			case "(":
			case ")":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					if(_code[i] == "(")
					{
						setFor(_current, _env);
						_env.flowParenthesis++;
					}
					else if(_code[i] == ")")
					{
						_env.flowParenthesis--;
					}
					else if(_code[i] == "[")
					{
						_env.flowAccessor++;
					}
					else if(_code[i] == "]")
					{
						_env.flowAccessor--;
					}
					addToken(_current, _env);
					addToken(_code[i], _env);
					_current = "";
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			case ";":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					addToken(_current, _env);
					addToken(";", _env);
					_current = "";
					if(_env.FOR == 0)
					{
						addFlow(_env);
					}
					else 
					{
						_env.FOR--;
					}
					
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			case ":":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					addToken(_current, _env);
					addToken(":", _env);
					_current = "";
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			case ",":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					addToken(_current, _env);
					addToken(",", _env);
					_current = "";
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			case "+":
			case "-":
			
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					addToken(_current, _env);
					if(_code[i + 1] && _code[i + 1] == _code[i])
					{
						addToken(_code[i] + _code[i + 1], _env);
						i++;
					}
					else if(_code[i + 1] && _code[i + 1] == "=")
					{
						addToken(_code[i] + _code[i + 1], _env);
						i++;
					}
					else 
					{
						addToken(_code[i], _env);
					}
					_current = "";
				}
				else 
				{
					_current += _code[i];
				}
			break;
			case "*":
			case ".":
				if(!_env.IN_STRING && !_env.IN_BLOCK_QUOTE && !_env.IN_NATIVE)
				{
					var _number = isNumber(_current);
					if(_number.check)
					{
						_current += _code[i];
					}
					else 
					{
						addToken(_current, _env);
						addToken(_code[i], _env);
						_current = "";
					}
				}
				else 
				{
					_current += _code[i];
				}
			break;
			
			default:
				_current += _code[i];
			break;
		}
		_env.CURSOR++;
	}

	addFlow(_env);
	if(_current.length > 0 && i == _code.length)
	{
		error("[!] untermined instruction");
	}
	if(_env.flowBracket < 0)
	{
		error("[!] Missing opening bracket {");
	}
	else if(_env.flowBracket > 0)
	{
		error("[!] Missing closing bracket }");
	}
	
	if(_env.flowParenthesis < 0)
	{
		error("[!] Missing opening parenthesis (");
	}
	else if(_env.flowParenthesis > 0)
	{
		error("[!] Missing closing parenthesis )");
	}
	
	if(_env.flowAccessor < 0)
	{
		error("[!] Missing opening accessor [");
	}
	else if(_env.flowAccessor > 0)
	{
		error("[!] Missing closing accessor ]");
	}
	
	if(_env.IN_NATIVE)
	{
		error("[!] Missing closing native block }} ]");
	}
	
	if(_env.IN_STRING)
	{
		error("[!] Missing closing string \" }} ]");
	}
	
	if(_env.IN_BLOCK_QUOTE)
	{
		error("[!] Missing closing block quote ` }} ]");
	}
}

module.exports = parseCode;
