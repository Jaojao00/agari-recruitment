const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(/import { Toaster } from "@\/components\/ui\/toaster";/g, '');
layout = layout.replace(/{\/\* <Toaster \/> \*\/}/g, '');
fs.writeFileSync('src/app/layout.tsx', layout);

let formPage = fs.readFileSync('src/app/ung-tuyen/page.tsx', 'utf8');
formPage = formPage.replace(/import { useForm } from 'react-form-hooks';/g, '');
formPage = formPage.replace(/useForm as useReactHookForm/g, 'useForm');
formPage = formPage.replace(/useReactHookForm/g, 'useForm');
fs.writeFileSync('src/app/ung-tuyen/page.tsx', formPage);

let validation = fs.readFileSync('src/lib/validation/application.ts', 'utf8');
validation = validation.replace(/z\.enum\(\['Nam', 'N.?'\]/g, 'z.enum([\'Nam\', \'Nữ\'] as [string, ...string[]]');
validation = validation.replace(/z\.enum\(\['9\/12', '10\/12', '11\/12', '12\/12', 'Khác'\]/g, 'z.enum([\'9/12\', \'10/12\', \'11/12\', \'12/12\', \'Khác\'] as [string, ...string[]]');
validation = validation.replace(/z\.enum\(\['Ca 1: 06:00 - 15:00', 'Ca 2: 15:00 - 22:00', 'Ca 3: 18:00 - 22:00'\]/g, 'z.enum([\'Ca 1: 06:00 - 15:00\', \'Ca 2: 15:00 - 22:00\', \'Ca 3: 18:00 - 22:00\'] as [string, ...string[]]');
fs.writeFileSync('src/lib/validation/application.ts', validation);

let adminApiRoute = fs.readFileSync('src/app/api/admin/applications/route.ts', 'utf8');
adminApiRoute = adminApiRoute.replace(/FirebaseFirestore\.Query/g, 'any');
fs.writeFileSync('src/app/api/admin/applications/route.ts', adminApiRoute);

let adminApiDetail = fs.readFileSync('src/app/api/admin/applications/[id]/route.ts', 'utf8');
adminApiDetail = adminApiDetail.replace(/async function GET\(request: Request, { params }: { params: { id: string } }\)/g, 'async function GET(request: Request, { params }: any)');
adminApiDetail = adminApiDetail.replace(/async function PATCH\(request: Request, { params }: { params: { id: string } }\)/g, 'async function PATCH(request: Request, { params }: any)');
fs.writeFileSync('src/app/api/admin/applications/[id]/route.ts', adminApiDetail);

let adminExportApi = fs.readFileSync('src/app/api/admin/export/excel/route.ts', 'utf8');
adminExportApi = adminExportApi.replace(/FirebaseFirestore\.Query/g, 'any');
fs.writeFileSync('src/app/api/admin/export/excel/route.ts', adminExportApi);

let firebaseAdmin = fs.readFileSync('src/lib/firebase/admin.ts', 'utf8');
firebaseAdmin = firebaseAdmin.replace(/admin\.apps/g, '(admin as any).apps');
firebaseAdmin = firebaseAdmin.replace(/admin\.credential/g, '(admin as any).credential');
firebaseAdmin = firebaseAdmin.replace(/admin\.firestore\(\)/g, '(admin as any).firestore()');
firebaseAdmin = firebaseAdmin.replace(/admin\.auth\(\)/g, '(admin as any).auth()');
fs.writeFileSync('src/lib/firebase/admin.ts', firebaseAdmin);

let adminAppPage = fs.readFileSync('src/app/admin/applications/page.tsx', 'utf8');
adminAppPage = adminAppPage.replace(/setStatusFilter\(val\)/g, 'setStatusFilter(val as any)');
fs.writeFileSync('src/app/admin/applications/page.tsx', adminAppPage);

let adminDetail = fs.readFileSync('src/app/admin/applications/[id]/page.tsx', 'utf8');
adminDetail = adminDetail.replace(/setStatus\(val\)/g, 'setStatus(val as any)');
adminDetail = adminDetail.replace(/onValueChange={setStatus}/g, 'onValueChange={(val) => setStatus(val)}');
fs.writeFileSync('src/app/admin/applications/[id]/page.tsx', adminDetail);

let adminReportsPage = fs.readFileSync('src/app/admin/reports/page.tsx', 'utf8');
adminReportsPage = adminReportsPage.replace(/setStatus\(val\)/g, 'setStatus(val as any)');
adminReportsPage = adminReportsPage.replace(/onValueChange={setStatus}/g, 'onValueChange={(val) => setStatus(val)}');
fs.writeFileSync('src/app/admin/reports/page.tsx', adminReportsPage);

let apiApps = fs.readFileSync('src/app/api/applications/route.ts', 'utf8');
apiApps = apiApps.replace(/transaction => {/g, '(transaction: any) => {');
fs.writeFileSync('src/app/api/applications/route.ts', apiApps);

console.log("Done");
