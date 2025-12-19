create or replace view public.v_items_price_stale as
select
  i.item_code,
  i.item_name,
  lp.last_recorded_at,
  case
    when lp.last_recorded_at is null then null
    else floor(extract(epoch from (now() - lp.last_recorded_at)) / 86400)::int
  end as days_since_update,
  case
    when lp.last_recorded_at is null then 'MISSING'
    when lp.last_recorded_at < now() - interval '7 days' then 'STALE'
    else 'OK'
  end as price_status
from public.item_data i
left join lateral (
  select max(h.recorded_at) as last_recorded_at
  from public.item_price_history h
  where h.item_code = i.item_code
) lp on true;

revoke all on public.v_items_price_stale from anon, authenticated;

create view public.latest_item_prices with (security_invoker = on) as
select distinct on (iph.item_code)
  iph.item_code,
  id.item_name,
  iph.th_price,
  iph.td_price,
  iph.recorded_at
from item_price_history iph
join item_data id
  on id.item_code = iph.item_code
order by iph.item_code, iph.recorded_at desc;

CREATE VIEW public.latest_gold_rate WITH (security_invoker = on) AS
SELECT
  grh.gold_rate_sell,
  grh.gold_rate_buy,
  grh.recorded_at
FROM public.gold_rate_history grh
ORDER BY grh.recorded_at DESC
LIMIT 1;