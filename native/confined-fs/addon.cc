#include "platform.h"
#include <node_api.h>
#include <vector>
#include <memory>
#include <cstring>
namespace confined {
void segment(const std::string& name){if(name.empty()||name=="."||name==".."||name.find_first_of("/\\:")!=std::string::npos||name.find('\0')!=std::string::npos)throw Error("EINVAL","Unsafe native path segment");
#ifdef _WIN32
 if(name.back()=='.'||name.back()==' ')throw Error("EALIAS","Windows filename alias rejected");
#endif
}
}
namespace {
struct Owned {confined::Handle h;bool closed=false;~Owned(){if(!closed)confined::close(h);}};
void check(napi_status status){if(status!=napi_ok)throw confined::Error("ENAPI","Native binding failure");}
std::string string(napi_env env,napi_value value){size_t n;check(napi_get_value_string_utf8(env,value,nullptr,0,&n));std::vector<char> bytes(n+1);check(napi_get_value_string_utf8(env,value,bytes.data(),bytes.size(),&n));return std::string(bytes.data(),n);}
Owned* owned(napi_env env,napi_value value){void* p;check(napi_get_value_external(env,value,&p));auto h=static_cast<Owned*>(p);if(!h||h->closed)throw confined::Error("EBADF","Closed native handle");return h;}
napi_value undefined(napi_env env){napi_value value;check(napi_get_undefined(env,&value));return value;}
napi_value wrap(napi_env env,confined::Handle h){Owned guard{h};auto p=std::make_unique<Owned>();p->h=h;guard.closed=true;napi_value value;check(napi_create_external(env,p.get(),[](napi_env,void* data,void*){delete static_cast<Owned*>(data);},nullptr,&value));p.release();return value;}
struct Args {napi_env env;size_t count=5;napi_value values[5]{};Args(napi_env e,napi_callback_info info):env(e){check(napi_get_cb_info(e,info,&count,values,nullptr,nullptr));}confined::Handle handle(size_t i){return owned(env,values[i])->h;}std::string text(size_t i){return string(env,values[i]);}};
template<napi_value (*Fn)(Args&)> napi_value call(napi_env env,napi_callback_info info){try{Args args(env,info);return Fn(args);}catch(const confined::Error& e){bool pending=false;napi_is_exception_pending(env,&pending);if(!pending)napi_throw_error(env,e.code.c_str(),e.what());}catch(const std::exception& e){napi_throw_error(env,"EIO",e.what());}return nullptr;}
napi_value root(Args& a){return wrap(a.env,confined::root(a.text(0)));}
napi_value open(Args& a){
 napi_valuetype callback=napi_undefined;
 if(a.count>3){check(napi_typeof(a.env,a.values[3],&callback));if(callback!=napi_undefined&&callback!=napi_function)throw confined::Error("EINVAL","Reservation callback must be a function");}
 auto h=confined::open(a.handle(0),a.text(1),a.text(2));
 // Report the reservation before allocating its JavaScript wrapper: allocation can fail too.
 try{if(callback==napi_function){napi_value result;check(napi_call_function(a.env,undefined(a.env),a.values[3],0,nullptr,&result));}}
 catch(...){confined::close(h);throw;}
 return wrap(a.env,h);
}
napi_value close(Args& a){auto h=owned(a.env,a.values[0]);confined::close(h->h);h->closed=true;return undefined(a.env);}
napi_value stat(Args& a){auto s=confined::stat(a.handle(0));napi_value result,id,directory;check(napi_create_object(a.env,&result));check(napi_create_string_utf8(a.env,s.id.c_str(),s.id.size(),&id));check(napi_get_boolean(a.env,s.directory,&directory));check(napi_set_named_property(a.env,result,"id",id));check(napi_set_named_property(a.env,result,"directory",directory));return result;}
napi_value read(Args& a){uint32_t count;check(napi_get_value_uint32(a.env,a.values[1],&count));if(count>262144)throw confined::Error("EINVAL","Read chunk exceeds native transfer bound");std::vector<char> bytes(count);size_t length=confined::read(a.handle(0),bytes.data(),count);napi_value value;check(napi_create_buffer_copy(a.env,length,bytes.data(),nullptr,&value));return value;}
napi_value write(Args& a){void* bytes;size_t count;check(napi_get_buffer_info(a.env,a.values[1],&bytes,&count));if(count>262144)throw confined::Error("EINVAL","Write chunk exceeds native transfer bound");confined::write(a.handle(0),bytes,count);return undefined(a.env);}
napi_value sync(Args& a){bool directory;check(napi_get_value_bool(a.env,a.values[1],&directory));auto h=a.handle(0);if(confined::stat(h).directory!=directory)throw confined::Error("EINVAL","Flush object kind mismatch");confined::sync(h,directory);return undefined(a.env);}
napi_value mkdir(Args& a){confined::mkdir(a.handle(0),a.text(1));return undefined(a.env);}
napi_value rename(Args& a){bool replace;check(napi_get_value_bool(a.env,a.values[4],&replace));confined::rename(a.handle(0),a.handle(1),a.text(2),a.text(3),replace);return undefined(a.env);}
napi_value unlink(Args& a){confined::unlink(a.handle(0),a.handle(1),a.text(2));return undefined(a.env);}
napi_value init(napi_env env,napi_value exports){napi_property_descriptor descriptors[]={
#define METHOD(name) {#name,nullptr,call<name>,nullptr,nullptr,nullptr,napi_default,nullptr}
 METHOD(root),METHOD(open),METHOD(close),METHOD(stat),METHOD(read),METHOD(write),METHOD(sync),METHOD(mkdir),METHOD(rename),METHOD(unlink)
#undef METHOD
 };check(napi_define_properties(env,exports,sizeof(descriptors)/sizeof(descriptors[0]),descriptors));napi_value version;check(napi_create_uint32(env,1,&version));check(napi_set_named_property(env,exports,"contractVersion",version));return exports;}
}
NAPI_MODULE(NODE_GYP_MODULE_NAME,init)
