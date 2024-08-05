import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as os from 'os';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('venkysio-jdk-installer.downloadJDK', async () => {
        vscode.window.showInformationMessage('Starting JDK download...');

        try {
            const downloadUrl = 'https://download.oracle.com/java/22/latest/jdk-22_windows-x64_bin.zip';
            const version = '22.0.0+0';
            const zipPath = path.join(os.tmpdir(), `jdk-${version}.zip`);
            const extractPath = path.join(os.homedir(), `jdk-${version}`);

            console.log(`Download URL: ${downloadUrl}`);
            console.log(`ZIP Path: ${zipPath}`);
            console.log(`Extract Path: ${extractPath}`);

            await downloadFile(downloadUrl, zipPath);
            extractZip(zipPath, extractPath);

            const binPath = path.join(extractPath, 'jdk-22', 'bin');
            addToEnvironmentPath(binPath);

            vscode.window.showInformationMessage(`JDK ${version} downloaded, extracted to ${extractPath}, and added to environment variables.`);
        } catch (error) {
            console.error(`Error during JDK download and extraction: ${getErrorMessage(error)}`);
            vscode.window.showErrorMessage(`Failed to download JDK: ${getErrorMessage(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

async function downloadFile(url: string, filePath: string): Promise<void> {
    try {
        console.log(`Starting download from URL: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        console.log(`Writing file to path: ${filePath}`);
        fs.writeFileSync(filePath, response.data);

        console.log(`File successfully written to ${filePath}`);
    } catch (error) {
        console.error(`Error in downloadFile function: ${getErrorMessage(error)}`);
        throw new Error(`Failed to download file: ${getErrorMessage(error)}`);
    }
}

function extractZip(zipPath: string, extractPath: string): void {
    try {
        console.log(`Starting extraction of ZIP file: ${zipPath}`);

        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        console.log(`Extraction completed to path: ${extractPath}`);

        fs.unlinkSync(zipPath); // Cleanup ZIP file
        console.log(`ZIP file deleted: ${zipPath}`);
    } catch (error) {
        console.error(`Error in extractZip function: ${getErrorMessage(error)}`);
        throw new Error(`Failed to extract ZIP file: ${getErrorMessage(error)}`);
    }
}

function addToEnvironmentPath(binPath: string): void {
    try {
        console.log(`Adding ${binPath} to environment variables`);

        const setxCommand = `setx PATH "%PATH%;${binPath}"`;
        exec(setxCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error in addToEnvironmentPath function: ${getErrorMessage(error)}`);
                throw new Error(`Failed to add to environment variables: ${getErrorMessage(error)}`);
            }
            console.log(`Environment variable updated: ${stdout}`);
        });
    } catch (error) {
        console.error(`Error in addToEnvironmentPath function: ${getErrorMessage(error)}`);
        throw new Error(`Failed to add bin path to environment variables: ${getErrorMessage(error)}`);
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
}

export function deactivate() {}
