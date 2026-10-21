#include "platform.h"
#define WIN32_LEAN_AND_MEAN
#define NOMINMAX
#include <windows.h>
#include <winternl.h>
#include <vector>
#include <limits>
#include <climits>
#include <cstddef>
#include <cstring>
#include <cwchar>
namespace confined {
static void fail(const char* operation,DWORD e=GetLastError()){throw Error(e==ERROR_FILE_NOT_FOUND||e==ERROR_PATH_NOT_FOUND?"ENOENT":e==ERROR_FILE_EXISTS||e==ERROR_ALREADY_EXISTS?"EEXIST":e==ERROR_NOT_SUPPORTED||e==ERROR_INVALID_FUNCTION?"ENOTSUP":"EIO",std::string(operation)+" (Win32 "+std::to_string(e)+")");}
static std::wstring wide(const std::string& s){int n=MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.data(),static_cast<int>(s.size()),nullptr,0);if(!n)fail("UTF-8 path");std::wstring r(n,L'\0');if(!MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.data(),static_cast<int>(s.size()),r.data(),n))fail("UTF-8 path");return r;}
void close(Handle h) noexcept{CloseHandle(h);}
Identity stat(Handle h){BY_HANDLE_FILE_INFORMATION s;if(!GetFileInformationByHandle(h,&s))fail("file identity");if(s.dwFileAttributes&FILE_ATTRIBUTE_REPARSE_POINT)throw Error("EALIAS","Reparse point rejected");bool directory=(s.dwFileAttributes&FILE_ATTRIBUTE_DIRECTORY)!=0;if(GetFileType(h)!=FILE_TYPE_DISK||(!directory&&s.nNumberOfLinks!=1))throw Error("EALIAS","Invalid or aliased file");return{std::to_string(s.dwVolumeSerialNumber)+":"+std::to_string(s.nFileIndexHigh)+":"+std::to_string(s.nFileIndexLow),directory,s.nNumberOfLinks};}
static void exactName(Handle h,const std::wstring& name){std::vector<unsigned char> bytes(1024);for(;;){if(GetFileInformationByHandleEx(h,FileNameInfo,bytes.data(),static_cast<DWORD>(bytes.size())))break;DWORD e=GetLastError();if(e!=ERROR_MORE_DATA)fail("canonical file name",e);if(bytes.size()>std::numeric_limits<DWORD>::max()/2)throw Error("EIO","Native name overflow");bytes.resize(bytes.size()*2);}auto info=reinterpret_cast<FILE_NAME_INFO*>(bytes.data());std::wstring actual(info->FileName,info->FileNameLength/sizeof(WCHAR));size_t slash=actual.find_last_of(L'\\');if(actual.substr(slash==std::wstring::npos?0:slash+1)!=name)throw Error("EALIAS","Filename alias rejected");}
Handle open(Handle parent,const std::string& name,const std::string& mode){segment(name);auto w=wide(name);if(w.size()>USHRT_MAX/sizeof(WCHAR))throw Error("EINVAL","Native name overflow");
 using Create=NTSTATUS(NTAPI*)(PHANDLE,ACCESS_MASK,POBJECT_ATTRIBUTES,PIO_STATUS_BLOCK,PLARGE_INTEGER,ULONG,ULONG,ULONG,ULONG,PVOID,ULONG);
 using ToError=ULONG(NTAPI*)(NTSTATUS);
 auto module=GetModuleHandleW(L"ntdll.dll");auto create=reinterpret_cast<Create>(GetProcAddress(module,"NtCreateFile"));auto toError=reinterpret_cast<ToError>(GetProcAddress(module,"RtlNtStatusToDosError"));if(!create||!toError)throw Error("ENOTSUP","Native relative open unavailable");
 bool directory=mode=="directory";if(!directory&&mode!="new"&&mode!="read")throw Error("EINVAL","Unknown open mode");
 UNICODE_STRING text{};text.Buffer=w.data();text.Length=static_cast<USHORT>(w.size()*sizeof(WCHAR));text.MaximumLength=text.Length;OBJECT_ATTRIBUTES attr{};attr.Length=sizeof(attr);attr.RootDirectory=parent;attr.ObjectName=&text;attr.Attributes=0;IO_STATUS_BLOCK io{};HANDLE h;
 // Exact, one-segment NT lookup. No DOS normalization or absolute-path reopen.
 ACCESS_MASK access=SYNCHRONIZE|FILE_READ_ATTRIBUTES|(directory?(FILE_LIST_DIRECTORY|FILE_TRAVERSE):(GENERIC_READ|DELETE|(mode=="new"?GENERIC_WRITE:0)));
 NTSTATUS status=create(&h,access,&attr,&io,nullptr,FILE_ATTRIBUTE_NORMAL,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,mode=="new"?2:1,0x00200000/*FILE_OPEN_REPARSE_POINT*/|0x20/*FILE_SYNCHRONOUS_IO_NONALERT*/|(directory?1:0x40),nullptr,0);
 if(status<0)fail("NtCreateFile",toError(status));try{if(mode=="new")return h;auto s=stat(h);if(s.directory!=directory)throw Error("EALIAS","Unexpected object kind");exactName(h,w);return h;}catch(...){close(h);throw;}
}
Handle root(const std::string& absolute){auto p=wide(absolute);if(p.size()<3||p[1]!=L':'||p[2]!=L'\\'||!((p[0]>=L'A'&&p[0]<=L'Z')||(p[0]>=L'a'&&p[0]<=L'z')))throw Error("ENOTSUP","Only local drive-absolute native roots are supported; UNC/device roots are unavailable");std::wstring volume=L"\\\\?\\"+p.substr(0,3);HANDLE h=CreateFileW(volume.c_str(),FILE_LIST_DIRECTORY|FILE_TRAVERSE|FILE_READ_ATTRIBUTES|SYNCHRONIZE,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,nullptr,OPEN_EXISTING,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT,nullptr);if(h==INVALID_HANDLE_VALUE)fail("drive root");try{if(!stat(h).directory)throw Error("EALIAS","Invalid root");size_t start=3;while(start<p.size()){size_t end=p.find(L'\\',start);if(end==std::wstring::npos)end=p.size();auto part=p.substr(start,end-start);if(!part.empty()){int n=WideCharToMultiByte(CP_UTF8,WC_ERR_INVALID_CHARS,part.data(),static_cast<int>(part.size()),nullptr,0,nullptr,nullptr);if(!n)fail("root encoding");std::string s(n,'\0');WideCharToMultiByte(CP_UTF8,WC_ERR_INVALID_CHARS,part.data(),static_cast<int>(part.size()),s.data(),n,nullptr,nullptr);auto next=open(h,s,"directory");close(h);h=next;}start=end+1;}return h;}catch(...){close(h);throw;}}
size_t read(Handle h,void* bytes,size_t count){DWORD n;if(!ReadFile(h,bytes,static_cast<DWORD>(count),&n,nullptr))fail("ReadFile");return n;}
void write(Handle h,const void* bytes,size_t count){auto p=static_cast<const char*>(bytes);while(count){DWORD n;if(!WriteFile(h,p,static_cast<DWORD>(count),&n,nullptr))fail("WriteFile");if(!n)throw Error("EIO","Zero-length native write");p+=n;count-=n;}}
void sync(Handle h,bool directory){
 if(!directory){if(!FlushFileBuffers(h))fail("FlushFileBuffers");return;}
 // MS-FSA 2.1.5.7 product note 80 only promises directory-structure flush on NTFS.
 // Other filesystems can return success without persisting the namespace.
 WCHAR filesystem[32]{};
 if(!GetVolumeInformationByHandleW(h,nullptr,0,nullptr,nullptr,nullptr,filesystem,32))fail("directory filesystem query");
 if(wcscmp(filesystem,L"NTFS")!=0)throw Error("ENOTSUP","Durable directory publication requires local NTFS on Windows");
 auto expected=stat(h);
 // Upgrade rights on the pinned object, never by reopening its absolute pathname.
 HANDLE writable=ReOpenFile(h,GENERIC_WRITE|FILE_READ_ATTRIBUTES,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT);
 if(writable==INVALID_HANDLE_VALUE)fail("reopen directory for metadata flush");
 try{
  auto actual=stat(writable);if(!actual.directory||actual.id!=expected.id)throw Error("EALIAS","Directory identity changed during flush reopen");
  using Flush=NTSTATUS(NTAPI*)(HANDLE,ULONG,PVOID,ULONG,PIO_STATUS_BLOCK);
  using ToError=ULONG(NTAPI*)(NTSTATUS);
  auto module=GetModuleHandleW(L"ntdll.dll");
  auto flush=reinterpret_cast<Flush>(GetProcAddress(module,"NtFlushBuffersFileEx"));
  auto toError=reinterpret_cast<ToError>(GetProcAddress(module,"RtlNtStatusToDosError"));
  if(!flush||!toError)throw Error("ENOTSUP","Native directory metadata flush unavailable");
  IO_STATUS_BLOCK io{};
  // Flags 0 flushes data AND metadata AND underlying storage; no DATA_ONLY/NO_SYNC.
  NTSTATUS status=flush(writable,0,nullptr,0,&io);
  if(status!=0)fail("NtFlushBuffersFileEx directory",toError(status));
  if(io.Status!=0)fail("directory flush completion",toError(io.Status));
 }catch(...){close(writable);throw;}
 close(writable);
}
void mkdir(Handle parent,const std::string& name){segment(name);auto w=wide(name);using Create=NTSTATUS(NTAPI*)(PHANDLE,ACCESS_MASK,POBJECT_ATTRIBUTES,PIO_STATUS_BLOCK,PLARGE_INTEGER,ULONG,ULONG,ULONG,ULONG,PVOID,ULONG);using ToError=ULONG(NTAPI*)(NTSTATUS);auto module=GetModuleHandleW(L"ntdll.dll");auto create=reinterpret_cast<Create>(GetProcAddress(module,"NtCreateFile"));auto toError=reinterpret_cast<ToError>(GetProcAddress(module,"RtlNtStatusToDosError"));if(!create||!toError)throw Error("ENOTSUP","Native directory creation unavailable");if(w.size()>USHRT_MAX/sizeof(WCHAR))throw Error("EINVAL","Native name overflow");UNICODE_STRING text{};text.Buffer=w.data();text.Length=static_cast<USHORT>(w.size()*sizeof(WCHAR));text.MaximumLength=text.Length;OBJECT_ATTRIBUTES attr{};attr.Length=sizeof(attr);attr.RootDirectory=parent;attr.ObjectName=&text;IO_STATUS_BLOCK io{};HANDLE h;NTSTATUS status=create(&h,FILE_LIST_DIRECTORY|FILE_READ_ATTRIBUTES|SYNCHRONIZE,&attr,&io,nullptr,FILE_ATTRIBUTE_DIRECTORY,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,2,1|0x20|0x00200000,nullptr,0);if(status<0)fail("relative mkdir",toError(status));close(h);}
void rename(Handle parent,Handle source,const std::string& from,const std::string& to,bool replace){segment(from);segment(to);stat(source);auto w=wide(to);size_t length=offsetof(FILE_RENAME_INFO,FileName)+w.size()*sizeof(WCHAR);std::vector<unsigned char> bytes(length);auto info=reinterpret_cast<FILE_RENAME_INFO*>(bytes.data());info->ReplaceIfExists=replace;info->RootDirectory=parent;info->FileNameLength=static_cast<DWORD>(w.size()*sizeof(WCHAR));memcpy(info->FileName,w.data(),info->FileNameLength);if(!SetFileInformationByHandle(source,FileRenameInfo,info,static_cast<DWORD>(length)))fail("handle-relative rename");}
void unlink(Handle parent,Handle source,const std::string& name){segment(name);stat(source);FILE_DISPOSITION_INFO info{TRUE};if(!SetFileInformationByHandle(source,FileDispositionInfo,&info,sizeof(info)))fail("handle deletion");}
}
