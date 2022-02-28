// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands as commands } from './commands';
import { Configs as configs } from './configs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	configs.setExtensionPath(context.extensionPath);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "C & CPP File Creator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let helloWorld = vscode.commands.registerCommand('c-and-cpp-creator.helloWorld', async (args) => {
		commands.helloWorld(args);
	});

	let createHeaderFile = vscode.commands.registerCommand('c-and-cpp-creator.createHeaderFile', async (args) => {
		await commands.createHeaderFile(args);
	});

	let createSourceFile = vscode.commands.registerCommand('c-and-cpp-creator.createSourceFile', async (args) => {
		await commands.createSourceFile(args);
	});

	let createClass = vscode.commands.registerCommand('c-and-cpp-creator.createClass', async (args) => {
		await commands.createClass(args);
	});

	let createMainForC = vscode.commands.registerCommand('c-and-cpp-creator.createMainForC', async (args) => {
		await commands.createMainForC(args);
	});

	let createMainForCpp = vscode.commands.registerCommand('c-and-cpp-creator.createMainForCpp', async (args) => {
		await commands.createMainForCpp(args);
	});

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(createHeaderFile);
	context.subscriptions.push(createSourceFile);
	context.subscriptions.push(createClass);
	context.subscriptions.push(createMainForC);
	context.subscriptions.push(createMainForCpp);

}

// this method is called when your extension is deactivated
export function deactivate() {}
