import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Review } from '../types'; // 1단계에서 만든 타입 import

import {
  MainLayoutContainer,
  PageContainer,
  TitleInput,
  ReadOnlyInput,
  ContentTextarea,
  ReadOnlyInfoBlock,
  MovieInfoWrapper,
  MovieTitleText,
  MovieDetailsText,
  PlotButton,
  SidePanelContainer,
  PanelContent,
  CloseButton,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ButtonContainer,
  SubmitButton,
  AiRefineButton,
  ModalBackdrop,
  ModalContainer,
  ModalContent,
  ModalButtonContainer,
  ModalButton,
  ClosePageButton,
} from '../styles/FilmWrite.style';

// --- Gemini API 클라이언트 설정 ---
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI: GoogleGenerativeAI | null = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

if (!genAI) {
  console.error("Gemini API 키가 .env 파일에 설정되지 않았습니다. .env 파일을 확인해주세요.");
}
// --- 설정 끝 ---

// --- 컴포넌트 ---
const FilmWritePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { movieTitle, viewDate, movieInfo } = location.state || {};

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  
  const [isPanelOpen, setIsPanelOpen] = useState(false); 
  const [plotSummary, setPlotSummary] = useState('');
  const [isLoadingPlot, setIsLoadingPlot] = useState(false);
  
  // ✅ --- 2. AI 다듬기 모달 상태 추가 ---
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedContent, setRefinedContent] = useState('');
  // --- 상태 추가 끝 ---

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!movieTitle || !viewDate || !movieInfo) {
      alert('잘못된 접근입니다. 메인 페이지로 이동합니다.');
      navigate('/');
    }
  }, [movieTitle, viewDate, movieInfo, navigate]);

  useEffect(() => {
    const container = pageContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setPanelMaxHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const formattedDate = viewDate
    ? new Date(viewDate).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  const handleFetchPlot = async () => {
    // ... (기존과 동일)
    if (!genAI) {
      alert("API 키가 설정되지 않아 줄거리를 불러올 수 없습니다.");
      return;
    }
    setIsPanelOpen(true);
    setIsLoadingPlot(true);
    setPlotSummary('');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `영화 '${movieTitle}' 줄거리 알려줘`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setPlotSummary(text);
    } catch (error) {
      console.error("Gemini API 호출 오류:", error);
      setPlotSummary("줄거리를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingPlot(false);
    }
  };

  const handleSubmit = () => {
    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 🔄 [변경] localStorage -> sessionStorage
    const savedReviewsJSON = sessionStorage.getItem('reviews');
    const savedReviews: Review[] = savedReviewsJSON ? JSON.parse(savedReviewsJSON) : [];

    const newReview: Review = {
      id: Date.now(),
      reviewTitle,
      reviewContent,
      movieTitle,
      movieInfo,
      viewDate: formattedDate,
    };

    const updatedReviews = [...savedReviews, newReview];

    // 🔄 [변경] localStorage -> sessionStorage
    sessionStorage.setItem('reviews', JSON.stringify(updatedReviews));

    alert('감상문이 저장되었습니다!');
    navigate('/');
  };

  // ✅ 이 함수를 추가해주세요.
  const handleCancel = () => {
    // 사용자가 무언가 입력했다면, 정말 나갈 것인지 확인합니다.
    if (reviewTitle || reviewContent) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말로 페이지를 나가시겠습니까?")) {
        navigate('/'); // 확인을 누르면 메인 페이지로 이동
      }
    } else {
      // 작성 내용이 없으면 바로 메인 페이지로 이동
      navigate('/');
    }
  };

  // ✅ --- 3. AI 다듬기 API 호출 함수 ---
  const handleAiRefine = async () => {
    if (!reviewContent.trim()) {
      alert("감상문 내용을 먼저 작성해주세요.");
      return;
    }
    if (!genAI) {
      alert("API 키가 설정되지 않아 AI 다듬기 기능을 사용할 수 없습니다.");
      return;
    }

    setIsRefineModalOpen(true);
    setIsRefining(true);
    setRefinedContent('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
      const prompt = `이건 내가 작성한 영화 '${movieTitle}'에 대한 영화 감상문인데, 내가 작성한 부분은 최대한 유지하면서 좀 더 풍부하고 감성적인 표현을 사용하여 전문가가 쓴 것처럼 자연스럽게 다듬어줘.\n\n---\n\n${reviewContent}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setRefinedContent(text);
    } catch (error) {
      console.error("Gemini API 호출 오류 (다듬기):", error);
      setRefinedContent("내용을 다듬는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsRefining(false);
    }
  };

  // ✅ --- 4. 다듬은 내용 적용 함수 ---
  const handleApplyRefinement = () => {
    setReviewContent(refinedContent);
    setIsRefineModalOpen(false);
  };

  if (!movieTitle || !viewDate || !movieInfo) {
    return null;
  }

  return (
    <>
      <MainLayoutContainer>
        <PageContainer ref={pageContainerRef}>
        {/* ✅ 2. X 버튼을 PageContainer 최상단에 추가 */}
          <ClosePageButton onClick={handleCancel}>&times;</ClosePageButton>
          <h2>영화 감상문 작성</h2>
          <TitleInput
            type="text"
            placeholder="제목: "
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          
          <ReadOnlyInfoBlock>
            <MovieInfoWrapper>
              <MovieTitleText>{movieTitle}</MovieTitleText>
              <MovieDetailsText>{movieInfo}</MovieDetailsText>
            </MovieInfoWrapper>
            <PlotButton onClick={handleFetchPlot}>줄거리 요약 보기</PlotButton>
          </ReadOnlyInfoBlock>
          
          <ReadOnlyInput type="text" value={formattedDate} readOnly />

          <ContentTextarea
            placeholder="자유롭게 감상평을 남겨주세요."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          
          <ButtonContainer>
            {/* ✅ onClick 핸들러 변경 */}
            <AiRefineButton onClick={handleAiRefine} disabled={!reviewContent.trim()}>AI 다듬기</AiRefineButton>
            <SubmitButton onClick={handleSubmit}>저장하기</SubmitButton>
          </ButtonContainer>

        </PageContainer>
        
        {isPanelOpen && (
          <SidePanelContainer style={{ maxHeight: panelMaxHeight ? `${panelMaxHeight}px` : 'auto' }}>
            <CloseButton onClick={() => setIsPanelOpen(false)}>&times;</CloseButton>
            <h3>{movieTitle} 줄거리</h3>
            {isLoadingPlot ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>줄거리 불러오는 중...</LoadingText>
              </LoadingContainer>
            ) : (
              <PanelContent>{plotSummary}</PanelContent>
            )}
          </SidePanelContainer>
        )}
      </MainLayoutContainer>

      {/* ✅ --- 5. AI 다듬기 모달 렌더링 --- */}
      {isRefineModalOpen && (
        <ModalBackdrop>
          <ModalContainer>
            <CloseButton onClick={() => setIsRefineModalOpen(false)}>&times;</CloseButton>
            <h3>AI가 다듬은 감상문</h3>
            {isRefining ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>감상문을 다듬는 중...</LoadingText>
              </LoadingContainer>
            ) : (
              <ModalContent>{refinedContent}</ModalContent>
            )}
            <ModalButtonContainer>
              <ModalButton className="secondary" onClick={() => setIsRefineModalOpen(false)}>취소</ModalButton>
              <ModalButton className="primary" onClick={handleApplyRefinement} disabled={isRefining}>적용하기</ModalButton>
            </ModalButtonContainer>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </>
  );
};

export default FilmWritePage;