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

module.exports = parseCLI;
function parseCLI(args)
{
  var result = {error: false, msg: "", cli:{}, stack: [], useless: []};
  var useless = [0, 1];
  var withArgs = ["--target", "--spec", "--env", "--stack", "-o", "--preset", "--flash", "--compiler", "-c", "--build", "-b", "--option", "--register", "-r", "--setauthor", "--setid", "--setkey", "--setapi", "--setport", "--sethash", "--setsdk", "--setndk", "--setwin_inc_ucrt", "--setwin_lib_ucrt", "--setwin_lib_um", "--setxcode"];
  var noArgs = ["--install_external", "--debug", "--conserve", "--generate", "--config", "--reinit", "--example", "--examples" , "--prepare", "--project", "--run", "--clean", "--purge", "--check", "--no-check", "--verbose", "-v", "--tips", "--version", "--help", "-h", "--release", "--no-object-hashmap"];


  for(var i = 0; i < args.length; i++)
  {
    if( useless.indexOf(i) > -1 )
    {
     result.useless.push(args[i]);
    }
    else if( withArgs.indexOf(args[i]) > -1)
    {
      if(args[i+1])
      {
        result.cli[args[i]] =
        {
          state: true,
          argument: args[i+1],
        };
        i++;
      }
      else
      {
        result.error = true;
        result.msg = "[!] Missing argument for " + args[i];
        break;
      }
    }
    else if(noArgs.indexOf(args[i]) > -1)
    {
      result.cli[args[i]] =
      {
        state: true,
      };
    }
    else if(args[i].length > 0 && args[i][0] == "-")
    {
      if(withArgs.indexOf(args[i]) < 0 && noArgs.indexOf(args[i]) < 0)
      {
        result.error = true;
        result.msg = "[!] Unknown parameter : " + args[i];
        break;
      }
    }
    else result.stack.push(args[i]);
  }
  return result;
}
