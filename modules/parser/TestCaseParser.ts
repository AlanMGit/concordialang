import { Scenario } from "../ast/Scenario";
import { Node } from '../ast/Node';
import { Document } from '../ast/Document';
import { SyntaticException } from '../req/SyntaticException';
import { NodeIterator } from './NodeIterator';
import { NodeParser } from './NodeParser';
import { ParsingContext } from "./ParsingContext";
import { TestCase } from "../ast/TestCase";
import { TagCollector } from "./TagCollector";

/**
 * TestCase parser
 *
 * @author Thiago Delgado Pinto
 */
export class TestCaseParser implements NodeParser< TestCase > {

    /** @inheritDoc */
    public analyze( node: TestCase, context: ParsingContext, it: NodeIterator, errors: Error[] ): boolean {

        // Has no feature and has no imports?
        if ( ! context.doc.feature
            && ( ! context.doc.imports || context.doc.imports.length < 1 ) ) {
            let e = new SyntaticException(
                'A Test Case must be declared after a Feature. Please declare or import a Feature and then declare the Test Case.', node.location );
            errors.push( e );
            return false;
        }

        // Prepares the owner to receive the testCase
        let owner = context.doc;
        if ( ! owner.testCases ) {
            owner.testCases = [];
        }

        // Adds it to the feature
        owner.testCases.push( node );

        // Adjusts the context
        context.resetInValues();
        context.inTestCase = true;
        context.currentTestCase = node;

        // Adds backward tags
        if ( ! node.tags ) {
            node.tags = [];
        }
        ( new TagCollector() ).addBackwardTags( it, node.tags );

        return true;
    }

}