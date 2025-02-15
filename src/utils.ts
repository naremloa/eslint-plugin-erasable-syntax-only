import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
	(name) =>
		`https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only/blob/main/docs/rules/${name}.md`,
);
