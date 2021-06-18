 #define __NERD_ENV_WASM
 #include "nerdcore/src/nerd.hpp"
 
 using namespace NerdCore::Global;
 using namespace NerdCore::Functions;
 
 var __NERD_ENV = "wasm";
 var __NERD_PLATFORM = "{{__PLATFORM__}}";
 
 #define __NERD_Create_Object() new NerdCore::Class::Object()
 #define __NERD_Create_Array(_arr) new NerdCore::Class::Array(_arr)
 #define __NERD_InitVar() NerdCore::VAR()
 {INCLUDE}
 
 {DECL}

int main(int argc, char* argv[])
{
	var __NERD_ARGS = __NERD_Create_Array();
	
	for( int i = 0; i < argc; i++)
	{
		__NERD_ARGS[i] = argv[i];
	}

	try 
	{

		{INIT}
		
		#ifdef __NERD_INIT_RAND_SEED
		srand (time(NULL));
		#endif
		{
			{CODE}

			NerdCore::Event::Loop();
		}
		
	}
	catch(NerdCore::VAR __NERD_Global_Exception)
	{
		__NERD_Log_Console(__NERD_Global_Exception);
		exit(1);
	}
	return 0;
}
