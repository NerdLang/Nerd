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

namespace NerdCore::JS
{
	NerdCore::VAR setImmediate = __NERD_Create_Var_Unscoped_Anon(
		NerdCore::VAR _fn;
		if (__NERD_VARLENGTH > 0) _fn = __NERD_VARARGS[0];
		NerdCore::Event::evQ.push_back(_fn);
		return NerdCore::Global::null;	
	);

	NerdCore::VAR setTimeout = __NERD_Create_Var_Unscoped_Anon(
		NerdCore::VAR _fn;
		NerdCore::VAR _delay;
		if (__NERD_VARLENGTH > 0) _fn = __NERD_VARARGS[0];
		if (__NERD_VARLENGTH > 1) _delay = __NERD_VARARGS[1];
		
		NerdCore::Event::setTimer(_fn, (int)_delay, false);
		
		return NerdCore::Global::null;
	);

	NerdCore::VAR setInterval = __NERD_Create_Var_Unscoped_Anon(
		NerdCore::VAR _fn;
		NerdCore::VAR _delay;
		if (__NERD_VARLENGTH > 0) _fn = __NERD_VARARGS[0];
		if (__NERD_VARLENGTH > 1) _delay = __NERD_VARARGS[1];
		
		NerdCore::Event::setTimer(_fn, (int)_delay, true);
		
		return NerdCore::Global::null;
	);
}