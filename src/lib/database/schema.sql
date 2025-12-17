CREATE TYPE item_name AS ENUM (
  'Essence of Life',
  'Lavish',
  'Mid Grade Agate Code',
  'Mid Grade Crystal Code',
  'Mid Grade Diamond Code',
  'High Grade Agate Code',
  'High Grade Crystal Code',
  'High Grade Diamond Code',
  'Card Box',
  'Ordinary Agate',
  'Ordinary Alteum',
  'Ordinary Diamond',
  'Polished Agate',
  'Polished Alteum',
  'Polished Diamond',
  'Dimensional Box Key'
);

CREATE TYPE rarity_type AS ENUM (
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Unique',
  'Legendary'
);

CREATE TABLE item_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_code text UNIQUE,
  item_name item_name NOT NULL,
  rarity rarity_type NOT NULL
);

ALTER TABLE item_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all" ON item_data
  FOR SELECT
  TO public
  USING (true);

CREATE TABLE item_price_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_code text NOT NULL references item_data(item_code),
  th_price integer NOT NULL,
  td_price integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE item_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all" ON item_price_history
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_item_price_history_item_time
ON item_price_history (item_code, recorded_at DESC);