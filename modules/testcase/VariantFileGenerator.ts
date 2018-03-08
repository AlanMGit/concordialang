import { Document } from "../ast/Document";
import { LanguageContentLoader } from "../dict/LanguageContentLoader";
import { KeywordDictionary } from "../dict/KeywordDictionary";
import { EnglishKeywordDictionary } from "../dict/EnglishKeywordDictionary";
import { promisify } from 'util';
import { EventEmitter } from "events";
import { Symbols } from "../req/Symbols";
import { NodeTypes } from "../req/NodeTypes";

/**
 * Generates files for Documents with Variants.
 * 
 * @author Thiago Delgado Pinto 
 */
export class VariantFileGenerator extends EventEmitter {

    public readonly fileHeader: string[] = [
        '# Generated with ❤ by Concordia',
        '#',
        '# THIS IS A GENERATED FILE - MODIFICATIONS CAN BE OVERWRITTEN !',
        ''       
    ];

    private _dict: KeywordDictionary;

    constructor(
        private _languageContentLoader: LanguageContentLoader,
        private language: string
    ) {
        super();
        // Loads/gets the dictionary according to the current language
        let langContent = _languageContentLoader.load( language );
        this._dict = langContent.keywords || new EnglishKeywordDictionary();
    }


    /**
     * Generates lines from a document.
     * 
     * @param doc Document
     * @param errors Errors found, probably because of language loading.
     * @param ignoreHeader If true, does not include the header.
     * @param indentation Characters used as indentation. Defaults to double spaces.
     */
    createLinesFromDoc(
        doc: Document,
        errors: Error[],
        ignoreHeader: boolean = false,
        indentation: string = '  '
    ): string[] {

        let dict = this._dict;
        let lines: string[] = [];
        
        // Add header lines
        if ( ! ignoreHeader ) {
            lines.push.apply( lines, this.fileHeader );
        }

        // Generate language, if declared
        if ( doc.language ) {
            dict = this.dictionaryForLanguage( doc.language.value, errors ) || this._dict;
            lines.push( this.generateLanguageLine( doc.language.value, dict ) );
            lines.push( '' ); // empty line
        }

        // Imports
        for ( let imp of doc.imports || [] ) {
            lines.push( this.generateImportLine( imp.value, dict ) );
        }

        // Variants
        for ( let variant of doc.variants || [] ) {

            lines.push( '' ); // empty line

            // Tags
            for ( let tag of variant.tags || [] ) {
                lines.push( this.generateTagLine( tag.name, tag.content ) );
            }
            // Name
            lines.push( this.generateVariantName( variant.name, dict ) );

            // Sentences
            for ( let sentence of variant.sentences || [] ) {
                let ind = indentation;
                if ( NodeTypes.STEP_AND === sentence.nodeType ) {
                    ind += indentation;
                }
                lines.push( ind + sentence.content );
            }
        }

        return lines;
    }


    async createFile( path: string, lines: string[], fs: any ): Promise< void > {
        const writeFileAsync = promisify( fs.writeFile );
        await writeFileAsync( path, lines.join( "\n" ) );
        this.emit( 'concordia:testCase:fileCreated', path );
    }


    dictionaryForLanguage( language: string, errors: Error[] ): KeywordDictionary | null {
        try {
            return this._languageContentLoader.load( language ).keywords || null;
        } catch ( err ) {
            errors.push( err );
            return null;
        }
    }

    generateLanguageLine( language: string, dict: KeywordDictionary ): string {        
        return Symbols.COMMENT_PREFIX + ( dict.language[ 0 ] || 'language' ) +
            Symbols.LANGUAGE_SEPARATOR + language;
    }

    generateImportLine( path: string, dict: KeywordDictionary ): string  {
        return ( dict.import[ 0 ] || 'import' ) + ' ' + 
            Symbols.IMPORT_PREFIX + path + Symbols.IMPORT_SUFFIX;
    }

    generateTagLine( name: string, content: string ): string {
        return Symbols.TAG_PREFIX + name +
            ( content && content.length > 0 ? '(' + content + ')' : '' );
    }

    generateVariantName( name: string, dict: KeywordDictionary ): string  {
        return ( dict.variant[ 0 ] || 'Variant' ) +
            Symbols.TITLE_SEPARATOR + ' ' + name;
    }

}