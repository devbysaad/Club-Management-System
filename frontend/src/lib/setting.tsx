export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin", "teacher", "student", "parent"],
  "/list/teachers": ["admin", "teacher", "student", "parent"], // Students and parents can see coaches
  "/list/students": ["admin", "teacher", "student", "parent"], // Students can see other students, parents can see their children
  "/list/parents": ["admin", "teacher"],
  "/list/classes": ["admin", "teacher"],
  "/list/attendance": ["admin", "teacher", "student", "parent"],
  "/list/events": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
};