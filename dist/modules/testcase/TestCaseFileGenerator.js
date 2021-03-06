"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EnglishKeywordDictionary_1 = require("../dict/EnglishKeywordDictionary");
const Symbols_1 = require("../req/Symbols");
const NodeTypes_1 = require("../req/NodeTypes");
const CaseConversor_1 = require("../util/CaseConversor");
/**
 * Generates files for Documents with Test Cases.
 *
 * @author Thiago Delgado Pinto
 */
class TestCaseFileGenerator {
    constructor(_languageContentLoader, language) {
        this._languageContentLoader = _languageContentLoader;
        this.language = language;
        this.fileHeader = [
            '# Generated with ❤ by Concordia',
            '#',
            '# THIS IS A GENERATED FILE - MODIFICATIONS CAN BE LOST !',
            ''
        ];
        // Loads/gets the dictionary according to the current language
        let langContent = _languageContentLoader.load(language);
        this._dict = langContent.keywords || new EnglishKeywordDictionary_1.EnglishKeywordDictionary();
    }
    /**
     * Generates lines from a document.
     *
     * @param doc Document
     * @param errors Errors found, probably because of language loading.
     * @param ignoreHeader If true, does not include the header.
     * @param indentation Characters used as indentation. Defaults to double spaces.
     */
    createLinesFromDoc(doc, errors, ignoreHeader = false, indentation = '  ') {
        let dict = this._dict;
        let lines = [];
        // Add header lines
        if (!ignoreHeader) {
            lines.push.apply(lines, this.fileHeader);
        }
        // Generate language, if declared
        if (doc.language) {
            dict = this.dictionaryForLanguage(doc.language.value, errors) || this._dict;
            lines.push(this.generateLanguageLine(doc.language.value, dict));
            lines.push(''); // empty line
        }
        // Imports
        for (let imp of doc.imports || []) {
            lines.push(this.generateImportLine(imp.value, dict));
        }
        // Test Cases
        let lastTagsContent = '';
        for (let testCase of doc.testCases || []) {
            lines.push(''); // empty line
            let newTagsContent = testCase.tags.map(t => (t.content || '')).join('');
            if (lastTagsContent != newTagsContent) {
                if (lastTagsContent !== '') {
                    lines.push(Symbols_1.Symbols.COMMENT_PREFIX + ' ' + '-'.repeat(80 - 2));
                    lines.push(''); // empty line
                }
                lastTagsContent = newTagsContent;
            }
            // Tags
            for (let tag of testCase.tags || []) {
                lines.push(this.generateTagLine(tag.name, tag.content));
            }
            // Header
            lines.push(this.generateTestCaseHeader(testCase.name, dict));
            // Sentences
            for (let sentence of testCase.sentences || []) {
                let ind = indentation;
                if (NodeTypes_1.NodeTypes.STEP_AND === sentence.nodeType) {
                    ind += indentation;
                }
                let line = ind + sentence.content +
                    (!sentence.comment ? '' : '  ' + Symbols_1.Symbols.COMMENT_PREFIX + sentence.comment);
                lines.push(line);
            }
        }
        return lines;
    }
    dictionaryForLanguage(language, errors) {
        try {
            return this._languageContentLoader.load(language).keywords || null;
        }
        catch (err) {
            errors.push(err);
            return null;
        }
    }
    generateLanguageLine(language, dict) {
        return Symbols_1.Symbols.COMMENT_PREFIX +
            (!dict.language ? 'language' : dict.language[0] || 'language') +
            Symbols_1.Symbols.LANGUAGE_SEPARATOR + language;
    }
    generateImportLine(path, dict) {
        return (!dict.import ? 'import' : dict.import[0] || 'import') + ' ' +
            Symbols_1.Symbols.IMPORT_PREFIX + path + Symbols_1.Symbols.IMPORT_SUFFIX;
    }
    generateTagLine(name, content) {
        return Symbols_1.Symbols.TAG_PREFIX + name + (!content ? '' : '(' + content + ')');
    }
    generateTestCaseHeader(name, dict) {
        return CaseConversor_1.upperFirst(!dict ? 'Test Case' : dict.testCase[0] || 'Test Case') +
            Symbols_1.Symbols.TITLE_SEPARATOR + ' ' + name;
    }
}
exports.TestCaseFileGenerator = TestCaseFileGenerator;
