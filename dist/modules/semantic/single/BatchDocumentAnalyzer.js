"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseDA_1 = require("./DatabaseDA");
const ScenarioDA_1 = require("./ScenarioDA");
const ImportDA_1 = require("./ImportDA");
const UIElementDA_1 = require("./UIElementDA");
const VariantGivenStepDA_1 = require("./VariantGivenStepDA");
/**
 * Executes a series of semantic analyzers to a document.
 *
 * @author Thiago Delgado Pinto
 */
class BatchDocumentAnalyzer {
    constructor() {
        this._analyzers = [
            new ImportDA_1.ImportDA(),
            new ScenarioDA_1.ScenarioDA(),
            new DatabaseDA_1.DatabaseDA(),
            new UIElementDA_1.UIElementDA(),
            new VariantGivenStepDA_1.VariantGivenStepDA()
        ];
    }
    analyze(doc, errors) {
        for (let analyzer of this._analyzers) {
            analyzer.analyze(doc, errors);
        }
    }
}
exports.BatchDocumentAnalyzer = BatchDocumentAnalyzer;
