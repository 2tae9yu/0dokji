import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { useNavigate } from 'react-router-dom';

// --- 스타일 컴포넌트 (기존과 동일) ---
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 500px;
  transition: height 0.3s ease;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const SearchResultsContainer = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
`;

const ResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex; /* 이미지와 텍스트 정렬을 위해 flex 추가 */
  align-items: center;
  gap: 10px;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f0f0f0;
  }
  
  img {
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  div {
    flex: 1;
    h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
    }
    p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
  }
`;

const SelectedInfo = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: left;

  h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #555;
  }
`;

const DatePickerWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const NextButton = styled.button`
    width: 100%;
    padding: 12px;
    margin-top: 25px;
    border: none;
    border-radius: 8px;
    background-color: #3498db;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background-color: #2980b9;
    }
`;

const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
`;

const ModalButton = styled.button`
    position: absolute;
    top: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #888;
    &:hover {
        color: #333;
    }
`;

const BackButton = styled(ModalButton)`
    left: 15px;
`;

const CloseButton = styled(ModalButton)`
    right: 15px;
`;

// --- 타입 정의 (알라딘 API 응답 구조에 맞춤) ---
interface Book {
  itemId: string;      // 알라딘 상품 ID
  title: string;       // 책 제목
  author: string;      // 저자
  pubDate: string;     // 출판일
  publisher: string;   // 출판사
  cover: string;       // 표지 이미지 URL
  categoryName?: string; // 카테고리 (선택)
}

interface BookSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ [추가] 저자 이름만 깨끗하게 추출하는 헬퍼 함수
const parseAuthor = (rawAuthor: string) => {
  if (!rawAuthor) return "저자 미상";

  // 1. 쉼표(,)로 구분된 사람들을 배열로 나눕니다.
  const people = rawAuthor.split(',');

  // 2. '(지은이)' 또는 '(저자)'가 포함된 항목만 찾습니다.
  const authors = people.filter(person => 
    person.includes('지은이') || person.includes('저자')
  );

  // 3. 지은이가 발견되었다면, '(지은이)' 글자를 제거하고 공백을 다듬어서 반환합니다.
  if (authors.length > 0) {
    return authors.map(author => 
      author.replace(/\(지은이\)|\(저자\)/g, '').trim()
    ).join(', '); // 만약 저자가 여러 명이면 쉼표로 이어줌
  }

  // 4. 만약 '(지은이)' 태그가 딱히 없다면, 보통 목록의 첫 번째 사람이 저자이므로 첫 번째를 반환합니다.
  return people[0].trim();
};

// --- 컴포넌트 ---
const BookSearch: React.FC<BookSearchProps> = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState<"search" | "calendar" | "confirm">("search");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // ✅ 알라딘 API 호출 로직
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const fetchBooks = async () => {
      setIsLoading(true);
      // .env 파일에 REACT_APP_ALADIN_API_KEY를 설정해야 합니다.
      const apiKey = process.env.REACT_APP_ALADIN_API_KEY;
      
      // output=js 파라미터를 사용하여 JSON 형식으로 받습니다.
      // Proxy 설정이 되어있지 않다면 CORS 에러가 발생할 수 있습니다. 
      // 개발 단계에서는 'http://www.aladin.co.kr' 앞부분을 package.json proxy에 등록하거나 별도 처리가 필요할 수 있습니다.
      const url = `/ttb/api/ItemSearch.aspx?ttbkey=${apiKey}&Query=${debouncedQuery}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 알라딘 API의 응답 구조인 data.item을 매핑
        if (data.item) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const books: Book[] = data.item.map((item: any) => ({
             itemId: item.itemId,
             title: item.title,
             author: parseAuthor(item.author),
             pubDate: item.pubDate,
             publisher: item.publisher,
             cover: item.cover,
             categoryName: item.categoryName
           }));
           setSearchResults(books);
        } else {
            setSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedQuery]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setModalStep("search");
    setQuery("");
    setSearchResults([]);
    setSelectedBook(null);
    setSelectedDate(null);
    onClose();
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setModalStep("calendar");
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setModalStep("confirm");
    }
  };

  const handleBackClick = () => {
    if (modalStep === "confirm") {
      setModalStep("calendar");
      setSelectedDate(null);
    } else if (modalStep === "calendar") {
      setModalStep("search");
      setSelectedBook(null);
    }
  };

  const handleNextClick = () => {
    if (selectedBook && selectedDate) {
      // ✅ 책 감상문 페이지('/book')으로 이동 및 데이터 전달
      navigate('/book', { 
        state: { 
          bookTitle: selectedBook.title,
          bookAuthor: selectedBook.author,
          viewDate: selectedDate.toISOString(),
          // 책 상세 정보 문자열 전달
          bookInfo: createBookInfoString(selectedBook),
          // 필요하다면 표지 이미지도 전달
          coverImage: selectedBook.cover
        } 
      });
      resetAndClose();
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // ✅ 도서 정보를 문자열로 조합하는 헬퍼 함수
  const createBookInfoString = (book: Book) => {
    // 예: 지은이 | 출판사 | 출판일
    return [book.author, book.publisher, book.pubDate].filter(Boolean).join(" | ");
  }

  const modalTitle = modalStep === "search" ? "어떤 책을 읽으셨나요?" : "독서 완료일이 언제인가요?";

  return (
    <ModalBackground>
      <ModalContainer>
        {modalStep !== 'search' && <BackButton onClick={handleBackClick}>←</BackButton>}
        <CloseButton onClick={resetAndClose}>×</CloseButton>
        <h3>{modalTitle}</h3>

        {/* 1단계: 도서 검색 */}
        {modalStep === "search" && (
          <>
            <SearchInput
              type="text"
              placeholder="책 제목을 검색하세요: "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchResultsContainer>
              {isLoading ? (
                <LoadingIndicator>검색 중...</LoadingIndicator>
              ) : (
                searchResults.map((book) => (
                  <ResultItem key={book.itemId} onClick={() => handleBookSelect(book)}>
                    {/* 알라딘은 표지 이미지를 주므로 표시해줌 */}
                    {book.cover && <img src={book.cover} alt={book.title} />}
                    <div>
                        <h4>{book.title}</h4>
                        <p>{createBookInfoString(book)}</p>
                    </div>
                  </ResultItem>
                ))
              )}
              {!isLoading && searchResults.length === 0 && debouncedQuery && (
                  <LoadingIndicator>검색 결과가 없습니다.</LoadingIndicator>
              )}
            </SearchResultsContainer>
          </>
        )}

        {/* 2단계: 날짜 선택 */}
        {modalStep === "calendar" && selectedBook && (
          <>
            <SelectedInfo>
              <h4>{selectedBook.title}</h4>
              <p>{createBookInfoString(selectedBook)}</p>
            </SelectedInfo>
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                inline
                locale={ko}
              />
            </DatePickerWrapper>
          </>
        )}

        {/* 3단계: 선택 완료 및 확인 */}
        {modalStep === "confirm" && selectedBook && selectedDate && (
            <>
                <SelectedInfo>
                    <h4>{selectedBook.title}</h4>
                    <p>{createBookInfoString(selectedBook)}</p>
                </SelectedInfo>
                <SelectedInfo>
                    <h4>{formatDate(selectedDate)}</h4>
                </SelectedInfo>
                <NextButton onClick={handleNextClick}>
                    작성하러 가기
                </NextButton>
            </>
        )}
      </ModalContainer>
    </ModalBackground>
  );
};

export default BookSearch;