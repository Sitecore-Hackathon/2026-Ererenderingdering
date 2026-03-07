import type { ContentItem } from "../../../constants";
import { ICONS } from "../../../constants";
import { getContextScript } from "./get-context";
import { listSitesScript } from "./list-sites";
import { graphqlQueryScript } from "./graphql-query";
import { renderHtmlScript } from "./render-html";
import { getItemScript } from "./get-item";
const allExamples = [
  getContextScript,
  listSitesScript,
  graphqlQueryScript,
  renderHtmlScript,
  getItemScript,
];

export const examplesFolder: ContentItem = {
  name: "Examples",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: allExamples,
};

// Flat record used by the installer
export const EXAMPLE_SCRIPTS: Record<string, string> = Object.fromEntries(
  allExamples.map((s) => [s.name, s.fields.Script])
);
