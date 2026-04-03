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

{: .objectives }
> - Foundational knowledge
> - Binary Search
> - Algorithm Complexity

## What Is an Algorithm

> **Algorithm**
> An algorithm is a set of instructions for accomplishing a task.

Understanding an algorithm means more than knowing it works. It means knowing *where* it works well, where it breaks down, and what you give up when you choose one approach over another. Some algorithms are domain-specific — recommendation systems, for instance, are often built using K-nearest neighbors — while whole categories of problems, called NP-complete problems, have no known algorithm that solves them efficiently at scale.

## Binary Search

Binary search solves a search problem efficiently, but it has a requirement: its input must be a sorted list. Given that list, it returns the position of the target element, or `null` if the element isn't found.

To understand why it matters, consider a simple game. There's a sequence from 1 to 100 and you need to guess a hidden number. With every guess, you're told whether you're too low, too high, or correct. A naïve approach starts at 1 and counts upward — guessing 1, then 2, then 3 — until eventually landing on the answer. This is **simple search**: it loops over the sequence and checks each element one by one.

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

But since the sequence is already sorted, we leverage a better technique to solve this problem.

Binary search starts from the middle of the sequence — element 50 in this case. If the target is higher, everything to the left of the midpoint (including the midpoint itself) is eliminated. If it's lower, everything to the right is eliminated. The surviving half is then halved again on the next step, repeating until the target is found or the search space is empty.

Unlike simple search which required `79` steps, binary search requires exactly **6 steps**.

**Middle Formula**

$$mid = \left\lfloor \frac{low + high}{2} \right\rfloor$$

| Iteration | Low | High | Mid | Comparison | Result |
|---|--:|--:|--:|---|---|
| 1 | 1 | 100 | 50 | $79 > 50$ | Go right |
| 2 | 51 | 100 | 75 | $79 > 75$ | Go right |
| 3 | 76 | 100 | 88 | $79 < 88$ | Go left |
| 4 | 76 | 87 | 81 | $79 < 81$ | Go left |
| 5 | 76 | 80 | 78 | $79 > 78$ | Go right |
| 6 | 79 | 80 | 79 | $79 = 79$ | Found |

To put that in perspective: a dictionary with 240,000 words would require up to 240,000 steps with simple search. Binary search finds the same word in at most 18 steps.

> **Binary Search Worst-Case Time**
>
> Binary search halves the search space at each step, so after at most $\lceil \log_2 n \rceil$ comparisons, it either finds the target or proves the target is not in the sorted array.

### Exercises

- **1.1.** It would take 7 steps at most.
- **1.2.** It would take 8 steps by doubling the size of the list.

## Running Time

When choosing between algorithms, the criterion is usually **runtime** — the number of steps an algorithm takes to complete a task, independent of CPU speed or hardware details. At a basic level, 100 steps take more time than 10 steps. Linear search and binary search have time complexities of $O(N)$ and $O(\log_2 N)$ respectively. Binary search can be significantly faster in the worst case, but only when its prerequisite is satisfied: the input must be sorted.

## Big O Notation

> **Big O notation** tells us how the runtime of an algorithm **grows** as the size of the input grows.

Big O doesn't measure time in seconds. It measures how the **number of operations** scales as the input grows — which is why it's a useful comparison tool regardless of machine speed or language. The question it answers isn't *how fast is this right now?* but rather: **as the input grows, how much more work does this algorithm create?**

This distinction matters because two algorithms can look similar on small inputs and diverge dramatically at scale. Binary search doesn't just save a few steps over simple search — its growth rate is fundamentally different. Simple search checks every element in the worst case: $O(n)$. Binary search halves the search space at every step: $O(\log n)$.

Big O also describes an **upper bound** — the worst-case scenario. Simple search might get lucky and find the target on the first try, but that doesn't change its Big O. In the worst case it still has to inspect every element, so its runtime stays $O(n)$.

### Common Big O Runtimes

| Big O | Name | Growth idea | Typical meaning |
|---|---|---|---|
| $O(\log n)$ | Logarithmic time | The work grows very slowly as input grows | The algorithm repeatedly reduces the problem size, usually by half. Example: binary search. |
| $O(n)$ | Linear time | The work grows proportionally with the input | The algorithm may need to process each element once. Example: simple search. |
| $O(n \log n)$ | Linearithmic time | Slightly worse than linear, but still efficient for large inputs | Common in efficient sorting algorithms. |
| $O(n^2)$ | Quadratic time | The work grows with the square of the input | Common when every element is compared with many others, often via nested loops. |
| $O(n!)$ | Factorial time | The work grows explosively | Common in brute-force problems trying every possible ordering. Becomes impractical very quickly. |

Algorithm speed isn't measured in seconds here — it's measured by the **growth of operations**. An $O(\log n)$ algorithm doesn't just run a bit faster than $O(n)$; as the input grows, the gap becomes substantial. Big O abstracts away machine-specific timing and focuses entirely on that growth rate.
 
### Exercises

- **1.3.** Because the phone book is sorted alphabetically we can utilize a binary search algorithm which takes $O(\log_2 N)$ to find the answer.
- **1.4.** Since we'll have to search through the whole book it would take $O(N)$.
- **1.5.** $O(N)$ to read the numbers of every person in the phone book.
- **1.6.** The only difference for A's from the whole book is a different number of N. Since we want to read the numbers of all A's the runtime growth is $O(N)$.
