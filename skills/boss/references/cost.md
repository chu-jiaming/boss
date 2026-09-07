# Official-price cost accounting

Use official token prices as the primary cost metric. With subscription login call it official-price equivalent cost, not an actual API bill or a measurement of Plus allowance. Do not change authentication to obtain this metric.

Use the exact model's official provider price page. Record model ID, source URL, retrieval date, currency, unit, and applicable service tier. Reuse a dated price snapshot for the session; refresh on model/tier changes, explicit requests, or known staleness. Freeze the same snapshot for a comparison. Do not permanently bake current prices or a model price ratio into skill instructions.

For per-million-token text rates:

```text
call_cost = (uncached_input * input_rate
           + cached_input * cached_rate
           + billable_output * output_rate) / 1_000_000
run_cost = sum(all Boss calls) + sum(all Worker calls)
saving = (single_Boss_baseline - run_cost) / single_Boss_baseline
```

If total input includes cached input, subtract cached input before pricing uncached input. Follow each model's official treatment of reasoning tokens; do not add them twice if included in billable output. Apply actual long-context, speed, batch, or modality rates only when eligible. Separate non-token service costs. Include failures, startup context, scheduling and review calls; waiting alone is not token consumption.

Before delegating, make a short estimate: saved Boss execution cost should exceed Worker work plus additional Boss scheduling, review and likely rework. Do not produce elaborate estimates for every leaf task. Low input price alone does not establish low total task cost. Fixed Worker identity remains binding even if a cheaper candidate exists.

Use measured tokens when exposed by the host, otherwise label estimates and their assumptions. Missing prices or usage are `unknown`, not zero. Do not ask Workers to guess exact billing usage. If no supported estimate exists, report that cost cannot be calculated and preserve an explicit model selection.

Compare like tasks with the same starting artifacts and acceptance criteria during deliberate evaluation. Never rerun ordinary user work just to generate a baseline. Without a measured baseline, label any savings estimate as estimated; zero baseline makes the ratio undefined. Track quality and elapsed time alongside cost.
