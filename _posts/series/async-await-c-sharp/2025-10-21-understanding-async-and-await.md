---
layout: post
title: "Understanding Async and Await"
series: "async-await"
part: 2
description: "Demystifying how C# pauses and resumes work — the state machine, continuation, and why async/await reads like plain code."
date: 2025-10-21
tags: [dotnet, "async/await", series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/understanding-async-and-await/
---

Understanding Async and Await

In the [previous part](/series/async-await/the-art-of-not-waiting/), our kitchen found its rhythm: three workers, one room, no one standing still. This is where that rhythm turns into code. C# doesn’t make work faster; it makes waiting cooperative. The trick is two small words — `async` and await — that let a method pause without freezing a thread.

`async` doesn’t create threads or make a method asynchronous by itself. It enables the use of await inside the method and tells the compiler, “this routine may need to pause and resume.” Under the hood, the compiler rewrites the method into a state machine — a tiny structure that can suspend at each await and later continue from the exact next line with local variables intact.

await marks where the pause can happen. If the awaited task hasn’t completed, the method yields control immediately. The thread that was executing it returns to the pool and can do something else. When the task completes, the state machine schedules the continuation and resumes the method right after the await. In UI apps, that continuation typically returns to the original synchronization context (so you can safely touch UI); on servers like ASP.NET Core, it resumes on a thread-pool thread by default.

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

An async method must return one of three types:

- `Task` — work completes without a return value.
- `Task<T>` — work completes and produces a result.
- `void` — only for event handlers; avoid elsewhere because callers can’t `await` or catch exceptions properly.

The essence is simple: async prepares a method to pause; `await` decides where it pauses. The compiler’s state machine and continuations make the whole thing feel like plain, top-to-bottom code. Your program keeps moving — like a kitchen where every worker knows when to step aside and when to return.

In [the next part](/series/async-await/why-async-await-change-everything/), we’ll look at why this matters under pressure: what goes wrong when you block with `.Result` or `.Wait()`, and how `await` prevents frozen UIs and starved servers.
