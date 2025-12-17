export type Database = {
  public: {
    Enums: {
      item_name:
        | 'Essence of Life'
        | 'Lavish'
        | 'Mid Grade Agate Code'
        | 'Mid Grade Crystal Code'
        | 'Mid Grade Diamond Code'
        | 'High Grade Agate Code'
        | 'High Grade Crystal Code'
        | 'High Grade Diamond Code'
        | 'Card Box'
        | 'Ordinary Agate'
        | 'Ordinary Alteum'
        | 'Ordinary Diamond'
        | 'Polished Agate'
        | 'Polished Alteum'
        | 'Polished Diamond'
        | 'Dimensional Box Key';

      rarity_type:
        | 'Common'
        | 'Uncommon'
        | 'Rare'
        | 'Epic'
        | 'Unique'
        | 'Legendary';
    };

    Tables: {
      item_data: {
        Row: {
          id: string;
          item_code: string | null;
          item_name: Database['public']['Enums']['item_name'];
          rarity: Database['public']['Enums']['rarity_type'];
        };
        Insert: {
          id?: string;
          item_code?: string | null;
          item_name: Database['public']['Enums']['item_name'];
          rarity: Database['public']['Enums']['rarity_type'];
        };
        Update: {
          id?: string;
          item_code?: string | null;
          item_name?: Database['public']['Enums']['item_name'];
          rarity?: Database['public']['Enums']['rarity_type'];
        };
        Relationships: [];
      };

      item_price_history: {
        Row: {
          id: string;
          item_code: string;
          th_price: number;
          td_price: number;
          recorded_at: string | null; // timestamptz
        };
        Insert: {
          id?: string;
          item_code: string;
          th_price: number;
          td_price: number;
          recorded_at?: string | null;
        };
        Update: {
          id?: string;
          item_code?: string;
          th_price?: number;
          td_price?: number;
          recorded_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'item_price_history_item_code_fkey';
            columns: ['item_code'];
            referencedRelation: 'item_data';
            referencedColumns: ['item_code'];
          }
        ];
      };
    };

    Views: {
      latest_item_prices: {
        Row: {
          item_code: string;
          item_name: string;
          th_price: number;
          td_price: number;
          recorded_at: string | null; // timestamptz
        };
        Relationships: [];
      };
    }
  };
};
