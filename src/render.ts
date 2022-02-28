import * as fs from 'fs';
import path = require('path');
import {Configs as configs} from './configs';

type Token = {
  pattern: RegExp,
  value: string,
};

export class Render {
  headerTemplate: string = configs.headerTemplate();
  sourceTemplate: string = configs.sourceTemplate();

  cMainTemplate: string = configs.cMainTemplate();
  cppMainTemplate: string = configs.cppMainTemplate();

  clazzHeaderFilenameTemplate: string = configs.classHeaderFilenameTemplate();
  clazzSourceFilenameTemplate: string = configs.classSourceFilenameTemplate();
  clazzHeaderTemplate: string = configs.classHeaderTemplate();
  clazzSourceTemplate: string = configs.classSourceTemplate();

  user: string = configs.username();
  licenseTemplate: string = configs.licenseTemplate();

  upperPattern: RegExp = /{{\*CLASSNAME_UPPER\*}}/gi;
  lowerPattern: RegExp = /{{\*CLASSNAME_LOWER\*}}/gi;
  titlePattern: RegExp = /{{\*CLASSNAME_TIELE\*}}/gi;
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
  today: string = '';

  constructor() {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    this.today = yyyy + '/' + mm + '/' + dd;
  }

  generateClazz(clazzName: string) {}

  render(replacements: Array<Token>, executeOn: string) {
    replacements.forEach(elem => {
      executeOn = executeOn.replace(elem.pattern, elem.value);
    });
    return executeOn;
  }

  createDir(dirPath: string) {
    // 检查本地类存储的路径是否存在，不存在则创建目录
    if (fs.existsSync(dirPath)) {
      var stats = fs.lstatSync(dirPath);

      if (!stats.isDirectory()) {
        // if the give directory path, isnt a directory, you cant create a class
        return false;
      }

    } else {
      // if the path doesnt exist, just create the directory
      fs.mkdirSync(dirPath);
    }
    return true;
  }

  createFile(filename: string, content: string) {
    fs.writeFile(filename, content, function(err) {
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

    var _filanameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      {pattern: this.datePattern, value: this.today},
      {pattern: this.userPattern, value: this.user},
      {pattern: this.filenamePattern, value: _filanameNotExt}, {
        pattern: this.filenameUpperPattern,
        value: _filanameNotExt.toUpperCase()
      },
      {pattern: this.filenameLowerPattern, value: _filanameNotExt.toLowerCase()}
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

    var _filanameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      {pattern: this.datePattern, value: this.today},
      {pattern: this.userPattern, value: this.user},
      {pattern: this.filenamePattern, value: _filanameNotExt}, {
        pattern: this.filenameUpperPattern,
        value: _filanameNotExt.toUpperCase()
      },
      {pattern: this.filenameLowerPattern, value: _filanameNotExt.toLowerCase()}
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

      {pattern: this.datePattern, value: this.today},

    ];

    var clazzHeaderFilename: Token = {
      pattern: this.clazzHeaderFilenamePattern,
      value: this.render(tokens, this.clazzHeaderFilenameTemplate)
    };

    var clazzSourceFilaname: Token = {
      pattern: this.clazzSourceFilenamePattern,
      value: this.render(tokens, this.clazzSourceFilenameTemplate)
    };

    var username: Token = {pattern: this.userPattern, value: this.user};

    // 生成license 模版并写入tokens列表中
    var license: string = this.render(tokens, this.licenseTemplate);
    tokens.push({pattern: this.licensePattern, value: license});
    tokens.push(clazzHeaderFilename);
    tokens.push(clazzSourceFilaname);
    tokens.push(username);

    var headerTokens = tokens;
    var _headerFilename = this.render(tokens, this.clazzHeaderFilenameTemplate);
    var _headerFilanameNotExt = path.parse(_headerFilename).name;
    headerTokens.push(
        {pattern: this.filenamePattern, value: _headerFilanameNotExt}, {
          pattern: this.filenameUpperPattern,
          value: _headerFilanameNotExt.toUpperCase()
        },
        {
          pattern: this.filenameLowerPattern,
          value: _headerFilanameNotExt.toLowerCase()
        },
        {
          pattern: this.filenameWithExtPattern,
          value: path.parse(_headerFilename).base
        });

    var sourceTokens = tokens;
    var _sourceFilename = this.render(tokens, this.clazzSourceFilenameTemplate);
    var _sourceFilanameNotExt = path.parse(_sourceFilename).name;
    sourceTokens.push(
        {pattern: this.filenamePattern, value: _sourceFilanameNotExt}, {
          pattern: this.filenameUpperPattern,
          value: _sourceFilanameNotExt.toUpperCase()
        },
        {
          pattern: this.filenameLowerPattern,
          value: _sourceFilanameNotExt.toLowerCase()
        },
        {
          pattern: this.filenameWithExtPattern,
          value: path.parse(_sourceFilanameNotExt).base
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

    var _filanameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      {pattern: this.datePattern, value: this.today},
      {pattern: this.userPattern, value: this.user},
      {pattern: this.filenamePattern, value: _filanameNotExt}, {
        pattern: this.filenameUpperPattern,
        value: _filanameNotExt.toUpperCase()
      },
      {pattern: this.filenameLowerPattern, value: _filanameNotExt.toLowerCase()}
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

    var _filanameNotExt = path.parse(filename).name;
    var tokens: Array<Token> = [
      {pattern: this.datePattern, value: this.today},
      {pattern: this.userPattern, value: this.user},
      {pattern: this.filenamePattern, value: _filanameNotExt}, {
        pattern: this.filenameUpperPattern,
        value: _filanameNotExt.toUpperCase()
      },
      {pattern: this.filenameLowerPattern, value: _filanameNotExt.toLowerCase()}
    ];

    // 生成license 模版并写入tokens列表中
    tokens.push({
      pattern: this.licensePattern,
      value: this.render(tokens, this.licenseTemplate)
    });

    var filepath = path.join(workspacePath, filename);
    return this.createFile(filepath, this.render(tokens, this.cppMainTemplate));
  }
}