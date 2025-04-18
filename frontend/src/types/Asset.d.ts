export type Asset = {
  id: string;
  attributes: {
    title: string;
    description_short: string;
    description_long?: string;
    player_code: string;
    premiered_on?: string;
    object_type?: string;
    duration?: number;
    images?: Array<{
      image: string;
      profile: string;
      updated_at?: string;
    }>;
    availabilities?: {
      public: {
        start: string | null;
        end: string | null
      }
    };
    parent_tree?: {
      attributes?: {
        ordinal?: number;
        season?: {
          attributes?: {
            ordinal?: number;
            show?: {
              id: string;
              attributes?: {
                title?: string;
              }
            }
          }
        }
      }
    }
  }
}