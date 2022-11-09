import { ts, PreProcessHandler, Plugin, PluginContext, Schema } from 'dtsgenerator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const packageJson: {
    name: string;
    version: string;
    description: string;
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('./package.json');

const doNothing: Plugin = {
    meta: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
    },
    preProcess,
    postProcess,
};

// eslint-disable-next-line @typescript-eslint/require-await
async function preProcess(
    _pluginContext: PluginContext
): Promise<PreProcessHandler | undefined> {
    return (contents: Schema[]): Schema[] => {
        return contents;
    };
}

// eslint-disable-next-line @typescript-eslint/require-await
async function postProcess(
    _pluginContext: PluginContext
): Promise<ts.TransformerFactory<ts.SourceFile> | undefined> {
    return (_context: ts.TransformationContext) => (
        root: ts.SourceFile
    ): ts.SourceFile => {
        return root;
    };
}

export default doNothing;
