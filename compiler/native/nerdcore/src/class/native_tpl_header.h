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
#include "_meta.h"


namespace NerdCore::Class
{
	template<typename T>
	class NativeTPL : public virtual Base
	{
		
	private:
		void internalDelete(std::true_type)
		{
			if((*this)["__NERD_On_Destroy"]) (*this)["__NERD_On_Destroy"]();
			if(std::is_pointer<T>::value) delete value;
		}
		void internalDelete(std::false_type)
		{
			if((*this)["__NERD_On_Destroy"]) (*this)["__NERD_On_Destroy"]();
		}
	public:
		// Constructors
		bool is_ptr = 0;
		int length = 0;
		const char* info;
		NativeTPL(T val)
		{
			is_ptr = std::is_pointer<T>::value;
			info = typeid(T).name();
			value = val;
		}
		// Properties
		count_t counter = 1;
		T value;
		NerdCore::Type::object_t object;
		// Methods
		
		inline void Delete() noexcept
		{
			if (--counter == 0)
			{
				internalDelete(std::is_pointer<T>());
				delete this;
			}
		}
		
		inline void* Copy() noexcept
		{
			counter++;
			return this;
		}
		
		template<typename Cast>
		const inline T operator()(Cast& c) const
		{
			if(std::string(typeid(Cast).name()).compare(info) == 0)
			{
				return value;
			}
			else
			{
				throw(__NERD_Throw_Error("Invalid native type casting"));
			}
			
		}
		
		inline T operator()() const
		{
			return value;
		}
	
		operator bool() const noexcept { return true; }
		operator double() const noexcept
		{
			return std::numeric_limits<double>::quiet_NaN();
		}
		operator int() const noexcept
		{
			return std::numeric_limits<int>::quiet_NaN();
		}
		operator long long() const noexcept
		{
			return std::numeric_limits<long long>::quiet_NaN();
		}
		operator std::string() const noexcept
		{
			return std::string("[native ") +  std::string(typeid(T).name()) +  std::string("]");
		}
		
		// Main operators
		NerdCore::VAR const operator[](NerdCore::VAR key) const
		{
			return NerdCore::Global::null;
		}
		NerdCore::VAR &operator[](NerdCore::VAR key)
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
		
		NerdCore::VAR &operator[](int key)
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
		
		NerdCore::VAR &operator[](double key)
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
		
		
		NerdCore::VAR &operator[](const char* key)
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
		NativeTPL operator!() const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		bool operator==(const NativeTPL<T> &_v1) const { return false; }
		// === emulated with __NERD_EQUAL_VALUE_AND_TYPE
		// !== emulated with __NERD_NOT_EQUAL_VALUE_AND_TYPE
		bool operator!=(const NativeTPL<T> &_v1) const { return true; }
		bool operator<(const NativeTPL<T> &_v1) const { return false; }
		bool operator<=(const NativeTPL<T> &_v1) const { return true; }
		bool operator>(const NativeTPL<T> &_v1) const { return false; }
		bool operator>=(const NativeTPL<T> &_v1) const { return true; }
		// Numeric operators
		NativeTPL operator+() const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator-() const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator++(const int _v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator--(const int _v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator+(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator+=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator-(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator-=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator*(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator*=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		// TODO: "**" and "**=" operators
		NativeTPL operator/(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator/=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator%(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator%=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator&(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator|(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator^(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator~() const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator>>(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator<<(const NativeTPL<T> &_v1) const 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator&=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator|=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator^=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator>>=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		NativeTPL operator<<=(const NativeTPL<T> &_v1) 
		{
			#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
			throw InvalidTypeException();
			#endif
			return NativeTPL();
		}
		// TODO: ">>>" and ">>>=" operators
		
	};
} // namespace NerdCore::Class
