#pragma once
#include <string>
#include <cstdint>
#include <stdexcept>
namespace confined {
struct Error : std::runtime_error { std::string code; Error(std::string c, std::string m):std::runtime_error(m),code(c){} };
#ifdef _WIN32
using Handle = void*;
#else
using Handle = int;
#endif
struct Identity { std::string id; bool directory; uint64_t links; };
Handle root(const std::string& absolute);
Handle open(Handle parent,const std::string& name,const std::string& mode);
void close(Handle h) noexcept;
Identity stat(Handle h);
size_t read(Handle h,void* bytes,size_t count);
void write(Handle h,const void* bytes,size_t count);
void sync(Handle h,bool directory);
void mkdir(Handle parent,const std::string& name);
void rename(Handle parent,Handle source,const std::string& from,const std::string& to,bool replace);
void unlink(Handle parent,Handle source,const std::string& name);
void segment(const std::string& name);
}
