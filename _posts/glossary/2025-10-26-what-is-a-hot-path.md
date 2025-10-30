---
layout: post
title: "What Is a Hot Path?"
description: "A clear, practical definition of a hot path—how to spot it, why it matters, and how to treat it in .NET."
date: 2025-10-26
tags: [dotnet, performance, glossary]
tags_color: "#4122aa"
permalink: /glossary/hot-path/
draft: false
---

## What Is a Hot Path?

A hot path is the stretch of code that runs so frequently—or is so central to a workload—that even small inefficiencies have a big impact. It’s the busy pass in a kitchen: every plate goes through here, so every second (and allocation) counts.

Hot paths are not about “fast for the sake of fast.” They’re about keeping critical flows smooth and predictable under load: request handling, tight render loops, serialization in a pipeline, or the inner body of a high‑RPS endpoint.

## Why It Matters

- Small costs add up: an extra allocation or lock in a hot path repeats millions of times.
- Latency variance grows: jitter in a hot path becomes user‑visible stutter or tail latency.
- Throughput drops: CPU and GC burn on overhead instead of useful work.

## How To Spot One (Measure)

- Profile representative runs (e.g., dotnet-trace, PerfView, Visual Studio Profiler, BenchmarkDotNet microbenchmarks for focused cases).
- Look for methods dominating CPU time or allocation flame graphs.
- Watch steady‑state behavior: high request rates, long sessions, or tight loops.
- Confirm with counters: GC collections/sec, LOH/SOH allocation rates, thread pool starvation, tail latency (p95/p99).

If you didn’t measure it, it’s not a hot path yet—it’s just a hunch.

## Typical .NET Hot Paths

- High‑RPS web endpoints before awaiting I/O (validation, routing, serialization, header parsing).
- Serialization/deserialization loops and formatters.
- Per‑frame update/render loops (games, realtime dashboards).
- Tight data transforms: hashing, compression, and parsers.

## How To Treat Hot Paths

- Minimize allocations: reuse buffers; prefer span‑based APIs; cache immutable data.
- Avoid unnecessary abstraction layers in the inner loop; keep call chains shallow.
- Prefer struct enumerators/value types only when they measurably reduce allocations and don’t complicate correctness.
- Keep locks off the hot path; prefer lock‑free or partitioned state when possible.
- Avoid blocking (I/O or `.Result`/`.Wait()`); use true async I/O and compose work with `Task.WhenAll` where appropriate.
- Keep branches predictable; precompute decisions outside the loop.

## `ValueTask` And Hot Paths

- Default to `Task`/`Task<T>` for async APIs—they compose well and are simple.
- Consider `ValueTask` only after profiling shows it reduces allocations in a hot path where calls complete synchronously most of the time (e.g., cache hits). Document the trade‑offs:
  - A `ValueTask` can be awaited only once and is more awkward to compose.
  - Misuse can be slower than `Task`; measure end‑to‑end, not just microbenchmarks.

## Quick Checklist

- Is this code on the critical path of high‑frequency or high‑volume work?
- Do profiles show it dominating CPU time or allocations?
- Can I remove an allocation, a lock, or a virtual/indirect call here?
- Did I validate improvements with before/after measurements and tail latency?

Hot paths deserve care—but also restraint. Optimize what you’ve measured, keep the code clear, and prove every change with numbers.

