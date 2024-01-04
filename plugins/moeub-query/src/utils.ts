export const trimMarkdownGrammar = (s: string) =>
  s.replaceAll(/(\[|\]|\*|\_|\-|\(|\)|\[|\]|<\w*(\\|)>|<|>)/g, "");
