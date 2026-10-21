const {spawn} = require('node:child_process');
const pidFile = process.argv[2];
const descendant = spawn(process.execPath, ['-e', `
 const fs = require('node:fs');
  process.on('SIGTERM', () => {});
 fs.writeFileSync(process.argv[1], String(process.pid));
 setInterval(() => {}, 1000);
`, pidFile], {stdio: 'ignore'});
descendant.on('error', () => process.exit(2));
// Exit successfully on TERM while the descendant keeps running without inherited pipes.
process.on('SIGTERM', () => process.exit(0));
setInterval(() => {}, 1000);
