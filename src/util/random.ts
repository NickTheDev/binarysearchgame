export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomSortedNumbers(
  length: number,
  lower: number,
  upper: number,
  range: number,
): number[] {
  const numbers: number[] = [];
  let max = upper;
  let min = lower;

  if (random(0, 2) === 1) {
    max -= random(0, range);
  } else {
    min += random(0, range);
  }

  for (let i = 0; i < length; i += 1) {
    let next = random(min, max);

    while (numbers.includes(next)) {
      next = random(min, max);
    }

    numbers[i] = next;
  }

  return numbers.sort((a, b) => a - b);
}
