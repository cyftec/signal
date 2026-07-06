import type { Karma, ProjectFileNames } from "./karma-types.ts";

const files = {
  buildable: {
    appSrcDir: "dev",
    appViewDir: "dev",
    pageFile: "page.ts",
    manifestFile: "manifest.ts",
  },
  static: {
    publishDir: "../docs",
    dsStoreDir: ".DS_Store",
    karmaTypesFile: "karma-types.ts",
    gitIgnoreFile: ".gitignore",
  },
  disposable: {
    stagingDir: "stage",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    bunLockFile: "bun.lock",
    bunLockBFile: "bun.lockb",
    packageJsonFile: "package.json",
  },
} as const satisfies ProjectFileNames;

// DO NOT CHANGE exported variable name
export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: files.buildable.appSrcDir,
      appViewDir: files.buildable.appViewDir,
      skipErrorAndBuildNext: false,
      ignoreDelimiter: "@",
      buildablePageFileName: files.buildable.pageFile,
      buildableManifestFileName: files.buildable.manifestFile,
      stagingDir: files.disposable.stagingDir,
      publishDir: files.static.publishDir,
      disposable: Object.values(files.disposable),
    },
    serve: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
      watchDir: files.buildable.appSrcDir,
      serveDir: files.disposable.stagingDir,
    },
  },
  maya: {
    name: "sample-app",
    appType: "web",
    dependencies: { "@cyftec/maya": "0.0.14" },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        [files.static.karmaTypesFile]: true,
        [files.static.gitIgnoreFile]: true,
        [files.static.publishDir]: false,
        [files.disposable.stagingDir]: false,
        [files.disposable.bunLockFile]: true,
        [files.disposable.bunLockBFile]: true,
        [files.disposable.dotVscodeDir]: true,
        [files.disposable.nodeModulesDir]: true,
        [files.disposable.packageJsonFile]: true,
      },
    },
  },
  git: {
    ignore: [
      files.static.dsStoreDir,
      files.static.karmaTypesFile,
      files.disposable.bunLockFile,
      files.disposable.bunLockBFile,
      files.disposable.dotVscodeDir,
      files.disposable.nodeModulesDir,
      files.disposable.packageJsonFile,
      files.disposable.stagingDir,
    ],
  },
};
