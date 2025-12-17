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
select distinct on (item_code)
  item_code,
  th_price,
  td_price,
  recorded_at
from item_price_history
order by item_code, recorded_at desc;