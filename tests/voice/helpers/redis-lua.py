"""Test-only Redis command mock executing the actual scripts in system Lua.
No Redis service/network/dependency installation; absence of liblua -> exit 77.
"""
import ctypes as c
import ctypes.util
import json
import sys
name = ctypes.util.find_library('lua5.3')
if not name:
    sys.exit(77)
lua = c.CDLL(name)
lua.luaL_newstate.restype = c.c_void_p
lua.luaL_openlibs.argtypes = [c.c_void_p]
lua.luaL_loadstring.argtypes = [c.c_void_p, c.c_char_p]
lua.lua_pcallk.argtypes = [c.c_void_p, c.c_int, c.c_int, c.c_int, c.c_longlong, c.c_void_p]
lua.lua_tolstring.argtypes = [c.c_void_p, c.c_int, c.c_void_p]
lua.lua_tolstring.restype = c.c_char_p
lua.lua_close.argtypes = [c.c_void_p]
def literal(value):
    if isinstance(value, list):
        return '{' + ','.join(literal(v) for v in value) + '}'
    if isinstance(value, str):
        return json.dumps(value)
    return str(value)
source = r'''
local db, expires = {}, {}
local now = 1000000000000
redis = {}
local function value(k)
 if expires[k] and expires[k]<=now then db[k]=nil; expires[k]=nil end
 return db[k]
end
local function score(v)
 if v=='-inf' then return -math.huge end
 if v=='+inf' then return math.huge end
 return tonumber(v)
end
function redis.call(cmd,k,...)
 local args={...}
 if cmd=='TIME' then return {math.floor(now/1000),(now%1000)*1000} end
 local v=value(k)
 if cmd=='EXISTS' then return v and 1 or 0 end
 if cmd=='TTL' then return not v and -2 or (expires[k] and math.floor((expires[k]-now)/1000) or -1) end
 if cmd=='SET' then db[k]=args[1]; expires[k]=now+tonumber(args[3])*1000;return 'OK' end
 if cmd=='EXPIRE' then expires[k]=now+tonumber(args[1])*1000;return 1 end
 if cmd=='ZADD' then if not v then v={};db[k]=v end;v[args[2]]=tonumber(args[1]);return 1 end
 if cmd=='ZCARD' then local n=0;for _ in pairs(v or {}) do n=n+1 end;return n end
 if cmd=='ZCOUNT' then local n=0;for _,s in pairs(v or {}) do if s>=score(args[1]) and s<=score(args[2]) then n=n+1 end end;return n end
 if cmd=='ZREMRANGEBYSCORE' then for m,s in pairs(v or {}) do if s>=score(args[1]) and s<=score(args[2]) then v[m]=nil end end;return 0 end
 if cmd=='ZRANGE' then
  local rows={};for m,s in pairs(v or {}) do rows[#rows+1]={m,s} end
  table.sort(rows,function(a,b) return a[2]<b[2] or (a[2]==b[2] and a[1]<b[1]) end)
  local out={};for _,r in ipairs(rows) do out[#out+1]=r[1];out[#out+1]=tostring(r[2]) end;return out
 end
 error('Unsupported mock Redis command: '..cmd)
end
local function encode(v)
 if type(v)=='table' then local a={};for _,x in ipairs(v) do a[#a+1]=encode(x) end;return '['..table.concat(a,',')..']' end
 if type(v)=='string' then return string.format('%q',v) end
 return tostring(v)
end
local out={}
for _,command in ipairs(COMMANDS) do
 if command[1]=='ADVANCE' then now=now+command[2]
 else
  assert(command[1]=='EVAL')
  local n=tonumber(command[3]);KEYS={};ARGV={}
  for i=1,n do KEYS[i]=command[3+i] end
  for i=4+n,#command do ARGV[#ARGV+1]=command[i] end
  out[#out+1]=assert(load(command[2]))()
 end
end
return encode(out)
'''
commands = json.load(sys.stdin)
program = ('local COMMANDS=' + literal(commands) + '\n' + source).encode()
state = lua.luaL_newstate()
lua.luaL_openlibs(state)
try:
    status = lua.luaL_loadstring(state, program)
    if not status:
        status = lua.lua_pcallk(state, 0, 1, 0, 0, None)
    output = lua.lua_tolstring(state, -1, None).decode()
    if status:
        raise RuntimeError(output)
    print(output)
finally:
    lua.lua_close(state)
