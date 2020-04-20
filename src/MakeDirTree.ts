export type DirTree = readonly [string, DirTree[]] | string;

export function makeDirTree(paths: string[][]): DirTree[] {
  const files: DirTree[] = paths
    .filter((path) => path.length === 1)
    .map(([file]) => file)
    .sort();

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
