import type { TemplateDef } from "../constants";
import { ICONS } from "../constants";

export const jsScriptTemplate: TemplateDef = {
  name: "JS Script",
  icon: ICONS.jsScript,
  sections: [
    {
      name: "Data",
      fields: [{ name: "Script", type: "Multi-Line Text" }],
    },
  ],
  standardValues: {
    __Icon: ICONS.jsScript,
  },
};
