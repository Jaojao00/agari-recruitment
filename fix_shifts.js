const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix shifts in the badges section (Yeu cau section)
page = page.replace(
  `<Badge variant="outline" className="text-sm py-1">Ca 1: 06:00 - 15:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 2: 15:00 - 22:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 3: 18:00 - 22:00</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">* Không có ca 22:00 - 06:00.</p>`,
  `<Badge variant="outline" className="text-sm py-1">Ca 1: 06:00 – 15:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 2: 13:00 – 22:00</Badge>
                  <Badge variant="outline" className="text-sm py-1">Ca 3: 22:00 – 06:00</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">* Xoay ca mỗi tuần theo lịch công ty.</p>`
);

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log('page.tsx updated');

let form = fs.readFileSync('src/app/ung-tuyen/page.tsx', 'utf8');

// 2. Fix shifts in form select
form = form.replace(
  `<SelectItem value="Ca 1: 06:00 - 15:00">Ca 1: 06:00 - 15:00</SelectItem>
                            <SelectItem value="Ca 2: 15:00 - 22:00">Ca 2: 15:00 - 22:00</SelectItem>
                            <SelectItem value="Ca 3: 18:00 - 22:00">Ca 3: 18:00 - 22:00</SelectItem>`,
  `<SelectItem value="Ca 1: 06:00 - 15:00">Ca 1: 06:00 – 15:00</SelectItem>
                            <SelectItem value="Ca 2: 13:00 - 22:00">Ca 2: 13:00 – 22:00</SelectItem>
                            <SelectItem value="Ca 3: 22:00 - 06:00">Ca 3: 22:00 – 06:00</SelectItem>`
);

fs.writeFileSync('src/app/ung-tuyen/page.tsx', form, 'utf8');
console.log('ung-tuyen/page.tsx updated');

let validation = fs.readFileSync('src/lib/validation/application.ts', 'utf8');
validation = validation.replace(
  `z.enum(['Ca 1: 06:00 - 15:00', 'Ca 2: 15:00 - 22:00', 'Ca 3: 18:00 - 22:00'] as [string, ...string[]]`,
  `z.enum(['Ca 1: 06:00 - 15:00', 'Ca 2: 13:00 - 22:00', 'Ca 3: 22:00 - 06:00'] as [string, ...string[]]`
);
fs.writeFileSync('src/lib/validation/application.ts', validation, 'utf8');
console.log('validation updated');

console.log('Done!');
