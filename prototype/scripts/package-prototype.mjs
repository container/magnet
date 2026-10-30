import { cp, mkdir, mkdtemp, readFile, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const prototypeRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = path.resolve(prototypeRoot, "../output/prototype-delivery");
const packageName = "mag-net-prototip";
// Explicit file list prevents internal documents and local state entering releases.
const files = [
  "INSTALL.md",
  "index.html",
  "public/favicon.svg",
  "src/App.tsx",
  "src/main.tsx",
  "src/data.ts",
  "src/data/spaces.ts",
  "src/types.ts",
  "src/i18n.tsx",
  "src/styles.css",
  "src/vite-env.d.ts",
  "src/renders/3_velika dvorana_pogled.jpg",
  "src/renders/5_mala dvorana_pogled_5a.jpg",
  "src/renders/6_vadbena dvorana_pogled_a.jpg",
  "src/renders/7_dvorana orkester_pogled.jpg",
  "src/renders/8_plesna dvorana_pogled.jpg",
];
const mappings = [
  ...files.map(file => [file, file]),
  ["tsconfig.app.json", "tsconfig.json"],
  ["packaging/local/package.json", "package.json"],
  ["packaging/local/package-lock.json", "package-lock.json"],
  ["packaging/local/vite.config.ts", "vite.config.ts"],
];

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "mag-net-package-"));
try {
  for (const [source, target] of mappings) {
    const sourcePath = path.join(prototypeRoot, source);
    if (/\.(tsx?|css|html|json)$/.test(target)) {
      const content = await readFile(sourcePath, "utf8");
      if (/specDocuments|\/documentation|\/api\/spec-documents|specs\/(platform|prototype)\//.test(content)) {
        throw new Error(`Documentation reference found in ${source}`);
      }
    }
    const targetPath = path.join(temporaryRoot, packageName, target);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await cp(sourcePath, targetPath, { dereference: true });
  }

  const archiveName = `${packageName}.zip`;
  const result = spawnSync("zip", ["-X", "-q", "-r", archiveName, packageName], {
    cwd: temporaryRoot,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ZIP creation failed: ${result.status}`);
  await mkdir(outputRoot, { recursive: true });
  const pendingArchive = path.join(outputRoot, `${archiveName}.pending`);
  await cp(path.join(temporaryRoot, archiveName), pendingArchive);
  await rename(pendingArchive, path.join(outputRoot, archiveName));
  console.log(path.join(outputRoot, archiveName));
  console.log(`${mappings.length} files; installation instructions are the only included document.`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
