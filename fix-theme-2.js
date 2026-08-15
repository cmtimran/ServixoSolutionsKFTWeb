const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app/admin');

function replaceClasses(content) {
    let newContent = content;
    
    // Backgrounds
    newContent = newContent.replace(/(?<!dark:)bg-slate-950/g, 'bg-white dark:bg-slate-950');
    
    // Text
    newContent = newContent.replace(/(?<!dark:)text-slate-200/g, 'text-slate-900 dark:text-slate-200');
    
    // Divide
    newContent = newContent.replace(/(?<!dark:)divide-slate-800(?!\/)/g, 'divide-slate-200 dark:divide-slate-800');
    newContent = newContent.replace(/(?<!dark:)divide-slate-800\/60/g, 'divide-slate-200 dark:divide-slate-800/60');
    
    // Some missed border stuff maybe?
    // border-slate-800 is mostly handled but let's be sure
    newContent = newContent.replace(/(?<!dark:)border-slate-800(?!\/)/g, 'border-slate-200 dark:border-slate-800');

    return newContent;
}

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = replaceClasses(content);
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated', fullPath);
            }
        }
    });
}

processDirectory(directoryPath);
