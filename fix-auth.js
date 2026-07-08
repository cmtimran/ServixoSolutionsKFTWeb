const fs = require('fs');
const path = require('path');

const dir = 'd:\\Development\\Servixo Solutions KFT\\src\\app\\api\\admin';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('!verifyToken(token)')) {
    content = content.replace(/!verifyToken\(token\)/g, '!(await verifyToken(token))');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
