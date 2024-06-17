import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import * as ts from 'typescript';

export const noTypeAssertion = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    return {
      ['TSAsExpression']: (node: TSESTree.Node) => {
        console.log(node.type);
        context.report({
          messageId: "noTypeAssertion",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        '型アサーション禁止',
    },
    messages: {
      noTypeAssertion: "型アサーションはあかんて",
    },
    type: 'problem',
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
});
