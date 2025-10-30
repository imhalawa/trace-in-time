---
layout: post
title: "2. Understanding Async and Await"
series: "The Art of Not Waiting"
part: 2
description: "Demystifying how C# pauses and resumes work - the state machine, continuation, and why async/await reads like plain code."
date: 2025-10-21
tags: [dotnet, async-await, series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/understanding-async-and-await/
---

## Understanding Async and Await

In the [previous part](/series/async-await/the-art-of-not-waiting/), our kitchen found its rhythm: three workers, one room, no one standing still. This is where that rhythm turns into code. C# doesn't make work faster; it makes waiting cooperative. The trick is two small words - `async` and await - that let a method pause without freezing a thread.

`async` doesn't create threads or make a method asynchronous by itself. It enables the use of `await` inside the method and tells the compiler, "this routine may need to pause and resume." Under the hood, the compiler rewrites the method into a state machine—a tiny structure that can suspend at each `await` and later continue at the next line with local variables intact.

`await` marks where the pause can happen. If the awaited operation isn’t complete, the method yields without blocking. The current thread returns to its caller (UI loop or thread pool) and can do other work. When the operation completes, the state machine schedules the continuation and resumes the method right after the `await`. In UI apps, that continuation typically runs on the original synchronization context; on ASP.NET Core it usually resumes on a thread‑pool thread. If the operation is already complete, the continuation may run synchronously.

```csharp
using System.Net.Http;
using System.Text.Json;

record Response(string Ticker, string Identifier, string TradeDate,
                string? Open, string? High, string? Low, string? Close,
                int Volume, double Change, double ChangePercent);

async Task<IEnumerable<Response>> GetStocksAsync(string symbol)
{
    using var http = new HttpClient();
    var baseUrl = "https://ps-async.fekberg.com/api/stocks";

    // The thread is released while these I/O operations are in flight
    var response = await http.GetAsync($"{baseUrl}/{symbol}");
    var json     = await response.Content.ReadAsStringAsync();

    return JsonSerializer.Deserialize<IEnumerable<Response>>(json)
           ?? Enumerable.Empty<Response>();
}
```

Each `await` above is a deliberate pause: while the network request travels, the thread is free. When the data arrives, execution continues exactly where it left off. No manual callbacks. No thread juggling. Just readable, sequential code that cooperates with time.

Async methods return these idiomatic types:

- `Task` — completes without a value.
- `Task<T>` — completes with a result.
- `void` — only for event handlers; avoid elsewhere because callers can’t await or catch exceptions.

Also common:

- `ValueTask`/`ValueTask<T>` — for performance-sensitive paths to reduce allocations.
- `IAsyncEnumerable<T>` — asynchronous streams consumed with `await foreach`.

Exceptions thrown inside an async method flow through the returned task and surface when you `await` it. For cooperative cancellation, pass a `CancellationToken` and forward it to async APIs.

The essence is simple: `async` prepares a method to pause; `await` decides where it pauses. The compiler's state machine and continuations make the whole thing feel like plain, top-to-bottom code. Your program keeps moving—like a kitchen where every worker knows when to step aside and when to return.

In [the next part](/series/async-await/why-async-await-change-everything/), we'll look at why this matters under pressure: what goes wrong when you block with `.Result` or `.Wait()`, and how `await` prevents frozen UIs and starved servers.
