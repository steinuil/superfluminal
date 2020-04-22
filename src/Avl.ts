export interface Tree<K, V> {
  key: K;
  value: V;
  height: number;
  left: Tree<K, V> | null;
  right: Tree<K, V> | null;
}

const heightNull = (tree: Tree<any, any> | null) => (tree ? tree.height : 0);

const make = <K, V>({
  key,
  value,
  left,
  right,
}: Omit<Tree<K, V>, 'height'>): Tree<K, V> => ({
  key,
  value,
  left,
  right,
  height: Math.max(heightNull(left), heightNull(right)) + 1,
});

export const balance = <K, V>(tree: Tree<K, V>): Tree<K, V> => {
  const hl = heightNull(tree.left);
  const hr = heightNull(tree.right);

  if (tree.left && hl > hr + 2) {
    if (heightNull(tree.left.left) >= heightNull(tree.left.right)) {
      return make({
        left: tree.left.left,
        key: tree.left.key,
        value: tree.left.value,
        right: make({
          left: tree.left.right,
          key: tree.key,
          value: tree.value,
          right: tree.right,
        }),
      });
    } else {
      if (!tree.left.right) throw new Error('invalid arg');
      return make({
        left: make({
          left: tree.left.left,
          key: tree.left.key,
          value: tree.left.value,
          right: tree.left.right.left,
        }),
        key: tree.left.right.key,
        value: tree.left.right.value,
        right: make({
          left: tree.left.right.right,
          key: tree.key,
          value: tree.value,
          right: tree.right,
        }),
      });
    }
  }

  if (tree.right && hr > hl + 2) {
    if (heightNull(tree.right.right) >= heightNull(tree.right.left)) {
      return make({
        left: make({
          left: tree.left,
          key: tree.key,
          value: tree.value,
          right: tree.right.left,
        }),
        key: tree.right.key,
        value: tree.right.value,
        right: tree.right.right,
      });
    } else {
      if (!tree.right.left) throw new Error('invalid arg');
      return make({
        left: make({
          left: tree.left,
          key: tree.key,
          value: tree.value,
          right: tree.right.left.left,
        }),
        key: tree.right.left.key,
        value: tree.right.left.value,
        right: make({
          left: tree.right.left.right,
          key: tree.right.key,
          value: tree.right.value,
          right: tree.right.right,
        }),
      });
    }
  }

  return tree;
};

export const add = <K, V>(
  tree: Tree<K, V> | null,
  key: K,
  value: V,
  cmp: (a: K, b: K) => number
): Tree<K, V> => {
  if (!tree)
    return make({
      left: null,
      key,
      value,
      right: null,
    });

  if (cmp(key, tree.key) < 0) {
    return balance(
      make({
        left: add(tree.left, key, value, cmp),
        key: tree.key,
        value: tree.value,
        right: tree.right,
      })
    );
  }

  if (cmp(key, tree.key) > 0) {
    return balance(
      make({
        left: tree.left,
        key: tree.key,
        value: tree.value,
        right: add(tree.right, key, value, cmp),
      })
    );
  }

  throw new Error(
    `Overlap: ${JSON.stringify(key)} ${JSON.stringify(tree.key)}`
  );
};
