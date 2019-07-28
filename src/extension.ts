import * as vscode from 'vscode';
import { convertToTypeStyle } from './conversion';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('typestyle-utils.convertCss', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Must be in a file!');
            return;
        }

        editor.edit(edit => {
            if (editor.selection.isEmpty) {
                const text = editor.document.getText();
                const newText = convertToTypeStyle(text);
                edit.replace(
                    new vscode.Range(
                        editor.document.positionAt(0),
                        editor.document.positionAt(text.length),
                    ),
                    newText,
                );
            } else {
                for (let selection of editor.selections) {
                    const text = editor.document.getText(selection);
                    const newText = convertToTypeStyle(text);
                    edit.replace(selection, newText);
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
