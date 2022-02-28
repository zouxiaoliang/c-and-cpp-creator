import * as fs from 'fs';
import * as vscode from 'vscode';
import * as fspath from 'path';

export abstract class Configs {
  private static _extensionPath: string = "";

  public static classHeaderTemplate(): string {
    var p = vscode.workspace.getConfiguration().get(
      'cpp.creator.template.class.h') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/class.h');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static classSourceTemplate(): string {
    var p = vscode.workspace.getConfiguration().get(
      'cpp.creator.template.class.cpp') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/class.cpp');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static headerTemplate(): string {
    var p = vscode.workspace.getConfiguration().get(
      'cpp.creator.template.header') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/header.h');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static sourceTemplate(): string {
    var p =  vscode.workspace.getConfiguration().get(
      'cpp.creator.template.source') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/source.c');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static classHeaderFilenameTemplate(): string {
    var template = vscode.workspace.getConfiguration().get(
      'cpp.creator.template.class.filename.header') as string;
    
      if (!template || 0 == template.length) {
        template = "{{\*CLASSNAME\*}}.h";
      }
  
    return template;
  }

  public static classSourceFilenameTemplate(): string {
    var template = vscode.workspace.getConfiguration().get(
      'cpp.creator.template.class.filename.source') as string;
    
      if (!template || 0 == template.length) {
        template = "{{\*CLASSNAME\*}}.cpp";
      }
  
    return template;
  }

  public static licenseTemplate(): string {
    var p = vscode.workspace.getConfiguration().get(
                   'cpp.creator.template.license') as string;
    if (!p || 0 == p.length) {
      p = fspath.join(this._extensionPath, '/resources/template/license');
    }

    var content = fs.readFileSync(p, 'utf-8');
    // vscode.window.showInformationMessage(content);
    return content;
  }

  public static username(): string {
    return vscode.workspace.getConfiguration().get(
               'cpp.creator.template.username') as string;
  }

  public static cMainTemplate(): string {
    var p =  vscode.workspace.getConfiguration().get(
      'cpp.creator.template.main.c') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/main.c');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static cppMainTemplate(): string {
    var p =  vscode.workspace.getConfiguration().get(
      'cpp.creator.template.main.cpp') as string;
    
      if (!p || 0 == p.length) {
        p = fspath.join(this._extensionPath, '/resources/template/main.cpp');
      }
  
      var content = fs.readFileSync(p, 'utf-8');
      // vscode.window.showInformationMessage(content);
      return content;
  }

  public static setExtensionPath(p: string) {
    this._extensionPath = p;
  }

  public static extensionPath(): string {
    return this._extensionPath;
  }
}