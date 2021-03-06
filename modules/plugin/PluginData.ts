/**
 * Test script plugin data.
 *
 * @author Thiago Delgado Pinto
 */
export interface PluginData {

    /** true if the plugin is fake (i.e. for demonstration purposes). */
    isFake: boolean;

    /** plugin name. */
    name: string;

    /** plugin description. */
    description: string;

    /** plugin version. */
    version: string;

    /** target technologies (e.g. frameworks). */
    targets: string[];

    /** authors of the plugin. */
    authors: string[];

    /** main file path */
    file: string;

    /** main class */
    class: string;

    /** install command */
    install: string;

    /** uninstall command */
    uninstall: string;

    /** serve command, usually to start a server */
    serve: string;
}