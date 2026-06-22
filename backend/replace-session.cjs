const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

const dir = path.join(__dirname, 'src/controller/v1');
const files = walkDir(dir);

let modified = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it has req.session.userId or req.session?.userId
    if (content.includes('req.session.userId') || content.includes('req.session?.userId')) {
        content = content.replace(/req\.session\?\.userId/g, '(req as any).user?.userId');
        content = content.replace(/req\.session\.userId/g, '(req as any).user?.userId');
        
        fs.writeFileSync(file, content, 'utf8');
        modified++;
        console.log(`Updated ${file}`);
    }
}

console.log(`Done. Modified ${modified} files.`);
