/**
 * Keyword dictionary
 * 
 * @author Thiago Delgado Pinto
 */
export interface KeywordDictionary {

    // Non-Gherkin keywords
    
    import?: Array< string >,

    // Gherkin keywords

    language?: Array< string >,

    feature?: Array< string >,

    step?: Array< string >,
    stepGiven?: Array< string >,
    stepWhen?: Array< string >,
    stepThen?: Array< string >,
    stepAnd?: Array< string >,
    stepBut?: Array< string >,

    scenario?: Array< string >,
    background?: Array< string >,
    outline?: Array< string >,
    examples?: Array< string >

}