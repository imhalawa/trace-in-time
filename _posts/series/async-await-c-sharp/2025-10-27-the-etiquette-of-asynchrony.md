---

layout: post
title: "The Etiquette of Asynchrony"
series: "async-await"
part: 8
description: "Practical habits for writing graceful asynchronous code in C# — from safe awaits to consistent patterns that keep systems smooth."
date: 2025-10-27
tags: [dotnet, "async/await", series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/the-etiquette-of-asynchrony/
---

In the [`previous part`](/series/async-await/designing-reliable-async-methods/), we built methods that could be trusted — consistent, awaitable, and predictable. But reliability isn’t just design; it’s habit. The best asynchronous code feels calm under pressure because its author practices good etiquette.

### Use `async` and `await` together

Marking a method `async` without an `await` is like setting the table and never serving the meal. The method still runs synchronously, but adds unnecessary overhead. If nothing is truly asynchronous inside, remove `async`.

### Return `Task` or `Task<T>`, not `void`

Always return a `Task` so that callers can `await` completion, handle exceptions, and track flow. Reserve `async void` only for event handlers — the only place where no caller exists to observe results.

### Avoid blocking calls like `.Result` or `.Wait()`

These calls freeze threads and can create deadlocks in UI or server contexts. Always prefer `await`, which pauses execution without blocking.

### Use `ConfigureAwait(false)` in library or backend code

In libraries or ASP.NET Core applications, where no synchronization context is required, using `ConfigureAwait(false)` prevents unnecessary thread switching and improves performance.

```csharp
var content = await httpClient.GetStringAsync(url)
                              .ConfigureAwait(false);
```

### Handle exceptions at the awaiting point

Wrap `await` statements in `try/catch` blocks if you expect failures. Remember: exceptions propagate to where you `await`, not where they were thrown.

### Combine asynchrony and parallelism carefully

Use asynchrony for I/O-bound work and parallelism for CPU-bound work. Mixing both can be powerful but confusing — be deliberate about where waiting ends and work begins.

At its core, asynchronous etiquette is about respect — for threads, for resources, and for readability. Each method should do its part, yield when it must, and never block others. These habits keep your system graceful, scalable, and easy to reason about.

This concludes *The Art of Not Waiting* — a journey through the principles and practice of asynchronous programming in C#. Like the cooks in our kitchen, the best code doesn’t rush; it moves in rhythm with time, turning pauses into progress.
