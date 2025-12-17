CREATE OR REPLACE FUNCTION set_item_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.item_code IS NULL THEN
    NEW.item_code := generate_item_code(NEW.item_name, NEW.rarity);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_item_code
BEFORE INSERT ON item_data
FOR EACH ROW
EXECUTE FUNCTION set_item_code();
