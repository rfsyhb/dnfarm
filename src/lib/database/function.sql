CREATE OR REPLACE FUNCTION generate_item_code(
  p_name item_name,
  p_rarity rarity_type
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  words text[];
  initials text := '';
  rarity_code text;
  w text;
BEGIN
  -- Split name into words
  words := string_to_array(p_name::text, ' ');

  -- Ambil huruf pertama tiap kata
  FOREACH w IN ARRAY words LOOP
    initials := initials || upper(left(w, 1));
  END LOOP;

  -- Mapping rarity (2 huruf)
  rarity_code := CASE p_rarity
    WHEN 'Common' THEN 'CM'
    WHEN 'Uncommon' THEN 'UC'
    WHEN 'Rare' THEN 'RA'
    WHEN 'Epic' THEN 'EP'
    WHEN 'Unique' THEN 'UQ'
    WHEN 'Legendary' THEN 'LG'
  END;

  RETURN initials || '-' || rarity_code;
END;
$$;