var OPTIONS = 
{
	"mega": { preset: "-DF_CPU=16000000UL -mmcu=atmega2560", variant: "mega"},
	"mega2560": { preset: "-DF_CPU=16000000UL -mmcu=atmega2560", variant: "mega"},
	"mega1280": { preset: "-DF_CPU=16000000UL -mmcu=atmega1280", variant: "mega"},
	"mega328p": { preset: "-DF_CPU=16000000UL -mmcu=atmega328p", variant: "standard"},
	"uno": { preset: "-DF_CPU=16000000UL -mmcu=atmega328p", variant: "standard"},
	"nano": { preset: "-DF_CPU=16000000UL -mmcu=atmega328p", variant: "standard"},
	"nano2": { preset: "-DF_CPU=16000000UL -mmcu=atmega168", variant: "standard"},
	"nano3": { preset: "-DF_CPU=16000000UL -mmcu=atmega328p", variant: "standard"}
}

function getOptions()
{
	var OPT = 
	{
		elf: false,
		cli: false,
	};

	if(CLI.cli["--option"] && CLI.cli["--option"].argument)
	{
		var _args = CLI.cli["--option"].argument.split(",");
		for(var i = 0; i < _args.length; i++)
		{
			OPT[_args[i]] = true;
		}
	}
	return OPT;
}

var ARDUINO =
{
  name: "arduino",
  main: "arduino.cpp",
  cli: function(compiler, preset, out, _in, option, target, spec)
  {  
	  var OPT = getOptions();		
	  var _cliOption = "";
	  if(CLI.cli["--option"]) _cliOption = CLI.cli["--option"].argument;
		
	  if(!target || !OPTIONS[target])
	  {
		  console.log("[!] No target selected, switching to 'uno'");
		  target = "uno";
	  }
	  var _cli = `${compiler} ${OPTIONS[target].preset} -D__NERD__OBJECT_VECTOR -DARDUINO_ARCH_AVR -w -Os -fno-exceptions -fno-rtti -fno-stack-protector -fomit-frame-pointer -ffunction-sections -fdata-sections -Wl,--gc-sections \
	  -I ${extern}/avr -I ${extern}/arduino/avr/variants/${OPTIONS[target].variant}/ -I ${extern}/arduino/avr/cores/arduino  -I ${extern}/avr/include -I ${extern}/stlarduino ${extern}/stlarduino/ios.cpp  ${extern}/arduino/avr/cores/arduino/abi.cpp ${extern}/stlarduino/new*.cpp ${extern}/stlarduino/char_traits.cpp ${extern}/stlarduino/del*.cpp ${extern}/stlarduino/stdexcept.cpp ${extern}/stlarduino/func_exception.cpp ${extern}/stlarduino/ostream_helpers.cpp -fno-threadsafe-statics -lm ${COMPILER.LIBS} -o ${out} ${_in} ${_cliOption}`;
	  
 	  if(!OPT.elf) _cli += `&& avr-objcopy -O ihex -R .eeprom ${out}`;
	if(OPT.cli) console.log("[*]" + _cli);

	return _cli;
  },
  compiler: "avr-g++ -std=c++17",
  stdlib:[],
  out: function(_name)
  {
	var OPT = getOptions();
	if(OPT.elf) _name += ".elf";
	else _name += ".hex";
	return _name;
  },
  
}

module.exports = ARDUINO;