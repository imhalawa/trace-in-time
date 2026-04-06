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

## Arrays

- Elements stored contiguously in memory
- Fixed size — needs reallocation + full copy when full
- Zero-based indexed
- Reading: $O(1)$ — address of any element is mathematically derivable
- Insertion/deletion: $O(N)$ — shifting or reallocation required

## Linked Lists

- Elements live anywhere in memory, connected via pointers (A → B → C)
- Reading: $O(N)$ — no random access, must traverse from head
- Insertion/deletion: $O(1)$ — only pointer updates needed
- Caveat: $O(1)$ insert/delete only if you already hold a reference to that node

## Arrays vs. Linked Lists in Practice

|               | Arrays | Linked Lists |
| ------------- | ------ | ------------ |
| **Reading**   | $O(1)$ | $O(N)$       |
| **Insertion** | $O(N)$ | $O(1)$       |
| **Deletions** | $O(N)$ | $O(1)$       |

- Arrays support both sequential and random access; linked lists support sequential only
- Arrays dominate in practice due to random access and no pointer overhead
- Pointer overhead in linked lists is costly when elements are small

## Selection Sort

- Growth rate: $O(N^2)$
- Repeatedly finds the smallest element in the unsorted portion and appends it to a result list
- Two operations: `FindSmallest(arr)` finds the min index, `SelectionSort(arr)` calls it repeatedly
- Intuitive but expensive — Quick sort solves the same in $O(n \log n)$

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

## Exercises

- **2.1.** Heavy writes → linked list
- **2.2.** Order queue → linked list; tail pointer = $O(1)$ insert, head pointer = $O(1)$ read/remove
- **2.3.** Read-heavy with binary search → array (random access required)
- **2.4.** The array will get resized more often
- **2.5.**

|        | Arrays  | Linked Lists | Hybrid |
| ------ | ------- | ------------ | ------ |
| search | fastest | slowest      | slow   |
| insert | slowest | fastest      | fast   |
