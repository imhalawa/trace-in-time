---
layout: post
title: "Continuation and Context"
series: "async-await"
part: 5
description: "How C# resumes work after an await — the idea of continuation, context, and why it matters for UI and server code."
date: 2025-10-24
tags: [dotnet, "async/await", series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/continuation-and-context/
---

In the [`previous part`](/series/async-await/timing-vs-teamwork/), we saw how `async` and `await` orchestrate timing and teamwork. But what happens when the waiting ends? When the oven timer rings, the cook doesn’t start over — they continue from where they left off. In C#, that continuation is the heartbeat of asynchrony.

When a method reaches an `await`, execution pauses. The compiler builds a **state machine** — a construct that remembers everything about the current method: local variables, progress, and what to do next. Once the awaited `Task` completes, the state machine resumes exactly where it left off, continuing the method’s execution seamlessly.

```csharp
async Task<string> AwaitableHelloWorld(string invokedBy = "no-one")
{
    var url = "https://postman-echo.com/get?message=hello%20world";
    using var http = new HttpClient();

    var response = await http.GetAsync(url);
    var result = await response.Content.ReadFromJsonAsync<Response>();

    Console.WriteLine(result.Args.Message + " InvokedBy: " + invokedBy);
    return result.Args.Message;
}

public void SaySomething()
{
    Console.WriteLine("Brought the data, now it's continuation.");
}

public async Task Continuation()
{
    await AwaitableHelloWorld();
    SaySomething();
}

await Continuation();
```

Here, when `AwaitableHelloWorld()` hits an `await`, it pauses until the HTTP request completes. Once that happens, it continues to the next line — `SaySomething()`. That line runs inside the **continuation context** — the portion of code that executes after the awaited operation finishes.

By default, C# tries to resume on the same **synchronization context** where the async call began. In desktop apps, that usually means the UI thread — ensuring that UI updates remain safe. In server applications like ASP.NET Core, there’s no fixed UI thread, so continuations often resume on any available thread from the pool, improving efficiency.

If your code doesn’t depend on returning to the original context, you can disable context capture using `ConfigureAwait(false)`. This small optimization prevents unnecessary thread switching, especially in library or backend code:

```csharp
var content = await httpClient.GetStringAsync(url)
                              .ConfigureAwait(false);
```

In simple terms, continuations are how asynchronous methods remember where they were. The context defines *where* they’ll pick back up. Together, they make sure the story flows naturally — no matter how many pauses it takes.

In the [`next part`](/series/async-await/when-something-burns/), we’ll look at what happens when something goes wrong inside an async method — how exceptions travel across awaits, and how to keep the kitchen from catching fire.
