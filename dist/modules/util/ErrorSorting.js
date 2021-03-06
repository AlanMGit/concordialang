"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Warning_1 = require("../req/Warning");
function sortErrorsByLocation(errors) {
    return Array.sort(errors, (a, b) => {
        if (a.location && b.location) {
            // Compare the line
            let lineDiff = a.location.line - b.location.line;
            if (0 === lineDiff) { // Same line, so let's compare the column
                return a.location.column - b.location.column;
            }
            return lineDiff;
        }
        // No location, so let's compare the error type
        const warningName = (new Warning_1.Warning()).name;
        const aIsWarning = a.name === warningName;
        const bIsWarning = b.name === warningName;
        // Both are warnings, they are equal
        if (aIsWarning && bIsWarning) {
            return 0;
        }
        return aIsWarning ? 1 : -1;
    });
}
exports.sortErrorsByLocation = sortErrorsByLocation;
