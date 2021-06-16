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

#pragma once
#include "native_header.h"
#include <functional>
#include <limits>

namespace NerdCore::Class
{
	// Constructors
	Native::Native() {}
	Native::Native(void *val)
	{
		value = val;
	}
	// Methods
	inline void Native::Delete() noexcept
	{
		if (--counter < 1)
		{
			if((*this)["__NERD_On_Destroy"]) (*this)["__NERD_On_Destroy"]();
			delete this;
		}
	}
	inline void* Native::Copy() noexcept
	{
		counter++;
		return this;
	}
	// Native cast
	Native::operator bool() const noexcept { return true; }
	Native::operator double() const noexcept
	{
		return std::numeric_limits<double>::quiet_NaN();
	}
	Native::operator int() const noexcept
	{
		return std::numeric_limits<int>::quiet_NaN();
	}
	Native::operator long long() const noexcept
	{
		return std::numeric_limits<long long>::quiet_NaN();
	}
	Native::operator std::string() const noexcept
	{
		return "[native code]";
	}
	// Main operators
	NerdCore::VAR const Native::operator[](NerdCore::VAR key) const
	{
		return NerdCore::Global::null;
	}
	NerdCore::VAR &Native::operator[](NerdCore::VAR key)
	{
		#ifndef __NERD__OBJECT_VECTOR
		return object[(std::string)key];
		#else
		for (auto & search : object)
		{
			if (((std::string)key).compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t((std::string)key, NerdCore::VAR()));
		return object[object.size() - 1].second;
		#endif
	}
	
	NerdCore::VAR &Native::operator[](int key)
	{
		#ifndef __NERD__OBJECT_VECTOR
		return object[std::to_string(key)];
		#else
		std::string _str = std::to_string(key);
		for (auto & search : object)
		{
			if (_str.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::VAR()));
		return object[object.size() - 1].second;
		#endif
	}
	
	NerdCore::VAR &Native::operator[](double key)
	{
		#ifndef __NERD__OBJECT_VECTOR
		return object[std::to_string(key)];
		#else
		std::string _str = std::to_string(key);
		for (auto & search : object)
		{
			if (_str.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::VAR()));
		return object[object.size() - 1].second;
		#endif
	}
	
	
	NerdCore::VAR &Native::operator[](const char* key)
	{
		std::string str = key;
		#ifndef __NERD__OBJECT_VECTOR
		return object[str];
		#else
		for (auto & search : object)
		{
			if (str.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(str, NerdCore::VAR()));
		return object[object.size() - 1].second;
		#endif
	}
	
	// Comparation operators
	Native Native::operator!() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	bool Native::operator==(const Native &_v1) const { return false; }
	// === emulated with __NERD_EQUAL_VALUE_AND_TYPE
	// !== emulated with __NERD_NOT_EQUAL_VALUE_AND_TYPE
	bool Native::operator!=(const Native &_v1) const { return true; }
	bool Native::operator<(const Native &_v1) const { return false; }
	bool Native::operator<=(const Native &_v1) const { return true; }
	bool Native::operator>(const Native &_v1) const { return false; }
	bool Native::operator>=(const Native &_v1) const { return true; }
	// Numeric operators
	Native Native::operator+() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator-() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator++(const int _v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator--(const int _v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator+(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator+=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator-(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator-=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator*(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator*=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	// TODO: "**" and "**=" operators
	Native Native::operator/(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator/=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator%(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator%=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator&(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator|(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator^(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator~() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator>>(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator<<(const Native &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator&=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator|=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator^=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator>>=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	Native Native::operator<<=(const Native &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Native();
	}
	// TODO: ">>>" and ">>>=" operators
} // namespace NerdCore::Class
