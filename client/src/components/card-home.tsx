import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

interface CardHomeProps {
  imageUrl: string;
  endpoint: string;
  imageResolution: string;
  isPNG: boolean;
}

const CardHome = React.forwardRef<HTMLDivElement, CardHomeProps>(
  ({ imageUrl, endpoint, imageResolution, isPNG }, ref) => {
    return (
      <Link to={`/wallpaper/${endpoint}`}>
        <div
          className="cursor-pointer relative flex flex-col justify-center items-center h-[100%] group"
          ref={ref} // Forward the ref to the outer div
        >
          <img
            src={imageUrl}
            alt={`photoID:${endpoint}`}
            className="w-full h-full object-contain rounded-lg"
            loading="lazy"
          />
          <div className="absolute gap-2 p-1 flex justify-center bottom-0 bg-gradient-to-t h-30 from-black to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-bold text-white/50">{imageResolution}</p>
            {isPNG && (
              <Badge className="bg-green-300 text-black rounded-md">PNG</Badge>
            )}
          </div>
        </div>
      </Link>
    );
  }
);

export default CardHome;
