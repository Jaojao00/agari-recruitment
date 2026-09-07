/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");

let adminPage = fs.readFileSync("src/app/admin/page.tsx", "utf8");
adminPage = adminPage.replace(/doc =>/g, "(doc: any) =>");
adminPage = adminPage.replace(/a =>/g, "(a: any) =>");
fs.writeFileSync("src/app/admin/page.tsx", adminPage);

let adminDetail = fs.readFileSync(
  "src/app/admin/applications/[id]/page.tsx",
  "utf8",
);
adminDetail = adminDetail.replace(/setStatus\(val\)/g, 'setStatus(val || "")');
fs.writeFileSync("src/app/admin/applications/[id]/page.tsx", adminDetail);

let adminReportsPage = fs.readFileSync(
  "src/app/admin/reports/page.tsx",
  "utf8",
);
adminReportsPage = adminReportsPage.replace(
  /setStatus\(val\)/g,
  'setStatus(val || "")',
);
fs.writeFileSync("src/app/admin/reports/page.tsx", adminReportsPage);

let apiAppsRoute = fs.readFileSync(
  "src/app/api/admin/applications/route.ts",
  "utf8",
);
apiAppsRoute = apiAppsRoute.replace(/doc =>/g, "(doc: any) =>");
fs.writeFileSync("src/app/api/admin/applications/route.ts", apiAppsRoute);

let apiExportRoute = fs.readFileSync(
  "src/app/api/admin/export/excel/route.ts",
  "utf8",
);
apiExportRoute = apiExportRoute.replace(/doc =>/g, "(doc: any) =>");
apiExportRoute = apiExportRoute.replace(/app =>/g, "(app: any) =>");
fs.writeFileSync("src/app/api/admin/export/excel/route.ts", apiExportRoute);

let appRoute = fs.readFileSync("src/app/api/applications/route.ts", "utf8");
appRoute = appRoute.replace(/transaction =>/g, "(transaction: any) =>");
fs.writeFileSync("src/app/api/applications/route.ts", appRoute);

let validation = fs.readFileSync("src/lib/validation/application.ts", "utf8");
validation = validation.replace(/required_error:/g, "message:");
fs.writeFileSync("src/lib/validation/application.ts", validation);

console.log("Fixed more TS errors.");
