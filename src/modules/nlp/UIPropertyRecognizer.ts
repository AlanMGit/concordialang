import { RuleBuilder, UI_PROPERTY_SYNTAX_RULES, DEFAULT_UI_PROPERTY_SYNTAX_RULE } from './SyntaxRules';
import { Intents } from './Intents';
import { NodeSentenceRecognizer, NLPResultProcessor } from "./NodeSentenceRecognizer";
import { UIProperty } from "../ast/UIElement";
import { LocatedException } from "../req/LocatedException";
import { ContentNode } from "../ast/Node";
import { NLPResult, NLP } from "./NLP";
import { NLPException } from "./NLPException";
import { Entities } from "./Entities";
import { Warning } from "../req/Warning";

/**
 * UI element property sentence recognizer.
 * 
 * @author Thiago Delgado Pinto
 */
export class UIPropertyRecognizer {

    private _syntaxRules: any[];

    constructor( private _nlp: NLP ) {
        this._syntaxRules = this.buildSyntaxRules();
    }    

    /**
     * Recognize sentences of UI Elements using NLP.
     * 
     * @param nodes Nodes to be recognized.
     * @param errors Output errors.
     * @param warnings Output warnings.
     * 
     * @throws Error If the NLP is not trained.
     */
    recognizeSentences(
        nodes: UIProperty[],
        errors: LocatedException[],
        warnings: LocatedException[]        
    ) {
        //console.log( nodes );

        const recognizer = new NodeSentenceRecognizer( this._nlp );
        const syntaxRules = this._syntaxRules;

        let processor: NLPResultProcessor = function(
            node: ContentNode,
            r: NLPResult,
            errors: LocatedException[],
            warnings: LocatedException[]
        ) {

            const recognizedEntityNames: string[] = r.entities.map( e => e.entity );

            // Must have a UI Property
            const propertyIndex: number = recognizedEntityNames.indexOf( Entities.UI_PROPERTY );
            if ( propertyIndex < 0 ) {
                const msg = 'Unrecognized property in the sentence "' + node.content + '".';
                errors.push( new NLPException( msg, node.location ) );
                return;
            }
            const property: string = r.entities[ propertyIndex ].value;

            // Validating
            recognizer.validate( node, recognizedEntityNames, syntaxRules, property, errors, warnings );

            // Getting the values
            let item: UIProperty = node as UIProperty;
            item.property = property;
            item.values = r.entities.filter( ( e, i ) => i !== propertyIndex ).map( e => e.value );
        };

        const TARGET_INTENT = Intents.UI;
        const TARGET_NAME = 'UI Element';        
        recognizer.recognize( nodes, TARGET_INTENT, TARGET_NAME, errors, warnings, processor );
    }


    public buildSyntaxRules(): object[] {
        return ( new RuleBuilder() ).build( UI_PROPERTY_SYNTAX_RULES, DEFAULT_UI_PROPERTY_SYNTAX_RULE );
    }

}