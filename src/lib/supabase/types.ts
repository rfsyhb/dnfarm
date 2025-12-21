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
          item_code: string;
          item_name: Database['public']['Enums']['item_name'];
          rarity: Database['public']['Enums']['rarity_type'];
          stampable: boolean;
          stamp_total: number;
        };
        Insert: {
          item_name: Database['public']['Enums']['item_name'];
          rarity: Database['public']['Enums']['rarity_type'];
          stampable: boolean;
          stamp_total?: number;
        };
        Update: {
          item_code: string | null;
          item_name: Database['public']['Enums']['item_name'];
          rarity?: Database['public']['Enums']['rarity_type'];
          stampable?: boolean;
          stamp_total?: number;
        };
        Relationships: [];
      };

      item_price_history: {
        Row: {
          id: string;
          item_code: string;
          th_price: number;
          td_price: number;
          recorded_at: string; // timestamptz
        };
        Insert: {
          item_code: string;
          th_price: number;
          td_price: number;
        };
        Update: {
          item_code: string;
          th_price?: number;
          td_price?: number;
          recorded_at: string | null;
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

      gold_rate_history: {
        Row: {
          id: string;
          gold_rate_sell: number;
          gold_rate_buy: number;
          recorded_at: string; // timestamptz
        };
        Insert: {
          gold_rate_sell: number;
          gold_rate_buy: number;
        }
      }
    };
    
    Views: {
      latest_item_prices: {
        Row: {
          item_code: string;
          item_name: string;
          th_price: number;
          td_price: number;
          recorded_at: string; // timestamptz
        };
        Relationships: [];
      };
      latest_gold_rate: {
        Row: {
          gold_rate_sell: number;
          gold_rate_buy: number;
          recorded_at: string; // timestamptz
        };
      };
    };
  };
};
