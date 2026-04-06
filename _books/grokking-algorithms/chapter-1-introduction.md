---
layout: post
title: "Chapter 1: Introduction to Algorithms"
description: "Binary search, Big O notation, and what it means for an algorithm to be efficient — notes and exercises from Chapter 1 of Grokking Algorithms."
date: 2026-03-29
book: grokking-algorithms
part: 1
tags: [algorithms, data-structures]
tags_color: "#E8374B"
permalink: /books/grokking-algorithms/chapter-1-introduction/
---

## What Is an Algorithm

- A set of instructions for accomplishing a task
- Knowing an algorithm means knowing where it works well and where it breaks down
- NP-complete problems have no known efficient algorithm at scale

## Binary Search

- Requires sorted input
- Returns the position of the target, or `null` if not found
- Starts at the middle, eliminates half the search space each step
- Worst case: $\lceil \log_2 n \rceil$ comparisons
- Simple search on 1–100: up to 100 steps vs binary search: 6 steps
- 240,000-word dictionary: simple search up to 240,000 steps vs binary search: 18 steps
- Mid formula: $mid = \lfloor (low + high) / 2 \rfloor$

```cs
int? Search(int[] sequence, int searchElement) 
{
    for(int i=0; i < sequence.Length; i++){
        if (sequence[i] == searchElement)
            return i;
    }
    return null;
}
```

## Big O Notation

- Measures how the number of **operations grows** as input grows, not absolute speed
- Describes the **upper bound** (worst case)

| Big O | Name | Typical meaning |
|---|---|---|
| $O(\log n)$ | Logarithmic | Repeatedly halves the problem. Example: binary search |
| $O(n)$ | Linear | Processes each element once. Example: simple search |
| $O(n \log n)$ | Linearithmic | Common in efficient sorting algorithms |
| $O(n^2)$ | Quadratic | Nested comparisons. Example: selection sort |
| $O(n!)$ | Factorial | Every possible ordering. Impractical quickly |

## Exercises

- **1.1.** 7 steps at most
- **1.2.** 8 steps — doubling the list adds one step
- **1.3.** Sorted phone book → binary search → $O(\log_2 N)$
- **1.4.** Search whole book → $O(N)$
- **1.5.** Read every number → $O(N)$
- **1.6.** Reading all A's is still $O(N)$ — N just represents fewer entries
