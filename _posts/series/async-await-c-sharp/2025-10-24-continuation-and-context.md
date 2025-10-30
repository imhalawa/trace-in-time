---
layout: post
title: "5. Continuation and Context"
series: async-await
part: 5
description: "How C# resumes work after an await—the idea of continuation, context, and why it matters for UI and server code."
date: 2025-10-24
tags: [dotnet, async-await, series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/continuation-and-context/
---
## Continuation and Context

In the [previous part](/series/async-await/timing-vs-teamwork/), we saw how `async` and `await` orchestrate timing and teamwork. But what happens when the waiting ends? When the oven timer rings, the cook doesn't start over—they continue from where they left off. In C#, that continuation is the heartbeat of asynchrony.

When a method reaches an `await`, execution pauses. The compiler builds a **state machine** — a construct that remembers everything about the current method: local variables, progress, and what to do next. Once the awaited `Task` completes, the state machine resumes exactly where it left off, continuing the method’s execution seamlessly.

```csharp
using System.Net.Http;
using System.Net.Http.Json;

static async Task<string> AwaitableHelloWorld(string invokedBy = "no-one")
{
    var url = "https://postman-echo.com/get?message=hello%20world";
    using var http = new HttpClient();

    var response = await http.GetAsync(url);
    var result = await response.Content.ReadFromJsonAsync<Response>();

    Console.WriteLine($"{result!.Args.Message} InvokedBy: {invokedBy}");
    return result!.Args.Message;
}

static void SaySomething() =>
    Console.WriteLine("Brought the data, now it's continuation.");

static async Task Continuation()
{
    await AwaitableHelloWorld();
    SaySomething();
}

// e.g., await Continuation(); // from an async Main or test
```

Here, when `AwaitableHelloWorld()` hits an `await`, it pauses until the HTTP request completes. Once that happens, `Continuation()` resumes and proceeds to `SaySomething()`. That code is the continuation—the part that runs after the awaited operation finishes.

By default, `await` captures the current scheduling context and resumes there: the current **SynchronizationContext** (UI apps) or, if none, the **TaskScheduler** (typically the thread pool in ASP.NET Core). In desktop apps, this means continuations return to the UI thread so UI updates remain safe. In ASP.NET Core, there’s usually no synchronization context, so continuations run on a thread‑pool thread.

If your code doesn’t need to return to the original context, you can disable context capture with `ConfigureAwait(false)`. This avoids unnecessary context hops—especially useful in libraries or backend code. Don’t use it before code that must touch UI:

```csharp
var content = await httpClient.GetStringAsync(url)
                              .ConfigureAwait(false);
```

In simple terms, continuations are how asynchronous methods remember where they were. The context defines where they’ll pick back up. If the awaited operation is already complete, the continuation may run synchronously. Together, they keep the story flowing—no matter how many pauses it takes.

In the [`next part`](/series/async-await/when-something-burns/), we’ll look at what happens when something goes wrong inside an async method — how exceptions travel across awaits, and how to keep the kitchen from catching fire.
