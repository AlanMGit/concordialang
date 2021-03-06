
import { BlockLexer } from "./BlockLexer";
import { NodeTypes } from "../req/NodeTypes";
import { Background } from "../ast/Background";

/**
 * Detects a Background block.
 *
 * @author Thiago Delgado Pinto
 */
export class BackgroundLexer extends BlockLexer< Background > {

    constructor( words: string[] ) {
        super( words, NodeTypes.BACKGROUND );
    }

    /** @inheritDoc */
    suggestedNextNodeTypes(): string[] {
        return [ NodeTypes.STEP_GIVEN, NodeTypes.VARIANT_BACKGROUND, NodeTypes.SCENARIO ];
    }

}