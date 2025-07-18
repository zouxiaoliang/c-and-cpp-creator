# A C& C++ Creator :zouxiaoliang:

This is a c&cpp creator extension for vscode.

## Features
* `v0.0.1` 创建 C++类
* `v0.0.1` 创建 头文件
* `v0.0.1` 创建 源文件
* `v0.0.1` 自定义源文件/头文件/类文件模版，可以增加自定义license信息以及用户名
* `v0.0.2` 创建cmake C/C++ 项目

### Macro

| Name | description |
| ----- | ----- |
| {{\*CLASSNAME_UPPER\*}} | 大写类名 |
| {{\*CLASSNAME_LOWER\*}} | 小写类名 |
| {{\*CLASSNAME_TITLE\*}} | 标题式类名 |
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
| {{\*PROJECT_NAME_UPPER\*}} | 大写项目名 ｜
| {{\*PROJECT_NAME_LOWER\*}} | 小写项目名 ｜
| {{\*PROJECT_NAME_TITLE\*}} | 标题式项目名 ｜
| {{\*PROJECT_NAME\*}} | 原始项目名 ｜

## Requirements


## Extension Settings

This extension contributes the following settings

| Name | Type | Value |
| ----- | ----- | ----- |
| code_assistant.creator.template.class.h | path | default: empty |
| code_assistant.creator.template.class.cpp | path | default: empty |
| code_assistant.creator.template.header | path | default: empty |
| code_assistant.creator.template.source | path | default: empty |
| code_assistant.creator.template.class.filename.header | string | default: {{\*CLASSNAME\*}}.h |
| code_assistant.creator.template.class.filename.source | string | default: {{\*CLASSNAME\*}}.cpp |
| code_assistant.creator.template.license | string | default: empty |
| code_assistant.creator.template.username | string | default: zouxiaoliang |
| code_assistant.creator.template.main.c | path | default: empty |
| code_assistant.creator.template.main.cpp | path | default: empty |

## Default Template
* code_assistant.creator.template.class.h
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

* code_assistant.creator.template.class.cpp
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

* code_assistant.creator.template.header
```
{{*LICENSE*}}

#ifndef {{*FILENAME_UPPER*}}_H
#define {{*FILENAME_UPPER*}}_H


#endif // {{*FILENAME_UPPER*}}_H
```

* code_assistant.creator.template.source
```
{{*LICENSE*}}
```

* code_assistant.creator.template.license
```
/**
 * @author {{*USER*}}
 * @date {{*DATE*}}
 */

```

* code_assistant.creator.template.main.c
```
{{*LICENSE*}}

#include <stdio.h>

void main() {
    printf("Hello world!!!");
}
```

* code_assistant.creator.template.main.cpp
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
