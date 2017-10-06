import { Intents } from './Intents';
import { NodeSentenceRecognizer, NLPResultProcessor } from "./NodeSentenceRecognizer";
import { LocatedException } from "../req/LocatedException";
import { ContentNode } from "../ast/Node";
import { NLPResult, NLP } from "./NLP";
import { NLPException } from "./NLPException";
import { Entities } from "./Entities";
import { Warning } from "../req/Warning";
import { RuleBuilder, UI_ACTION_SYNTAX_RULES, DEFAULT_UI_ACTION_SYNTAX_RULE } from './SyntaxRules';
import { Step } from '../ast/Step';

/**
 * Test case sentence recognizer.
 * 
 * @author Thiago Delgado Pinto
 */
export class TestCaseSentenceRecognizer {

    private _syntaxRules: any[];
    
    constructor( private _nlp: NLP ) {
        this._syntaxRules = this.buildSyntaxRules();
    }

    /**
     * Recognize sentences of test cases using NLP.
     * 
     * @param language Language to be used in the recognition.
     * @param nodes Nodes to be recognized.
     * @param errors Output errors.
     * @param warnings Output warnings.
     * 
     * @throws Error If the NLP is not trained.
     */
    recognizeSentences(
        language: string,
        nodes: Step[],
        errors: LocatedException[],
        warnings: LocatedException[]        
    ) {
        const recognizer = new NodeSentenceRecognizer( this._nlp );
        const syntaxRules = this._syntaxRules;

        let processor: NLPResultProcessor = function(
            node: ContentNode,
            r: NLPResult,
            errors: LocatedException[],
            warnings: LocatedException[]
        ) {
            const recognizedEntityNames: string[] = r.entities.map( e => e.entity );

            // Must have a UI Action (? what about a state?)
            const propertyIndex: number = recognizedEntityNames.indexOf( Entities.UI_ACTION );
            if ( propertyIndex < 0 ) {
                const msg = 'Unrecognized property in the sentence "' + node.content + '".';
                errors.push( new NLPException( msg, node.location ) );
                return;
            }
            const property: string = r.entities[ propertyIndex ].value;

            // Validating
            recognizer.validate( node, recognizedEntityNames, syntaxRules, property, errors, warnings );

            // Getting the values
            let item: Step = node as Step;
            
            //item.values = r.entities.filter( ( e, i ) => i !== propertyIndex ).map( e => e.value );
        };


        recognizer.recognize( language, nodes, Intents.TEST_CASE, 'Test Case', errors, warnings, processor );
    }


    public buildSyntaxRules(): object[] {
        return ( new RuleBuilder() ).build( UI_ACTION_SYNTAX_RULES, DEFAULT_UI_ACTION_SYNTAX_RULE );
    }    

}