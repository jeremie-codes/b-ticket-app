export type EventType = {
  author_name: string;
  author_picture: string;
  category: EventCategoryType;
  category_id: number;
  created_at: string;
  date: string;
  description: string;
  id: number;
  image: string;
  location: string;
  prices: EventPricingType[];
  media: EventMediaType[];
  time_end: string;
  time_start: string;
  title: string;
  updated_at: string;
  is_favorite?: boolean;
};

export type EventCategoryType = {
  name: string;
  slug: string;
  description: string;
};

export type EventMediaType = {
  collection_name: string;
  conversions_disk: string;
  created_at: string;
  custom_properties: [];
  disk: string;
  file_name: string;
  generated_conversions: [];
  id: 5;
  manipulations: [];
  mime_type: string;
  model_id: number;
  model_type: string;
  name: string;
  order_column: number;
  original_url: string;
  preview_url: string;
  responsive_images: MediaOrifinalType;
  size: number;
  updated_at: string;
  uuid: string;
};

export type EventPricingType = {
  amount?: string;
  category: string;
  created_at: string;
  currency?: string;
  event_id: number;
  id: number;
  updated_at: string;
};

type MediaOrifinalType = {
  media_library_original: ReponsiveImageType;
};
type ReponsiveImageType = {
  base64svg: string;
  urls: string[];
};
