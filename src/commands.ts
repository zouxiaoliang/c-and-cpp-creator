import * as path from 'path';
import * as vscode from 'vscode';

import {Configs as configs} from './configs';
import {ClazzHelper as clazz_helper} from './helper/clazz';
import {VscodeHelper as vscode_helper} from './helper/vscode';
import * as render from './render';

export abstract class Commands {
  public static helloWorld(args: any) {
    // The code you place here will be executed every time your command is
    // executed Display a message box to the user
    vscode.window.showInformationMessage(
        'Hello World from c & cpp file creator!!!');
    var path = vscode.extensions.getExtension('c_cpp.creator')?.extensionPath as
        unknown as string;
    if (path) {
      vscode.window.showInformationMessage(
          'extension c & cpp file creator path: ' + path);
    } else {
      vscode.window.showInformationMessage(
          'extension c & cpp file creator path: ' +
          'unkonwn');
    }

    configs.licenseTemplate();
  }

  public static async createHeaderFile(args: any) {
    // vscode.window.showInformationMessage("create header file from c & cpp
    // file creator"); 要求用户输入文件名，并根据类模版生成类
    var dirPath = vscode_helper.dirPath(args);
    if (!dirPath) {
      dirPath = '';
    }

    var filename = await vscode_helper.inputFilePath();
    if (!filename || !filename.length) {
      vscode.window.showInformationMessage(
          'can\'t create header file from c & cpp file creator, filename invalid.');
      return;
    }
    if (!filename.endsWith('.h') && !filename.endsWith('hpp')) {
      filename += '.h';
    }

    // 创建文件模版
    var fileRender = new render.Render();
    if (!fileRender.createHeaderFile(dirPath, filename)) {
      vscode.window.showInformationMessage(
          'can\'t create header file from c & cpp file creator');
    }

    vscode.window.showInformationMessage(
        'create header file ' + filename + ' from c & cpp file creator');
  }

  public static async createSourceFile(args: any) {
    // vscode.window.showInformationMessage("create source file from c & cpp
    // file creator"); 要求用户输入文件，并根据类模版生成类
    var dirPath = vscode_helper.dirPath(args);
    if (!dirPath) {
      dirPath = '';
    }

    var filename = await vscode_helper.inputFilePath();
    if (!filename) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator, filename is empty.');
      return;
    }
    if (!filename.endsWith('.c') && !filename.endsWith('.cpp') &&
        !filename.endsWith('.cc')) {
      filename += '.cpp';
    }

    // 创建文件模版
    var fileRender = new render.Render();
    if (!fileRender.createSourceFile(dirPath, filename)) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator');
    }

    vscode.window.showInformationMessage(
        'create source file ' + filename + ' from c & cpp file creator');
  }

  public static async createClass(args: any) {
    // vscode.window.showInformationMessage("create class from c & cpp file
    // creator"); 要求用户输入类名，并根据类模版生成类
    var dirPath = vscode_helper.dirPath(args);
    if (!dirPath) {
      dirPath = '';
    }

    var className = await vscode_helper.inputClassName();
    if (!className) {
      vscode.window.showInformationMessage(
          'can\'t create class from c & cpp file creator, class name is empty.');
      return;
    }

    // 类名有效性检车
    if (!clazz_helper.isValid(className)) {
      vscode.window.showInformationMessage(
          'can\'t create class ' + className +
          ' from c & cpp file creator, class name is invalid.');
      return;
    }

    // 创建类
    var clazzRender = new render.Render();
    if (!clazzRender.createClass(dirPath, className)) {
      vscode.window.showInformationMessage(
          'can\'t create class from c & cpp file creator');
    }

    vscode.window.showInformationMessage(
        'create class ' + className +
        ' from c & cpp file creator, path: ' + dirPath);
  }

  public static async createMainForC(args: any) {
    // vscode.window.showInformationMessage("create source file from c & cpp
    // file creator"); 要求用户输入文件，并根据类模版生成类
    var dirPath = vscode_helper.dirPath(args);
    if (!dirPath) {
      dirPath = '';
    }

    var filename = await vscode_helper.inputFilePath();
    if (!filename) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator, filename is empty.');
      return;
    }
    if (!filename.endsWith('.c')) {
      filename += '.c';
    }

    // 创建文件模版
    var fileRender = new render.Render();
    if (!fileRender.createMainForC(dirPath, filename)) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator');
    }

    vscode.window.showInformationMessage(
        'create source file ' + filename + ' from c & cpp file creator');
  }

  public static async createMainForCpp(args: any) {
    // vscode.window.showInformationMessage("create source file from c & cpp
    // file creator"); 要求用户输入文件，并根据类模版生成类
    var dirPath = vscode_helper.dirPath(args);
    if (!dirPath) {
      dirPath = '';
    }

    var filename = await vscode_helper.inputFilePath();
    if (!filename) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator, filename is empty.');
      return;
    }
    if (!filename.endsWith('.cpp') && !filename.endsWith('.cc')) {
      filename += '.cpp';
    }

    // 创建文件模版
    var fileRender = new render.Render();
    if (!fileRender.createMainForCpp(dirPath, filename)) {
      vscode.window.showInformationMessage(
          'can\'t create source file from c & cpp file creator');
    }

    vscode.window.showInformationMessage(
        'create source file ' + filename + ' from c & cpp file creator');
  }

  public static async createProjectC(args: any) {
    var projectDefaultPath = configs.projectDefaultPath();
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
      vscode.window.showInformationMessage(
          'project will be create in ' + projectDefaultPath);
    }

    let projectName = await vscode_helper.inputProjectName();

    if (!projectName) {
      vscode.window.showInformationMessage(
          'can\'t create c project, project name is empty.');
      return;
    }

    var fileRender = new render.Render();
    const [r, p] = fileRender.createProjectC(uri.path, projectName);
    if (!r) {
      vscode.window.showInformationMessage('can\'t cpp project ' + projectName);
      return;
    }
    vscode.window.showInformationMessage(
        'create c project in director ' + uri.path +
        ', project name: ' + projectName);

    if (vscode.workspace.workspaceFolders !== undefined) {
      // open dir: ${p}
      var root = vscode.workspace.workspaceFolders[0].uri.path;
      if (!p.startsWith(root)) {
        // open new windows
        vscode.window.showInformationMessage('open new windows ' + p);
        await vscode.commands.executeCommand(
            'vscode.openFolder', vscode.Uri.file(p.toString()));
      }
    } else {
      // open new windows
      vscode.window.showInformationMessage('open new windows ' + p);
      await vscode.commands.executeCommand(
          'vscode.openFolder', vscode.Uri.file(p.toString()));
    }
  }

  public static async createProjectCpp(args: any) {
    var projectDefaultPath = configs.projectDefaultPath();
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
      vscode.window.showInformationMessage(
          'project will be create in ' + projectDefaultPath);
    }
    let projectName = await vscode_helper.inputProjectName();

    if (!projectName) {
      vscode.window.showInformationMessage(
          'can\'t create cpp project, project name is empty.');
      return;
    }

    var fileRender = new render.Render();
    const [r, p] = fileRender.createProjectCpp(uri.path, projectName);
    if (!r) {
      vscode.window.showInformationMessage('can\'t cpp project ' + projectName);
      return;
    }

    vscode.window.showInformationMessage(
        'create cpp project in director ' + uri.path +
        ', project name: ' + projectName);

    // check workspaces has opened foled? if no, open a new one.

    if (vscode.workspace.workspaceFolders !== undefined) {
      // open dir: ${p}
      var root = vscode.workspace.workspaceFolders[0].uri.path;
      if (!p.startsWith(root)) {
        // open new windows
        vscode.window.showInformationMessage('open new windows ' + p);
        await vscode.commands.executeCommand(
            'vscode.openFolder', vscode.Uri.file(p.toString()));
      }
    } else {
      // open new windows
      await vscode.window.showInformationMessage('open new windows ' + p);
    }
  }
}