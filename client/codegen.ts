import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: ['src/**/*.graphql', 'src/**/*.gql'],
  ignoreNoDocuments: false,
  generates: {
    './src/gql/': {
      preset: 'client',
      config : {
        documentMode: 'string',
        useTypeImports: true
      },
      presetConfig:{
        fragmentMasking: false
      }
    },
    './src/gql/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  },
};

export default config;
