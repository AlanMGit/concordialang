import { Language } from '../ast/Language';
import { Node } from '../ast/Node';
import { Document } from '../ast/Document';
import { SyntaticException } from '../SyntaticException';
import { NodeIterator } from './NodeIterator';
import { NodeParser } from './NodeParser';
import { ParsingContext } from "./ParsingContext";

export class LanguageParser implements NodeParser< Language > {

    public analyze( node: Language, context: ParsingContext, it: NodeIterator, errors: Error[] ): boolean {

        // Checks if it is already declared
        if ( context.doc.language ) {
            let e = new SyntaticException( 'Just one language declaration is allowed.', node.location );
            errors.push( e );
            return false;
        }

        // Checks if it has a feature declared before it
        if ( context.doc.feature ) {
            let e = new SyntaticException( 'The language must be declared before a feature.', node.location );
            errors.push( e );
            return false;
        }        

        context.doc.language = node;

        return true;
    }

}