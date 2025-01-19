import customer_navigation from "@/navigation/customer_navigation";
import management_navigation from "@/navigation/management_navigation";

const flattenNavigation = (navigation: any) =>
  navigation.flatMap((item: any) =>
    item.children
      ? [{ ...item, children: undefined }, ...item.children]
      : [item]
  );

const flat_management_navigation = flattenNavigation(management_navigation);
const flat_customer_navigation = flattenNavigation(customer_navigation);
const exclude_routes = [
  "/",
  "/login",
  "/error-404",
  "/register",
  "/managements/customer/add-customer",
  "/managements/customer/edit-customer",
  "/my-profile",
];

export function isRoutesPermitted(user: any, to: any) {
  if (exclude_routes.includes(to.path)) {
    return true;
  }
  if (!user?.role) {
    return false;
  }
  let navigation: any[] = [];
  if (user.role === 99) {
    navigation = flat_customer_navigation;
  } else {
    navigation = flat_management_navigation;
  }
  const target_navigation = navigation.find((el: any) => el.to == to.name);
  if (target_navigation?.access.includes(user.role)) {
    return true;
  }
  return false;
}
