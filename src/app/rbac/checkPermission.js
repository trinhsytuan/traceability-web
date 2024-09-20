export function checkPermission(permissionGranted, url = "", type, type_org) {
  if (permissionGranted) {
    if (
      permissionGranted.hasOwnProperty("is_admin") ||
      (permissionGranted.hasOwnProperty(url) && permissionGranted[url].xem) ||
      url === "all"
    ) {
      if (Array.isArray(type_org)) {
        if (type_org.includes(type) && type_org.length > 0) {
          return true;
        }
        return false;
      }
      return true;
    } else {
      return false;
    }
  } else {
    if (url === "all") {
      return true;
    }
    return false;
  }
}
