import { NamedNode } from './Node';
import { MayHaveTags } from './Tag';
import { Step } from './Step';
import { VariantLike, State } from './VariantLike';

/**
 * Variant
 *
 * @see VariantLike
 *
 * @author Thiago Delgado Pinto
 */
export interface Variant extends VariantLike, NamedNode, MayHaveTags {

    // Detected during test scenario generation:
    postconditions?: State[];
}

/**
 * Test Case
 *
 * @author Thiago Delgado Pinto
 */
export interface TestCase extends Variant {
}


export function instanceOfVariant( obj: any ): obj is Variant {
    return 'postconditions' in obj;
}