import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Configs as configs } from './configs';
import { ClazzHelper as clazz_helper } from './helper/clazz';
import { VscodeHelper as vscode_helper } from './helper/vscode';
import * as render from './render';
import { CodeRender } from './render';

function log(message: string) {
  vscode.window.showInformationMessage(message);
}

async function readInput(args: any): Promise<[string, string]> {
  var dirname = vscode_helper.dirPath(args);
  if (!dirname) {
    dirname = '';
  }

  var filename = await vscode_helper.inputFilePath();

  return [dirname, filename as string];
}

export namespace v1 {
  export abstract class Commands {
    public static helloWorld(args: any) {
      var path = vscode.extensions.getExtension('code_assistant.creator')?.extensionPath as
        unknown as string;
      if (path) {
        log('hello world, extension c & cpp file creator path: ' + path);
      } else {
        log('hello world, extension c & cpp file creator path: ' + 'unknown');
      }
    }

    public static async createHeaderFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename || !filename.length) {
        log('can\'t create header file from c & cpp file creator, filename invalid.');
        return;
      }
      if (!filename.endsWith('.h') && !filename.endsWith('hpp')) {
        filename += '.h';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createHeaderFile(dirname, filename)) {
        log('can\'t create header file from c & cpp file creator');
      } else {
        log('create header file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createSourceFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.c') && !filename.endsWith('.cpp') && !filename.endsWith('.cc')) {
        filename += '.cpp';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createSourceFile(dirname, filename)) {
        log('can\'t create source file from c & cpp file creator');
      } else {
        log('create source file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createClass(args: any) {
      var [dirname, classname] = await readInput(args);
      if (!classname) {
        log('can\'t create class from c & cpp file creator, class name is empty.');
        return;
      }

      // 类名有效性检车
      if (!clazz_helper.isValid(classname)) {
        log('can\'t create class ' + classname + ' from c & cpp file creator, class name is invalid.');
        return;
      }

      // 创建类
      var clazzRender = new render.Render();
      if (!clazzRender.createClass(dirname, classname)) {
        log('can\'t create class from c & cpp file creator');
      } else {
        log('create class ' + classname + ' from c & cpp file creator, path: ' + dirname);
      }
    }

    public static async createMainForC(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.c')) {
        filename += '.c';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createMainForC(dirname, filename)) {
        log('can\'t create source file from c & cpp file creator');
      } else {
        log('create source file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createMainForCpp(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.cpp') && !filename.endsWith('.cc')) {
        filename += '.cpp';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createMainForCpp(dirname, filename)) {
        log('can\'t create source file from c & cpp file creator');
      } else {
        log('create source file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createProjectC(args: any) {
      var projectDefaultPath = configs.instance().projectDefaultPath();
      let uri = vscode.Uri.file(projectDefaultPath);

      const options: vscode.OpenDialogOptions = {
        canSelectFolders: true,
        openLabel: 'Select',
        canSelectMany: false,
        defaultUri: uri
      };
      var projectPaths = await vscode.window.showOpenDialog(options);

      if (projectPaths) {
        uri = projectPaths[0];
      } else {
        log('project will be create in ' + projectDefaultPath);
      }

      let projectName = await vscode_helper.inputProjectName();

      if (!projectName) {
        log('can\'t create c project, project name is empty.');
        return;
      }

      var fileRender = new render.Render();
      const [r, p] = fileRender.createProjectC(uri.path, projectName);
      if (!r) {
        log('can\'t cpp project ' + projectName);
      } else {
        log('create c project in director ' + uri.path + ', project name: ' + projectName);
      }

      if (vscode.workspace.workspaceFolders !== undefined) {
        // open dir: ${p}
        var root = vscode.workspace.workspaceFolders[0].uri.path;
        if (!p.startsWith(root)) {
          // open new windows
          log('open new windows ' + p);
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
        }
      } else {
        // open new windows
        log('open new windows ' + p);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
      }
    }

    public static async createProjectCpp(args: any) {
      var projectDefaultPath = configs.instance().projectDefaultPath();
      let uri = vscode.Uri.file(projectDefaultPath);

      const options: vscode.OpenDialogOptions = {
        canSelectFolders: true,
        openLabel: 'Select',
        canSelectMany: false,
        defaultUri: uri
      };
      var projectPaths = await vscode.window.showOpenDialog(options);

      if (projectPaths) {
        uri = projectPaths[0];
      } else {
        log('project will be create in ' + projectDefaultPath);
      }
      let projectName = await vscode_helper.inputProjectName();

      if (!projectName) {
        log('can\'t create cpp project, project name is empty.');
        return;
      }

      var fileRender = new render.Render();
      const [r, p] = fileRender.createProjectCpp(uri.path, projectName);
      if (!r) {
        log('can\'t cpp project ' + projectName);
      } else {
        log('create cpp project in director ' + uri.path + ', project name: ' + projectName);
      }

      // check workspaces has opened fold? if no, open a new one.

      if (vscode.workspace.workspaceFolders !== undefined) {
        // open dir: ${p}
        var root = vscode.workspace.workspaceFolders[0].uri.path;
        if (!p.startsWith(root)) {
          // open new windows
          log('open new windows ' + p);
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
        }
      } else {
        // open new windows
        log('open new windows ' + p);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
      }
    }

    public static async createPythonFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.py')) {
        filename += '.py';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createPythonFile(dirname, filename)) {
        log('can\'t create python file from c & cpp file creator');
        return;
      } else {
        log('create python file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createRustFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.rs')) {
        filename += '.rs';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createRustFile(dirname, filename)) {
        log('can\'t create rust file from c & cpp file creator');
      } else {
        log('create rust file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createShellFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.sh')) {
        filename += '.sh';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createRustFile(dirname, filename)) {
        log('can\'t create shell file from c & cpp file creator');
      } else {
        log('create shell file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createGoFile(args: any) {
      var [dirname, filename] = await readInput(args);
      if (!filename) {
        log('can\'t create source file from c & cpp file creator, filename is empty.');
        return;
      }
      if (!filename.endsWith('.go')) {
        filename += '.go';
      }

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createRustFile(dirname, filename)) {
        log('can\'t create go file from c & cpp file creator');
      } else {
        log('create go file ' + filename + ' from c & cpp file creator');
      }
    }

    public static async createCMakeFile(args: any) {
      var dirname = vscode_helper.dirPath(args);
      var filename = "CMakeLists.txt";

      // 创建文件模版
      var fileRender = new render.Render();
      if (!fileRender.createRustFile(dirname, filename)) {
        log('can\'t create go file from c & cpp file creator');
      } else {
        log('create go file ' + filename + ' from c & cpp file creator');
      }
    }
  }
}

export namespace v2 {
  export abstract class Commands {
    public static helloWorld(args: any) {
      var path = vscode.extensions.getExtension('code_assistant.creator')?.extensionPath as
        unknown as string;
      if (path) {
        log('hello world, extension c & cpp file creator path: ' + path);
      } else {
        log('hello world, extension c & cpp file creator path: ' + 'unknown');
      }
    }

    public static async createHeaderFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename || !filename.length) {
        log('create header file failed, filename invalid.');
        return;
      }
      if (!filename.endsWith('.h') && !filename.endsWith('hpp')) {
        filename += '.h';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().headerTemplate()
      );
      var _headerFilename = _render.render();
      var _headerFilenameNotExt = path.parse(filename).name;
      var tokens: Array<render.Token> = [
        {
          pattern: render.CodeRender.filenamePattern,
          value: _headerFilenameNotExt
        },
        {
          pattern: render.CodeRender.filenameUpperPattern,
          value: _headerFilenameNotExt.toUpperCase()
        },
        {
          pattern: render.CodeRender.filenameLowerPattern,
          value: _headerFilenameNotExt.toLowerCase()
        },
        {
          pattern: render.CodeRender.filenameWithExtPattern,
          value: path.parse(_headerFilename).base
        },
      ];
      fs.writeFile(filepath, _render.render(dirname, "", filename, tokens), function (err) {
        if (err) {
          log('create header file failed, what: ' + err);
        } else {
          log('create header file ' + filename + ' success');
        }
      });
    }

    public static async createSourceFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create source file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.c') && !filename.endsWith('.cpp') && !filename.endsWith('.cc')) {
        filename += '.cpp';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().sourceTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create source file failed, what: ' + err);
        } else {
          log('create source file ' + filename + ' success');
        }
      });
    }

    public static generateClassToken(classname: string): Array<render.Token> {

      var h = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classHeaderFilenameTemplate()
      );

      var cpp = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classSourceFilenameTemplate()
      );

      var tokens: Array<render.Token> = [
        {
          pattern: render.CodeRender.upperPattern,
          value: classname.toUpperCase()
        },  // CLASSNAMEUPPER - default classname to upper
        {
          pattern: render.CodeRender.lowerPattern,
          value: classname.toLowerCase()
        },  // CLASSNAMELOWER - default classname to lower
        {
          pattern: render.CodeRender.titlePattern,
          value: classname.charAt(0).toUpperCase() + classname.substring(1).toLowerCase()
        },  // CLASSNAMECAPI  - default classname with capitalized first letter
        {
          pattern: render.CodeRender.defaultPattern,
          value: classname
        },  // CLASSNAME      - default classname
      ];

      var _headerFilename = h.render("", "", "", tokens);
      var _headerFilenameNotExt = path.parse(_headerFilename).name;
      var _sourceFilename = cpp.render("", "", "", tokens);
      var _sourceFilenameNotExt = path.parse(_sourceFilename).name;

      tokens.push(
        {
          pattern: render.CodeRender.clazzHeaderFilenamePattern,
          value: h.render("", "", "", tokens)
        },
        {
          pattern: render.CodeRender.clazzSourceFilenamePattern,
          value: cpp.render("", "", "", tokens)
        },
        {
          pattern: render.CodeRender.filenamePattern,
          value: _headerFilenameNotExt
        },
        {
          pattern: render.CodeRender.filenameUpperPattern,
          value: _headerFilenameNotExt.toUpperCase()
        },
        {
          pattern: render.CodeRender.filenameLowerPattern,
          value: _headerFilenameNotExt.toLowerCase()
        },
        {
          pattern: render.CodeRender.filenameWithExtPattern,
          value: path.parse(_headerFilename).base
        },
        {
          pattern: render.CodeRender.filenamePattern,
          value: _sourceFilenameNotExt
        },
        {
          pattern: render.CodeRender.filenameUpperPattern,
          value: _sourceFilenameNotExt.toUpperCase()
        },
        {
          pattern: render.CodeRender.filenameLowerPattern,
          value: _sourceFilenameNotExt.toLowerCase()
        },
        {
          pattern: render.CodeRender.filenameWithExtPattern,
          value: path.parse(_sourceFilenameNotExt).base
        }
      );

      return tokens;
    }

    public static async createClass(args: any) {
      var [dirname, classname] = await readInput(args);
      classname = classname.trim();
      if (!classname) {
        log('create c++ class failed, class name is empty.');
        return;
      }

      // 类名有效性检车
      if (!clazz_helper.isValid(classname)) {
        log('create c++ class ' + classname + ' failed, class name is invalid.');
        return;
      }

      var tokens = this.generateClassToken(classname);

      // 创建类
      var clazzHeaderRender = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classHeaderTemplate(),
      );

      var classHeaderFilenameRender = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classHeaderFilenameTemplate(),
      );
      var classSourceFilenameRender = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classSourceFilenameTemplate(),
      );

      let headerFilename = path.join(dirname, classHeaderFilenameRender.render("", "", classname, tokens));
      let sourceFilename = path.join(dirname, classSourceFilenameRender.render("", "", classname, tokens));

      var clazzSourceRender = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().classSourceTemplate(),
      );

      var result = true;
      fs.writeFile(headerFilename, clazzHeaderRender.render(dirname, "", classname, tokens), function (err) {
        if (!err) {
          log('create class header file' + classname + ' failed, what: ' + err);
          result = false;
        }
      });

      fs.writeFile(sourceFilename, clazzSourceRender.render(dirname, "", classname, tokens), function (err) {
        if (!err) {
          log('create class source file' + classname + ' failed, what: ' + err);
          result = false;
        }
      });

      if (result) {
        log('create class ' + classname + ' success, class in dir: ' + dirname);
      }
    }

    public static async createMainForC(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create c main file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.c')) {
        filename += '.c';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cMainTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create c main file failed, what: ' + err);
        } else {
          log('create c main file ' + filename + ' success');
        }
      });
    }

    public static async createMainForCpp(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create c++ main file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.cpp') && !filename.endsWith('.cc')) {
        filename += '.cpp';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cppMainTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create c++ main file failed, what: ' + err);
        } else {
          log('create c++ main file ' + filename + ' success.');
        }
      });
    }

    public static async createProject(args: any) {
      var projectDefaultPath = configs.instance().projectDefaultPath();
      let uri = vscode.Uri.file(projectDefaultPath);

      var projectPaths;
      if (vscode.workspace.workspaceFolders === undefined) {
        const options: vscode.OpenDialogOptions = {
          canSelectFolders: true,
          openLabel: 'Select',
          canSelectMany: false,
          defaultUri: uri
        };
        projectPaths = await vscode.window.showOpenDialog(options);
        if (projectPaths) {
          uri = projectPaths[0];
        } else {
          log('project will be create in ' + projectDefaultPath);
        }
      } else {
        uri = vscode.workspace.workspaceFolders[0].uri;
      }

      let projectName = (await vscode_helper.inputProjectName() as unknown as string).trim();

      if (!projectName) {
        log('create cpp project failed, project name is empty.');
        return [null, null];
      }

      return [uri, projectName];
    }

    public static async openNewWorkspace(p: String) {
      // check workspaces has opened fold? if no, open a new one.
      if (vscode.workspace.workspaceFolders !== undefined) {
        // open dir: ${p}
        var root = vscode.workspace.workspaceFolders[0].uri.path;
        if (!p.startsWith(root)) {
          // open new windows
          log('open new windows ' + p);
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
        }
      } else {
        // open new windows
        log('open new windows ' + p);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p.toString()));
      }
    }

    public static async mkdir(path: string) {

      // 检查本地类存储的路径是否存在，不存在则创建目录
      if (fs.existsSync(path)) {
        var stats = fs.lstatSync(path);

        if (!stats.isDirectory()) {
          // if the give directory path, isn't a directory, you cant create a class
          return false;
        }

      } else {
        // if the path doesn't exist, just create the directory
        fs.mkdirSync(path);
      }
      return true;
    }

    public static async createProjectC(args: any) {
      var [_uri, _projectName] = await this.createProject(args);
      if (!_uri) {
        return;
      }

      let uri = _uri as unknown as vscode.Uri;
      let projectName = (_projectName as unknown as string).trim();
      let projectPath = path.join(uri.path, projectName);

      // create director
      this.mkdir(projectPath);

      // render cmakefile for c
      var cmakefile = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cCmakeProjectTemplate()
      );

      // create director
      this.mkdir(projectPath);

      fs.writeFile(path.join(projectPath, "CMakeLists.txt"), cmakefile.render("", projectName), function (err) {
        if (err) {
          log('create cmake file failed, what: ' + err);
        } else {
          log('create cmake file success.');
        }
      });

      // render main.c
      var c = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cMainTemplate()
      );
      fs.writeFile(path.join(projectPath, "main.c"), c.render("", projectName), function (err) {
        if (err) {
          log('create c main file failed, what: ' + err);
        } else {
          log('create c main file success.');
        }
      });

      await this.openNewWorkspace(projectPath);
    }

    public static async createProjectCpp(args: any) {
      var [_uri, _projectName] = await this.createProject(args);
      if (!_uri) {
        return;
      }

      let uri = _uri as unknown as vscode.Uri;
      let projectName = (_projectName as unknown as string).trim();
      let projectPath = path.join(uri.path, projectName.trim());

      // create director
      this.mkdir(projectPath);

      // render cmakefile for cpp
      var cmakefile = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cppCmakeProjectTemplate()
      );

      fs.writeFile(path.join(projectPath, "CMakeLists.txt"), cmakefile.render("", projectName), function (err) {
        if (err) {
          log('create cmake file failed, what: ' + err);
        } else {
          log('create cmake file success.');
        }
      });

      // render main.cpp
      var cpp = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cppMainTemplate()
      );
      fs.writeFile(path.join(projectPath, "main.cpp"), cpp.render(), function (err) {
        if (err) {
          log('create c++ main file failed, what: ' + err);
        } else {
          log('create c++ main file success.');
        }
      });

      await this.openNewWorkspace(projectPath);
    }

    public static async createProjectRust(args: any) {
      // TODO: cargo new <project name>
    }

    public static async createPythonFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create python file failed, filename is empty.');
        return;
      }

      if (!filename.endsWith('.py')) {
        filename += '.py';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().pyMainTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create python file failed, what: ' + err);
        } else {
          log('create python file ' + filename + ' success.');
        }
      });
    }

    public static async createRustFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create rust file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.rs')) {
        filename += '.rs';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().rsMainTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create rust file failed, what: ' + err);
        } else {
          log('create rust file ' + filename + ' success');
        }
      });
    }

    public static async createShellFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create shell file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.sh')) {
        filename += '.sh';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().shellTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create shell file failed, what: ' + err);
        } else {
          log('create shell file ' + filename + ' success');
        }
      });
    }

    public static async createGoFile(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create go file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.go')) {
        filename += '.go';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().goTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create go file failed, what: ' + err);
        } else {
          log('create go file ' + filename + ' success.');
        }
      });
    }

    public static async createCMakeFile(args: any) {
      var dirname = vscode_helper.dirPath(args);
      var projectName = path.parse(dirname).name;
      var filename = "CMakeLists.txt";

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().cppCmakeProjectTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, projectName, filename), function (err) {
        if (err) {
          log('create CMakeList.txt failed, what: ' + err);
        } else {
          log('create CMakeList.txt in path ' + projectName);
        }
      });
    }

    public static async createRustMod(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create rust mod failed, filename is empty.');
        return;
      }

      let modName = path.join(dirname, filename);
      this.mkdir(modName);
      var filepath = path.join(modName, "mod.rs");

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().rsMainTemplate()
      );

      fs.writeFile(filepath, _render.render(modName, "", filename), function (err) {
        if (err) {
          log('create rust mod failed, what: ' + err);
        } else {
          log('create rust mod ' + filename + ' success.');
        }
      });
    }

    public static async createPlantUML(args: any) {
      var [dirname, filename] = await readInput(args);
      filename = filename.trim();
      if (!filename) {
        log('create plant uml file failed, filename is empty.');
        return;
      }
      if (!filename.endsWith('.puml')) {
        filename += '.puml';
      }

      var filepath = path.join(dirname, filename);

      // 创建文件模版
      var _render = new CodeRender(
        configs.instance().username(),
        configs.instance().licenseTemplate(),
        configs.instance().plantumlTemplate()
      );

      fs.writeFile(filepath, _render.render(dirname, "", filename), function (err) {
        if (err) {
          log('create plant uml file failed, what: ' + err);
        } else {
          log('create plant uml file ' + filename + ' success');
        }
      });
    }
  }
}
