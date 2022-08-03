export function permutate<T>(arr: T[]): T[][] {
  if (arr.length === 1) return [[...arr]];

  const res: any[] = [];

  arr.forEach((x, index) => {
    const rest = arr.slice(0, index).concat(arr.slice(index + 1));
    const perm = permutate(rest);

    perm.forEach((val) => {
      val.push(x);
      res.push(val);
    });
  });

  return res;
}
