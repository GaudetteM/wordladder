export function findShortestPath(
  start: string,
  target: string,
  dictionary: Set<string>,
): string[] | null {
  const startWord = start.trim().toLowerCase();
  const targetWord = target.trim().toLowerCase();

  if (startWord.length !== targetWord.length || startWord.length === 0) {
    return null;
  }

  if (!dictionary.has(startWord) || !dictionary.has(targetWord)) {
    return null;
  }

  if (startWord === targetWord) {
    return [startWord.toUpperCase()];
  }

  const visited = new Set<string>([startWord]);
  const parents = new Map<string, string>();
  const queue: string[] = [startWord];

  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];

    for (let i = 0; i < current.length; i++) {
      for (let code = 97; code <= 122; code++) {
        const letter = String.fromCharCode(code);

        if (letter === current[i]) {
          continue;
        }

        const next = current.slice(0, i) + letter + current.slice(i + 1);

        if (!dictionary.has(next) || visited.has(next)) {
          continue;
        }

        visited.add(next);
        parents.set(next, current);

        if (next === targetWord) {
          const path = [targetWord];
          let word = targetWord;

          while (word !== startWord) {
            const parent = parents.get(word);

            if (parent === undefined) {
              return null;
            }

            word = parent;
            path.push(word);
          }

          return path.reverse().map((word) => word.toUpperCase());
        }

        queue.push(next);
      }
    }
  }

  return null;
}
