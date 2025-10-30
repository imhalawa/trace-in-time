---
layout: post
title: "6. When Something Burns"
series: async-await
part: 6
description: "Understanding how exceptions work in asynchronous code—where they go, how to catch them, and why context matters."
date: 2025-10-25
tags: [dotnet, async-await, series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/when-something-burns/
---
## When Something Burns

In the [previous part](/series/async-await/continuation-and-context/), we explored how asynchronous methods pick up exactly where they left off. But even in a well-run kitchen, something occasionally burns. In code, that's an exception—and in asynchronous code, knowing where it surfaces is half the battle.

When an exception occurs before the first `await`, it behaves just like synchronous code: the exception is thrown immediately. But when it happens after an `await`, it's captured by the returned `Task`. The exception doesn’t disappear—it travels forward in time and rethrows when you await that `Task`.

This difference changes how and where you handle errors. Most often you catch them where you await, or inside the async method around the awaited operation. That’s where the continuation resumes—and where you regain control.

```csharp
private async void Search_Click(object sender, RoutedEventArgs e)
{
    BeforeLoadingStockData();
    try
    {
        var store = new DataStore();
        var response = await store.GetStockPrices(StockIdentifier.Text);
        Stocks.ItemsSource = response;
    }
    catch (Exception)
    {
        Notes.Text = $"Unable to get stock prices for {StockIdentifier.Text}";
    }
    finally
    {
        AfterLoadingStockData();
    }
}
```

In this example, any exception thrown inside `GetStockPrices()` surfaces when it’s awaited. The `try/catch` around the `await` ensures the app handles it gracefully, and the `finally` keeps your UI cleanup predictable—essential in UI apps, where unhandled exceptions can terminate the process.

Avoid `async void` except for event handlers like this one. Without a `Task` return type, the method can’t be awaited, so callers can’t observe completion. Exceptions bubble to the synchronization context and can crash the process—they can’t be caught by the caller.

```csharp
async void NonAwaitable()
{
    var result = await awaitableMethod(); // Throws, but can’t be caught externally
}

async Task Awaitable()
{
    var result = await awaitableMethod(); // Exceptions flow through Task
}
```

Using `.Result` or `.Wait()` to force a task's completion is just as dangerous. These calls block the thread and wrap exceptions inside an `AggregateException`, hiding the real cause and risking deadlocks in single-threaded environments.

Prefer `await` so exceptions flow naturally and preserve stack traces. `task.GetAwaiter().GetResult()` unwraps the exception, but still blocks and can deadlock on a captured context—avoid it on UI threads and ASP.NET Core request threads.

Not every burn is a disaster: cancellation is you taking the pan off the heat. Pass a `CancellationToken` and treat `OperationCanceledException` as a normal outcome, not an error:

```csharp
try
{
    await DoWorkAsync(token);
}
catch (OperationCanceledException) when (token.IsCancellationRequested)
{
    // expected – user canceled
}
```

When awaiting multiple tasks, exceptions aggregate. `await Task.WhenAll(tasks)` throws one exception; the rest are in `ex.InnerExceptions` on the returned task. Handle them deliberately.

In short, asynchronous exceptions behave like smoke — they rise to the point where the `Task` is awaited, not where the fire started. Handle them there, and your program keeps running even when something burns.

In the [`next part`](/series/async-await/designing-reliable-async-methods/), we’ll look at how to design async methods that don’t just survive errors but stay predictable and reliable from start to finish.
