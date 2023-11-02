// Type for the query parameters
interface QueryParametersSearch {
    page: number;
    q: string | undefined;
    categories: string | undefined;
    sort: string | undefined;
    ai_art_filter: string | undefined;
}

// Type for the QueryDetail
interface QueryDetailSearch {
    page: number;
    query: string | undefined;
    categoryArrToLowerCase: string[] | undefined;
    sorting: string | undefined;
    totalWallpaper?: number;
    totalPages?: number;
}


// Type for the data array
interface WallpaperDataSearch {
    isPng: boolean;
    resolution: string;
    previewUrl: string | undefined;
    imageEndpoint: string | undefined;
}

interface QueryDetailWallpaper {
    imageEndpoint: string | undefined;
}

interface WallpaperProperties {
    uploader: string;
    uploaded: string;
    category: string;
    purity: string;
    size: string;
    views: string;
    favorites: string;
}

interface WallpaperDetail {
    name: string | undefined;
    resolution: string;
    imageUrl: string | undefined;
    properties: WallpaperProperties;
}

export { QueryDetailSearch, WallpaperDataSearch, QueryParametersSearch, QueryDetailWallpaper, WallpaperProperties, WallpaperDetail }