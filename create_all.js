var fs = require('fs');  
fs.writeFileSync('src/app/cli/page.tsx', 'use client;');  
fs.writeFileSync('src/app/password_reset/page.tsx', 'use client;');  
fs.writeFileSync('src/app/forgot_username/page.tsx', 'use client;');  
fs.mkdirSync('src/app/settings/username', { recursive: true });  
fs.writeFileSync('src/app/settings/username/page.tsx', 'use client;');  
console.log('Files initialized'); 
