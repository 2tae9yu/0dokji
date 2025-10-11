// src/components/FilmSearchModal.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

// --- 스타일 컴포넌트 ---
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
  position: relative; // ✅ 자식 요소의 absolute 위치를 위한 기준점
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
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f0f0f0;
  }
  h4 {
    margin: 0 0 5px 0;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
`;

// ✅ 영화와 날짜 정보를 보여주는 공통 컴포넌트로 활용
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

// ✅ '다음' 버튼 스타일 추가
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

// ✅ 로딩 텍스트 스타일 추가
const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
`;

// ✅ 뒤로가기, 닫기 버튼 공통 스타일
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

// ✅ 뒤로가기 버튼
const BackButton = styled(ModalButton)`
    left: 15px;
`;

// ✅ 닫기 버튼
const CloseButton = styled(ModalButton)`
    right: 15px;
`;

// --- 타입 정의 ---
interface Director {
  peopleNm: string;
}
interface Movie {
  movieCd: string;
  movieNm: string;
  prdtYear: string;
  directors: Director[];
  repGenreNm: string;
  typeNm: string; // ✅ 영화 유형 필드 추가
}
interface FilmSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- 컴포넌트 ---
const FilmSearch: React.FC<FilmSearchProps> = ({ isOpen, onClose }) => {
  // ✅ 모달 상태를 3단계로 관리
  const [modalStep, setModalStep] = useState<"search" | "calendar" | "confirm">("search");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 초기값을 null로 변경

  // (이하 useEffect들은 이전과 동일)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const fetchMovies = async () => {
      setIsLoading(true);
      const apiKey = process.env.REACT_APP_KOFIC_API_KEY;
      const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${apiKey}&movieNm=${debouncedQuery}&itemPerPage=10`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data.movieListResult?.movieList || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [debouncedQuery]);


  if (!isOpen) return null;

  const resetAndClose = () => {
    setModalStep("search");
    setQuery("");
    setSearchResults([]);
    setSelectedMovie(null);
    setSelectedDate(null);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) resetAndClose();
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalStep("calendar");
  };

  // ✅ 날짜 선택 시 호출될 함수
  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setModalStep("confirm"); // 날짜를 선택하면 confirm 단계로 이동
    }
  };

  // ✅ 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    if (modalStep === "confirm") {
      setModalStep("calendar");
      setSelectedDate(null); // 날짜 선택 상태 초기화
    } else if (modalStep === "calendar") {
      setModalStep("search");
      setSelectedMovie(null); // 영화 선택 상태 초기화
    }
  };

  // ✅ 다음 버튼 클릭 시 실행될 함수 (지금은 콘솔에 로그만 출력)
  const handleNextClick = () => {
    if (selectedMovie && selectedDate) {
        console.log("선택된 영화:", selectedMovie.movieNm);
        console.log("선택된 날짜:", selectedDate.toLocaleDateString('ko-KR'));
        // 여기서 부모 컴포넌트로 선택된 데이터를 전달하거나 다른 로직을 수행할 수 있습니다.
        resetAndClose(); // 예시로, 다음 단계로 넘어간 후 모달을 닫습니다.
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // ✅ 영화 정보를 문자열로 조합하는 헬퍼 함수
  const createMovieInfoString = (movie: Movie) => {
    const directorNames = movie.directors.map(d => d.peopleNm).join(", ");
    // filter(Boolean)은 혹시라도 비어있는 값이 있을 경우 | 구분자가 연속으로 나오는 것을 방지합니다.
    return [movie.prdtYear, directorNames, movie.typeNm, movie.repGenreNm].filter(Boolean).join(" | ");
  }

  const modalTitle = modalStep === "search" ? "어떤 영화를 감상하셨나요?" : "감상일이 언제인가요?";

  return (
    // ✅ ModalBackground의 onClick 이벤트 제거
    <ModalBackground>
      <ModalContainer>
        {/* ✅ 뒤로가기, 닫기 버튼 추가 */}
        {modalStep !== 'search' && <BackButton onClick={handleBackClick}>←</BackButton>}
        <CloseButton onClick={resetAndClose}>×</CloseButton>
        <h3>{modalTitle}</h3>

        {/* 1단계: 영화 검색 */}
        {modalStep === "search" && (
          <>
            <SearchInput
              type="text"
              placeholder="영화 제목을 검색하세요: "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchResultsContainer>
              {/* ... 검색 결과 렌더링 ... */}
              {isLoading ? (
                <LoadingIndicator>검색 중...</LoadingIndicator>
              ) : (
                searchResults.map((movie) => (
                  <ResultItem key={movie.movieCd} onClick={() => handleMovieSelect(movie)}>
                    <h4>{movie.movieNm}</h4>
                    {/* ✅ 영화 정보 표시 부분 수정 */}
                    <p>{createMovieInfoString(movie)}</p>
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
        {modalStep === "calendar" && selectedMovie && (
          <>
            <SelectedInfo>
              <h4>{selectedMovie.movieNm}</h4>
              {/* ✅ 영화 정보 표시 부분 수정 */}
              <p>{createMovieInfoString(selectedMovie)}</p>
            </SelectedInfo>
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect} // ✅ 핸들러 변경
                inline
                locale={ko}
              />
            </DatePickerWrapper>
          </>
        )}

        {/* 3단계: 선택 완료 및 확인 */}
        {modalStep === "confirm" && selectedMovie && selectedDate && (
            <>
                <SelectedInfo>
                    <h4>{selectedMovie.movieNm}</h4>
                    {/* ✅ 영화 정보 표시 부분 수정 */}
                    <p>{createMovieInfoString(selectedMovie)}</p>
                </SelectedInfo>
                <SelectedInfo>
                    <h4>{formatDate(selectedDate)}</h4>
                </SelectedInfo>
                <NextButton onClick={handleNextClick}>
                    다음
                </NextButton>
            </>
        )}
      </ModalContainer>
    </ModalBackground>
  );
};

export default FilmSearch;