---
layout: post
title: "Designing Reliable Async Methods"
series: "async-await"
part: 7
description: "Building predictable asynchronous methods in C# — avoiding pitfalls, ensuring consistency, and writing code that never loses track."
date: 2025-10-26
tags: [dotnet, "async/await", series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/designing-reliable-async-methods/
---

In the [`previous part`](/series/async-await/when-something-burns/), we saw how asynchronous code can fail — and how to keep the fire contained. But prevention is better than cleanup. Designing reliable async methods starts with consistency: every method should be predictable in how it runs, finishes, and reports problems.

A good `async` method always returns something awaitable — usually `Task` or `Task<T>`. That’s the key to reliability: callers can `await` completion, handle exceptions, and control flow without hidden behavior. `async void`, by contrast, is a blind spot. It should be reserved only for event handlers, where no caller exists to observe the result.

```csharp
private async Task GetStocksAsync()
{
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
}
```

This method is reliable because it returns a `Task`. Any exception thrown inside is captured and rethrown at the `await` site — never lost, never silent. The caller decides how to handle it.

Compare that with an `async void` method:

```csharp
async void DoX()
{
    await Task.Delay(1000);
    throw new Exception("This will crash the app.");
}
```

Here, if the exception occurs, the application may crash silently because no `Task` exists to represent the method’s state. The runtime can’t catch or await what isn’t reported.

The same principle applies to return types. Keep them consistent — a `Task` for fire-and-forget operations, a `Task<T>` for those returning results. Avoid mixing sync and async patterns in one method; blocking a thread with `.Result` or `.Wait()` defeats the purpose of asynchrony.

Designing reliable asynchronous methods means keeping the chain intact. Each function awaits the one before it, propagating success or failure through `Task` objects. This design lets your application stay composed under pressure — no missed signals, no silent failures.

In the [`next part`](/series/async-await/the-etiquette-of-asynchrony/), we’ll wrap up this series with the small habits and best practices that keep asynchronous code graceful — the etiquette that turns chaos into flow.
