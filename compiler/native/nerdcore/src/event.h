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

#include <deque>

namespace NerdCore::Event
{
	std::deque<NerdCore::VAR> evQ = {};
	std::deque<std::tuple<uint64_t,bool,NerdCore::VAR>> timeQ = {};

	inline uint64_t getMillis()
	{
		#ifndef __NERD_ENV_ARDUINO
			return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
		#else
			return millis();
		#endif
	}
	void sleep(uint64_t _timer)
	{
		#ifdef __NERD_ENV_ARDUINO
			delay(_timer);
		#else
			std::this_thread::sleep_for(std::chrono::milliseconds(_timer));
		#endif
	}

	void setTimer(NerdCore::VAR _var, int _timer, bool repeat)
	{
		uint64_t _trigger = getMillis();
		_trigger += _timer;
		timeQ.push_back({_trigger, repeat, _var});
	}

	void Loop()
	{
		while(evQ.size() || timeQ.size())
		{
			if(timeQ.size())
			{
				uint64_t min = 1000;
				uint64_t _now = getMillis();
				for(auto it = timeQ.begin(); it != timeQ.end();)
				{
					#ifndef __NERD_ENV_ARDUINO
						uint64_t& _t = std::get<0>(*it);
						NerdCore::VAR _ev = std::get<2>(*it);
						bool& _b = std::get<1>(*it);
					#else
						uint64_t _t = it->get<0>();
						NerdCore::VAR _ev = it->get<2>();
						bool _b = it->get<1>();
					#endif
					if(_t <= _now)
					{
						if(!_b) timeQ.erase(it);
						_ev();
						if(!_b) ((NerdCore::Class::Base*)_ev.data.ptr)->Delete();
						else it++;
					}
					else
					{
						if(_t - _now < min) min = _t - _now;
						it++;
					}
				}
				if(evQ.size() == 0 && timeQ.size() > 0)
				{
					NerdCore::Event::sleep(min);
				}
			}

			if(evQ.size())
			{
				NerdCore::VAR _ev = evQ.front();
				evQ.pop_front();
				_ev();
				((NerdCore::Class::Base*)_ev.data.ptr)->Delete();
			}
		}
	}
}
