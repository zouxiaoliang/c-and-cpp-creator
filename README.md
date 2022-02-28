# A C& C++ Creator :ZouXL:

This is a c&cpp creator extension for vscode.

## Features

### Macro

| Name | description | 
| ----- | ----- |
| {{\*CLASSNAME_UPPER\*}} | 大写类名 |
| {{\*CLASSNAME_LOWER\*}} | 小写类名 |
| {{\*CLASSNAME_TIELE\*}} | 标题式类名 |
| {{\*CLASSNAME\*}} | 原始类名 |
| {{\*CLAZZ_HEADER_FILENAME\*}} | 类头文件名 |
| {{\*CLAZZ_SOURCE_FILENAME\*}} | 类源文件名 |
| {{\*FILENAME_EXT\*}} | 带扩展的文件名 |
| {{\*FILENAME\*}} | 不带扩展的文件名 |
| {{\*FILENAME_UPPER\*}} | 大写不带扩展的文件名 |
| {{\*FILENAME_LOWER\*}} | 小写不带扩展的文件名 |
| {{\*USER\*}} | 用户名 |
| {{\*LICENSE\*}} | license信息 |
| {{\*DATE\*}} | 文件创建时间 |

## Requirements


## Extension Settings

This extension contributes the following settings

| Name | Type | Value |
| ----- | ----- | ----- |
| cpp.creator.template.class.h | path | default: empty |
| cpp.creator.template.class.cpp | path | default: empty |
| cpp.creator.template.header | path | default: empty |
| cpp.creator.template.source | path | default: empty |
| cpp.creator.template.class.filename.header | string | default: {{\*CLASSNAME\*}}.h |
| cpp.creator.template.class.filename.source | string | default: {{\*CLASSNAME\*}}.cpp |
| cpp.creator.template.license | string | default: empty |
| cpp.creator.template.username | string | default: zouxiaoliang |
| cpp.creator.template.main.c | path | default: empty |
| cpp.creator.template.main.cpp | path | default: empty |

## Default Template
* cpp.creator.template.class.h
```
{{*LICENSE*}}

#ifndef {{*CLASSNAME_UPPER*}}_H
#define {{*CLASSNAME_UPPER*}}_H

class {{*CLASSNAME*}} {
public:
    {{*CLASSNAME*}}();
    ~{{*CLASSNAME*}}();

private:

};

#endif // {{*CLASSNAME_UPPER*}}_H
```

* cpp.creator.template.class.cpp
```
{{*LICENSE*}}

#include "{{*CLAZZ_HEADER_FILENAME*}}"

{{*CLASSNAME*}}::{{*CLASSNAME*}}() {
    // TODO:
}

{{*CLASSNAME*}}::~{{*CLASSNAME*}}() {
    // TODO:
}
```

* cpp.creator.template.header
```
{{*LICENSE*}}

#ifndef {{*FILENAME_UPPER*}}_H
#define {{*FILENAME_UPPER*}}_H


#endif // {{*FILENAME_UPPER*}}_H
```

* cpp.creator.template.source
```
{{*LICENSE*}}
```

* cpp.creator.template.license
```
/**
 * @author {{*USER*}}
 * @date {{*DATE*}}
 */

```

* cpp.creator.template.main.c
```
{{*LICENSE*}}

#include <stdio.h>

void main() {
    printf("Hello world!!!");
}
```

* cpp.creator.template.main.cpp
```
{{*LICENSE*}}

#include <iostream>

int main(int argc, char *argv[]) {
    std::cout << "Hello world!!!" << std::endl;
    return 0;
}

```

## Release Notes

### v0.0.1


**Enjoy!**
