import { VariantLexer } from './VariantLexer';
import { BeforeAllLexer, AfterAllLexer, BeforeFeatureLexer, AfterFeatureLexer, BeforeScenariosLexer, AfterScenariosLexer } from './TestEventLexer';
import { DatabasePropertyLexer } from './DatabasePropertyLexer';
import { DatabaseLexer } from './DatabaseLexer';
import { UIPropertyLexer } from './UIPropertyLexer';
import { UIElementLexer } from './UIElementLexer';
import { ConstantBlock } from '../ast/ConstantBlock';
import { KeywordBasedLexer } from './KeywordBasedLexer';
import { Language } from '../ast/Language';
import { NodeTypes } from '../req/NodeTypes';
import { TestCaseLexer } from './TestCaseLexer';
import { Node } from '../ast/Node';
import { DocumentProcessor } from '../req/DocumentProcessor';
import { NodeLexer, LexicalAnalysisResult } from './NodeLexer';
import { LanguageLexer } from "./LanguageLexer";
import { TagLexer } from "./TagLexer";
import { ImportLexer } from './ImportLexer';
import { FeatureLexer } from './FeatureLexer';
import { BackgroundLexer } from './BackgroundLexer';
import { ScenarioLexer } from './ScenarioLexer';
import { StepGivenLexer } from "./StepGivenLexer";
import { StepWhenLexer } from "./StepWhenLexer";
import { StepThenLexer } from "./StepThenLexer";
import { StepAndLexer } from "./StepAndLexer";
import { StepOtherwiseLexer } from './StepOtherwiseLexer';
import { TextLexer } from "./TextLexer";
import { RegexBlockLexer } from './RegexBlockLexer';
import { RegexLexer } from './RegexLexer';
import { ConstantBlockLexer } from './ConstantBlockLexer';
import { ConstantLexer } from './ConstantLexer';
import { KeywordDictionary } from '../dict/KeywordDictionary';
import { TableLexer } from './TableLexer';
import { TableRowLexer } from './TableRowLexer';
import { LongStringLexer } from './LongStringLexer';
import { LanguageContentLoader } from '../dict/LanguageContentLoader';
import { LanguageContent } from '../dict/LanguageContent';
import { VariantBackgroundLexer } from './VariantBackgroundLexer';

/**
 * Lexer
 *
 * @author Thiago Delgado Pinto
 */
export class Lexer {

    private _nodes: Node[] = [];
    private _errors: Error[] = [];

    private _lexers: Array< NodeLexer< Node > > = [];
    private _lexersMap: Map< string, NodeLexer< any > > =
        new Map< string, NodeLexer< any > >(); // iterable in insertion order
    private _lastLexer: NodeLexer< any > = null;

    private _inLongString: boolean = false;
    private _mustRecognizeAsText: boolean = false;

    /**
     * Constructs the lexer.
     *
     * @param _defaultLanguage Default language (e.g.: "en")
     * @param _languageContentLoader Language content loader.
     * @param _stopOnFirstError True for stopping on the first error found.
     *
     * @throws Error if the given default language could not be found.
     */
    constructor(
        private _defaultLanguage: string,
        private _languageContentLoader: LanguageContentLoader,
        private _stopOnFirstError: boolean = false,
    ) {
        const dictionary: KeywordDictionary = this.loadDictionary( _defaultLanguage ); // may throw Error
        if ( ! dictionary ) {
            throw new Error( 'Cannot load a dictionary for the language: ' + _defaultLanguage );
        }

        this._lexers = [
            new LongStringLexer()
            , new LanguageLexer( dictionary.language )
            , new TagLexer()
            , new ImportLexer( dictionary.import )
            , new FeatureLexer( dictionary.feature )
            , new BackgroundLexer( dictionary.background )
            , new VariantBackgroundLexer( dictionary.variantBackground )
            , new ScenarioLexer( dictionary.scenario )
            , new StepGivenLexer( dictionary.stepGiven )
            , new StepWhenLexer( dictionary.stepWhen )
            , new StepThenLexer( dictionary.stepThen )
            , new StepAndLexer( dictionary.stepAnd )
            , new StepOtherwiseLexer( dictionary.stepOtherwise )
            , new VariantLexer( dictionary.variant )
            , new TestCaseLexer( dictionary.testCase )
            , new ConstantBlockLexer( dictionary.constantBlock )
            , new ConstantLexer( dictionary.is ) // "name" is "value"
            , new RegexBlockLexer( dictionary.regexBlock )
            , new RegexLexer( dictionary.is ) // "name" is "value"
            , new TableLexer( dictionary.table )
            , new TableRowLexer()
            , new UIElementLexer( dictionary.uiElement )
            , new UIPropertyLexer()
            , new DatabaseLexer( dictionary.database )
            , new DatabasePropertyLexer()
            , new BeforeAllLexer( dictionary.beforeAll )
            , new AfterAllLexer( dictionary.afterAll )
            , new BeforeFeatureLexer( dictionary.beforeFeature )
            , new AfterFeatureLexer( dictionary.afterFeature )
            , new BeforeScenariosLexer( dictionary.beforeEachScenario )
            , new AfterScenariosLexer( dictionary.afterEachScenario )
            , new TextLexer() // captures any non-empty
        ];

        // Building the map
        for ( let lex of this._lexers ) {
            this._lexersMap.set( lex.nodeType(), lex );
        }

    }

    public defaultLanguage(): string {
        return this._defaultLanguage;
    }

    public reset() {
        this._nodes = [];
        this._errors = [];

        this._inLongString = false;
        this._mustRecognizeAsText = false;

        // Also resets language to the defined default
        this.changeLanguage( this.defaultLanguage() );
    }

    public nodes(): Node[] {
        return this._nodes;
    }

    public hasErrors(): boolean {
        return this._errors.length > 0;
    }

    public errors(): Error[] {
        return this._errors;
    }

    public stopOnFirstError( stop?: boolean ): boolean {
        if ( stop !== undefined ) {
            this._stopOnFirstError = stop;
        }
        return this._stopOnFirstError;
    }

    /**
     * Returns true if the lexer was configured to stop on the first error
     * and an error was found.
     */
    public shouldStop(): boolean {
        return this._stopOnFirstError && this._errors.length > 0;
    }

    public longStringDetected(): void {
        this._inLongString = ! this._inLongString;
        this._mustRecognizeAsText = ! this._mustRecognizeAsText;
    }

    public mustRecognizeAsText(): boolean {
        return this._mustRecognizeAsText;
    }

    public changeResultToRecognizedAsText( result: LexicalAnalysisResult< Node > ): void {
        result.errors = [];
        result.warnings = [];
        for ( let node of result.nodes ) {
            node.nodeType = NodeTypes.TEXT;
        }
    }

    /**
     * Tries to add a node from the given line. Returns true if added.
     *
     * @param line Line to be analyzed
     * @param lineNumber Line number
     */
    public addNodeFromLine( line: string, lineNumber: number ): boolean {

        if ( this.shouldStop() ) {
            return false;
        }

        if ( 0 === line.trim().length ) { // Ignore empty lines
            return false;
        }

        let result: LexicalAnalysisResult< Node >;
        let node: Node;

        // Analyze with lexers of the suggested node types
        if ( this._lastLexer !== null ) {

            const suggestedNodeTypes: string[] = this._lastLexer.suggestedNextNodeTypes();

            for ( let nodeType of suggestedNodeTypes ) {
                // Ignores text
                if ( NodeTypes.TEXT === nodeType ) {
                    continue; // next lexer
                }
                let lexer = this._lexersMap.get( nodeType );
                if ( ! lexer ) {
                    continue; // next lexer
                }
                result = lexer.analyze( line, lineNumber );
                if ( ! result ) {
                    continue; // next lexer
                }
                // Stores the last valid lexer
                this._lastLexer = lexer;
                // Add the node and errors
                this.dealWithResult( result );
                return true; // found a node in the line
            }
        }

        // Analyze with all the lexers
        for ( let lexer of this._lexers ) {
            result = lexer.analyze( line, lineNumber );
            if ( ! result ) {
                continue; // next lexer
            }
            // Stores the last valid lexer
            this._lastLexer = lexer;
            // Add the node and errors
            this.dealWithResult( result );
            return true; // found a node in the line
        }

        return false;
    }

    public dealWithResult( result: LexicalAnalysisResult< Node > ): void {

        // Whether a Long String node was detected, indicates it.
        if ( result.nodes.length > 0 && NodeTypes.LONG_STRING === result.nodes[ 0 ].nodeType ) {
            this.longStringDetected();
        // Else whether recognition is disabled, change node type to TEXT
        } else if ( this.mustRecognizeAsText() ) {
            this.changeResultToRecognizedAsText( result );
        }

        // Detects a language node and tries to change the language
        if ( result.nodes.length > 0 && NodeTypes.LANGUAGE === result.nodes[ 0 ].nodeType ) {
            let language = ( result.nodes[ 0 ] as Language ).value;
            if ( language != this._defaultLanguage ) { // needs to change ?
                try {
                    this.changeLanguage( language );
                } catch ( e ) {
                    this._errors.push( e );
                }
            }
        }

        // Add the "nodes" array to "_nodes"
        this._nodes.push.apply( this._nodes, result.nodes );

        if ( result.errors ) {
            // Add the "errors" array to "_errors"
            this._errors.push.apply( this._errors, result.errors );
        }
    }

    /**
     * Tries to add an error message. Returns true if added.
     *
     * @param message Error message to be added
     */
    public addErrorMessage( message: string ): boolean {
        if ( this.shouldStop() ) {
            return false;
        }
        this._errors.push( new Error( message ) );
        return true;
    }

    /**
     * Change the language (of the internal lexers) iff it could be loaded.
     * This will *not* change the default lexer language.
     *
     * @param language Language
     * @return The loaded keyword dictionary.
     * @throws Error In case of the language is not available.
     */
    public changeLanguage( language: string ): KeywordDictionary {
        let dict = this.loadDictionary( language ) // may throw Error
            || {} as KeywordDictionary;
        for ( let lexer of this._lexers ) {
            if ( this.isAWordBasedLexer( lexer ) ) {
                let nodeType = lexer.affectedKeyword();
                let words = dict[ nodeType ];
                if ( words ) {
                    lexer.updateWords( words );
                }
            }
        }
        return dict;
    }

    /**
     * Loads a dictionary
     *
     * @param language Language
     * @throws Error
     */
    private loadDictionary( language: string ): KeywordDictionary | null {
        const content: LanguageContent = this._languageContentLoader.load( language ); // may throw Error
        return content ? content.keywords : null;
    }

    private isAWordBasedLexer( obj: any ): obj is KeywordBasedLexer {
        return ( < KeywordBasedLexer > obj ).updateWords !== undefined;
    }
}