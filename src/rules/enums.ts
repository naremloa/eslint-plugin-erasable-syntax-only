import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		const sourceCode = context.sourceCode;
		return {
			TSEnumDeclaration(node) {
				const name = node.id.name;
				const isExported =
					node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration;
				const EOL = sourceCode.text.includes("\r\n") ? "\r\n" : "\n";
				const body: { content: string; range: [number, number] }[] = [];

				let previousMemberNumericValue = -1;
				for (const enumMember of node.body.members) {
					if (
						enumMember.id.type !== AST_NODE_TYPES.Identifier &&
						(enumMember.id.type !== AST_NODE_TYPES.Literal ||
							typeof enumMember.id.value !== "string")
					) {
						return;
					}
					const propertyName =
						enumMember.id.type === AST_NODE_TYPES.Identifier
							? enumMember.id.name
							: enumMember.id.value;
					const value =
						enumMember.initializer?.type === AST_NODE_TYPES.Literal
							? enumMember.initializer.value
							: previousMemberNumericValue + 1;

					if (value === null) {
						return;
					}

					body.push({
						content: `${propertyName}: ${typeof value === "string" ? `'${value}'` : value.toString()}`,
						range: enumMember.range,
					});
					if (typeof value === "number") {
						previousMemberNumericValue = value;
					}
				}

				context.report({
					messageId: "enum",
					node,
					suggest: [
						{
							fix(fixer) {
								return [
									fixer.replaceTextRange(
										[node.range[0], node.range[0] + 4],
										"const",
									),
									fixer.insertTextBefore(node.body, "= "),
									...body.map(({ content, range }) =>
										fixer.replaceTextRange(range, content),
									),
									fixer.insertTextAfter(node.body, " as const"),
									fixer.insertTextAfter(
										node.parent.parent ?? node.parent,
										`${EOL}${EOL}${isExported ? "export " : ""}type ${name} = typeof ${name}[keyof typeof ${name}]`,
									),
								];
							},
							messageId: "enumFix",
						},
					],
				});
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's enums.",
		},
		hasSuggestions: true,
		messages: {
			enum: "This enum will not be allowed under TypeScript's --erasableSyntaxOnly.",
			enumFix: "Replace enum with an equivalent object literal.",
		},
		schema: [],
		type: "problem",
	},
	name: "enums",
});
