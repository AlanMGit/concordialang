import { Options } from "./Options";
import { CLI } from "./CLI";
import { SingleFileCompiler } from "./SingleFileCompiler";
import { MultiFileProcessor, MultiFileProcessedData } from "./MultiFileProcessor";
import { VerboseAppEventsListener } from "./VerboseAppEventsListener";
import { SimpleAppEventsListener } from "./SimpleAppEventsListener";
import { Spec } from "../ast/Spec";
import { Lexer } from "../lexer/Lexer";
import { LocatedException } from "../req/LocatedException";
import { Parser } from "../parser/Parser";
import { NLPTrainer } from "../nlp/NLPTrainer";
import { NLPBasedSentenceRecognizer } from "../nlp/NLPBasedSentenceRecognizer";
import { BatchSpecSemanticAnalyzer } from "../semantic/BatchSpecSemanticAnalyzer";
import { Compiler } from "./Compiler";
import { LanguageManager } from "./LanguageManager";
import { LexerBuilder } from "../lexer/LexerBuilder";
import { LanguageContentLoader, JsonLanguageContentLoader } from "../dict/LanguageContentLoader";


export class CompilerController {

    public compile = async ( options: Options, cli: CLI ): Promise< Spec > => {

        const langLoader: LanguageContentLoader =
            new JsonLanguageContentLoader( options.languageDir, {}, options.encoding );        

        let lexer: Lexer = ( new LexerBuilder( langLoader ) ).build( options );
        let parser: Parser = new Parser();

        let nlpTrainer: NLPTrainer = new NLPTrainer( langLoader );
        let nlpBasedSentenceRecognizer: NLPBasedSentenceRecognizer = new NLPBasedSentenceRecognizer( nlpTrainer );

        let specAnalyzer: BatchSpecSemanticAnalyzer = new BatchSpecSemanticAnalyzer();
        
        const lm = new LanguageManager( options.languageDir );
        const availableLanguages: string[] = await lm.availableLanguages();
        if ( availableLanguages.indexOf( options.language ) < 0 ) { // not found
            throw new Error( 'Informed language is not available: ' + options.language );
        }

        // Verbose output option
        let listener =  options.verbose
            ? new VerboseAppEventsListener( cli )
            : new SimpleAppEventsListener( cli );

        let singleFileCompiler = new SingleFileCompiler(
            lexer,
            parser,
            nlpBasedSentenceRecognizer,
            options.language
        );

        let mfp = new MultiFileProcessor( singleFileCompiler, listener, listener, listener, listener );        

        let compiler = new Compiler(
            mfp,
            specAnalyzer
        );

        return await compiler.compile( options, listener );
    };

}