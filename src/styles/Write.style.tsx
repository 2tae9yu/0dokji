import styled, { keyframes } from 'styled-components';

// 종이 질감을 위한 SVG 노이즈 패턴 (데이터 URI)
const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

// --- 레이아웃 ---
export const MainLayoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  padding: 50px 20px;
  background-color: #fcfaf2;
  background-image: ${paperTexture};
  min-height: 100vh; /* 화면 전체를 채우도록 */
`;

// ✅ 1. 종이 질감 느낌으로 변경 (그림자 부드럽게)
export const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 40px 50px; /* 여백을 조금 더 주어 여유롭게 */
  border-radius: 12px; /* 모서리를 조금 더 둥글게 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* 은은하고 고급스러운 그림자 */
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 요소 간격을 살짝 넓힘 */
  position: relative;
`;

// ✅ 2. 닫기 버튼: 조금 더 차분하게
export const ClosePageButton = styled.button`
  position: absolute;
  top: 20px;
  right: 25px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #b0b0b0; /* 너무 튀지 않는 회색 */
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #555;
    transform: scale(1.1); /* 살짝 커지는 효과 */
  }
`;

// --- 입력 요소 ---

// ✅ 제목은 '박스'보다 '밑줄' 형태가 감성적입니다.
export const TitleInput = styled.input`
  width: 100%;
  padding: 10px 5px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid #eeeeee; /* 밑줄만 남김 */
  background: transparent;
  font-size: 28px; /* 제목은 조금 더 크게 */
  font-weight: 700;
  color: #2c3e50;
  box-sizing: border-box;
  transition: border-color 0.3s;
  
  &::placeholder {
    color: #d1d1d1;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #7f8c8d; /* 포커스 시 진한 회색 */
  }
`;

export const ReadOnlyInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fcfcfc; /* 아주 연한 회색 */
  color: #7f8c8d;
  box-sizing: border-box;
  cursor: default;
  &:focus { outline: none; }
`;

// ✅ 본문 영역: 종이 위에 쓰는 느낌 강화
export const ContentTextarea = styled.textarea.attrs({
  spellCheck: false,
})`
  width: 100%;
  height: 350px; /* 높이 약간 증가 */
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff; /* 순백색 유지 */
  
  /* 폰트 설정 유지 */
  font-family: 'Nanum Pen Script', cursive;
  font-size: 1.4rem; 
  line-height: 1.6;
  color: #333;
  
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;

  &::placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 1rem;
    color: #ccc;
    font-weight: 300;
  }

  /* 포커스 시 약간의 깊이감 */
  &:focus {
    outline: none;
    border-color: #bdc3c7;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
`;

// --- 정보 블록 ---
// ✅ 영화 정보: 티켓이나 카드 같은 느낌
export const ReadOnlyInfoBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  margin-bottom: 20px;
  border: 1px dashed #dcdcdc; /* 점선 테두리로 티켓 느낌 */
  border-radius: 8px;
  background-color: #fafafa;
  box-sizing: border-box;
`;

export const MovieInfoWrapper = styled.div`
  text-align: left;
`;

export const MovieTitleText = styled.p`
  margin: 0 0 6px 0;
  font-size: 17px;
  color: #2c3e50; /* 짙은 남색 계열 */
  font-weight: 700;
  letter-spacing: -0.5px;
`;

export const MovieDetailsText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
`;

// --- 버튼 ---
export const ButtonContainer = styled.div`
  display: flex;
  gap: 15px; /* 버튼 간격 조금 더 넓게 */
  margin-top: 10px;
`;

export const BaseButton = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* 버튼에 살짝 입체감 */

  &:active {
    transform: translateY(2px); /* 눌리는 효과 */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  &:disabled {
    background-color: #dfe4ea;
    color: #a4b0be;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

// ✅ 감성적인 네이비/차콜 블루 (기존의 쨍한 파랑 제거)
export const SubmitButton = styled(BaseButton)`
  background-color: #4a6fa5; 
  &:hover:not(:disabled) {
    background-color: #3d5a80;
  }
`;

// ✅ 차분한 세이지 그린/올리브 (기존의 형광 초록 제거)
export const AiRefineButton = styled(BaseButton)`
  background-color: #8da399;
  &:hover:not(:disabled) {
    background-color: #768d83;
  }
`;

export const PlotButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #4a6fa5;
  border-radius: 20px; /* 둥근 캡슐 모양 */
  background-color: transparent;
  color: #4a6fa5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: #eef2f6;
  }
`;

// --- 사이드 패널 (AI 피드백 등) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const SidePanelContainer = styled.div`
  width: 380px;
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08); /* 부드러운 그림자 */
  position: relative;
  display: flex;
  flex-direction: column;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
  animation: ${fadeIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1); /* 더 부드러운 등장 */
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
`;

export const PanelContent = styled.div`
  font-size: 16px;
  line-height: 1.75;
  color: #444;
  white-space: pre-wrap;
  overflow-y: auto;
  flex-grow: 1;
  font-family: 'Pretendard', sans-serif; /* 가독성 좋은 폰트 명시 */
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #bdc3c7;
  transition: color 0.2s;
  &:hover { color: #2c3e50; }
`;

// --- 모달 ---
export const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(30, 30, 30, 0.4); /* 배경을 조금 더 부드럽게 */
  backdrop-filter: blur(3px); /* 배경 흐림 효과 추가 */
  display: flex;
  justify-content: center; align-items: center; z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  width: 90%; max-width: 650px; max-height: 80vh;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  position: relative;
  display: flex; flex-direction: column;
`;

export const ModalContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  overflow-y: auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  flex-grow: 1;
  border: 1px solid #eee;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
`;

export const ModalButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover { opacity: 0.9; }

  &.primary {
    background-color: #4a6fa5;
    color: white;
  }
  
  &.secondary {
    background-color: #ecf0f1;
    color: #555;
  }
`;

// --- 로딩 ---
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  min-height: 150px;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a6fa5; /* 스피너 색상도 톤다운 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 15px;
  font-weight: 500;
`;