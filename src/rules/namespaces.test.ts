import { rule } from "./namespaces.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("namespaces", rule, {
	invalid: [
		{
			code: `module Values {}`,
			errors: [
				{
					column: 1,
					endColumn: 17,
					endLine: 1,
					line: 1,
					messageId: "namespace",
				},
			],
		},
		{
			code: `module Values.Inner {}`,
			errors: [
				{
					column: 1,
					endColumn: 23,
					endLine: 1,
					line: 1,
					messageId: "namespace",
				},
			],
		},
		{
			code: `namespace Values {}`,
			errors: [
				{
					column: 1,
					endColumn: 20,
					endLine: 1,
					line: 1,
					messageId: "namespace",
				},
			],
		},
		{
			code: `namespace Values.Inner {}`,
			errors: [
				{
					column: 1,
					endColumn: 26,
					endLine: 1,
					line: 1,
					messageId: "namespace",
				},
			],
		},
	],
	valid: [
		`const Values = {};`,
		`module 'values' {}`,
		"declare module Values {}",
		"declare namespace Values {}",
	],
});
