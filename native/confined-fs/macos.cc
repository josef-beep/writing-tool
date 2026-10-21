#include "platform.h"
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <cerrno>
#include <cstring>
namespace confined {
static void fail(const char* operation) { int e=errno; throw Error(e==ENOENT?"ENOENT":e==EEXIST?"EEXIST":"EIO",std::string(operation)+": "+strerror(e)); }
void close(Handle h) noexcept { ::close(h); }
Identity stat(Handle h) { struct stat s; if(fstat(h,&s))fail("fstat"); if(!S_ISDIR(s.st_mode)&&(!S_ISREG(s.st_mode)||s.st_nlink!=1))throw Error("EALIAS","Invalid or aliased file");return {std::to_string(s.st_dev)+":"+std::to_string(s.st_ino),S_ISDIR(s.st_mode),static_cast<uint64_t>(s.st_nlink)}; }
Handle open(Handle parent,const std::string& name,const std::string& mode) {
 segment(name);int flags=O_CLOEXEC|O_NOFOLLOW;
 if(mode=="directory")flags|=O_RDONLY|O_DIRECTORY;
 else if(mode=="new")flags|=O_RDWR|O_CREAT|O_EXCL;
 else if(mode=="read")flags|=O_RDONLY;
 else throw Error("EINVAL","Unknown open mode");
 int fd=openat(parent,name.c_str(),flags,0600);if(fd<0)fail("openat");
 try{if(mode=="new")return fd;auto s=stat(fd);if(s.directory!=(mode=="directory"))throw Error("EALIAS","Unexpected object kind");return fd;}catch(...){close(fd);throw;}
}
Handle root(const std::string& absolute) {
 if(absolute.empty()||absolute[0]!='/')throw Error("EINVAL","Absolute root required");
 int fd=::open("/",O_RDONLY|O_DIRECTORY|O_NOFOLLOW|O_CLOEXEC);if(fd<0)fail("open root");
 try{size_t start=1;while(start<absolute.size()){size_t end=absolute.find('/',start);if(end==std::string::npos)end=absolute.size();std::string name=absolute.substr(start,end-start);if(!name.empty()){int next=open(fd,name,"directory");close(fd);fd=next;}start=end+1;}return fd;}catch(...){close(fd);throw;}
}
size_t read(Handle h,void* bytes,size_t count){ssize_t n;do{n=::read(h,bytes,count);}while(n<0&&errno==EINTR);if(n<0)fail("read");return static_cast<size_t>(n);}
void write(Handle h,const void* bytes,size_t count){auto p=static_cast<const char*>(bytes);while(count){ssize_t n=::write(h,p,count);if(n<0&&errno==EINTR)continue;if(n<=0)fail("write");p+=n;count-=n;}}
void sync(Handle h,bool directory){if(directory){if(fsync(h))fail("directory fsync");}else{if(fcntl(h,F_FULLFSYNC))fail("F_FULLFSYNC");}}
void mkdir(Handle parent,const std::string& name){segment(name);if(mkdirat(parent,name.c_str(),0700))fail("mkdirat");}
static void same(Handle parent,Handle source,const std::string& name){struct stat s;if(fstatat(parent,name.c_str(),&s,AT_SYMLINK_NOFOLLOW))fail("fstatat");auto expected=stat(source);if(!S_ISREG(s.st_mode)||s.st_nlink!=1||expected.id!=std::to_string(s.st_dev)+":"+std::to_string(s.st_ino))throw Error("EALIAS","Source identity changed");}
void rename(Handle parent,Handle source,const std::string& from,const std::string& to,bool replace){segment(from);segment(to);same(parent,source,from);if(renameatx_np(parent,from.c_str(),parent,to.c_str(),replace?0:RENAME_EXCL))fail("renameatx_np");}
void unlink(Handle parent,Handle source,const std::string& name){segment(name);same(parent,source,name);if(unlinkat(parent,name.c_str(),0))fail("unlinkat");}
}
