"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaticException_1 = require("../req/SyntaticException");
const NodeTypes_1 = require("../req/NodeTypes");
/**
 * Regex parser.
 *
 * @author Thiago Delgado Pinto
 */
class RegexParser {
    /** @inheritDoc */
    isAccepted(node, it) {
        const allowedPriorNodes = [
            NodeTypes_1.NodeTypes.REGEX_BLOCK,
            NodeTypes_1.NodeTypes.REGEX
        ];
        return allowedPriorNodes.indexOf(it.spyPrior().nodeType) >= 0;
    }
    /** @inheritDoc */
    handle(node, context, errors) {
        // Adjusts the node type
        node.nodeType = NodeTypes_1.NodeTypes.REGEX;
        // Checks the context
        if (!context.currentRegexBlock
            || (!context.inRegexBlock && !context.inRegex)) {
            let e = new SyntaticException_1.SyntaticException('The "' + node.nodeType + '" clause must be declared inside a Regular Expressions block.', node.location);
            errors.push(e);
            return false;
        }
        // Adjusts the context
        context.resetInValues();
        context.inRegex = true;
        // Checks the structure
        if (!context.currentRegexBlock.items) {
            context.currentRegexBlock.items = [];
        }
        // Adds the node
        context.currentRegexBlock.items.push(node);
        return true;
    }
}
exports.RegexParser = RegexParser;
