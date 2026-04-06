---
layout: post
title: "Chapter 4: Divide and Conquer"
description: "Divide and conquer, quicksort, Lomuto partitioning, inductive proofs, and Big O revisited — notes from Chapter 4 of Grokking Algorithms."
date: 2026-04-06
book: grokking-algorithms
part: 4
tags: [algorithms, data-structures]
tags_color: "#E8374B"
permalink: /books/grokking-algorithms/chapter-4-divide-and-conquer/
---

## Divide and Conquer

- A recursive technique for solving problems
- Ask yourself: "Can I solve this if I use divide and conquer?"
- Two steps:
  - Figure out the base case — the simplest possible case
  - Divide and reduce the problem until it becomes the base case
- Every recursive call must reduce the problem size
- Base case for array problems is often an empty array or an array with one element
- Functional languages like Haskell have no loops — recursion is the only option there

## Quicksort

- Much faster than selection sort

### Design

- Base cases — arrays that don't need sorting:
  - Empty array
  - Array with one element
- Array with two elements: compare and swap if needed

### How It Works

- Pick an element as the **pivot**
- **Partition** — split remaining elements into two sub-arrays:
  - Elements less than the pivot
  - Elements greater than the pivot
- Recursively sort both sub-arrays
- Result: $quicksort(left) + pivot + quicksort(right)$
- Pick a random element as pivot — don't fixate on a specific position
- In-place partitioning avoids extra lists; Lomuto is one common approach

#### Lomuto Partitioning

```cs
int[] array = [5, 3, 4, 7, 8, 0, 1, 10, 30];

var pivot = array[0];
var storeIndex = 1;
for (int i = 1; i < array.Length; i++)
{
    if (array[i] < pivot)
    {
        (array[i], array[storeIndex]) = (array[storeIndex], array[i]);
        storeIndex++;
    }
}
(array[0], array[storeIndex - 1]) = (array[storeIndex - 1], array[0]);
```

### Inductive Proofs

- A way to prove an algorithm works
- Two steps: base case and inductive case
- Prove it works for the base case (size 0, 1, 2)
- Prove that if it works for size N, it works for size N+1 — and so on

### Big O Revisited

- Quicksort speed depends on pivot choice
- Always picking the first element as pivot on a sorted array → worst case $O(n^2)$
- With a random pivot → average case $O(n \log n)$
- Merge sort is always $O(n \log n)$ in best, average, and worst case
- Constants are dropped in Big O when comparing different complexities — e.g. $O(n)$ vs $O(\log n)$, the latter always wins at scale
- Constants matter when complexities are the same — e.g. quicksort vs merge sort both at $O(n \log n)$, quicksort wins due to a smaller constant and hits average case most of the time

## Exercises

### 4.1 Recursive Sum

```cs
int Sum(int[] numbers)
{
    if (numbers.Length == 1)
    {
        return numbers[0];
    }
    return numbers[0] + Sum(numbers[1..numbers.Length]);
}
```

### 4.2 Recursive Count

```cs
int Count(int[] items)
{
    if (items.Length == 1)
    {
        return 1;
    }
    return 1 + Count(items[1..items.Length]);
}
```

### 4.3 Recursive Max

```cs
int Max(int[] items)
{
    if (items.Length == 1)
    {
        return items[0];
    }

    var restMax = Max(items[1..items.Length]);
    return items[0] > restMax ? items[0] : restMax;
}
```

### 4.4 Recursive Binary Search

```cs
static int BinarySearch(int[] space, int key)
{
    return Search(space, key, 0, space.Length - 1);
}

static int Search(int[] space, int key, int lo, int hi)
{
    if (lo > hi)
    {
        return -1;
    }
  
    int mid = lo + (hi - lo) / 2;
  
    if (space[mid] == key)
    {
        return mid;
    }

    if (key > space[mid])
    {
        return Search(space, key, mid + 1, hi);
    }

    return Search(space, key, lo, mid - 1);
}
```
