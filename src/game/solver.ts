export function findShortestPath(
  start: string,
  target: string,
  dictionary: Set<string>,
): string[] | null {
  start = start.toUpperCase();
  target = target.toUpperCase();

  if (start.length !== target.length) {
    return null;
  }

  if (start === target) {
    return [start];
  }

  if (!dictionary.has(target)) {
    return null;
  }

  const visited = new Set<string>([start]);
  const parents = new Map<string, string>();
  const queue: string[] = [start];

  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];

    for (let i = 0; i < current.length; i++) {
      for (let code = 65; code <= 90; code++) {
        const letter = String.fromCharCode(code);

        if (letter === current[i]) {
          continue;
        }

        const next = current.slice(0, i) + letter + current.slice(i + 1);

        if (!dictionary.has(next)) {
          continue;
        }

        if (visited.has(next)) {
          continue;
        }

        visited.add(next);
        parents.set(next, current);

        if (next === target) {
          const path = [target];
          let word = target;

          while (word !== start) {
            word = parents.get(word)!;
            path.push(word);
          }

          return path.reverse();
        }

        queue.push(next);
      }
    }
  }

  return null;
}
