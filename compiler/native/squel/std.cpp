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

 #include <iostream>
 #include <string>
 #include <cstring>
 #include <stdio.h>
 #include <stdlib.h>
 #include <string.h>
 #include <sstream>
 #include <vector>
 #include <memory>


 #include "nerdcore/src/nerd.hpp"
 using namespace NerdCore::Global;
 
 var __NJS_ENV = "std";
 var __NJS_PLATFORM = "{{__PLATFORM__}}";
 NerdCore::Global::var __NERD_ARGS = new NerdCore::Class::Array();
 
 {INCLUDE}
 
 {DECL}

int main(int __NERD_VARLENGTH, char* __Nerd_Argv[])
{
	NerdCore::VAR __NERD_VARARGS[__NERD_VARLENGTH];
	for( int i = 0; i < __NERD_VARLENGTH; i++)
	{
		__NERD_ARGS[i] = __Nerd_Argv[i];
		__NERD_VARARGS[i] = __Nerd_Argv[i];
	}


	{INIT}

	{CODE}
	return 0;
}
