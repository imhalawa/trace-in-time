---
layout: post
title: "7. Designing Reliable Async Methods"
series: async-await
part: 7
description: "Building predictable asynchronous methods in C#—avoiding pitfalls, ensuring consistency, and writing code that never loses track."
date: 2025-10-26
tags: [dotnet, async-await, series]
tags_color: "#4122aa"
image: /images/series/async-await/async-await.png
permalink: /series/async-await/designing-reliable-async-methods/
---
## Designing Reliable Async Methods

In the [previous part](/series/async-await/when-something-burns/), we saw how asynchronous code can fail—and how to keep the fire contained. But prevention is better than cleanup. Designing reliable async methods starts with consistency: every method should be predictable in how it runs, finishes, and reports problems.

A good `async` method always returns something awaitable—usually `Task` or `Task<T>`. That’s the key to reliability: callers can await completion, handle exceptions, and control flow without hidden behavior. Also common: `ValueTask`/`ValueTask<T>` for perf‑critical paths, and `IAsyncEnumerable<T>` for asynchronous streams. `async void`, by contrast, is a blind spot—reserve it for event handlers only.

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

This method is reliable because it returns a `Task`. Any exception thrown inside is captured and rethrown at the await site—never lost, never silent. The caller decides how to handle it.

Compare that with an `async void` method:

```csharp
async void DoX()
{
    await Task.Delay(1000);
    throw new Exception("This will crash the app.");
}
```

Here, if the exception occurs after an await, it bubbles to the synchronization context and can crash the app because no `Task` exists to represent the method’s state. The caller can’t catch or await what isn’t reported.

The same principle applies to return types. Keep them consistent: a `Task<T>` when returning results, a `Task` when there’s no result. If you truly must “fire and forget,” prefer returning `Task` anyway and handle/log exceptions inside; avoid `async void` outside event handlers. Don’t mix sync and async in one method—blocking with `.Result` or `.Wait()` defeats asynchrony and can deadlock.

Designing reliable asynchronous methods means keeping the chain intact. Each function awaits the one before it, propagating success or failure through `Task` objects. This design lets your application stay composed under pressure—no missed signals, no silent failures.

## Practical Tips for reliability

- Name methods with the `Async` suffix (e.g., `GetStocksAsync`).
- Accept a `CancellationToken` and honor it; treat `OperationCanceledException` as expected when canceled.
- Don’t catch `Exception` in libraries; catch specific exceptions or let callers decide. Always clean up in `finally`.
- Prefer true async I/O over `Task.Run`; reserve `Task.Run` for CPU‑bound offload.
- Prefer `Task`/`Task<T>`. Choose `ValueTask` only after profiling shows allocation savings in a [hot path](/glossary/hot-path/) where the operation completes synchronously most of the time (e.g., cache hits); otherwise stick with `Task`.
- For multiple operations, use `Task.WhenAll` to run concurrently and handle aggregated exceptions deliberately.

Example of a predictable async signature:

```csharp
public async Task<IReadOnlyList<Stock>> GetStocksAsync(
    string symbol,
    CancellationToken cancellationToken)
{
    using var http = new HttpClient();
    var json = await http.GetStringAsync($"https://example.com/stocks/{symbol}", cancellationToken)
                         .ConfigureAwait(false);

    return JsonSerializer.Deserialize<List<Stock>>(json) ?? Array.Empty<Stock>();
}
```

## Next

In the [`next part`](/series/async-await/the-etiquette-of-asynchrony/), we’ll wrap up this series with the small habits and best practices that keep asynchronous code graceful — the etiquette that turns chaos into flow.
