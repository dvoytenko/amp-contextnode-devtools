
const fs = require('fs');

function build() {
  if (!fs.existsSync('.key')) {
    throw new Error('.key file is absent. See go/dev-crx');
  }
  const key = fs.readFileSync('.key').toString().trim();
  if (!key) {
    throw new Error('.key file is empty. See go/dev-crx');
  }

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Passthrough files.
  fs.copyFileSync('src/bootstrap.html', 'dist/bootstrap.html');
  fs.copyFileSync('src/showNodeInfo.js', 'dist/showNodeInfo.js');

  // Copy manifest with replacements.
  const manifest = fs.readFileSync('src/manifest.json').toString();
  const manifestWithKey = manifest.replace('$key$', key);
  fs.writeFileSync('dist/manifest.json', manifestWithKey);
}

const args = process.argv;
let key = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] == '--key') {
    key = args[i + 1];
    break;
  }
}

build();
