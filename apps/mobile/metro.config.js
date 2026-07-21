const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro config for a pnpm monorepo. Without watchFolders + nodeModulesPaths,
 * Metro only sees apps/mobile and can't bundle @rewire/core (which ships raw
 * TypeScript) or deps hoisted to the workspace root. Package exports must be
 * enabled so Metro reads @rewire/core's "exports" map.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
