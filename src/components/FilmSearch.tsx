import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { useNavigate } from 'react-router-dom';

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
  display: flex; /* ✅ 이미지 배치를 위해 flex 적용 */
  align-items: center;
  gap: 15px;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

// ✅ 포스터 이미지 스타일
const PosterImg = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #eee; /* 로딩 전 회색 배경 */
  flex-shrink: 0;
`;

const TextInfo = styled.div`
  flex: 1;
  h4 {
    margin: 0 0 5px 0;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
`;

const SelectedInfo = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: left;
  display: flex; /* ✅ 선택된 정보에서도 포스터 옆에 텍스트 나오게 */
  align-items: center;
  gap: 15px;

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

// 선택된 정보 안의 텍스트 래퍼
const SelectedTextWrapper = styled.div`
  flex: 1;
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
  typeNm: string;
  posterUrl?: string; // ✅ 포스터 URL 필드 추가 (나중에 채워넣음)
}
interface FilmSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ [핵심] TMDB API를 이용해 포스터를 가져오는 비동기 컴포넌트
// src/components/FilmSearch.tsx 내부

const MoviePosterFetcher: React.FC<{ 
  title: string; 
  year: string; 
  onLoad?: (url: string) => void 
}> = ({ title, year, onLoad }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const fetchPoster = async () => {
      const tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
      if (!tmdbKey) return;

      try {
        // 1. 제목 정제 (특수문자 제거)
        const cleanTitle = title.replace(/[:\-/]/g, ' ').trim();
        
        // 2. 제목으로만 검색 (일단 다 가져옴)
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(cleanTitle)}&language=ko-KR&page=1`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          // ✅ [핵심 로직] 결과 목록에서 '연도'가 일치하는 영화 찾기
          
          // KOFIC 연도 (제작년도)
          const targetYear = parseInt(year); 

          // TMDB 결과 중에서 연도가 매칭되는 것 찾기
          const matchedMovie = data.results.find((movie: any) => {
            if (!movie.release_date) return false;
            const releaseYear = parseInt(movie.release_date.substring(0, 4));
            
            // 제작년도와 개봉년도는 1년 정도 차이날 수 있음 (오차 허용)
            return Math.abs(releaseYear - targetYear) <= 1;
          });

          // 매칭되는 영화가 있으면 그 포스터 사용, 없으면 첫 번째 결과(가장 유명한 것) 사용 여부 결정
          // -> 정확도를 위해 매칭되는 게 있을 때만 띄우거나, 
          // -> 혹은 제목이 완전히 똑같다면 첫 번째 것을 쓰는 식의 타협이 필요합니다.
          
          let posterPath = "";

          if (matchedMovie && matchedMovie.poster_path) {
             // 1순위: 연도가 맞는 영화
             posterPath = matchedMovie.poster_path;
          } else if (data.results[0].title.replace(/\s/g, "") === cleanTitle.replace(/\s/g, "") && data.results[0].poster_path) {
             // 2순위: 연도는 다르지만 제목이 띄어쓰기 제외하고 완벽히 똑같은 경우 (유명한 영화일 확률 높음)
             // 다만 이 경우도 리메이크작 이슈가 있을 수 있으므로, 정확성을 원하면 이 else if 블록을 지우세요.
             posterPath = data.results[0].poster_path;
          }

          if (posterPath) {
            const fullUrl = `https://image.tmdb.org/t/p/w92${posterPath}`;
            setSrc(fullUrl);
            if (onLoad) onLoad(fullUrl);
          }
        }
      } catch (error) {
        console.error("Poster fetch error:", error);
      }
    };

    fetchPoster();
  }, [title, year, onLoad]);

  if (!src) return <PosterImg style={{ visibility: 'hidden' }} />; 
  
  return <PosterImg src={src} alt="poster" />;
};


// --- 메인 컴포넌트 ---
const FilmSearch: React.FC<FilmSearchProps> = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState<"search" | "calendar" | "confirm">("search");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

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
        // KOFIC 데이터에는 posterUrl이 없으므로 일단 비워둠
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

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
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
      setSelectedMovie(null);
    }
  };

  const handleNextClick = () => {
    if (selectedMovie && selectedDate) {
      navigate('/film', { 
        state: { 
          movieTitle: selectedMovie.movieNm,
          viewDate: selectedDate.toISOString(),
          movieInfo: createMovieInfoString(selectedMovie),
          // ✅ TMDB에서 가져온 포스터 URL을 넘겨줍니다.
          posterUrl: selectedMovie.posterUrl 
        } 
      });
      resetAndClose();
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const createMovieInfoString = (movie: Movie) => {
    const directorNames = movie.directors.map(d => d.peopleNm).join(", ");
    return [movie.prdtYear, directorNames, movie.typeNm, movie.repGenreNm].filter(Boolean).join(" | ");
  }
  
  // ✅ 자식 컴포넌트(PosterFetcher)가 이미지를 찾으면 호출해서 movie 객체에 url을 저장함
  const handlePosterLoad = (movieCd: string, url: string) => {
    // 1. 검색 결과 리스트 업데이트
    setSearchResults(prev => prev.map(m => 
        m.movieCd === movieCd ? { ...m, posterUrl: url } : m
    ));
    
    // 2. 현재 선택된 영화가 있다면 그것도 업데이트
    if (selectedMovie && selectedMovie.movieCd === movieCd) {
        setSelectedMovie(prev => prev ? { ...prev, posterUrl: url } : null);
    }
  };

  const modalTitle = modalStep === "search" ? "어떤 영화를 관람하셨나요?" : "관람일이 언제인가요?";

  return (
    <ModalBackground>
      <ModalContainer>
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
              {isLoading ? (
                <LoadingIndicator>검색 중...</LoadingIndicator>
              ) : (
                searchResults.map((movie) => (
                  <ResultItem key={movie.movieCd} onClick={() => handleMovieSelect(movie)}>
                    {/* ✅ 포스터 가져오는 컴포넌트 사용 */}
                    <MoviePosterFetcher 
                        title={movie.movieNm} 
                        year={movie.prdtYear} 
                        onLoad={(url) => handlePosterLoad(movie.movieCd, url)}
                    />
                    <TextInfo>
                        <h4>{movie.movieNm}</h4>
                        <p>{createMovieInfoString(movie)}</p>
                    </TextInfo>
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
              {/* ✅ 선택된 영화 정보에도 포스터 표시 */}
              {selectedMovie.posterUrl && <PosterImg src={selectedMovie.posterUrl} alt="poster" />}
              <SelectedTextWrapper>
                  <h4>{selectedMovie.movieNm}</h4>
                  <p>{createMovieInfoString(selectedMovie)}</p>
              </SelectedTextWrapper>
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
        {modalStep === "confirm" && selectedMovie && selectedDate && (
            <>
                <SelectedInfo>
                    {selectedMovie.posterUrl && <PosterImg src={selectedMovie.posterUrl} alt="poster" />}
                    <SelectedTextWrapper>
                        <h4>{selectedMovie.movieNm}</h4>
                        <p>{createMovieInfoString(selectedMovie)}</p>
                    </SelectedTextWrapper>
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