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
#include "object_header.h"
#include <limits>

namespace NerdCore::Class
{
	NerdCore::VAR __proxy;
	// Constructors
	Object::Object() { }

	/*
	Object::Object(const char* _key, NerdCore::VAR _value)
	{ 
		object[_key] = _value;
	}
	*/
	
	Object::Object(NerdCore::Type::object_t _obj)
	{ 
		object = _obj;
	}
	// Methods
	inline double Object::Size() noexcept
	{
		return object.size();
	}

	inline void recursiveDeleteObject(NerdCore::Class::Object* obj, NerdCore::Class::Object* _main);
	inline void recursiveDeleteArray(NerdCore::Class::Array* obj, NerdCore::Class::Object* _main);
	inline void recursiveDeleteFixedArray(NerdCore::Class::FixedArray* obj, NerdCore::Class::Object* _main);

	inline void recursiveDeleteObject(NerdCore::Class::Object* obj, NerdCore::Class::Object* _main)
	{
		for (auto& itr : obj->object) 
		{
			if(itr.second.type == NerdCore::Enum::Type::Object)
			{
				NerdCore::Class::Object* _obj = (NerdCore::Class::Object*)itr.second.data.ptr;
				if(_main == _obj)
				{
					_obj->counter--;
					itr.second.type = NerdCore::Enum::Type::Null;
					itr.second.data.number = 0;
				}
				else
				{
					recursiveDeleteObject(_obj, _main);
				}
			}
			else if(itr.second.type == NerdCore::Enum::Type::Array)
			{
				recursiveDeleteArray((NerdCore::Class::Array*)itr.second.data.ptr, _main);
			}
			else if(itr.second.type == NerdCore::Enum::Type::FixedArray)
			{
				recursiveDeleteFixedArray((NerdCore::Class::FixedArray*)itr.second.data.ptr, _main);
			}
		}
	}

	inline void recursiveDeleteArray(NerdCore::Class::Array* obj, NerdCore::Class::Object* _main)
	{
		int size = obj->Size();
		for (int i = 0; i < size; i++) 
		{
			if(obj->value[i].type == NerdCore::Enum::Type::Object)
			{
				NerdCore::Class::Object* _obj = (NerdCore::Class::Object*)obj->value[i].data.ptr;
				if(_main == _obj)
				{
					_obj->counter--;
					obj->value[i].type = NerdCore::Enum::Type::Null;
					obj->value[i].data.number = 0;
				}
				else
				{
					recursiveDeleteObject(_obj, _main);
				}
				
			}
			else if(obj->value[i].type == NerdCore::Enum::Type::Array)
			{
				recursiveDeleteArray((NerdCore::Class::Array*)obj->value[i].data.ptr, _main);
			}
			else if(obj->value[i].type == NerdCore::Enum::Type::FixedArray)
			{
				recursiveDeleteFixedArray((NerdCore::Class::FixedArray*)obj->value[i].data.ptr, _main);
			}
		}
	}

	inline void recursiveDeleteFixedArray(NerdCore::Class::FixedArray* obj, NerdCore::Class::Object* _main)
	{
		int size = obj->length;
		for (int i = 0; i < size; i++) 
		{
			if(obj->value[i].type == NerdCore::Enum::Type::Object)
			{
				NerdCore::Class::Object* _obj = (NerdCore::Class::Object*)obj->value[i].data.ptr;
				if(_main == _obj)
				{
					_obj->counter--;
					obj->value[i].type = NerdCore::Enum::Type::Null;
					obj->value[i].data.number = 0;
				}
				else
				{
					recursiveDeleteObject(_obj, _main);
				}
				
			}
			else if(obj->value[i].type == NerdCore::Enum::Type::Array)
			{
				recursiveDeleteArray((NerdCore::Class::Array*)obj->value[i].data.ptr, _main);
			}
			else if(obj->value[i].type == NerdCore::Enum::Type::FixedArray)
			{
				recursiveDeleteFixedArray((NerdCore::Class::FixedArray*)obj->value[i].data.ptr, _main);
			}
		}
	}

	inline void Object::Delete() noexcept
	{
		recursiveDeleteObject(this, this);
		if (--counter == 0)
		{
			delete this;
		}
	}
	inline void Object::jsDelete(const std::string _key) noexcept
	{
		#ifndef __NERD__OBJECT_VECTOR
			object.erase(_key);
		#else
			for (NerdCore::Type::object_t::iterator it = object.begin() ; it != object.end(); ++it)
			{
				if (_key.compare(it->first) == 0)
				{
					object.erase(it);
					return;
				}
			}
		#endif
	}
	inline void* Object::Copy() noexcept
	{
		counter++;
		return this;
	}
	// Native cast
	Object::operator bool() const noexcept { return true; }
	Object::operator double() const noexcept
	{
		return std::numeric_limits<double>::quiet_NaN();
	}
	Object::operator int() const noexcept
	{
		return std::numeric_limits<int>::quiet_NaN();
	}
	Object::operator long long() const noexcept
	{
		return std::numeric_limits<long long>::quiet_NaN();
	}
	Object::operator std::string() const noexcept
	{
		return "[object Object]";
	}
	// Main operators
	NerdCore::VAR const Object::operator[](NerdCore::VAR key) const
	{
		return NerdCore::Global::null;
	}
	
	#ifndef __NERD__OBJECT_VECTOR
	NerdCore::VAR &Object::operator[](NerdCore::VAR key)
	{
		return object[key];
	}
	#else
	NerdCore::VAR &Object::operator[](NerdCore::VAR key)
	{
		std::string _str = ((std::string)key);
		NerdCore::Type::StringView _sview = _str;
		
		if (key.type == NerdCore::Enum::Type::Number)
		{
			auto i = (int)key;
			
			if (i < 0)
			{
				return NerdCore::Global::null;
			}
			else 
			{
				if (i >= object.size())
				{
					object.reserve(i + 1);
					object.resize(i + 1);
				}
			}
			return object[i].second;
		}
		
		for (auto & search : object)
		{
			if (_sview.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::Global::null));

		return object[object.size() - 1].second;
	}
	#endif
	
	#ifndef __NERD__OBJECT_VECTOR
	NerdCore::VAR &Object::operator[](int key)
	{
		std::string _str = std::to_string(key);
		NerdCore::Type::StringView _sview = _str;
		
		return object[_str];
	}
	#else
	NerdCore::VAR &Object::operator[](int key)
	{
		std::string _str = std::to_string(key);
		NerdCore::Type::StringView _sview = _str;
		
		for (auto & search : object)
		{
			if (_sview.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::Global::null));


		return object[object.size() - 1].second;
	}
	#endif
	
	#ifndef __NERD__OBJECT_VECTOR
	NerdCore::VAR &Object::operator[](double key)
	{
		std::string _str = std::to_string(key);
		NerdCore::Type::StringView _sview = _str;
		
		return object[_str];
	}
	#else
	NerdCore::VAR &Object::operator[](double key)
	{
		std::string _str = std::to_string(key);
		NerdCore::Type::StringView _sview = _str;
		
		for (auto & search : object)
		{
			if (_sview.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::Global::null));

		return object[object.size() - 1].second;
	}
	#endif
	
	#ifndef __NERD__OBJECT_VECTOR
	NerdCore::VAR &Object::operator[](const char* key)
	{
		return object[key];
	}
	#else
	NerdCore::VAR &Object::operator[](const char* key)
	{
		std::string _str = key;
		NerdCore::Type::StringView _sview = _str;

		for (auto & search : object)
		{
			if (_sview.compare(search.first) == 0)
			{
				return search.second;
			}
		}

		object.push_back(NerdCore::Type::pair_t(_str, NerdCore::Global::null));


		return object[object.size() - 1].second;
	}
	#endif
	
	// Comparation operators
	Object Object::operator!() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	bool Object::operator==(const Object &_v1) const { return false; }
	// === emulated with __NERD_EQUAL_VALUE_AND_TYPE
	// !== emulated with __NERD_NOT_EQUAL_VALUE_AND_TYPE
	bool Object::operator!=(const Object &_v1) const { return true; }
	bool Object::operator<(const Object &_v1) const { return false; }
	bool Object::operator<=(const Object &_v1) const { return true; }
	bool Object::operator>(const Object &_v1) const { return false; }
	bool Object::operator>=(const Object &_v1) const { return true; }
	// Numeric operators
	Object Object::operator+() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator-() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator++(const int _v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator--(const int _v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator+(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator+=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator-(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator-=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator*(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator*=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	// TODO: "**" and "**=" operators
	Object Object::operator/(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator/=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator%(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator%=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator&(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator|(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator^(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator~() const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator>>(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator<<(const Object &_v1) const 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator&=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator|=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator^=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator>>=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	Object Object::operator<<=(const Object &_v1) 
	{
		#if !defined(__NERD_ENV_ARDUINO) && !defined(__NERD_ENV_ESP32)
		throw InvalidTypeException();
		#endif
		return Object();
	}
	// TODO: ">>>" and ">>>=" operators
} // namespace NerdCore::Class
