import { Node } from '../ast/Node';
import { SyntaticException } from '../req/SyntaticException';
import { NodeIterator } from './NodeIterator';
import { ParsingContext } from './ParsingContext';

/**
 * Node parser
 * 
 * @author Thiago Delgado Pinto
 */
export interface NodeParser< T extends Node > {

    /**
     * Perform a syntatic analysis of the given node. ???
     * 
     * @param node Node to be analyzed.
     * @param context Parsing context.
     * @param it Node iterator.
     * @param errors Detected errors.
     */
    analyze( node: T, context: ParsingContext, it: NodeIterator, errors: Error[] ): boolean;

}