import { RuleTester } from '@typescript-eslint/rule-tester';
import { noNullInTemplateLiteral } from "../rules/noNullInTemplateLiteral"
import { noTypeAssertion } from '../rules/noTypeAssertion';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run("no-type-assetion", noTypeAssertion, {
  valid: [
    {
      code: `
        import { foo as bar } from 'foo';
      `,
    },
  ],
  invalid: [
    {
      code: `
        const foo = 'foo' as string;
      `,
      errors: [{ messageId: "noTypeAssertion" }],
    },
    {
      code: `
        const foo = 'foo' as any;
      `,
      errors: [{ messageId: "noTypeAssertion" }],
    },
    {
      code: `
        someFunc('foo' as unknown);
      `,
      errors: [{ messageId: "noTypeAssertion" }],
    },
  ],
});