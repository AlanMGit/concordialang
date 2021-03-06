"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test Scenario
 *
 * @author Thiago Delgado Pinto
 */
class TestScenario {
    constructor() {
        /**
         * When the respective Feature or Variant has a tag `ignore`,
         * the Test Scenario must be ignored for Test Case generation.
         * Even though, it can be used to replace preconditions' states
         * and state calls.
         */
        this.ignoreForTestCaseGeneration = false;
        /**
         * Step after state preconditions. Precondition steps must be
         * the first ones in a Variant. So this makes a reference to
         * the step after all preconditions, in order to allow ignoring
         * them, which is needed for State Calls.
         */
        this.stepAfterPreconditions = null;
        this.steps = [];
    }
    clone() {
        let ts = new TestScenario();
        ts.steps = this.steps.slice(0); // copy the array, but do not clone the steps
        ts.ignoreForTestCaseGeneration = this.ignoreForTestCaseGeneration;
        ts.stepAfterPreconditions = this.stepAfterPreconditions;
        return ts;
    }
    stepsWithoutPreconditions() {
        if (null === this.stepAfterPreconditions) {
            return this.steps;
        }
        let subset = [];
        let canAdd = false;
        for (let step of this.steps) {
            if (!canAdd && step === this.stepAfterPreconditions) {
                canAdd = true;
            }
            if (canAdd) {
                subset.push(step);
            }
        }
        return subset;
    }
}
exports.TestScenario = TestScenario;
