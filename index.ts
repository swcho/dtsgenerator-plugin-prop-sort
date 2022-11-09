import {
    ts,
    PreProcessHandler,
    Plugin,
    PluginContext,
    Schema,
    isJsonSchemaDraft04,
    JsonSchema,
} from 'dtsgenerator';

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
    console.log('preprocess');
    return (contents: Schema[]): Schema[] => {
        // writeFileSync('content.json', JSON.stringify(contents, null, 2));
        contents.forEach(({ content, type }) => {
            // console.log(id);
            if (typeof content === 'object') {
                if (!isJsonSchemaDraft04(content, type)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-member-access
                    const schemaMap = (content as any)['components'][
                        'schemas'
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ] as { [name: string]: JsonSchema };
                    // writeFileSync(
                    //     'schemaMap.json',
                    //     JSON.stringify(schemaMap, null, 2)
                    // );
                    Object.keys(schemaMap).forEach((name) => {
                        const schema = schemaMap[name];
                        if (typeof schema === 'object') {
                            if ('properties' in schema) {
                                const { properties } = schema;
                                if (properties) {
                                    const propertyNames =
                                        Object.keys(properties);
                                    propertyNames.sort();
                                    schema.properties = propertyNames.reduce<
                                        typeof properties
                                    >((ret, propertyName) => {
                                        ret[propertyName] =
                                            properties[propertyName];
                                        return ret;
                                    }, {});
                                    console.log(name, schema.properties);
                                }
                            }
                        }
                    });
                }
            }
        });
        return contents;
    };
}

// eslint-disable-next-line @typescript-eslint/require-await
async function postProcess(
    _pluginContext: PluginContext
): Promise<ts.TransformerFactory<ts.SourceFile> | undefined> {
    return (_context: ts.TransformationContext) =>
        (root: ts.SourceFile): ts.SourceFile => {
            return root;
        };
}

export default doNothing;
