import { RuleTester } from '@typescript-eslint/rule-tester';
import { noNullInTemplateLiteral } from "../rules/noNullInTemplateLiteral"

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run("no-null-in-template-literal", noNullInTemplateLiteral, {
  valid: [
    { code: "console.log('foo');" },
    { code: "console.log(null);" },
    { code: `
      declare const foo: string;
      console.log(\`\${foo}\`);
    `},
    {
      code: `
        declare type Foo = { a: string; b?: string };
        declare const foo: Foo;
        console.log(\`\${foo.a}\`);
      `,
    },
    {
      code: `
        declare type Foo = { a: { b: string } };
        declare const foo: Foo;
        console.log(\`\${foo.a.b}\`);
      `,
    },
  ],
  invalid: [
    {
      code: `
        const foo = null;
        console.log(\`\${foo}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare const foo: null;
        console.log(\`\${foo}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare const foo: string | number | null;
        console.log(\`\${foo}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare const foo: string | number | undefined;
        console.log(\`/foo/\${foo}/foo\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare type Foo = { a: string; b?: string };
        declare const foo: Foo;
        console.log(\`\${foo.b}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare type Foo = { a: string; b: string | undefined };
        declare const foo: Foo;
        console.log(\`\${foo.b}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare type Foo = { a: string; b: null };
        declare const foo: Foo;
        console.log(\`\${foo.b}\`);
      `,
      errors: [{ messageId: "nullishInTemplateLiteral" }],
    },
    {
      code: `
        declare type Foo = { a?: { b?: string } };
        declare const foo: Foo;
        console.log(\`\${foo?.a?.b}\`);
      `,
      errors: [{ messageId: "optionalChainInTemplateLiteral" }, { messageId: "optionalChainInTemplateLiteral" }],
    },
    {
      code: `
        declare const foo: any;
        console.log(\`\${foo.a?.b.c}\`);
      `,
      errors: [{ messageId: "optionalChainInTemplateLiteral" }],
    },
    {
      code: `
      declare const foo: any;
      console.log(\`\${foo.a.b?.c}\`);
    `,
      errors: [{ messageId: "optionalChainInTemplateLiteral" }],
    },
    {
      code: `
      declare const foo: any;
      console.log(\`\${foo?.a.b.c}\`);
    `,
      errors: [{ messageId: "optionalChainInTemplateLiteral" }],
    },
  ],
});