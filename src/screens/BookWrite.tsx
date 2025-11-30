import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // ✅ styled import 확인
import { GoogleGenerativeAI } from "@google/generative-ai";

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
} from '../styles/Write.style';

// ✅ [추가] 이미지와 텍스트를 묶어줄 컨테이너
const BookInfoGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 20px; /* 이미지와 텍스트 사이 간격은 여기서 조절 */
  flex: 1;   /* 공간을 차지하여 버튼을 오른쪽 끝으로 밈 */
  text-align: left;
`;

// ✅ [수정] BookCoverImg 수정 (margin-right 제거 -> gap으로 대체)
const BookCoverImg = styled.img`
  width: 60px;
  height: 86px;
  object-fit: cover;
  border-radius: 4px;
  /* margin-right: 20px;  <-- 제거 (BookInfoGroup의 gap이 대신함) */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  background-color: #eee;
  flex-shrink: 0; /* 화면이 줄어들어도 이미지가 찌그러지지 않게 방지 */
`;

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI: GoogleGenerativeAI | null = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface BookReview {
  id: number;
  reviewTitle: string;
  reviewContent: string;
  bookTitle: string;
  bookInfo: string;
  viewDate: string;
  coverImage?: string; // ✅ [추가] 표지 이미지 필드 추가
}

const BookWritePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ [수정] coverImage 추가로 받아오기
  const { bookTitle, bookAuthor, viewDate, bookInfo, coverImage } = location.state || {};

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  
  const [isPanelOpen, setIsPanelOpen] = useState(false); 
  const [plotSummary, setPlotSummary] = useState('');
  const [isLoadingPlot, setIsLoadingPlot] = useState(false);
  
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedContent, setRefinedContent] = useState('');

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!bookTitle || !viewDate || !bookInfo) {
      alert('잘못된 접근입니다. 메인 페이지로 이동합니다.');
      navigate('/');
    }
  }, [bookTitle, viewDate, bookInfo, navigate]);

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
    if (!genAI) {
      alert("API 키가 설정되지 않아 책 소개를 불러올 수 없습니다.");
      return;
    }
    setIsPanelOpen(true);
    setIsLoadingPlot(true);
    setPlotSummary('');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `'${bookAuthor}' 쓴 '${bookTitle}'의 줄거리와 핵심 내용을 요약해서 알려줘`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setPlotSummary(text);
    } catch (error) {
      console.error("Gemini API 호출 오류:", error);
      setPlotSummary("책 소개를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingPlot(false);
    }
  };

  const handleSubmit = () => {
    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const savedReviewsJSON = sessionStorage.getItem('bookReviews');
    const savedReviews: BookReview[] = savedReviewsJSON ? JSON.parse(savedReviewsJSON) : [];

    const newReview: BookReview = {
      id: Date.now(),
      reviewTitle,
      reviewContent,
      bookTitle,
      bookInfo,
      viewDate: formattedDate,
      coverImage, // ✅ [추가] 저장 시 표지 이미지도 함께 저장
    };

    const updatedReviews = [...savedReviews, newReview];

    sessionStorage.setItem('bookReviews', JSON.stringify(updatedReviews));

    alert('독서 감상문이 저장되었습니다!');
    navigate('/');
  };

  const handleCancel = () => {
    if (reviewTitle || reviewContent) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말로 페이지를 나가시겠습니까?")) {
        navigate('/'); 
      }
    } else {
      navigate('/');
    }
  };

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
      const prompt = `이건 내가 읽은 책 '${bookAuthor}' 의 '${bookTitle}'에 대한 독서 감상문인데, 내가 작성한 부분은 최대한 유지하면서 좀 더 풍부하고 깊이 있는 표현을 사용하여 전문가가 쓴 것처럼 자연스럽게 다듬어줘.\n\n---\n\n${reviewContent}`;
      
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

  const handleApplyRefinement = () => {
    setReviewContent(refinedContent);
    setIsRefineModalOpen(false);
  };

  if (!bookTitle || !viewDate || !bookInfo) {
    return null;
  }

  return (
    <>
      <MainLayoutContainer>
        <PageContainer ref={pageContainerRef}>
          <ClosePageButton onClick={handleCancel}>&times;</ClosePageButton>
          <h2>독서 감상문 작성</h2>
          <TitleInput
            type="text"
            placeholder="제목: "
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          
          {/* ✅ [수정] 표지 이미지와 텍스트를 하나의 그룹으로 묶음 */}
          <ReadOnlyInfoBlock>
            <BookInfoGroup>
              {coverImage && <BookCoverImg src={coverImage} alt={bookTitle} />}
              <MovieInfoWrapper>
                <MovieTitleText>{bookTitle}</MovieTitleText>
                <MovieDetailsText>{bookInfo}</MovieDetailsText>
              </MovieInfoWrapper>
            </BookInfoGroup>
            
            {/* 버튼은 그룹 밖(오른쪽 끝)에 유지 */}
            <PlotButton onClick={handleFetchPlot}>책 소개 보기</PlotButton>
          </ReadOnlyInfoBlock>
          
          <ReadOnlyInput type="text" value={formattedDate} readOnly />

          <ContentTextarea
            placeholder="이 책을 읽고 든 생각이나 느낌을 자유롭게 적어주세요."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          
          <ButtonContainer>
            <AiRefineButton onClick={handleAiRefine} disabled={!reviewContent.trim()}>AI 다듬기</AiRefineButton>
            <SubmitButton onClick={handleSubmit}>저장하기</SubmitButton>
          </ButtonContainer>

        </PageContainer>
        
        {isPanelOpen && (
          <SidePanelContainer style={{ maxHeight: panelMaxHeight ? `${panelMaxHeight}px` : 'auto' }}>
            <CloseButton onClick={() => setIsPanelOpen(false)}>&times;</CloseButton>
            <h3>{bookTitle} 줄거리</h3>
            {isLoadingPlot ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>책 소개 불러오는 중...</LoadingText>
              </LoadingContainer>
            ) : (
              <PanelContent>{plotSummary}</PanelContent>
            )}
          </SidePanelContainer>
        )}
      </MainLayoutContainer>

      {/* AI 다듬기 모달 */}
      {isRefineModalOpen && (
        <ModalBackdrop>
          <ModalContainer>
            <CloseButton onClick={() => setIsRefineModalOpen(false)}>&times;</CloseButton>
            <h3>AI가 다듬은 독서 감상문</h3>
            {isRefining ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>문장을 다듬는 중...</LoadingText>
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

export default BookWritePage;