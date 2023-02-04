import * as fs from 'fs';
import path = require('path');
import { config } from 'process';
import * as vscode from 'vscode';
import { Configs as configs } from './configs';

export type Token = {
  pattern: RegExp,
  value: string,
};

export class Render {
  headerTemplate: string = configs.instance().headerTemplate();
  sourceTemplate: string = configs.instance().sourceTemplate();

  cMainTemplate: string = configs.instance().cMainTemplate();
  cppMainTemplate: string = configs.instance().cppMainTemplate();

  clazzHeaderFilenameTemplate: string = configs.instance().classHeaderFilenameTemplate();
  clazzSourceFilenameTemplate: string = configs.instance().classSourceFilenameTemplate();
  clazzHeaderTemplate: string = configs.instance().classHeaderTemplate();
  clazzSourceTemplate: string = configs.instance().classSourceTemplate();

  user: string = configs.instance().username();
  licenseTemplate: string = configs.instance().licenseTemplate();

  cmakeProjectC = configs.instance().cCmakeProjectTemplate();
  cmakeProjectCpp = configs.instance().cppCmakeProjectTemplate();
  pyMainTemplate = configs.instance().pyMainTemplate();
  rsMainTemplate = configs.instance().rsMainTemplate();

  upperPattern: RegExp = /{{\*CLASSNAME_UPPER\*}}/gi;
  lowerPattern: RegExp = /{{\*CLASSNAME_LOWER\*}}/gi;
  titlePattern: RegExp = /{{\*CLASSNAME_TITLE\*}}/gi;
  defaultPattern: RegExp = /{{\*CLASSNAME\*}}/gi;

  clazzHeaderFilenamePattern: RegExp = /{{\*CLAZZ_HEADER_FILENAME\*}}/gi;
  clazzSourceFilenamePattern: RegExp = /{{\*CLAZZ_SOURCE_FILENAME\*}}/gi;

  filenameWithExtPattern: RegExp = /{{\*FILENAME_EXT\*}}/gi;
  filenamePattern: RegExp = /{{\*FILENAME\*}}/gi;
  filenameUpperPattern: RegExp = /{{\*FILENAME_UPPER\*}}/gi;
  filenameLowerPattern: RegExp = /{{\*FILENAME_LOWER\*}}/gi;

  userPattern: RegExp = /{{\*USER\*}}/gi;
  licensePattern: RegExp = /{{\*LICENSE\*}}/gi;

  datePattern: RegExp = /{{\*DATE\*}}/gi;

  projectNamePattern: RegExp = /{{\*PROJECT_NAME\*}}/gi;
  projectNameUpperPattern: RegExp = /{{\*PROJECT_NAME_UPPER\*}}/gi;
  projectNameLowerPattern: RegExp = /{{\*PROJECT_NAME_LOWER\*}}/gi;
  projectNameTitlePattern: RegExp = /{{\*PROJECT_NAME_TITLE\*}}/gi;

  today: string = '';

  constructor() {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    this.today = yyyy + '/' + mm + '/' + dd;
  }

  render(replacements: Array<Token>, content: string) {
    replacements.forEach(elem => {
      content = content.replace(elem.pattern, elem.value);
    });
    return content;
  }

  createDir(dirPath: string) {
    // 检查本地类存储的路径是否存在，不存在则创建目录
    if (fs.existsSync(dirPath)) {
      var stats = fs.lstatSync(dirPath);

      if (!stats.isDirectory()) {
        // if the give directory path, isn't a directory, you cant create a class
        return false;
      }

    } else {
      // if the path doesn't exist, just create the directory
      fs.mkdirSync(dirPath);
    }
    return true;
  }

  createFile(filename: string, content: string) {
    fs.writeFile(filename, content, function (err) {
      if (err) {
        console.error(err);
        return false;
      }
    });

    return true;
  }

  createHeaderFile(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    var license: string = this.render(tokens, this.licenseTemplate);
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.headerTemplate));
  }

  createSourceFile(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.sourceTemplate));
  }

  createClass(workspacePath: string, clazzName: string) {
    if (!this.createDir(workspacePath)) {
      return;
    }

    var tokens: Array<Token> = [
      {
        pattern: this.upperPattern,
        value: clazzName.toUpperCase()
      },  // CLASSNAMEUPPER - default classname to upper
      {
        pattern: this.lowerPattern,
        value: clazzName.toLowerCase()
      },  // CLASSNAMELOWER - default classname to lower
      {
        pattern: this.titlePattern,
        value: clazzName.charAt(0).toUpperCase() +
          clazzName.substring(1).toLowerCase()
      },  // CLASSNAMECAPI  - default classname with capitalized first letter
      {
        pattern: this.defaultPattern,
        value: clazzName
      },  // CLASSNAME      - default classname

      { pattern: this.datePattern, value: this.today },

    ];

    var clazzHeaderFilename: Token = {
      pattern: this.clazzHeaderFilenamePattern,
      value: this.render(tokens, this.clazzHeaderFilenameTemplate)
    };

    var clazzSourceFilename: Token = {
      pattern: this.clazzSourceFilenamePattern,
      value: this.render(tokens, this.clazzSourceFilenameTemplate)
    };

    var username: Token = { pattern: this.userPattern, value: this.user };

    // 生成license 模版并写入tokens列表中
    var license: string = this.render(tokens, this.licenseTemplate);
    tokens.push({ pattern: this.licensePattern, value: license });
    tokens.push(clazzHeaderFilename);
    tokens.push(clazzSourceFilename);
    tokens.push(username);

    var headerTokens = tokens;
    var _headerFilename = this.render(tokens, this.clazzHeaderFilenameTemplate);
    var _headerFilenameNotExt = path.parse(_headerFilename).name;
    headerTokens.push(
      { pattern: this.filenamePattern, value: _headerFilenameNotExt }, {
      pattern: this.filenameUpperPattern,
      value: _headerFilenameNotExt.toUpperCase()
    },
      {
        pattern: this.filenameLowerPattern,
        value: _headerFilenameNotExt.toLowerCase()
      },
      {
        pattern: this.filenameWithExtPattern,
        value: path.parse(_headerFilename).base
      });

    var sourceTokens = tokens;
    var _sourceFilename = this.render(tokens, this.clazzSourceFilenameTemplate);
    var _sourceFilenameNotExt = path.parse(_sourceFilename).name;
    sourceTokens.push(
      { pattern: this.filenamePattern, value: _sourceFilenameNotExt }, {
      pattern: this.filenameUpperPattern,
      value: _sourceFilenameNotExt.toUpperCase()
    },
      {
        pattern: this.filenameLowerPattern,
        value: _sourceFilenameNotExt.toLowerCase()
      },
      {
        pattern: this.filenameWithExtPattern,
        value: path.parse(_sourceFilenameNotExt).base
      });

    var hppFilename = path.join(workspacePath, _headerFilename);
    var hpp = this.createFile(
      hppFilename, this.render(headerTokens, this.clazzHeaderTemplate));

    var cppFilename = path.join(workspacePath, _sourceFilename);
    var cpp = this.createFile(
      cppFilename, this.render(sourceTokens, this.clazzSourceTemplate));

    return (hpp && cpp);
  }

  createMainForC(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.cMainTemplate));
  }

  createMainForCpp(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.cppMainTemplate));
  }

  createProjectC(projectPath: string, projectName: string): [boolean, String] {
    var projectNameNotSpace = projectName.trim().replace(' ', '_');
    var tokens: Array<Token> = [
      { pattern: this.projectNamePattern, value: projectNameNotSpace },
      {
        pattern: this.projectNameUpperPattern,
        value: projectNameNotSpace.toUpperCase()
      },
      {
        pattern: this.projectNameLowerPattern,
        value: projectNameNotSpace.toLowerCase()
      },
      {
        pattern: this.projectNameTitlePattern,
        value: projectNameNotSpace.charAt(0).toUpperCase() +
          projectNameNotSpace.substring(1).toLowerCase()
      },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.datePattern, value: this.today },
    ];

    var license: string = this.render(tokens, this.licenseTemplate);
    tokens.push({ pattern: this.licensePattern, value: license });

    // create project director.
    var dir = vscode.Uri.joinPath(vscode.Uri.file(projectPath), projectName);
    this.createDir(dir.fsPath);

    // create project files, CMakeLists.txt main.c/main.cpp
    this.createMainForCpp(dir.fsPath, 'main.c');
    var cmake = vscode.Uri.joinPath(dir, 'CMakeLists.txt');
    this.createFile(cmake.fsPath, this.render(tokens, this.cmakeProjectC));

    return [true, dir.fsPath];
  }

  createProjectCpp(projectPath: string, projectName: string):
    [boolean, String] {
    var projectNameNotSpace = projectName.trim().replace(' ', '_');
    var tokens: Array<Token> = [
      { pattern: this.projectNamePattern, value: projectNameNotSpace },
      {
        pattern: this.projectNameUpperPattern,
        value: projectNameNotSpace.toUpperCase()
      },
      {
        pattern: this.projectNameLowerPattern,
        value: projectNameNotSpace.toLowerCase()
      },
      {
        pattern: this.projectNameTitlePattern,
        value: projectNameNotSpace.charAt(0).toUpperCase() +
          projectNameNotSpace.substring(1).toLowerCase()
      },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.datePattern, value: this.today },
    ];

    var license: string = this.render(tokens, this.licenseTemplate);
    tokens.push({ pattern: this.licensePattern, value: license });

    // create project director.
    var dir = vscode.Uri.joinPath(vscode.Uri.file(projectPath), projectName);
    this.createDir(dir.fsPath);

    // create project files, CMakeLists.txt main.c/main.cpp
    this.createMainForCpp(dir.fsPath, 'main.cpp');
    var cmake = vscode.Uri.joinPath(dir, 'CMakeLists.txt');
    this.createFile(cmake.fsPath, this.render(tokens, this.cmakeProjectCpp));

    return [true, dir.fsPath];
  }

  createPythonFile(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.pyMainTemplate));
  }

  createRustFile(workspacePath: string, filename: string) {
    if (!this.createDir(workspacePath)) {
      return false;
    }

    var _filenameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      { pattern: this.datePattern, value: this.today },
      { pattern: this.userPattern, value: this.user },
      { pattern: this.filenamePattern, value: _filenameNotExt }, {
        pattern: this.filenameUpperPattern,
        value: _filenameNotExt.toUpperCase()
      },
      { pattern: this.filenameLowerPattern, value: _filenameNotExt.toLowerCase() }
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.rsMainTemplate));
  }
}

export class CodeRender {
  user: string = configs.instance().username();
  licenseTemplate: string = configs.instance().licenseTemplate();

  public static upperPattern: RegExp = /{{\*CLASSNAME_UPPER\*}}/gi;
  public static lowerPattern: RegExp = /{{\*CLASSNAME_LOWER\*}}/gi;
  public static titlePattern: RegExp = /{{\*CLASSNAME_TITLE\*}}/gi;
  public static defaultPattern: RegExp = /{{\*CLASSNAME\*}}/gi;

  public static clazzHeaderFilenamePattern: RegExp = /{{\*CLAZZ_HEADER_FILENAME\*}}/gi;
  public static clazzSourceFilenamePattern: RegExp = /{{\*CLAZZ_SOURCE_FILENAME\*}}/gi;

  public static filenameWithExtPattern: RegExp = /{{\*FILENAME_EXT\*}}/gi;
  public static filenamePattern: RegExp = /{{\*FILENAME\*}}/gi;
  public static filenameUpperPattern: RegExp = /{{\*FILENAME_UPPER\*}}/gi;
  public static filenameLowerPattern: RegExp = /{{\*FILENAME_LOWER\*}}/gi;

  public static userPattern: RegExp = /{{\*USER\*}}/gi;
  public static licensePattern: RegExp = /{{\*LICENSE\*}}/gi;

  public static datePattern: RegExp = /{{\*DATE\*}}/gi;

  public static projectNamePattern: RegExp = /{{\*PROJECT_NAME\*}}/gi;
  public static projectNameUpperPattern: RegExp = /{{\*PROJECT_NAME_UPPER\*}}/gi;
  public static projectNameLowerPattern: RegExp = /{{\*PROJECT_NAME_LOWER\*}}/gi;
  public static projectNameTitlePattern: RegExp = /{{\*PROJECT_NAME_TITLE\*}}/gi;

  today: string = '';

  tokens: Array<Token> = [];
  template: string = '';
  constructor(username: string, license: string, template: string) {
    this.user = username;
    this.licenseTemplate = license;
    this.template = template;

    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    this.today = yyyy + '/' + mm + '/' + dd;

    this.tokens = [
      { pattern: CodeRender.datePattern, value: this.today },
      { pattern: CodeRender.userPattern, value: this.user },
    ];

    // 生成license 模版并写入tokens列表中
    this.tokens.push({
      pattern: CodeRender.licensePattern,
      value: this._render(this.tokens, this.licenseTemplate)
    });;
  }

  _createDir(dirPath: string) {
    // 检查本地类存储的路径是否存在，不存在则创建目录
    if (fs.existsSync(dirPath)) {
      var stats = fs.lstatSync(dirPath);

      if (!stats.isDirectory()) {
        // if the give directory path, isn't a directory, you cant create a class
        return false;
      }

    } else {
      // if the path doesn't exist, just create the directory
      fs.mkdirSync(dirPath);
    }
    return true;
  }

  _createFile(filename: string, content: string) {
    fs.writeFile(filename, content, function (err) {
      if (err) {
        console.error(err);
        return false;
      }
    });

    return true;
  }

  _render(replacements: Array<Token>, executeOn: string) {
    replacements.forEach(elem => {
      executeOn = executeOn.replace(elem.pattern, elem.value);
    });
    return executeOn;
  }

  render(workspacePath: string = "", project: string = "", target: string = "", padding: Array<Token> = []): string {
    if (workspacePath.length > 0 && !this._createDir(workspacePath)) {
      return "";
    }

    if (project.length > 0) {
      this.tokens.push(
        {
          pattern: CodeRender.projectNamePattern,
          value: project.trim().replace(' ', '_')
        },
        {
          pattern: CodeRender.projectNameUpperPattern,
          value: project.toUpperCase()
        },
        {
          pattern: CodeRender.projectNameLowerPattern,
          value: project.toLowerCase()
        },
        {
          pattern: CodeRender.projectNameTitlePattern,
          value: project.charAt(0).toUpperCase() + project.substring(1).toLowerCase()
        });
    }

    if (target.length > 0) {
      this.tokens.push(
        {
          pattern: CodeRender.filenamePattern,
          value: target
        },
        {
          pattern: CodeRender.filenameUpperPattern,
          value: target.toUpperCase()
        },
        {
          pattern: CodeRender.filenameLowerPattern,
          value: target.toLowerCase()
        },
        {
          pattern: CodeRender.filenameWithExtPattern,
          value: path.parse(target).base
        },
      );
    }

    var tokens = [...this.tokens, ...padding];
    return this._render(tokens, this.template);
  }
}
