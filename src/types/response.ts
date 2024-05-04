export type ResponseType = {
  data: [] | PaginatorResponseType;
  success: boolean;
  status: number;
  message: string;
};

export type PaginatorResponseType = {
  data: [];
  current_page: number;
  last_page: number;
  has_more: boolean;
};
