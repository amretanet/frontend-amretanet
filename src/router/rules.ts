function isProjectExpire(project: any) {
  if (project) {
    const target_date = new Date(project.periode.end_date).getTime();
    const current_date = new Date().getTime();
    const time_difference = target_date - current_date;
    const days = Math.floor(time_difference / (1000 * 60 * 60 * 24));
    const minutes = Math.floor(
      (time_difference % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (days <= 0 && minutes <= 0) {
      return true;
    }
    return false;
  }
  return false;
}
export function isRoutesPermitted(user: any, routes: string) {
  if (user && routes) {
    if (user.role === 99 && routes.includes("managements")) {
      return false;
    }
    return true;
  }
  return true;
}
