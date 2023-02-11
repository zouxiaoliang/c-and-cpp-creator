import { promises } from 'dns';
import * as fs from 'fs';
import * as vscode from 'vscode';

import path = require('path');

export abstract class VscodeHelper {
  public static async inputClassName(): Promise<string | undefined> {
    var option: vscode.InputBoxOptions = {
      ignoreFocusOut: false,
      placeHolder: 'Hello world.',
      prompt: 'Type your class name'
    };

    return await vscode.window.showInputBox(option);
  }

  public static async inputDirPath(): Promise<string | undefined> {
    var option: vscode.InputBoxOptions = {
      ignoreFocusOut: false,
      placeHolder: 'Give me your path.',
      prompt: 'Type a valid path'
    };

    return await vscode.window.showInputBox(option);
  }

  public static async inputFilePath(): Promise<string | undefined> {
    var option: vscode.InputBoxOptions = {
      ignoreFocusOut: false,
      placeHolder: 'Give me you filename.',
      prompt: 'Type a valid filename'
    };

    return await vscode.window.showInputBox(option);
  }

  public static async inputProjectName(): Promise<string | undefined> {
    var option: vscode.InputBoxOptions = {
      ignoreFocusOut: false,
      placeHolder: 'Give me you project name.',
      prompt: 'Type a valid project name'
    };
    return await vscode.window.showInputBox(option);
  }

  public static dirPath(args: any): string {
    var dir: string = '';
    if (1 === vscode.workspace.workspaceFolders?.length) {
      dir = vscode.workspace.workspaceFolders[0].uri.path;
    }
    if (args !== null && args.fsPath !== null) {
      dir = args.fsPath;
      if (typeof dir === 'string' && fs.existsSync(dir)) {
        var stats = fs.lstatSync(dir);
        if (!stats.isDirectory()) {
          // If it's not a directory then it's the file so get the parent
          // directory
          dir = path.dirname(args.fsPath);
        }
      }
    }
    return dir;
  }
}
