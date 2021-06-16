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

function copyDirSync( source, target ) 
{
    var targetFile = target;
    if ( fs.existsSync( target ) ) 
    {
        if ( fs.lstatSync( target ).isDirectory() ) 
        {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    fs.copyFileSync(source, targetFile);
}

function copyFolderRecursiveSync( source, target, _root ) 
{
    var files = [];
    var targetFolder = path.join( target, path.basename( source ) );
    if(_root) targetFolder = target;
    if ( !fs.existsSync( targetFolder ) ) 
    {
        fs.mkdirSync( targetFolder );
    }

    if ( fs.lstatSync( source ).isDirectory() ) 
    {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) 
        {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) 
            {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else 
            {
                copyDirSync( curSource, targetFolder );
            }
        } );
    }
}

module.exports = copyFolderRecursiveSync;