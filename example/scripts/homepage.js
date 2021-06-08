const fs = require('fs');
const packageJson = require('../package.json');

if (process.env.HOMEPAGE) {
  packageJson.homepage = process.env.HOMEPAGE;
  fs.writeFileSync(
    require.resolve('../package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}
