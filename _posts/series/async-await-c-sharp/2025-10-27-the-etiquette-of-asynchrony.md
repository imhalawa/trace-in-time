---

layout: post
title: "8. The Habits of Asynchrony"
series: async-await
part: 8
description: "Practical habits for writing graceful asynchronous code in C#—from safe awaits to consistent patterns that keep systems smooth."
date: 2025-10-27
tags: [dotnet, async-await, series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/the-etiquette-of-asynchrony/
---

## The Habits of Asynchrony

In the [previous part](/series/async-await/designing-reliable-async-methods/), we built methods that could be trusted—consistent, awaitable, and predictable. But reliability isn't just design; it's habit. The best asynchronous code feels calm under pressure because its author practices good habits.

### Use `async` and `await` together

Marking a method `async` without an `await` is like setting the table and never serving the meal. The method still runs synchronously and returns a completed task, adding overhead without benefit. If nothing is truly asynchronous inside, remove `async` or make the method synchronous.

### Return `Task` or `Task<T>`, not `void`

Always return a `Task` so callers can await completion, handle exceptions, and track flow. Reserve `async void` only for event handlers—the only place where no caller exists to observe results. For streaming, use `IAsyncEnumerable<T>`. Consider `ValueTask` only on measured [hot paths](/glossary/hot-path/).

### Avoid blocking calls like `.Result` or `.Wait()`

These calls freeze threads and can create deadlocks in UI or server contexts. Prefer `await`, which pauses execution without blocking and preserves exception flow.

### Use `ConfigureAwait(false)` in library or backend code

In libraries, `ConfigureAwait(false)` avoids capturing a context you don't own and prevents unnecessary hops. In ASP.NET Core there’s typically no synchronization context, so it often has no effect. Don’t use it before code that must touch UI.

```csharp
var content = await httpClient.GetStringAsync(url)
                              .ConfigureAwait(false);
```

### Handle exceptions at the awaiting point

Wrap `await` statements in `try/catch` when you expect failures. Remember: exceptions surface where you await, not where they were thrown.

### Combine asynchrony and parallelism carefully

Use asynchrony for I/O-bound work and parallelism for CPU-bound work. Compose concurrent I/O with `Task.WhenAll`; use `Task.Run` only to offload CPU work—never to wrap I/O.

### Honor cancellation and name intent

- Accept and pass `CancellationToken` where appropriate; treat cancellation as an expected outcome, not an error.
- Name async methods with the `Async` suffix (e.g., `LoadAsync`) and keep method behavior consistent with the name.

At its core, asynchronous practice is about respect—for threads, for resources, and for readability. Each method should do its part, yield when it must, and never block others. These habits keep your system graceful, scalable, and easy to reason about.

This concludes *The Art of Not Waiting*—a journey through the principles and practice of asynchronous programming in C#. Like the cooks in our kitchen, the best code doesn't rush; it moves in rhythm with time, turning pauses into progress.
