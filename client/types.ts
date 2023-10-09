interface QueryDetail {
  page: null | number;
  categoryArrToLowerCase: string[];
  sorting: string;
}

interface ImageData {
  isPng: boolean;
  resolution: string;
  previewUrl: string;
  imageEndpoint: string;
}

interface ApiResponseSearch {
  status: boolean;
  message: string;
  queryDetail: QueryDetail;
  data: ImageData[];
}

type ApiResponseWallpaper = {
  status: boolean;
  message: string;
  queryDetail: {
    imageEndpoint: string;
  };
  data: {
    name: string;
    resolution: string;
    imageUrl: string;
    properties: {
      uploader: string;
      uploaded: string;
      category: string;
      purity: string;
      size: string;
      views: string;
    };
  };
};

export type { ApiResponseSearch, ApiResponseWallpaper };
