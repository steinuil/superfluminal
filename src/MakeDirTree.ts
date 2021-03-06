export type DirTree = readonly [string, DirTree[]] | string;

// TODO: return a simple list with depth instead of a tree structure
export function makeDirTree(paths: string[][]): DirTree[] {
  const files: DirTree[] = paths
    .filter((path) => path.length === 1)
    .map(([file]) => file)
    .sort();

  // https://stackoverflow.com/a/21320309
  const byDir: Record<string, string[][]> = Object.create(null);

  paths
    .filter((path) => path.length !== 1)
    .forEach((path) => {
      if (!byDir[path[0]]) byDir[path[0]] = [];
      if (!byDir[path[0]].push) console.log(byDir, path, byDir[path[0]]);
      byDir[path[0]].push(path.slice(1));
    });

  const dirs = Object.keys(byDir).sort();

  return dirs
    .map<DirTree>((dir) => [dir, makeDirTree(byDir[dir])])
    .concat(files);
}
