import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSImportEqualsDeclaration(node) {
				if (
					node.moduleReference.type === AST_NODE_TYPES.TSExternalModuleReference
				) {
					context.report({
						messageId: "importAlias",
						node,
					});
				}
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's import aliases.",
		},
		messages: {
			importAlias:
				"This import alias will not be allowed under TypeScript's --erasableSyntaxOnly.",
		},
		schema: [],
		type: "problem",
	},
	name: "import-aliases",
});
