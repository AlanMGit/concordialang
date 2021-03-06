"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SingleFileProcessor_1 = require("./SingleFileProcessor");
const listeners_1 = require("./listeners");
const SingleFileProcessor_2 = require("./SingleFileProcessor");
const filewalker = require("filewalker");
const crypto_1 = require("crypto");
class MultiFileProcessor {
    constructor(_singleProcessor, _fileReadListener, _fileProcessorListener, _directoryReadListener, _multiFileProcessListener) {
        this._singleProcessor = _singleProcessor;
        this._fileReadListener = _fileReadListener;
        this._fileProcessorListener = _fileProcessorListener;
        this._directoryReadListener = _directoryReadListener;
        this._multiFileProcessListener = _multiFileProcessListener;
        this.process = (options) => {
            return new Promise((resolve, reject) => {
                const dir = options.directory;
                const hasFilesToConsider = options.files.length > 0;
                const matchRegExp = hasFilesToConsider
                    ? this.filesToRegExp(options.files)
                    : this.extensionsToRegExp(options.extensions);
                const hasFilesToIgnore = options.ignore.length > 0;
                const target = hasFilesToConsider
                    ? options.files
                    : this.prettyExtensions(options.extensions);
                const recursive = options.recursive;
                let filePromises = [];
                let processedFiles = [];
                let errors = [];
                const startTime = Date.now();
                this._directoryReadListener.directoryReadStarted(dir, target, hasFilesToConsider);
                this._multiFileProcessListener.multiProcessStarted();
                const filewalkerOptions = {
                    maxPending: -1,
                    maxAttempts: 0,
                    attemptTimeout: 1000,
                    matchRegExp: matchRegExp,
                    recursive: recursive
                };
                let fwalker = filewalker(dir, filewalkerOptions);
                fwalker
                    // .on( 'dir', ( p ) => {
                    //      console.log('dir:  %s', p);
                    // } )
                    .on('file', (p, s) => {
                    this._fileReadListener.fileReadStarted(p, s.size);
                })
                    .on('stream', (rs, p, s, fullPath) => {
                    if (hasFilesToIgnore) {
                        if (this.filesToIgnoreToRegExp(options.ignore).test(p)) {
                            this._fileReadListener.fileReadIgnored(p);
                            return;
                        }
                    }
                    rs._readableState.highWaterMark = 1024 * 1024; // 1 MB
                    let fileContent = '';
                    rs.on('data', (chunk) => {
                        fileContent += chunk;
                        this._fileReadListener.fileReadChunk(p, chunk.length);
                    });
                    rs.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        const hashStr = crypto_1.createHash('md5')
                            .update(fileContent)
                            .digest('hex');
                        this._fileReadListener.fileReadFinished(p);
                        const fileStartTime = Date.now();
                        const fileMeta = new SingleFileProcessor_1.FileMeta(fullPath, s.size, hashStr);
                        let hasErrors = false;
                        try {
                            const fileData = new SingleFileProcessor_1.FileData(fileMeta, fileContent);
                            this._fileProcessorListener.processStarted(fileMeta);
                            let promise = this._singleProcessor.process(fileData);
                            filePromises.push(promise);
                            const processedData = yield promise; // executes
                            processedFiles.push(processedData);
                            this._fileProcessorListener.processFinished(processedData);
                        }
                        catch (err) {
                            // should not happen, since errors are catched internally by the processor
                            const processDurationMs = Date.now() - fileStartTime;
                            this._fileProcessorListener.processFinished(new SingleFileProcessor_2.ProcessedFileData(fileMeta, {}, processDurationMs, [err], []));
                        }
                    }));
                })
                    .on('error', (err) => {
                    errors.push(err);
                })
                    .on('done', () => __awaiter(this, void 0, void 0, function* () {
                    let durationMs = Date.now() - startTime;
                    // TO-DO: Remove the comparison and use fwalker.dirs when its Issue 20 is fixed.
                    // https://github.com/oleics/node-filewalker/issues/20
                    const dirCount = recursive ? fwalker.dirs : 1;
                    const data = new listeners_1.DirectoryReadResult(dirCount, fwalker.files, fwalker.bytes, durationMs, errors.length);
                    this._directoryReadListener.directoryReadFinished(data);
                    yield Promise.all(filePromises);
                    durationMs = Date.now() - startTime;
                    this._multiFileProcessListener.multiProcessFinished(fwalker.files, durationMs);
                    return resolve(new MultiFileProcessedData(processedFiles, errors));
                }))
                    .walk();
            });
        };
        this.filesToRegExp = (files) => {
            const exp = '(' + files.map(f => f.replace('/', '\\\\')).join('|') + ')';
            return new RegExp(exp, 'ui');
        };
        this.filesToIgnoreToRegExp = (files) => {
            const exp = '(' + files.map(f => f.replace('\\', '/')).join('|') + ')';
            return new RegExp(exp, 'ui');
        };
        this.extensionsToRegExp = (extensions) => {
            const exp = '(' + extensions.map(e => e.indexOf('.') >= 0 ? '\\' + e : '\\.' + e).join('|') + ')';
            return new RegExp(exp, 'ui');
        };
        this.prettyExtensions = (extensions) => {
            return extensions.map(e => e.indexOf('.') >= 0 ? e : '.' + e);
        };
    }
}
exports.MultiFileProcessor = MultiFileProcessor;
class MultiFileProcessedData {
    constructor(compiledFiles, readErrors) {
        this.compiledFiles = compiledFiles;
        this.readErrors = readErrors;
    }
}
exports.MultiFileProcessedData = MultiFileProcessedData;
