import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSModuleDeclaration(node) {
				if (
					!node.declare &&
					node.id.type !== AST_NODE_TYPES.Literal &&
					node.parent.type !== AST_NODE_TYPES.TSModuleDeclaration
				) {
					context.report({
						messageId: "namespace",
						node,
					});
				}
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's namespaces.",
		},
		messages: {
			namespace:
				"This namespace will not be allowed under TypeScript's --erasableSyntaxOnly.",
		},
		schema: [],
		type: "problem",
	},
	name: "namespaces",
});
