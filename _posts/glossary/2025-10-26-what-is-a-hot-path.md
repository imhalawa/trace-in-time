---
layout: post
title: "Hot Path"
description: "A practical definition of a hot path—how to identify, measure, and optimize it in .NET."
date: 2025-10-26
tags: [dotnet, performance, glossary]
tags_color: "#4122aa"
permalink: /glossary/hot-path/
draft: false
---

## Definition

A hot path is code that runs very often or sits on the critical path of a request. Tiny costs here become visible. An extra allocation, work done twice, or a branch the CPU keeps guessing wrong will show up as slower responses and higher CPU.

## Impact

Hot paths change how the system feels under load. Small work repeated many times becomes large. Slow outliers get slower (p95/p99 are the slowest 5% and 1% of requests — see [percentiles](https://en.wikipedia.org/wiki/Percentile)). CPU and [GC](https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals) spend time on overhead instead of useful work.

## Identify (Measure)

Measure first. Use a profiler to see where time and memory go ([dotnet‑trace](https://learn.microsoft.com/dotnet/core/diagnostics/dotnet-trace), [PerfView](https://github.com/microsoft/perfview), or [Visual Studio Profiler](https://learn.microsoft.com/visualstudio/profiling/?view=vs-2022)). For tight loops or small methods, use [BenchmarkDotNet](https://benchmarkdotnet.org/).

Read [flame graphs](http://www.brendangregg.com/flamegraphs.html) — the stacked chart of where CPU time is spent — and allocation views. Look for methods near the top. Watch steady state: high request rates, tight loops, long‑running sessions. Check counters: GC/sec (how often GC runs), allocation rate (MB/s), [thread‑pool starvation](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/debug-threadpool-starvation) (threads can’t keep up), and p95/p99 latency (slow tail).

{: .tip }
Percentiles (p95/p99) tell you about the slow tail. Improving the hot path often reduces that tail more than it changes the average.

{: .note }
Further reading on percentiles and tail latency: [Percentile (Wikipedia)](https://en.wikipedia.org/wiki/Percentile), [The Tail at Scale (ACM Queue)](https://queue.acm.org/detail.cfm?id=1814327).

> ThreadPool starvation occurs when the pool has no available threads to process new work items and it often causes applications to respond slowly.

As a simple rule of thumb: if one method uses ~10% or more of CPU or allocations, treat it as hot.

{: .important }
If you haven’t measured it, it isn’t a hot path. It’s a guess.

## Backend Example: High‑RPS JSON endpoint

{: .note }
RPS means requests per second.

Imagine an endpoint that fetches two services, merges the result, and returns JSON. A slow version creates new objects on every request and waits for the calls one by one:

```csharp
// Naive: extra allocations + sequential I/O
static readonly Uri Svc1 = new("https://svc1/api");
static readonly Uri Svc2 = new("https://svc2/api");

public async Task<IActionResult> Get()
{
    using var http = new HttpClient(); // per-request instance
    var json1 = await http.GetStringAsync(Svc1);
    var json2 = await http.GetStringAsync(Svc2);

    var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    var a = JsonSerializer.Deserialize<A>(json1, options);
    var b = JsonSerializer.Deserialize<B>(json2, options);
    return Results.Json(Combine(a, b), options);
}
```

A faster, cleaner version reuses what can be reused and runs I/O concurrently:

```csharp
// Improved: reuse + concurrent I/O
static readonly JsonSerializerOptions JsonOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

public async Task<IActionResult> Get(HttpClient http) // injected via IHttpClientFactory
{
    var t1 = http.GetStringAsync(Svc1);
    var t2 = http.GetStringAsync(Svc2);
    var (json1, json2) = (await t1, await t2);

    var a = JsonSerializer.Deserialize<A>(json1, JsonOpts);
    var b = JsonSerializer.Deserialize<B>(json2, JsonOpts);
    return Results.Json(Combine(a, b), JsonOpts);
}
```

The difference is simple: less allocation and no unnecessary waiting.

## Backend Example: Cache‑backed call

Consider a method that first checks a cache and, only on a miss, queries a database. With `Task<T>` it’s fine:

```csharp
public Task<User> GetUserAsync(string id)
    => cache.TryGet(id, out var user)
       ? Task.FromResult(user)
       : FetchFromDbAsync(id);
```

If most calls hit the cache, switching to `ValueTask<User>` can remove some allocations:

```csharp
public ValueTask<User> GetUserAsync(string id)
    => cache.TryGet(id, out var user)
       ? ValueTask.FromResult(user)
       : new ValueTask<User>(FetchFromDbAsync(id));
```

Only do this when profiles show real savings, and keep the rule in mind: await a `ValueTask` once, and prefer `Task` when composing with APIs that expect `Task`. See [`ValueTask`](https://learn.microsoft.com/dotnet/api/system.threading.tasks.valuetask) for details.

## Practices (ASP.NET Core)

Keep the hot path short and quiet. Reuse `HttpClient` via [`IHttpClientFactory`](https://learn.microsoft.com/aspnet/core/fundamentals/http-requests?view=aspnetcore-8.0). Reuse serializer options and large buffers. Avoid doing the same work twice per request. Prefer true async I/O and avoid `.Result` and `.Wait()`. If you need multiple I/O calls, start them, then await them together with `Task.WhenAll`. Don’t wrap I/O with `Task.Run`; use it only to move CPU‑bound work off the request thread. When many requests need to update shared data, avoid a single bottleneck; split the work by key or move it out of the hot path.

## ValueTask and hot paths

Start with `Task`—it’s simple and composes well. Reach for `ValueTask` only when a profiler shows the hot path is allocation‑heavy and often completes synchronously (like cache hits). If you convert a `ValueTask` to `Task`, you pay an allocation; measure end‑to‑end to make sure it’s worth it.

Optimize what you’ve measured. Keep the path clear. Let numbers justify every change.
