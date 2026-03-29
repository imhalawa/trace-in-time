---
layout: post
title: "Chapter 2: Selection Sort"
description: "Arrays vs Linked Lists — trade-offs in reading, insertion, and deletion — plus the Selection Sort algorithm. Notes and exercises from Chapter 2 of Grokking Algorithms."
date: 2026-03-29
book: grokking-algorithms
part: 2
tags: [algorithms, data-structures]
tags_color: "#E8374B"
permalink: /books/grokking-algorithms/chapter-2-selection-sort/
---

## Objectives

- Learn about Arrays and Linked Lists
- Highlight the Pros and Cons of both Arrays and Linked Lists
- Learn about Selection Sort Algorithm

## Arrays & Linked Lists

There are two basic ways to store elements in memory: arrays and linked lists. Every slot in memory has an address, and the structure you choose determines how those addresses are organized and accessed.

Arrays store elements **contiguously** — each element occupies a slot directly adjacent to the next. This makes them fixed in size; when you need more room, you have to allocate a new larger array and move everything over. Random access is instant, though: because elements are laid out in sequence, the address of any element can be derived mathematically. If the first element is at address 0, the fifth is at address 4. **Arrays are zero-based indexed**, so an array of 545 items has its last element at index 544. This predictability makes arrays optimal for reading patterns where you need to jump directly to a known position.

Linked lists take a different approach. Elements can live anywhere in memory — what connects them is a pointer stored in each item, pointing to where the next one lives. Think of it like a treasure hunt: each item only tells you where to find the next one (A → B → C → …). This structure makes insertion straightforward: to insert between two elements you update the surrounding pointers, with no shifting required. Traversal costs more, though. In a singly-linked list you can't jump to any element directly; you have to start at the head and follow pointers one by one, resulting in $O(N)$ read time in the worst case.

|               | Arrays | Linked Lists |
| ------------- | ------ | ------------ |
| **Reading**   | $O(1)$ | $O(N)$       |
| **Insertion** | $O(N)$ | $O(1)$       |
| **Deletions** | $O(N)$ | $O(1)$       |

There are two cases that force this. With **dynamic expansion**, if the array is already full when an insertion is needed, a new larger array must be allocated and every existing element copied over — an $O(N)$ operation on its own. With **insert at beginning**, every existing element must shift one position to the right to free up the first slot, which again touches every element in the array.

> **Linked Lists — Insertions & Deletions caveat**
> It's worth mentioning that insertions and deletions are O(1) time only if you can instantly access the element to be deleted.

### Exercises

- 2.1 Use linked lists for heavy writes.

## Arrays vs. Linked Lists in Practice

Arrays are used more often in practice, and the reason comes down to access patterns. There are two types of access: **Sequential Access** — traversing a data structure element by element to reach the target — and **Random Access**, where you jump directly to a known position. Arrays support both. Because elements are stored contiguously, the address of any element can be calculated directly, making random access instant. Even sequential access is faster with arrays since there's no pointer-chasing involved. Linked lists can only offer sequential access; every traversal must start at the head and follow the chain.

One subtler trade-off is memory overhead. When elements are small, storing a `next` pointer in every linked list node becomes costly relative to the data itself. When elements are large, that overhead becomes marginal. Neither structure is universally better — the right choice depends on the dominant operation in your use case.

### Exercises

- 2.2. Since we're registering the orders in a queue like fashion, I'd prefer a linked lists, insertion to the end of the list can be instant as long as we have a reference to the tail. also reading and removing from the top can be instant with a pointer to head in place.
- 2.3. The problem leans more towards read-heavy pattern, with binary search in place random access is not negotiable for a basic data structure. so array is the best fit.
- 2.4. The array will get resized more often.
- 2.5.

|        | Arrays  | Linked Lists | Hybrid |
| ------ | ------- | ------------ | ------ |
| search | fastest | slowest      | slow   |
| insert | slowest | fastest      | fast   |

## Selection Sort

Selection sort has a growth rate of $O(N^2)$. As the name suggests, it works by repeatedly selecting the smallest element from the remaining unsorted portion of the array and appending it to a new result array. It relies on two operations: a helper `FindSmallest(arr)` that locates the index of the minimum element, and `SelectionSort(arr)` that calls it repeatedly until the source is exhausted.

```cs
static int FindSmallest(List<int> arr)
{
    int smallest = arr[0];
    int smallest_index = 0;
    
    for (int i = 1; i < arr.Count; i++)
    {
        if (arr[i] < smallest)
        {
            smallest = arr[i];
            smallest_index = i;
        }
    }
    
    return smallest_index;
}

static List<int> SelectionSort(List<int> arr)
{
    List<int> newArr = new List<int>();
    List<int> copiedArr = new List<int>(arr);
    
    for (int i = 0; i < copiedArr.Count; i++)
    {
        int smallest = FindSmallest(copiedArr);
        newArr.Add(copiedArr[smallest]);
        copiedArr.RemoveAt(smallest);
    }
    
    return newArr;
}
```

Selection sort is intuitive but expensive at scale. Quick sort solves the same problem in $O(n \log n)$ — a meaningful improvement once the input grows large.
