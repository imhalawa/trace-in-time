---
layout: post
title: "When Something Burns"
series: "async-await"
part: 6
description: "Understanding how exceptions work in asynchronous code — where they go, how to catch them, and why context matters."
date: 2025-10-25
tags: [dotnet, "async/await", series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/when-something-burns/
---

In the [`previous part`](/series/async-await/continuation-and-context/), we explored how asynchronous methods pick up exactly where they left off. But even in a well-run kitchen, something occasionally burns. In code, that’s an exception — and in asynchronous code, knowing where it surfaces is half the battle.

When an exception occurs before the first `await`, it behaves just like synchronous code: the exception is thrown immediately. But when it happens *after* an `await`, it’s wrapped inside the returned `Task`. That means the exception doesn’t disappear — it simply travels forward in time, waiting to be observed the moment you `await` that `Task`.

This difference changes how and where you handle errors. The right place to catch them isn’t where they’re thrown, but where they’re awaited. That’s where the continuation resumes — and where you regain control.

```csharp
private async void Search_Click(object sender, RoutedEventArgs e)
{
    try
    {
        BeforeLoadingStockData();
        var store = new DataStore();
        var response = await store.GetStockPrices(StockIdentifier.Text);
        Stocks.ItemsSource = response;
    }
    catch (Exception ex)
    {
        Notes.Text = $"Unable to get stock prices for {StockIdentifier.Text}";
    }

    AfterLoadingStockData();
}
```

In this example, any exception thrown inside `GetStockPrices()` will surface when it’s awaited. The `try/catch` around the `await` ensures the application handles it gracefully — essential in UI apps, where unhandled exceptions can terminate the process.

Avoid `async void` except for event handlers like this one. Without a `Task` return type, the method can’t be awaited, meaning the caller can’t observe or handle its completion. Exceptions that occur there can crash the app silently.

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

Using `.Result` or `.Wait()` to force a task’s completion is just as dangerous. These calls block the thread and wrap exceptions inside an `AggregateException`, hiding the real cause and risking deadlocks in single-threaded environments.

In short, asynchronous exceptions behave like smoke — they rise to the point where the `Task` is awaited, not where the fire started. Handle them there, and your program keeps running even when something burns.

In the [`next part`](/series/async-await/designing-reliable-async-methods/), we’ll look at how to design async methods that don’t just survive errors but stay predictable and reliable from start to finish.
