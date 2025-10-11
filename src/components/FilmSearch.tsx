// src/components/FilmSearchModal.tsx (파일 경로 예시)

import React from "react";
import styled from "styled-components";

// --- 모달 관련 스타일 컴포넌트 ---
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
`;

const SearchInput = styled.input`
    width: 300px;
    padding: 10px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
`;

// --- 컴포넌트가 받을 props의 타입을 정의 ---
interface FilmSearchProps {
    isOpen: boolean;
    onClose: () => void; // onClose는 아무것도 반환하지 않는 함수 타입
}

const FilmSearch: React.FC<FilmSearchProps> = ({ isOpen, onClose }) => {
    // isOpen이 false이면 아무것도 렌더링하지 않음 (컴포넌트 숨김)
    if (!isOpen) {
        return null;
    }

    // 배경 클릭 시 모달을 닫는 핸들러
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // 부모 컴포넌트로부터 받은 onClose 함수를 실행
        }
    };
    
    return (
        <ModalBackground onClick={handleBackgroundClick}>
            <ModalContainer>
                <h3>어떤 영화를 감상하셨나요?</h3>
                <SearchInput type="text" placeholder="영화 제목을 검색하세요" />
            </ModalContainer>
        </ModalBackground>
    );
};

export default FilmSearch;