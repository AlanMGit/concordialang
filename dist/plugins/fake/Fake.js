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
const TestScriptExecution_1 = require("../../modules/testscript/TestScriptExecution");
/**
 * Fake plugin.
 *
 * @author Thiago Delgado Pinto
 */
class Fake {
    constructor() {
        /** @inheritDoc */
        this.executeCode = (options) => __awaiter(this, void 0, void 0, function* () {
            let r = new TestScriptExecution_1.TestScriptExecutionResult();
            r.sourceFile = 'nofile.json';
            r.schemaVersion = '1.0';
            r.started = (new Date()).toUTCString();
            r.finished = (new Date()).toUTCString();
            r.durationMs = 0;
            r.results = [];
            r.total = {
                tests: 4,
                passed: 1,
                error: 1,
                failed: 1,
                skipped: 1,
                unknown: 0
            };
            return r;
        });
    }
    /** @inheritDoc */
    generateCode(abstractTestScripts, options, errors) {
        return __awaiter(this, void 0, void 0, function* () {
            return []; // No files
        });
    }
    ;
    /** @inheritDoc */
    convertReportFile(filePath) {
        throw new Error("Method not implemented: convertReportFile.");
    }
}
exports.Fake = Fake;
