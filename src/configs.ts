import * as fs from 'fs';
import * as os from 'os';
import * as fspath from 'path';
import * as vscode from 'vscode';

export class Configs {
  private _extensionPath: string = '';
  private _templates: Map<string, string> = new Map();

  private static _instance: Configs = new Configs();

  private constructor() {

  }

  private initTemplates() {
    this._templates.set('code_assistant.creator.template.class.h', this.classHeaderTemplate());
    this._templates.set('code_assistant.creator.template.class.cpp', this.classSourceTemplate());
    this._templates.set('code_assistant.creator.template.header', this.headerTemplate());
    this._templates.set('code_assistant.creator.template.source', this.sourceTemplate());
    this._templates.set('code_assistant.creator.template.class.filename.header', this.classHeaderFilenameTemplate());
    this._templates.set('code_assistant.creator.template.class.filename.source', this.classSourceFilenameTemplate());
    this._templates.set('code_assistant.creator.template.license', this.licenseTemplate());
    this._templates.set('code_assistant.creator.template.username', this.username());
    this._templates.set('code_assistant.creator.template.main.c', this.cMainTemplate());
    this._templates.set('code_assistant.creator.template.main.cpp', this.cppMainTemplate());
    this._templates.set('code_assistant.creator.template.c.cmakelists.txt', this.cCmakeProjectTemplate());
    this._templates.set('code_assistant.creator.template.cpp.cmakelists.txt', this.cppCmakeProjectTemplate());
    this._templates.set('code_assistant.creator.template.main.py', this.pyMainTemplate());
    this._templates.set('code_assistant.creator.template.main.rs', this.rsMainTemplate());
    this._templates.set('code_assistant.creator.template.main.sh', this.shellTemplate());
    this._templates.set('code_assistant.creator.template.main.go', this.goTemplate());
    this._templates.set('code_assistant.creator.template.main.cmakefile', this.cmakefileTemplate());
    this._templates.set('code_assistant.creator.template.plantuml', this.plantumlTemplate());
  }

  public static instance(): Configs {
    return Configs._instance;
  }

  public readTemplateFile(configKey: string, defaultPath: string): string {
    var p = vscode.workspace.getConfiguration().get(configKey) as string;

    var extensionPath = this.extensionPath();
    if (0 === extensionPath.length) {
      return "";
    }

    if (!p || 0 === p.length) {
      p = fspath.join(extensionPath, defaultPath);
    }

    var content = fs.readFileSync(p, 'utf-8');
    return content;
  }

  public readTemplateString(configKey: string, defaultValue: string = ""): string {
    var content =
      vscode.workspace.getConfiguration().get(
        configKey) as string;

    if (!content || 0 === content.length) {
      content = defaultValue;
    }

    return content;
  }

  public classHeaderTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.class.h', '/resources/template/class.h');
  }

  public classSourceTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.class.cpp', '/resources/template/class.cpp');
  }

  public headerTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.header', '/resources/template/header.h');
  }

  public sourceTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.source', '/resources/template/source.c');
  }

  public shellTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.sh', '/resources/template/main.sh');
  }

  public goTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.go', '/resources/template/main.go');
  }

  public cmakefileTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.cmakefile', '/resources/template/CPP_CMakeLists.txt');
  }

  public classHeaderFilenameTemplate(): string {
    return this.readTemplateString('code_assistant.creator.template.class.filename.header', '{{*CLASSNAME*}}.h');
  }

  public classSourceFilenameTemplate(): string {
    return this.readTemplateString('code_assistant.creator.template.class.filename.source', '{{*CLASSNAME*}}.cpp');
  }

  public licenseTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.license', '/resources/template/license');
  }

  public username(): string {
    return this.readTemplateString('code_assistant.creator.template.username', '');
  }

  public cMainTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.c', '/resources/template/main.c');
  }

  public cppMainTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.cpp', '/resources/template/main.cpp');
  }

  public cCmakeProjectTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.c.cmakelists.txt', '/resources/template/C_CMakeLists.txt');
  }

  public cppCmakeProjectTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.cpp.cmakelists.txt', '/resources/template/CPP_CMakeLists.txt');
  }

  public pyMainTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.py', '/resources/template/main.py');
  }

  public rsMainTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.main.rs', '/resources/template/main.rs');
  }

  public plantumlTemplate(): string {
    return this.readTemplateFile('code_assistant.creator.template.plantuml', '/resources/template/main.puml');
  }

  public projectDefaultPath(): string {
    return this.readTemplateString('code_assistant.creator.default_project_path', os.homedir());
  }

  public setExtensionPath(p: string) {
    this._extensionPath = p;
    this.initTemplates();
  }

  public get(key: string): string {
    if (this._templates.has(key)) {
      return this._templates.get(key) as string;
    }
    return '';
  }

  public extensionPath(): string {
    return this._extensionPath;
  }
}
