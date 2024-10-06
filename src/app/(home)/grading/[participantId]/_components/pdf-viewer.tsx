"use client";

import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const maxWidth = 400;
const resizeObserverOptions = {};

const PDFViewer = () => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
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
      // 잘못된 입력 값일 경우 현재 페이지를 다시 세팅
      setInputPage(pageNumber.toString());
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onPageInputSubmit();
    }
  };

  return (
    <div
      className="flex flex-col h-full items-center justify-center"
      ref={setContainerRef}
    >
      <Document
        file="/test.pdf" // 여기는 가지고 계신 pdf 주소
        onLoadSuccess={onDocumentLoadSuccess}
        className="w-full shadow-lg"
      >
        {/* height, width는 number 타입으로 vh, %는 먹지 않습니다. */}
        <Page
          pageNumber={pageNumber}
          width={containerWidth ? containerWidth : maxWidth}
        />
      </Document>
      {/* <p className="text-sm text-gray-600">
        Page {pageNumber} of {numPages}
      </p> */}
      <div className="flex bg-gray-200 p-2 w-full justify-center space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            pageNumber > 1
              ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
              : "bg-gray-100 cursor-not-allowed"
          }`}
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          {"<"}
        </button>
        <div className="flex items-center">
          <input
            type="text"
            value={inputPage}
            onKeyDown={onKeyDown}
            onChange={onPageInputChange}
            onBlur={onPageInputSubmit} // 포커스가 사라질 때 페이지 이동
            className="w-12 px-2 border-4 border-gray-300 rounded-2xl text-center"
          />{" "}
          <span className="ml-2 text-sm text-gray-600">of {numPages}</span>
        </div>
        <button
          className={`px-3 py-1 rounded ${
            pageNumber < numPages
              ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
              : "bg-gray-100 cursor-not-allowed"
          }`}
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          {">"}
        </button>
        {/* <button
          className="ml-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            const viewerElement = document.querySelector(".pdf-container"); // PDF 뷰어의 전체를 담고 있는 컨테이너 클래스에 맞게 지정
            if (viewerElement?.requestFullscreen) {
              viewerElement.requestFullscreen();
            }
          }}
        >
          {"<>"}
        </button> */}
      </div>
    </div>
  );
};

export default memo(PDFViewer);
