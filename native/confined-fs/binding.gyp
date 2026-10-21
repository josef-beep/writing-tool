{
  "targets": [{
    "target_name": "confined_fs",
    "sources": ["addon.cc"],
    "defines": ["NAPI_VERSION=8"],
    "cflags_cc!": ["-fno-exceptions"],
    "conditions": [
      ["OS=='mac'", {"sources": ["macos.cc"], "xcode_settings": {"CLANG_CXX_LANGUAGE_STANDARD": "c++17", "GCC_ENABLE_CPP_EXCEPTIONS": "YES", "MACOSX_DEPLOYMENT_TARGET": "11.0"}}],
      ["OS=='win'", {"sources": ["windows.cc"], "msvs_settings": {"VCCLCompilerTool": {"ExceptionHandling": 1, "AdditionalOptions": ["/std:c++17"]}}}],
      ["OS!='mac' and OS!='win'", {"type": "none"}]
    ]
  }]
}
