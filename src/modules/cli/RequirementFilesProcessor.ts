import { Warning } from '../req/Warning';
import { NLPException } from '../nlp/NLPException';
import { NLPBasedSentenceRecognizer } from '../nlp/NLPBasedSentenceRecognizer';
import { LocatedException } from '../req/LocatedException';
import { SpecAnalyzer } from '../semantic/SpecAnalyzer';
import { SingleDocumentAnalyzer } from '../semantic/single/SingleDocumentAnalyzer';
import { FileInfo } from '../ast/FileInfo';
import { FileUtil } from '../util/FileUtil';
import { ProcessingObserver } from './ProcessingObserver';
import { EnglishKeywordDictionary } from '../dict/EnglishKeywordDictionary';
import { Document } from '../ast/Document';
import { Node } from '../ast/Node';
import { LexerProcessor } from '../lexer/LexerProcessor';
import { FileProcessor } from '../req/FileProcessor';
import { DocumentProcessor } from '../req/DocumentProcessor';
import { KeywordDictionaryLoader } from "../dict/KeywordDictionaryLoader";
import { JsonKeywordDictionaryLoader } from "../dict/JsonKeywordDictionaryLoader";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import { SyncFileProcessor } from "../req/SyncFileProcessor";
import { Spec } from "../ast/Spec";
import { NLP } from '../nlp/NLP';
import { NLPTrainer } from '../nlp/NLPTrainer';

const path = require( 'path' );

/**
 * Requirement files processor.
 * 
 * @author  Thiago Delgado Pinto
 */
export class RequirementFilesProcessor {

    private _dictMap = { 'en': new EnglishKeywordDictionary() };
    private _dictLoader: KeywordDictionaryLoader =
        new JsonKeywordDictionaryLoader( this._dictMap );
    private _lexer: Lexer = new Lexer( 'en', this._dictLoader );
    private _docProcessor: DocumentProcessor = new LexerProcessor( this._lexer );    
    private _parser: Parser = new Parser();
    private _fileUtil: FileUtil = new FileUtil();

    private _nlpTrainer: NLPTrainer = new NLPTrainer();
    private _nlpBasedSentenceRecognizer: NLPBasedSentenceRecognizer =
        new NLPBasedSentenceRecognizer();
    private _singleDocAnalyzer: SingleDocumentAnalyzer = new SingleDocumentAnalyzer();
    private _specAnalyzer: SpecAnalyzer = new SpecAnalyzer();

    constructor( private _write: Function ) {
    }

    public process(
        basePath: string,
        files: string[],
        language: string,
        encoding: string,
        observer?: ProcessingObserver
    ) {
        // Updates the doc processor according to the new language
        if ( this._lexer.defaultLanguage() != language ) {
            this._lexer = new Lexer( language, this._dictLoader );
            this._docProcessor = new LexerProcessor( this._lexer );
        }

        let fileProcessor: FileProcessor = new SyncFileProcessor( encoding );

        let spec: Spec = new Spec( basePath );

        // Make documents for each file
        for ( let file of files ) {

            let normalizedFilePath = path.join( file, '' ); // @see https://nodejs.org/api/path.html#path_path_join_paths
            
            let doc: Document = {
                fileErrors: [],
                fileWarnings: []
            };

            let hadErrors = false;

            let fileInfo: FileInfo = {
                path: normalizedFilePath,
                hash: this._fileUtil.hashOfFile( normalizedFilePath, encoding ) // Compute file hash
            };

            // Adds the file info to the document
            doc.fileInfo = fileInfo;            

            // Notify about the start
            /*
            if ( observer ) {
                observer.onStarted( fileInfo );
            } 
            */       

            // LEXER ===
            // Process the file with the lexer processor
            fileProcessor.process( normalizedFilePath, this._docProcessor );
            // Get the lexed nodes
            let nodes: Node[] = this._lexer.nodes();
            // Add errors found
            hadErrors = this._lexer.hasErrors();            
            this.addErrorsToDoc( this._lexer.errors(), doc );
            // Resets the lexer state (important!)
            this._lexer.reset();
    
            // PARSER ===
            this._parser.analyze( nodes, doc );
            hadErrors = hadErrors || this._parser.hasErrors();
            this.addErrorsToDoc( this._parser.errors(), doc );

            // NLP ===
            if ( ! this._nlpBasedSentenceRecognizer.isTrained( language ) ) {
                //this._nlpBasedSentenceRecognizer.train( language );
                if ( this._nlpBasedSentenceRecognizer.canBeTrained( language ) ) {
                    this._nlpBasedSentenceRecognizer.train( language );
                } else {
                    let errors = [
                        new Error( 'The NLP cannot be trained in the language "' + language + '".' )
                    ];
                    this.addErrorsToDoc( errors, doc );                    
                }
            }

            this._nlpBasedSentenceRecognizer.recognizeSentencesInDocument(
                doc, doc.fileErrors, doc.fileWarnings );

            // NODE-BASED SEMANTIC ANALYSIS ===
            this._singleDocAnalyzer.analyze( spec, doc, doc.fileErrors );
    
            //this._write( doc ); // <<< TEMPORARY

            // TEMPORARY <<< TO-DO: present file errors once
            /*
            if ( observer && doc.fileErrors.length > 0 ) {
                observer.onError( fileInfo, doc.fileErrors );
            }
            */

            // Notify about the finish
            /*
            if ( observer ) {
                observer.onFinished( fileInfo, ! hadErrors );
            }
            */
            
            // Adds the document to the semantic analysis context
            spec.docs.push( doc );
        }

        // SEMANTIC ANALYSIS
        let semanticErrors: LocatedException[] = [];
        this._specAnalyzer.analyze( spec, semanticErrors );

        // Output
        if ( observer ) {
            for ( let doc of spec.docs ) {
                observer.onFileStarted( doc.fileInfo );
                let hadWarnings = doc.fileWarnings.length > 0;
                if ( hadWarnings ) {
                    let sortedWarnings: LocatedException[] = this.sortErrorsByLocation( doc.fileWarnings );
                    observer.onFileWarning( doc.fileInfo, sortedWarnings );
                }                
                let hadErrors = doc.fileErrors.length > 0;
                if ( hadErrors ) {
                    let sortedErrors: LocatedException[] = this.sortErrorsByLocation( doc.fileErrors );
                    observer.onFileError( doc.fileInfo, sortedErrors );
                }
                observer.onFileFinished( doc.fileInfo, ! hadErrors ); 
            }
        }       

    }

    private addErrorsToDoc( errors: Error[], doc: Document ) {
        if ( ! doc.fileErrors ) {
            doc.fileErrors = [];
        }
        doc.fileErrors.push.apply( doc.fileErrors, errors );        
    }

    private sortErrorsByLocation( errors: LocatedException[] ): LocatedException[] {
        return Array.sort( errors, ( a: LocatedException, b: LocatedException ) => {
            if ( a.location && b.location ) {
                // Compare the line
                let lineDiff: number = a.location.line - b.location.line;
                if ( 0 === lineDiff ) { // Same line, so let's compare the column
                    return a.location.column - b.location.column;
                }
                return lineDiff;
            }
            // No location, so let's compare the error type
            let aIsWarning = a.name === Warning.name;
            let bIsWarning = b.name === Warning.name;
            // Both are warnings, they are equal
            if ( aIsWarning && bIsWarning ) {
                return 0;
            }
            return aIsWarning ? 1 : -1;
        } );
    }

}