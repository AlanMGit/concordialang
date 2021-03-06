"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UI_1 = require("./UI");
const PluginController_1 = require("../plugin/PluginController");
const CLI_1 = require("./CLI");
const CompilerController_1 = require("./CompilerController");
const LanguageController_1 = require("./LanguageController");
const PluginManager_1 = require("../plugin/PluginManager");
const TestScriptExecution_1 = require("../testscript/TestScriptExecution");
const CliScriptExecutionReporter_1 = require("./CliScriptExecutionReporter");
const ATSGenController_1 = require("./ATSGenController");
const TestScriptOptions_1 = require("../testscript/TestScriptOptions");
const CliHelp_1 = require("./CliHelp");
const OptionsHandler_1 = require("./OptionsHandler");
const meow = require("meow");
const updateNotifier = require("update-notifier");
/**
 * Application controller
 *
 * @author Thiago Delgado Pinto
 */
class AppController {
    start(appPath, processPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const cli = new CLI_1.CLI();
            const cliHelp = new CliHelp_1.CliHelp();
            const meowInstance = meow(cliHelp.content(), cliHelp.meowOptions());
            const optionsHandler = new OptionsHandler_1.OptionsHandler(appPath, processPath, cli, meowInstance);
            let options;
            // Load options
            try {
                options = yield optionsHandler.load();
            }
            catch (err) {
                this.showException(err, options, cli);
                return false; // exit
            }
            // Save config ?
            if (options.saveConfig) {
                try {
                    yield optionsHandler.save();
                }
                catch (err) {
                    this.showException(err, options, cli);
                    // continue!
                }
            }
            let ui = new UI_1.UI(cli, meowInstance);
            //console.log( options );
            if (options.help) {
                ui.showHelp();
                return true;
            }
            if (options.about) {
                ui.showAbout();
                return true;
            }
            if (options.version) {
                ui.showVersion();
                return true;
            }
            const pkg = meowInstance.pkg; // require( './package.json' );
            const oneDay = 1000 * 60 * 60 * 24;
            const notifier = updateNotifier({
                pkg,
                updateCheckInterval: oneDay
            });
            notifier.notify();
            if (options.newer) {
                if (!notifier.update) {
                    cli.newLine(cli.symbolInfo, 'No update available');
                }
                return true;
            }
            let pluginData = null;
            let pluginManager = new PluginManager_1.PluginManager(options.pluginDir);
            let plugin = null;
            if (options.somePluginOption()) {
                let pluginController = new PluginController_1.PluginController(cli);
                try {
                    yield pluginController.process(options);
                }
                catch (err) {
                    this.showException(err, options, cli);
                    return false;
                }
                return true;
            }
            else if (options.someOptionThatRequiresAPlugin() && options.hasPluginName()) {
                try {
                    pluginData = yield pluginManager.pluginWithName(options.plugin);
                    if (!pluginData) {
                        cli.newLine(cli.symbolError, 'Plugin "' + options.plugin + '" not found at "' + options.pluginDir + '".');
                        return true;
                    }
                    plugin = yield pluginManager.load(pluginData);
                }
                catch (err) {
                    this.showException(err, options, cli);
                    return false;
                }
                if (!pluginData) { // needed?
                    cli.newLine(cli.symbolError, 'Plugin not found:', options.plugin);
                    return false;
                }
                if (!plugin) { // needed?
                    cli.newLine(cli.symbolError, 'Could not load the plugin:', options.plugin);
                    return false;
                }
                // can continue
            }
            if (options.languageList) {
                let langController = new LanguageController_1.LanguageController(cli);
                try {
                    yield langController.process(options);
                }
                catch (err) {
                    this.showException(err, options, cli);
                    return false;
                }
                return true;
            }
            let hasErrors = false;
            let spec = null;
            let graph = null;
            if (options.compileSpecification) {
                if (!options.generateTestCase) {
                    cli.newLine(cli.symbolInfo, 'Test Case generation disabled.');
                }
                let compilerController = new CompilerController_1.CompilerController();
                try {
                    [spec, graph] = yield compilerController.compile(options, cli);
                }
                catch (err) {
                    hasErrors = true;
                    this.showException(err, options, cli);
                }
            }
            else {
                cli.newLine(cli.symbolInfo, 'Specification compilation disabled.');
            }
            //cli.newLine( '-=[ SPEC ]=-', "\n\n" );
            //cli.newLine( spec );
            if (!plugin && (options.generateScript || options.executeScript || options.analyzeResult)) {
                cli.newLine(cli.symbolWarning, 'A plugin was not defined.');
                return true;
            }
            if (spec !== null) {
                if (options.generateScript) { // Requires a plugin
                    const atsCtrl = new ATSGenController_1.ATSGenController();
                    let abstractTestScripts = atsCtrl.generate(spec);
                    if (abstractTestScripts.length > 0) {
                        // cli.newLine( cli.symbolInfo, 'Generated', abstractTestScripts.length, 'abstract test scripts' );
                        let errors = [];
                        let files = [];
                        try {
                            files = yield plugin.generateCode(abstractTestScripts, new TestScriptOptions_1.TestScriptGenerationOptions(options.dirScript, options.dirResult), errors);
                        }
                        catch (err) {
                            hasErrors = true;
                            this.showException(err, options, cli);
                        }
                        for (let file of files) {
                            cli.newLine(cli.symbolSuccess, 'Generated script', cli.colorHighlight(file));
                        }
                        for (let err of errors) {
                            cli.newLine(cli.symbolError, err.message);
                        }
                    }
                    else {
                        cli.newLine(cli.symbolInfo, 'No generated abstract test scripts.');
                    }
                }
                else {
                    cli.newLine(cli.symbolInfo, 'Script generation disabled.');
                }
            }
            let executionResult = null;
            if (options.executeScript) { // Requires a plugin
                let tseo = new TestScriptExecution_1.TestScriptExecutionOptions(options.dirScript, options.dirResult);
                cli.newLine(cli.symbolInfo, 'Executing test scripts...');
                const LINE_SIZE = 80;
                const SEPARATION_LINE = '_'.repeat(LINE_SIZE);
                cli.newLine(SEPARATION_LINE);
                try {
                    executionResult = yield plugin.executeCode(tseo);
                }
                catch (err) {
                    hasErrors = true;
                    this.showException(err, options, cli);
                }
            }
            else {
                cli.newLine(cli.symbolInfo, 'Script execution disabled.');
            }
            if (options.analyzeResult) { // Requires a plugin
                if (!executionResult) {
                    cli.newLine(cli.symbolError, 'Could not retrieve execution results.');
                    return false;
                }
                try {
                    executionResult = yield plugin.convertReportFile(executionResult.sourceFile);
                    (new CliScriptExecutionReporter_1.CliScriptExecutionReporter(cli)).scriptExecuted(executionResult);
                }
                catch (err) {
                    hasErrors = true;
                    this.showException(err, options, cli);
                }
            }
            else {
                cli.newLine(cli.symbolInfo, 'Results\' analysis disabled.');
            }
            if (!options.compileSpecification
                && !options.generateTestCase
                && !options.generateScript
                && !options.executeScript
                && !options.analyzeResult) {
                cli.newLine(cli.symbolWarning, 'Well, you have disabled all the interesting behavior. :)');
            }
            return !hasErrors;
        });
    }
    showException(err, options, cli) {
        (!options ? true : options.debug)
            ? cli.newLine(cli.symbolError, err.message, this.formattedStackOf(err))
            : cli.newLine(cli.symbolError, err.message);
    }
    formattedStackOf(err) {
        return "\n  DETAILS: " + err.stack.substring(err.stack.indexOf("\n"));
    }
}
exports.AppController = AppController;
