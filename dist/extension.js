"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const os = __importStar(require("os"));
function activate(context) {
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
            vscode.window.showInformationMessage(`JDK ${version} downloaded and extracted to ${extractPath}`);
        }
        catch (error) {
            console.error(`Error during JDK download and extraction: ${getErrorMessage(error)}`);
            vscode.window.showErrorMessage(`Failed to download JDK: ${getErrorMessage(error)}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function downloadFile(url, filePath) {
    try {
        console.log(`Starting download from URL: ${url}`);
        const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
        console.log(`Writing file to path: ${filePath}`);
        fs.writeFileSync(filePath, response.data);
        console.log(`File successfully written to ${filePath}`);
    }
    catch (error) {
        console.error(`Error in downloadFile function: ${getErrorMessage(error)}`);
        throw new Error(`Failed to download file: ${getErrorMessage(error)}`);
    }
}
function extractZip(zipPath, extractPath) {
    try {
        console.log(`Starting extraction of ZIP file: ${zipPath}`);
        const zip = new adm_zip_1.default(zipPath);
        zip.extractAllTo(extractPath, true);
        console.log(`Extraction completed to path: ${extractPath}`);
        fs.unlinkSync(zipPath); // Cleanup ZIP file
        console.log(`ZIP file deleted: ${zipPath}`);
    }
    catch (error) {
        console.error(`Error in extractZip function: ${getErrorMessage(error)}`);
        throw new Error(`Failed to extract ZIP file: ${getErrorMessage(error)}`);
    }
}
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map