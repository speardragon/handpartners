"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { memo, useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";

type Props = {
  isFull: boolean;
  pdfPath: string;
  handleFullButton?: () => void;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const maxWidth = 400;
const resizeObserverOptions = {};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
  </div>
);

const PDFViewer = ({ isFull, handleFullButton, pdfPath }: Props) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const [containerHeight, setContainerHeight] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
      setContainerHeight(entry.contentRect.height);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage("1");
  }

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      setInputPage(newPage.toString());
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      setInputPage(newPage.toString());
    }
  };

  const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const pageNumber = parseInt(value);

    if (value === "" || (pageNumber >= 1 && pageNumber <= numPages)) {
      setInputPage(value);
    }
  };

  const onPageInputSubmit = () => {
    const pageNumber = parseInt(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
      setPageNumber(pageNumber);
    } else {
      setInputPage(pageNumber.toString());
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onPageInputSubmit();
    }
  };

  const hasPdfPath = typeof pdfPath === "string" && pdfPath.trim().length > 0;

  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 ${
        isFull
          ? "h-full overflow-hidden"
          : "h-full justify-center overflow-y-scroll"
      }`}
      ref={setContainerRef}
    >
      <div
        className={`${
          isFull
            ? "flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            : ""
        }`}
      >
        {!hasPdfPath ? (
          <LoadingSpinner />
        ) : (
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingSpinner />}
            className="overflow-hidden rounded-lg shadow-lg"
          >
            <Page
              className="flex justify-center"
              loading={<LoadingSpinner />}
              pageNumber={pageNumber}
              {...(isFull
                ? {
                    height: containerHeight ? containerHeight - 60 : undefined,
                  }
                : {
                    width: containerWidth ? containerWidth - 32 : maxWidth,
                  })}
            />
          </Document>
        )}
      </div>

      {/* 컨트롤바 */}
      <div className="flex shrink-0 items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
        <button
          className={`rounded-full p-1 transition-colors ${
            pageNumber > 1
              ? "cursor-pointer text-gray-700 hover:bg-gray-100"
              : "cursor-not-allowed text-gray-300"
          }`}
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5 text-sm">
          <input
            type="text"
            value={inputPage}
            onKeyDown={onKeyDown}
            onChange={onPageInputChange}
            onBlur={onPageInputSubmit}
            className="w-10 rounded-md border px-1 py-0.5 text-center text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-muted-foreground">/ {numPages}</span>
        </div>

        <button
          className={`rounded-full p-1 transition-colors ${
            pageNumber < numPages
              ? "cursor-pointer text-gray-700 hover:bg-gray-100"
              : "cursor-not-allowed text-gray-300"
          }`}
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight size={18} />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-200" />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="cursor-pointer rounded-full p-1 text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => handleFullButton?.()}
              >
                {isFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFull ? "원래 크기" : "전체화면"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default memo(PDFViewer);
