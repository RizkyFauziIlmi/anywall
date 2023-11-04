import { MoveLeft, RefreshCw, SearchX, ServerCrash } from "lucide-react";
import { Button } from "./ui/button";

interface NotFoundProps {
  statusCode: number;
  message: string;
  refreshFc?: () => void;
}

export default function ErrorPage({
  statusCode,
  message,
  refreshFc,
}: NotFoundProps) {
  return (
    <div className="flex flex-col gap-2 h-screen justify-center items-center">
      {statusCode === 404 && <SearchX size={80} className="animate-bounce" />}
      {statusCode === 500 && (
        <ServerCrash className="animate-pulse" size={80} />
      )}
      <h1 className="text-xl font-bold opacity-50">
        {statusCode} {message}
      </h1>
      <a
        href="/"
        className="font-semibold hover:underline opacity-80 flex items-center justify-center gap-1"
      >
        {statusCode === 404 && (
          <>
            <MoveLeft className="h-4 w-4" /> Back Home
          </>
        )}
        {statusCode === 500 && (
          <Button className="mt-2" onClick={refreshFc}>
            <RefreshCw className="h-4 w-4 mr-2"/> Refresh
          </Button>
        )}
      </a>
    </div>
  );
}
