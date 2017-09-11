import { KeywordBaseLexer } from './KeywordBasedLexer';
import { Node, ContentNode } from '../ast/Node';
import { NodeLexer, LexicalAnalysisResult } from './NodeLexer';
import { Expressions } from '../req/Expressions';
import { LineChecker } from '../req/LineChecker';
import { Symbols } from "../req/Symbols";
import { LexicalException } from "../req/LexicalException";

const XRegExp = require( 'xregexp' );

/**
 * Detects a node in the format "keyword "value"".
 * 
 * @author Thiago Delgado Pinto
 */
export class QuotedNodeLexer< T extends ContentNode > implements NodeLexer< T >, KeywordBaseLexer  {

    private _lineChecker: LineChecker = new LineChecker();

    constructor( private _words: Array< string >, private _keyword: string ) {
    }

    /** @inheritDoc */
    public keyword(): string {
        return this._keyword;
    }
        
    /** @inheritDoc */
    public updateWords( words: string[] ) {
        this._words = words;   
    }     

    protected makeRegexForTheWords( words: string[] ): string {
        return '^' + Expressions.SPACES_OR_TABS
            + '(?:' + words.join( '|' ) + ')'
            + Expressions.SPACES_OR_TABS
            + '("[^"\r\n]*")';
    }

    /** @inheritDoc */
    public analyze( line: string, lineNumber?: number ): LexicalAnalysisResult< T > {

        let exp = new RegExp( this.makeRegexForTheWords( this._words ), "iu" );
        let result = exp.exec( line );
        if ( ! result ) {
            return null;
        }

        let pos = this._lineChecker.countLeftSpacesAndTabs( line );
        let name = this._lineChecker.textAfterSeparator( Symbols.IMPORT_WRAPPER, line )
            .replace( new RegExp( Symbols.IMPORT_WRAPPER , 'g' ), '' ) // replace all '"' with ''
            .trim();

        let node = {
            keyword: this._keyword,
            location: { line: lineNumber || 0, column: pos + 1 },
            content: name
        } as T;

        let errors = [];
        if ( ! this.isValidName( name ) ) {
            let loc = { line: lineNumber || 0, column: line.indexOf( name ) + 1 };
            let msg = 'Invalid ' + this._keyword + ' name: "' + name + '"';
            errors.push( new LexicalException( msg, loc ) );
        }

        return { nodes: [ node ], errors: errors };
    }

    /**
     * Returns true if the given name is a valid one.
     * 
     * @param name Name
     */
    public isValidName( name: string ): boolean {
        return XRegExp( '^[\\p{L}][\\p{L}0-9 ._-]*$', 'ui' ).test( name ); // TO-DO: improve the regex
    }    

}