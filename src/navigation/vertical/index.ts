import type { VerticalNavItems } from "@/@layouts/types";
import management_navigation from "../management_navigation";
import customer_navigation from "../customer_navigation";

export default [
  ...management_navigation,
  ...customer_navigation,
] as VerticalNavItems;
