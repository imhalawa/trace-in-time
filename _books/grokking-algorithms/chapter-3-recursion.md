---
layout: post
title: "Chapter 3: Recursion"
description: "Recursion, base cases, and recursive cases — notes from Chapter 3 of Grokking Algorithms."
date: 2026-04-06
book: grokking-algorithms
part: 3
tags: [algorithms, data-structures]
tags_color: "#E8374B"
permalink: /books/grokking-algorithms/chapter-3-recursion/
---

## Recursion

- A function that calls itself
- Box analogy: to find a key in nested boxes, keep opening boxes — if it contains a box, open it; if it's the key, stop
- Use recursion when it makes the solution clearer, not for performance
- An iterative solution usually exists and is sometimes faster
- "Loop may achieve a performance gain for your program. Recursion may achieve a performance gain for your programmer." — [Leigh Cladwell](https://stackoverflow.com/questions/72209/recursion-or-iteration/72694#72694)

## Base Case and Recursive Case

- Easy to write a recursive function that ends up in an infinite loop
- Recursive calls should know when to stop — that's the **base case**
- Every recursive function has two parts:
  - **Base case** — when to stop
  - **Recursive case** — when to keep calling yourself
- If the base case is never met, you get an infinite loop

```cs 
void Print(int n){
    Console.WriteLine(n)
    if(n == 0){
        return;
    }
    else{
        return Print(n-1);
    }
}
```
