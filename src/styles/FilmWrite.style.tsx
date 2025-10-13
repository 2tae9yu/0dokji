import styled, { keyframes } from 'styled-components';

// --- 레이아웃 ---
export const MainLayoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  padding: 50px 20px;
`;

// ✅ 1. PageContainer에 position: relative 추가
export const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative; /* 👈 X 버튼의 위치 기준점이 됩니다 */
`;

// ✅ 2. 우측 상단 X 버튼 스타일 새로 추가
export const ClosePageButton = styled.button`
  position: absolute;
  top: 20px;
  right: 25px;
  background: transparent;
  border: none;
  font-size: 2.5rem; /* '×' 기호 크기 */
  color: #888;
  cursor: pointer;
  line-height: 1; /* 글자 높이 조절 */
  padding: 0;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #333;
  }
`;

// --- 입력 요소 ---
export const TitleInput = styled.input`
  width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc;
  border-radius: 8px; font-size: 24px; font-weight: bold; box-sizing: border-box;
`;

export const ReadOnlyInput = styled.input`
  width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #e0e0e0;
  border-radius: 8px; font-size: 16px; background-color: #f9f9f9;
  color: #555; box-sizing: border-box; cursor: default;
  &:focus { outline: none; }
`;

export const ContentTextarea = styled.textarea`
  width: 100%; height: 300px; padding: 15px; margin-bottom: 20px;
  border: 1px solid #ccc; border-radius: 8px; font-size: 16px;
  line-height: 1.6; resize: vertical; box-sizing: border-box;
`;

// --- 정보 블록 ---
export const ReadOnlyInfoBlock = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #e0e0e0;
  border-radius: 8px; background-color: #f9f9f9; box-sizing: border-box;
`;

export const MovieInfoWrapper = styled.div` text-align: left; `;

export const MovieTitleText = styled.p`
  margin: 0 0 4px 0; font-size: 16px; color: #333; font-weight: bold;
`;

export const MovieDetailsText = styled.p`
  margin: 0; font-size: 14px; color: #666;
`;

// --- 버튼 ---
export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const BaseButton = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(BaseButton)`
  background-color: #3498db;
  &:hover:not(:disabled) { background-color: #2980b9; }
`;

export const AiRefineButton = styled(BaseButton)`
  background-color: #2ecc71;
  &:hover:not(:disabled) { background-color: #27ae60; }
`;

export const PlotButton = styled.button`
  padding: 8px 12px; border: 1px solid #3498db; border-radius: 6px;
  background-color: #ffffff; color: #3498db; font-size: 14px;
  cursor: pointer; white-space: nowrap;
  &:hover { background-color: #f0f8ff; }
`;

// --- 사이드 패널 ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const SidePanelContainer = styled.div`
  width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  flex-shrink: 0;
`;

export const PanelContent = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  overflow-y: auto;
  flex-grow: 1;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  &:hover { color: #000; }
`;

// --- 모달 ---
export const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white; padding: 30px; border-radius: 10px;
  width: 90%; max-width: 700px; max-height: 80vh;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3); position: relative;
  display: flex; flex-direction: column;
`;

export const ModalContent = styled.div`
  font-size: 16px; line-height: 1.7; color: #333;
  white-space: pre-wrap; overflow-y: auto;
  background-color: #f9f9f9; border-radius: 8px; padding: 20px;
  flex-grow: 1;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  
  &.primary {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
  }
  
  &.secondary {
    background-color: #ecf0f1;
    color: #34495e;
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
  padding: 40px 0;
  min-height: 150px;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  margin-top: 15px;
  color: #555;
  font-size: 16px;
`;