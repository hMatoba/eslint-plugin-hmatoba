import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import * as ts from 'typescript';

export const noNullInTemplateLiteral = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    return {
      ['TemplateLiteral > Identifier, TemplateLiteral > MemberExpression > Identifier.property']: (node: TSESTree.Node) => {
        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker();
        const type = services.getTypeAtLocation(node);

        if (node.type !== 'Identifier') {
          return;
        }

        if (hasNullOrUndefined(type, checker)) {
          context.report({
            messageId: "nullishInTemplateLiteral",
            node,
          });
        }
      },
      ['TemplateLiteral MemberExpression[optional=true]']: (node: TSESTree.Node) => {
        context.report({
          messageId: "optionalChainInTemplateLiteral",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        'null(or undefined) should not is in template literal.',
    },
    messages: {
      nullishInTemplateLiteral: "'null(or undefined)' in template literal.",
      optionalChainInTemplateLiteral: "'template literal includes optional chain.",
    },
    type: 'suggestion',
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
});

function hasNullOrUndefined(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (type.isUnion()) {
    return type.types.some((type) => {
      const _type = checker.typeToString(type);
      return _type === 'null' || _type === 'undefined'
    });
  }
  const _type = checker.typeToString(type);
  return _type === 'null' || _type === 'undefined'
};