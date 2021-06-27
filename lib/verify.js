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

var isVariable = require("./check/isVariable.js");
var isNumber = require("./check/isNumber.js");

function verifyExpression(_exp, _inst, _env)
{
	for(var z = 0; z < _exp.length; z++)
	{
		if(RESERVED.indexOf(_exp[z]) < 0 && BOOLEAN_KEYWORD.indexOf(_exp[z]) < 0 && isVariable(_exp[z]).check)
		{
			if( (!_exp[ z - 1] || _exp[ z - 1] != ".") && !varExists(_exp[z], _env))
			{
				error(`[!] Unknown variable: ${_exp[z]} line:${_env.MAP[_inst][z].line + 1} position:${_env.MAP[_inst][z].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][z].line]}`);
			}
		}
		if(_exp[z] == "__NERD_Multi_Line_Quote")
		{
			_env.FLOW[_inst][z + 2] = _exp[z + 2].slice(1, _exp[z + 2].length - 1)
		}
	}
}

function checkLogicalState(_token, _next, _env)
{
	var _logicalState = getLogical(_env);

	if(_logicalState.DO)
	{
		if(_token == "}")
		{
			if(_next != "WHILE")
			{
				return { error: true, message: "Unexpected token, waiting for while"};
			}
		}
		else if(_token == "WHILE")
		{
			return { error: false };
		}
		else
		{
			return { error: true, message: "Unexpected token, waiting for while"};
		}
	}
	
	if(_logicalState.TRY)
	{
		if(_token == "}")
		{
			if(_next != "CATCH")
			{
				return { error: true, message: "Unexpected token, waiting for catch"};
			}
		}
		else if(_token == "CATCH")
		{
			return { error: false };
		}
		else
		{
			return { error: true, message: "Unexpected token, waiting for catch"};
		}
	}
	
	if(_logicalState.FUNCTION)
	{
		if(_token == "}")
		{
			if(_next != ";")
			{
				return { error: true, message: "Unexpected token, waiting for ';' after "};
			}
		}
	}
	return { error: false };
}

function getFunctionArgs(_flow, param, _env)
{
	var _parenthesis = 0;
	var _args = [];
	for(var i = 0; i < _flow.length; i++)
	{
		if(_flow[i] == "(") _parenthesis++;
		else if(_flow[i] == ")") _parenthesis--;
		else if(_parenthesis > 0)
		{
			if(_flow[i][0] == '\"')
			{
				_args.push(_flow[i]);
			}
			else if(param && varExists(_flow[i], _env))
			{
				_args.push(_flow[i]);
			}
			else if(!param)
			{
				_args.push(_flow[i]);
			}
		}
	}
	return _args;
}

function forgeArray(_var, _flow, _start, _inst, _env)
{
	_env.FLOW[_inst][_start - 1] = "new NerdCore::Class::Array()";
	_env.FLOW[_inst] = _env.FLOW[_inst].slice(0, _start);
	_env.FLOW[_inst].push(";");
	if(_flow[_start] != "]" )
	{
		var a = 0;
		for(var i = _start; i < _flow.length - 1; i+=2)
		{
			if(_flow[i] == "[" && _flow[i + 1] == "]")
			{
				_env.FLOW[_inst].push(_var + "[" + a + "]");
				_env.FLOW[_inst].push("=");
				_env.FLOW[_inst].push("new NerdCore::Class::Array()");
				_env.FLOW[_inst].push(";");
			}
			else if(_flow[i] != "]")
			{
				if(isVariable(_flow[i]).check)
				{
					if(!varExists(_flow[i], _env))
					{
						error(`[!] Variable or token undefined: ${_flow[i]} line:${_env.MAP[_inst][i].line + 1} position:${_env.MAP[_inst][i].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][i].line]}`);
					}
				}
				
				_env.FLOW[_inst].push(_var + "[" + a + "]");
				_env.FLOW[_inst].push("=");
				_env.FLOW[_inst].push(_flow[i]);
				_env.FLOW[_inst].push(";");
			}
			a++;
		}
	}
}

function forgeObject(_var, _flow, _start, _inst, _env)
{
	var newFlow = _env.FLOW[_inst].slice(0, _start - 1);
	newFlow.push("new NerdCore::Class::Object()");
	newFlow.push(";");

	for(var f = _start; f < _env.FLOW[_inst].length; f+=4)
	{
		if(_env.FLOW[_inst][f+1] && _env.FLOW[_inst][f+1] == ":" && (_env.FLOW[_inst][f+2] != "}" && _env.FLOW[_inst][f+2] != "," ) )
		{
			// OK
			if(isVariable(_env.FLOW[_inst][f + 2]).check)
			{
				if(!varExists(_env.FLOW[_inst][f + 2], _env))
				{
					error(`[!] Variable or token undefined: ${_env.FLOW[_inst][f + 2]} line:${_env.MAP[_inst][f+2].line + 1} position:${_env.MAP[_inst][f+2].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][f+2].line]}`);
				}
			}
			if(isVariable(_env.FLOW[_inst][f]).check)
			{
				newFlow.push(_var + "[\"" + _env.FLOW[_inst][f] + "\"] = " + _env.FLOW[_inst][f + 2] + ";");
			}
			else newFlow.push(_var + "[" + _env.FLOW[_inst][f] + "] = " + _env.FLOW[_inst][f + 2] + ";");
		}
	}
	_env.FLOW[_inst] = newFlow;
}

function verifyFlow(_ast, _flow, _inst, _scope, _env, _main)
{
	for(var z = 0; z < _flow.length; z++)
	{
		if(_flow[z] == ".")
		{
			_scope[_inst] = _scope[_inst].slice(0, z-1);
			_scope[_inst].push(_flow[z-1]);
			
			for(var v = z; v < _flow.length; v++)
			{
				if(_flow[v] == ".")
				{
					_scope[_inst].push("[");
					_scope[_inst].push("\"" + _flow[v+1] + "\"");
					_scope[_inst].push("]");
					v++;
				}
				else
				{
					_scope[_inst].push(_flow[v]);
				}
			}
			break;
		}
	}
	_flow = _scope[_inst];

	var _next;
	if(_scope[_inst+1] && _scope[_inst+1][0])
	{
		_next = _scope[_inst+1][0];
	}
	var _logicalError = checkLogicalState(_ast[0], _next, _env);
	if(_logicalError.error)
	{
		error(`[!] ${_logicalError.message}: ${_flow[0]} line:${_env.MAP[_inst][0].line + 1} position:${_env.MAP[_inst][0].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][0].line]}`);
	}

	switch(_flow[0])
	{
		case "var":
			if(RESERVED.indexOf(_flow[1]) > -1)
			{
				error(`[!] ${_flow[1]} is a reserved keyword: ${_flow[1]} line:${_env.MAP[_inst][1].line + 1} position:${_env.MAP[_inst][1].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][1].line]}`);
			}

			if(_flow[2] != "=")
			{
				addVar(_flow[1], _env);
				return _inst + 1;
			}
			else if(_flow[2] == "=")
			{
				var _existsVar =  checkVarExists(_flow[1], _env);
				if(_existsVar.error)
				{
					error(`[!] ${_existsVar.message}: line:${_env.MAP[_inst][1].line + 1} position:${_env.MAP[_inst][1].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][1].line]}`);
				}

				if(_flow[3] == "function")
				{
					var _newFlow = [ _flow[0], _flow[1], _flow[2], "__NERD_Create_Var_Scoped_Copy_Anon", "({"];
					var _args = getFunctionArgs(_flow, false, _env);
					addVar(_flow[1], _env, 1, _inst);
					nextScope(_env);
					addLogical("FUNCTION", _env);
					_scope[_inst] = _newFlow;
					var item = 0;
					for(var a = 0; a < _args.length; a+=2)
					{
						addVar(_args[a], _env, 5, _inst);
						_scope[_inst] = _scope[_inst].concat(["var", _args[a], ";", "if", "(", "__NERD_VARLENGTH", ">", item,")", _args[a], "=", `__NERD_VARARGS[${item}];`]);
						item++;
					}
					//verifyExpression(_flow.slice(6), _inst, _env);
					return _inst + 1;
				}
				else if(_flow[3] == "[" )
				{
					addVar(_flow[1], _env);
					forgeArray(_flow[1], _flow, 4, _inst, _env);
					return _inst + 1;
				}
				else if(_flow[3] == "{}")
				{
					addVar(_flow[1], _env);
					forgeObject(_flow[1], _flow, 4, _inst, _env);
					return _inst + 1;
				}
				else if(_flow[3] == "{")
				{
					addVar(_flow[1], _env);
					forgeObject(_flow[1], _flow, 4, _inst, _env);
					return _inst + 1;
				}
				else if(_flow[3] == "exit")
				{
					error(`[!] Invalid use of exit: line:${_env.MAP[_inst][eq].line + 1} position:${_env.MAP[_inst][eq].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][eq].line]}`);
				}
				else if(_flow[3] == "require")
				{
					addVar(_flow[1], _env);
					verifyExpression(_flow.slice(3), _inst, _env);
					var _args = getFunctionArgs(_flow, true, _env);
					if(_args.length != 1)
					{
						error(`[!] Invalid number of parameter, only one required: ${_flow[3]} line:${_env.MAP[_inst][3].line + 1} position:${_env.MAP[_inst][3].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][3].line]}`);
					}
					var _required = genRequire(COMPILER.PATH, _args[0].slice(1, _args[0].length - 1), _env);
					if(_required.add)
					{
						COMPILER.DECL += _required.code;
					}
					_scope[_inst] = _flow.slice(0, 3);
					_scope[_inst].push(_required.module);
					_scope[_inst].push(";");
				}
				else
				{
					addVar(_flow[1], _env);
					verifyExpression(_flow.slice(3), _inst, _env);
				}
				
				return _inst + 1;
			}
		break;
		
		case "{":
			
			nextScope(_env);
				
		break;
		
		case "}":
			if(getLogical(_env).FUNCTION)
			{
				_scope[_inst] = ["return NerdCore::Global::null;"].concat(_flow).concat([")", ";"]);
				removeLogical("FUNCTION", _env);
			}

			popScope(_env);

		break;
	
		case "exit": 
			verifyExpression(_flow.slice(1), _inst, _env);
			var _args = getFunctionArgs(_flow, true, _env);
			if(_args.length < 1)
			{
				error(`[!] Invalid number of parameter, only one required: ${_flow[3]} line:${_env.MAP[_inst][3].line + 1} position:${_env.MAP[_inst][3].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][3].line]}`);
			}
		break;
		case "require":
		
			var _args = getFunctionArgs(_flow, true, _env);
			if(_args.length < 1)
			{
				error(`[!] Missing file parameter: ${_flow[3]} line:${_env.MAP[_inst][3].line + 1} position:${_env.MAP[_inst][3].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][3].line]}`);
			}
			verifyExpression(_flow.slice(1), _inst, _env);
			var _required = genRequire(COMPILER.PATH, _args[0].slice(1, _args[0].length - 1), _env);
			if(_required.add)
			{
				COMPILER.DECL += _required.code;
			}
			_scope[_inst] = [];
			_scope[_inst].push(_required.module);
			_scope[_inst].push(";");
			
		break;
	
		case "define":
		
			_scope[_inst] = [];
			if(_flow[2] == "__NERD_Multi_Line_Quote")
			{
				COMPILER.DECL += "\n" + _flow[4].slice(1, _flow[4].length -1) + "\n";
			}
			else COMPILER.DECL += "\n" + _flow[2].slice(1, _flow[2].length - 1) + "\n";
			return _inst + 1;
			
		break;
	
		case "include":
		
			_scope[_inst] = [""];
			if(_flow[2][1] == "<")
			{
				COMPILER.INCLUDE += "#include " + _flow[2].slice(1, _flow[2].length - 1) + "\n";
			}
			else 
			{
				var _toInclude = _flow[2].slice(1, _flow[2].length - 1);
				var _pathToInclude = path.join( _env.PATH, _toInclude);
				if(fs.existsSync(_pathToInclude))
				{
					COMPILER.INCLUDE += "#include \"" + _pathToInclude + "\"\n"
				}
				else COMPILER.INCLUDE += "#include " + _flow[2] + "\n";
			}
			return _inst + 1;
			
		break;
	
		case "for":
		
			nextScope(_env);	

			var _for = _flow.slice(2);
			
			var _firstComa = _for.indexOf(";");
			var _init = _for.slice(0, _firstComa);

			_for = _for.slice(_firstComa + 1);
			
			var _secondComa = _for.indexOf(";");
			var _loop = _for.slice(0, _secondComa);
			
			var _it = _for.slice(_secondComa + 1, _for.length - 2);
			
			if(_init[0] == "var")
			{
				addVar(_init[1], _env);
			}
			else
			{
				verifyExpression(_init, _inst, _env);
			}
			
			verifyExpression(_loop, _inst, _env);
			verifyExpression(_it, _inst, _env);
			
			return _inst + 1;
		break;
		
		case "if":
			verifyExpression(_flow.slice(2, _flow.length - 2), _inst, _env);
			
			addLogical("IF", _env);
			nextScope(_env);
			return _inst + 1;
		break;
		
		case "else":
			if(!getLogical(_env).IF)
			{
				error(`[!] Use if before else/else if: ${_flow[0]} line:${_env.MAP[_inst][0].line + 1} position:${_env.MAP[_inst][0].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][0].line]}`);
			}
			if(_flow[1] && _flow[1] == "if")
			{
				verifyExpression(_flow.slice(3, _flow.length - 2), _inst, _env);
				nextScope(_env);
			}
			else
			{				
				nextScope(_env);
			}
			
			return _inst + 1;
		break;
		
		case "do":
		
			addLogical("DO", _env);

			nextScope(_env);
			return _inst + 1;
			
		break;
		
		case "while":			
			verifyExpression(_flow.slice(2, _flow.length - 2), _inst, _env);
			if(getLogical(_env).DO)
			{
				removeLogical("DO", _env);
			}
			else
			{				
				nextScope(_env);
			}
			return _inst + 1;
		break;
		
		case ";":
		
		break;
		
		case "try":
		
			addLogical("TRY", _env);
			
			nextScope(_env);
			return _inst + 1;
		break;
		
		case "catch":
			
			_scope[_inst][2] = "var " + _scope[_inst][2];
			
			if(getLogical(_env).TRY)
			{
				removeLogical("TRY", _env);
			}
			else
			{				
				error(`[!] Missing try statement before catch: ${_flow[0]} line:${_env.MAP[_inst][0].line + 1} position:${_env.MAP[_inst][0].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][0].line]}`);
			}
			nextScope(_env);
			return _inst + 1;
		break;
		
		case "return":
				if(_flow[1] == "{")
				{
					var _returnVar = "__NERD_RETURN_" + _env.MAP[_inst][0].line;
					_env.FLOW[_inst] = ["var", _returnVar, "="].concat(_env.FLOW[_inst].slice(1));
					forgeObject(_returnVar, _flow, 4, _inst, _env);
					_env.FLOW[_inst].push("return");
					_env.FLOW[_inst].push(" ");
					_env.FLOW[_inst].push(_returnVar);
					_env.FLOW[_inst].push(";");
				}
				else 
				{
					verifyExpression(_flow.slice(1), _inst, _env);
					if(_ast[1] != "VARIABLE")
					{
						_flow[1] = "var(" + _flow[1] + ")";
					}
				}
				return _inst + 1;
		break;
		
		default:
			if(varExists(_flow[0], _env))
			{			

				if(_flow[0][0] == "_" && _flow[1] && _flow[1] == "=")
				{
					error(`[!] Cannot reassign value to constant: ${_flow[0]} line:${_env.MAP[_inst][0].line + 1} position:${_env.MAP[_inst][0].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][0].line]}`);
				}
				
				if(_flow[1])
				{
					var _eq = -1;
					for(var e = 0; e < _flow.length; e++)
					{
						if(_flow[e] == "=" || _flow[e] == "(")
						{
							_eq = e; 
							break;
						}
					}
					
					var _left = _flow.slice(0, _eq).join(" ");
					
					if(_flow[_eq] == "(")
					{
						var _args = getFunctionArgs(_flow.slice(_eq), true, _env);
						
						for(var a = 0; a < _args.length; a+=2)
						{
							if(isVariable(_args[a]).check && !varExists(_args[a], _env))
							{
								error(`[!] Unknown variable or token: ${_args[a]} line:${_env.MAP[_inst][_eq + a].line + 1} position:${_env.MAP[_inst][_eq + a].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][_eq + a].line]}`);
							}
						}
						return _inst + 1;
					}
					else if(_flow[_eq] == "=")
					{
						if(_flow[_eq + 1] == "{")
						{
							forgeObject( _left, _flow, _eq + 2, _inst, _env);
						}
						else if(_flow[_eq + 1] == "[")
						{
							forgeArray( _left, _flow, _eq + 2, _inst, _env)
						}
						else if(_flow[_eq + 1] == "[]")
						{
							forgeArray( _left, _flow, _eq + 2, _inst, _env);
						}
						else if(_flow[_eq + 1] == "function")
						{
							var _newFlow = _flow.slice(0, _eq + 1).concat(["__NERD_Create_Var_Scoped_Copy_Anon", "({"]);
							var _args = getFunctionArgs(_flow, false, _env);
							nextScope(_env);
							addLogical("FUNCTION", _env);
							_scope[_inst] = _newFlow;
							var item = 0;
							for(var a = 0; a < _args.length; a+=2)
							{
								addVar(_args[a], _env, 4, _inst);
								_scope[_inst] = _scope[_inst].concat(["var", _args[a], ";", "if", "(", "__NERD_VARLENGTH", ">", item,")", _args[a], "=", `__NERD_VARARGS[${item}];`]);
								item++;
							}
							verifyExpression(_flow.slice(_eq + 1), _inst, _env);
						}
						return _inst + 1;
					}
					else if(_flow[_eq] == "exit")
					{
							error(`[!] Invalid use of exit: ${_flow[eq]} line:${_env.MAP[_inst][eq].line + 1} position:${_env.MAP[_inst][eq].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][eq].line]}`);
					}
					else if(_flow[_eq] == "require")
					{
						var _args = getFunctionArgs(_flow, true, _env);
						if(_args.length < 1)
						{
							error(`[!] Missing file parameter: ${_flow[eq]} line:${_env.MAP[_inst][eq].line + 1} position:${_env.MAP[_inst][eq].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][eq].line]}`);
						}
						verifyExpression(_flow.slice(_eq), _inst, _env);
						var _required = genRequire(COMPILER.PATH, _args[0].slice(1, _args[0].length - 1), _env);
						if(_required.add)
						{
							COMPILER.DECL += _required.code;
						}
						_scope[_inst] = [];
						_scope[_inst].push(_required.module);
						_scope[_inst].push(";");
					}
				}
			}
			else if(_ast[0] == "NATIVE")
			{
				// nothing to do
			}
			else
			{
				error(`[!] Unknown variable or token: ${_flow[0]} line:${_env.MAP[_inst][0].line + 1} position:${_env.MAP[_inst][0].position}${os.EOL}=> ${array_of_code[_env.MAP[_inst][0].line]}`);
			}
		
		break;
	}
	verifyExpression(_flow, _inst, _env);
	return _inst+1;
}

module.exports = verifyFlow;