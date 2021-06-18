function __Nectar_DELAY_MS(_value)
{ 
	delay(__Nectar_Get_Int(_value)); // to fix
}

function __Nectar_DELAY(_value)
{ 
	delay(__Nectar_Get_Int(_value));
}

function __Nectar_DELAY_SECOND(_value)
{
	delay(__Nectar_Get_Int(_value) * 1000);
}

function __Nectar_PIN_MODE( _pin, _mode)
{ 
	pinMode(__Nectar_Get_Int(_pin), __Nectar_Get_Int(_mode));
}

function __Nectar_DIGITAL_WRITE( _pin, _mode)
{ 
	digitalWrite(__Nectar_Get_Int(_pin), __Nectar_Get_Int(_mode));
}

#define arduino_HIGH var(HIGH)
#define arduino_LOW var(LOW)
#define arduino_INPUT var(INPUT)
#define arduino_OUTPUT var(OUTPUT)
#define arduino_LED_BUILTIN var(LED_BUILTIN)