const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app/admin');

function replaceClasses(content) {
    let newContent = content;
    
    // Backgrounds
    newContent = newContent.replace(/(?<!dark:)bg-slate-900(?!\/)/g, 'bg-white dark:bg-slate-900');
    newContent = newContent.replace(/(?<!dark:)bg-slate-900\/50/g, 'bg-slate-50 dark:bg-slate-900/50');
    newContent = newContent.replace(/(?<!dark:)bg-slate-800(?!\/)/g, 'bg-slate-100 dark:bg-slate-800');
    newContent = newContent.replace(/(?<!dark:)bg-slate-800\/30/g, 'bg-slate-50 dark:bg-slate-800/30');
    newContent = newContent.replace(/(?<!dark:)bg-slate-800\/50/g, 'bg-slate-50 dark:bg-slate-800/50');
    
    // Text colors
    newContent = newContent.replace(/(?<!dark:)text-slate-300/g, 'text-slate-700 dark:text-slate-300');
    newContent = newContent.replace(/(?<!dark:)text-slate-400/g, 'text-slate-600 dark:text-slate-400');
    newContent = newContent.replace(/(?<!dark:)text-slate-500/g, 'text-slate-500 dark:text-slate-500'); // Some might already be fine, just being safe
    newContent = newContent.replace(/(?<!dark:)text-white/g, 'text-slate-900 dark:text-white');
    
    // Borders
    newContent = newContent.replace(/(?<!dark:)border-slate-800(?!\/)/g, 'border-slate-200 dark:border-slate-800');
    newContent = newContent.replace(/(?<!dark:)border-slate-800\/50/g, 'border-slate-200 dark:border-slate-800/50');
    newContent = newContent.replace(/(?<!dark:)border-slate-700(?!\/)/g, 'border-slate-300 dark:border-slate-700');
    newContent = newContent.replace(/(?<!dark:)border-slate-700\/60/g, 'border-slate-200 dark:border-slate-700/60');
    
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
