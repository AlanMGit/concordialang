"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class CliHelp {
    content() {
        const exeName = chalk_1.default.magenta('concordia');
        const NIY = chalk_1.default.red('NIY');
        /*
                return `
          ${chalk.yellowBright('Usage:')} ${exeName} [<dir>] [options]
        
          where ${chalk.yellow('<dir>')} is the directory that contains your specification files.
        
          ${chalk.yellowBright('Options:')}
        
          ${chalk.gray('Input directories and files')}
        
          -d,  --directory <value>               Directory to search.
          -nr, --no-recursive                    Disable recursive search.
          -e,  --encoding <value>                File encoding. Default is "utf8".
          -x,  --extensions <".ext1,.ext2,...">  File extensions to consider (when <dir> is informed).
          -i,  --ignore <"file1,file2,...">      Files to ignore, when <dir> is informed.
          -f,  --files <"file1,file2,...">       Files to consider, instead of <dir>.
        
          -l,  --language <code>                 Default language. Default is "en" (english).
          -ll, --language-list                   List available languages.
        
          ${chalk.gray('Plug-in')}
        
          -p,  --plugin <name>                   Plug-in to use.
          -pa, --plugin-about <name>             About a plug-in.
          -pi, --plugin-install <name>           Install a plug-in.
          -pu, --plugin-uninstall <name>         Uninstall a plug-in.
          -ps, --plugin-serve <name>             Starts a test server with a plugin.
          -pl, --plugin-list                     List available plug-ins.
        
          ${chalk.gray('Processing and output')}
        
          --save-config                          Save/overwrite a configuration file
                                                 with the other command line options.
        
          -b,  --verbose                         Verbose output.
        
          -np, --no-spec                         Do not process specification files.
          -nt, --no-test-case                    Do not generate test cases.
          -ns, --no-script                       Do not generate test scripts.
          -nx, --no-run                          Do not run test scripts.
          -nu, --no-result                       Do not process execution results.
        
          -jp, --just-spec                       Just process specification files.
          -jt, --just-test-case                  Just generate test cases.
          -js, --just-script                     Just generate test scripts.
          -jx, --just-run                        Just execute test scripts.
        
          -dt, --dir-test-case                   Output directory for test cases.
          -ds, --dir-script                      Output directory for test scripts.
          -du, --dir-result                      Output directory for result files.
        
          -ef, --ext-feature                     File extension for Feature files.
                                                 Default is .feature.
          -et, --ext-test-case                   File extension for Test Case files.
                                                 Default is .testcase.
          -lb, --line-breaker                    Character used for breaking lines.
        
          ${chalk.gray('Content generation')}
        
          --case-ui (camel|pascal|snake|kebab|none)
                                                 String case to use for UI Element names
                                                 when they are not defined (default is camel).
          --case-method (camel|pascal|snake|kebab|none)
                                                 String case to use for test script methods
                                                 (default is snake).
          --tc-suppress-header                   Suppress header in generated Test Case files.
          --tc-indenter <value>                  String used as indenter in generated Test Case
                                                 files (default is double spaces).
        
          ${chalk.gray('Randomic value generation')}
        
          --seed <value>                         Use the given random seed. Default is current
                                                 date and time.
          --random-min-string-size <number>      Minimum random string size. Default is 0.
          --random-max-string-size <number>      Minimum random string size. Default is 500.
          --random-tries <number>                Random tries to generate invalid values.
                                                 Default is 5.
        
          ${chalk.gray('Specification filtering')}
        
          --importance <number>                  Sets the default importance value.
          --sel-min-feature <number>             Minimum feature importance.  ${NIY}
          --sel-max-feature <number>             Maximum feature importance.  ${NIY}
          --sel-min-scenario <number>            Minimum scenario importance. ${NIY}
          --sel-max-scenario <number>            Maximum scenario importance. ${NIY}
          --sel-filter <filter>                  Filter by tag. ${NIY}
        
          ${chalk.gray('Combination strategies')}
        
          --comb-variant (random|first|fmi|all)  Strategy to select variants to combine,
                                                 by their states.
                random  = random variant that has the state (default)
                first   = first variant that has the state
                fmi     = first most important variant that has the state
                all     = all variants that have the state
        
          --comb-state (sre|sow|onewise|all)     Strategy to combine states of a
                                                 same variant.
                sre     = single random of each (default)
                sow     = shuffled one-wise
                ow      = one-wise
                all     = all
        
          --comb-invalid (node|0|1|smart|random|all)
                                                 How many input data will be invalid
                                                 in each test case.
                0,none  = no invalid data
                1       = one invalid data per test case
                smart   = use algorithm to decide (default)
                random  = random invalid data per test case
                all     = all invalid
        
          --comb-data (sre|sow|onewise|all)     Strategy to combine data test cases
                                                of a variant.
                sre     = single random of each (default)
                sow     = shuffled one-wise
                ow      = one-wise
                all     = all
        
          ${chalk.gray('Test script execution filtering (depends on the used plugin)')}
        
          --run-min-feature <number>             Minimum feature importance. ${NIY}
          --run-max-feature <number>             Maximum feature importance. ${NIY}
          --run-min-scenario <number>            Minimum scenario importance. ${NIY}
          --run-max-scenario <number>            Maximum scenario importance. ${NIY}
          --run-filter <filter>                  Filter by tag. ${NIY}
        
          ${chalk.gray('Information')}
        
          -v,  --version                         Show current version.
          -a,  --about                           Show information about this application.
          -h,  --help                            Show this help.
          -n,  --newer                           Check for newer versions. ${NIY}
        
          ${chalk.yellowBright('Examples')}
        
           $ ${exeName} --plugin some-plugin
           $ ${exeName} path/to/dir --no-test-case --no-script -p some-plugin
           $ ${exeName} --files "file1.feature,path/to/file2.feature" -p some-plugin -l pt
        `;
        */
        return `
${chalk_1.default.yellowBright('Usage:')} ${exeName} [<dir>] [options]

where ${chalk_1.default.yellow('<dir>')} is the directory that contains your specification files.

${chalk_1.default.yellowBright('Options:')}

${chalk_1.default.gray('Input directories and files')}

-d,  --directory <value>               Directory to search.
-nr, --no-recursive                    Disable recursive search.
-e,  --encoding <value>                File encoding. Default is "utf8".
-x,  --extensions <".ext1,.ext2,...">  File extensions to consider (when <dir> is informed).
-i,  --ignore <"file1,file2,...">      Files to ignore, when <dir> is informed.
-f,  --files <"file1,file2,...">       Files to consider, instead of <dir>.

-l,  --language <code>                 Default language. Default is "en" (english).
-ll, --language-list                   List available languages.

${chalk_1.default.gray('Plug-in')}

-p,  --plugin <name>                   Plug-in to use.
-pa, --plugin-about <name>             About a plug-in.
-pi, --plugin-install <name>           Install a plug-in.
-pu, --plugin-uninstall <name>         Uninstall a plug-in.
-ps, --plugin-serve <name>             Starts a test server with a plugin.
-pl, --plugin-list                     List available plug-ins.

${chalk_1.default.gray('Processing and output')}

--save-config                          Save/overwrite a configuration file
                                       with the other command line options.

-b,  --verbose                         Verbose output.

-np, --no-spec                         Do not process specification files.
-nt, --no-test-case                    Do not generate test cases.
-ns, --no-script                       Do not generate test scripts.
-nx, --no-run                          Do not run test scripts.
-nu, --no-result                       Do not process execution results.

-jp, --just-spec                       Just process specification files.
-jt, --just-test-case                  Just generate test cases.
-js, --just-script                     Just generate test scripts.
-jx, --just-run                        Just execute test scripts.

-dt, --dir-test-case                   Output directory for test cases.
-ds, --dir-script                      Output directory for test scripts.
-du, --dir-result                      Output directory for result files.

-ef, --ext-feature                     File extension for Feature files.
                                       Default is .feature.
-et, --ext-test-case                   File extension for Test Case files.
                                       Default is .testcase.
-lb, --line-breaker                    Character used for breaking lines.

${chalk_1.default.gray('Content generation')}

--case-ui (camel|pascal|snake|kebab|none)
                                       String case to use for UI Element names
                                       when they are not defined (default is camel).
--case-method (camel|pascal|snake|kebab|none)
                                       String case to use for test script methods
                                       (default is snake).
--tc-suppress-header                   Suppress header in generated Test Case files.
--tc-indenter <value>                  String used as indenter in generated Test Case
                                       files (default is double spaces).

${chalk_1.default.gray('Randomic value generation')}

--seed <value>                         Use the given random seed. Default is current
                                       date and time.
--random-min-string-size <number>      Minimum random string size. Default is 0.
--random-max-string-size <number>      Minimum random string size. Default is 500.
--random-tries <number>                Random tries to generate invalid values.
                                       Default is 5.

${chalk_1.default.gray('Combination strategies')}

--comb-variant (random|first|fmi|all)  Strategy to select variants to combine,
                                       by their states.
      random  = random variant that has the state (default)
      first   = first variant that has the state
      fmi     = first most important variant that has the state
      all     = all variants that have the state

--comb-state (sre|sow|onewise|all)     Strategy to combine states of a
                                       same variant.
      sre     = single random of each (default)
      sow     = shuffled one-wise
      ow      = one-wise
      all     = all

--comb-invalid (node|0|1|smart|random|all)
                                       How many input data will be invalid
                                       in each test case.
      0,none  = no invalid data
      1       = one invalid data per test case
      smart   = use algorithm to decide (default)
      random  = random invalid data per test case
      all     = all invalid

--comb-data (sre|sow|onewise|all)     Strategy to combine data test cases
                                      of a variant.
      sre     = single random of each (default)
      sow     = shuffled one-wise
      ow      = one-wise
      all     = all

${chalk_1.default.gray('Information')}

-v,  --version                         Show current version.
-a,  --about                           Show information about this application.
-h,  --help                            Show this help.

${chalk_1.default.yellowBright('Examples')}

 $ ${exeName} --plugin some-plugin
 $ ${exeName} path/to/dir --no-test-case --no-script -p some-plugin
 $ ${exeName} --files "file1.feature,path/to/file2.feature" -p some-plugin -l pt
`;
    }
    // meowNewOptions(): object {
    //     return {
    //         flags: {
    //             // INPUT DIRECTORIES AND FILES
    //             directory: { type: 'string', alias: 'd' },
    //             noRecursive: { type: 'boolean', alias: 'nr' },
    //             encoding: { type: 'string', alias: 'e' },
    //             extensions: { type: 'string', alias: 'x' },
    //             ignore: { type: 'string', alias: 'i' },
    //             files: { type: 'string', alias: 'f' },
    //             language: { type: 'string', alias: 'l' },
    //             languageList: { type: 'boolean', alias: 'll' },
    //             // PLUG-IN
    //             plugin: { type: 'string', alias: 'p' },
    //             pluginAbout: { type: 'string', alias: 'pa' },
    //             pluginInstall: { type: 'string', alias: 'pi' },
    //             pluginUninstall: { type: 'string', alias: 'pu' },
    //             pluginList: { type: 'boolean', alias: 'pl' },
    //             // PROCESSING AND OUTPUT
    //             verbose: { type: 'boolean', alias: 'b' },
    //             noSpec: { type: 'boolean', alias: 'np' },
    //             noTestCases: { type: 'boolean', alias: 'nt' },
    //             noScripts: { type: 'boolean', alias: 'ns' },
    //             noRun: { type: 'boolean', alias: 'nr' },
    //             noResults: { type: 'boolean', alias: 'nu' },
    //             justSpec: { type: 'boolean', alias: 'jp' },
    //             justTestCases: { type: 'boolean', alias: 'jt' },
    //             justScripts: { type: 'boolean', alias: 'js' },
    //             justRun: { type: 'boolean', alias: 'jx' },
    //             dirTestCases: { type: 'string', alias: 'dt' },
    //             dirScripts: { type: 'string', alias: 'ds' },
    //             dirResults: { type: 'string', alias: 'du' },
    //             extFeature: { type: 'string', alias: 'ef' },
    //             extTestCases: { type: 'string', alias: 'et' },
    //             lineBreaker: { type: 'string', alias: 'lb' },
    //             // CONTENT GENERATION
    //             caseUi: { type: 'string' },
    //             caseMethod: { type: 'string' },
    //             tcSuppressHeader: { type: 'boolean' },
    //             tcIndenter: { type: 'string' },
    //             // RANDOMIC GENERATION
    //             seed: { type: 'string' },
    //             randomMinStringSize: { type: 'integer' },
    //             randomMaxStringSize: { type: 'integer' },
    //             randomTries: { type: 'integer' },
    //             // SPECIFICATION FILTERING
    //             importance: { type: 'integer' },
    //             selMinFeature: { type: 'integer' },
    //             selMaxFeature: { type: 'integer' },
    //             selMinScenario: { type: 'integer' },
    //             selMaxScenario: { type: 'integer' },
    //             selFilter: { type: 'string' },
    //             // COMBINATION STRATEGIES
    //             combVariant: { type: 'string' },
    //             combState: { type: 'string' },
    //             combInvalid: { type: 'string' },
    //             combData: { type: 'string' },
    //             // TEST SCRIPT FILTERING
    //             runMinFeature: { type: 'integer' },
    //             runMaxFeature: { type: 'integer' },
    //             runMinScenario: { type: 'integer' },
    //             runMaxScenario: { type: 'integer' },
    //             runFilter: { type: 'string' },
    //             // INFO
    //             help: { alias: 'h', type: 'boolean' },
    //             about: { alias: 'a', type: 'boolean' },
    //             version: { alias: 'v', type: 'boolean' },
    //             newer: { alias: 'n', type: 'boolean' },
    //         }
    //     };
    // }
    meowOptions() {
        return {
            alias: {
                // FILES
                d: 'directory',
                nr: 'no-recursive',
                e: 'encoding',
                x: 'extensions',
                i: 'ignore',
                f: 'files',
                // LANGUAGE
                l: 'language',
                ll: 'language-list',
                // PLUGIN
                p: 'plugin',
                pa: 'plugin-about',
                pi: 'plugin-install',
                pu: 'plugin-uninstall',
                ps: 'plugin-serve',
                pl: 'plugin-list',
                // PROCESSING
                b: 'verbose',
                ff: 'fail-fast',
                np: 'no-spec',
                nt: 'no-test-case',
                ns: 'no-script',
                nx: 'no-run',
                nu: 'no-result',
                jp: 'just-spec',
                jt: 'just-test-case',
                js: 'just-script',
                jx: 'just-run',
                dt: 'dir-test-case',
                ds: 'dir-script',
                du: 'dir-result',
                lb: 'line-breaker',
                // INFO
                h: 'help',
                a: 'about',
                v: 'version',
                n: 'newer'
            }
        };
    }
}
exports.CliHelp = CliHelp;
//# sourceMappingURL=CliHelp.js.map