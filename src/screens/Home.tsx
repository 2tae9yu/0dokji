import React, { useState } from "react";
import styled from "styled-components";

import FilmSearch from "../components/FilmSearch";
import BookSearch from "../components/BookSearch";

// --- 👇 스타일 코드 변경 (종이 질감 적용) ---

// 종이 질감을 위한 SVG 노이즈 패턴 (데이터 URI)
const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 70px);
    padding: 40px 20px;
    text-align: center;
    box-sizing: border-box;
    // ✅ 변경: 따뜻한 미색 배경 및 종이 질감 패턴 추가
    background-color: #fcfaf2;
    background-image: ${paperTexture};
`;

const Title = styled.div`
    margin-bottom: 50px;
    h1 {
        font-size: 2.2rem;
        font-weight: 700;
        // ✅ 변경: 너무 진한 검정 대신 따뜻한 흑갈색 텍스트
        color: #3e3a35;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
        // ✅ 추가: 텍스트에 약간의 질감 효과
        text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
    }
`;

const Record = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px;
`;

const CardBase = styled.div`
    width: 320px;
    height: 480px;
    // ✅ 변경: 전체 배경보다 약간 밝은 종이색, 미세한 테두리, 따뜻하고 부드러운 그림자
    background-color: #fffef8;
    border: 1px solid #eeddcc;
    border-radius: 16px;
    box-shadow: 
        0 4px 8px rgba(60, 50, 40, 0.05),
        0 10px 20px rgba(60, 50, 40, 0.03);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    // ✅ 추가: 카드 내부에도 약하게 종이 질감 적용
    background-image: ${paperTexture};

    &:hover {
        transform: translateY(-8px);
        // ✅ 변경: 호버 시 그림자가 더 따뜻하고 깊게 퍼짐
        box-shadow: 
            0 8px 16px rgba(60, 50, 40, 0.08),
            0 16px 32px rgba(60, 50, 40, 0.05);
            border-color: #ddccbb;
    }

    img {
        width: 150px;
        height: 150px;
        margin-bottom: 40px;
        // (참고) 이미지 배경이 투명하지 않다면 종이 질감 위에 흰 네모가 뜰 수 있습니다.
        // 투명 배경 PNG/WebP 사용을 권장합니다.
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        // ✅ 변경: 따뜻한 흑갈색 텍스트
        color: #3e3a35;
    }
`;

const Film = styled(CardBase)``;
const Book = styled(CardBase)``;

// --- 👆 스타일 코드 끝 ---

const Home: React.FC = () => {
    // ✅ 변경점 1: 단순히 true/false가 아니라, 'film'인지 'book'인지 구분하는 상태로 변경
    // null이면 아무것도 안 열린 상태
    const [activeModal, setActiveModal] = useState<'film' | 'book' | null>(null);

    const closeModal = (): void => {
        setActiveModal(null);
    };

    return (
        <Container>
            <Title>
                <h1>어떤 걸 기록하시겠어요?</h1>
            </Title>
            <Record>
                {/* ✅ 변경점 2: 클릭 시 각각에 맞는 타입('film')을 상태로 설정 */}
                <Film onClick={() => setActiveModal('film')}>
                    <img src="/images/film.webp" alt="필름" width={150} height={150} style={{margin: "50px 0 50px 0"}} />
                    <h3>영화 기록하기</h3>
                </Film>
                
                {/* ✅ 변경점 3: 클릭 시 각각에 맞는 타입('book')을 상태로 설정 */}
                <Book onClick={() => setActiveModal('book')}>
                    <img src="/images/book.webp" alt="책" width={150} height={150} style={{margin: "50px 0 50px 0"}} />
                    <h3>독서 기록하기</h3>
                </Book>
            </Record>

            {/* ✅ 변경점 4: 상태값에 따라 맞는 모달만 렌더링 */}
            {activeModal === 'film' && (
                <FilmSearch isOpen={true} onClose={closeModal} />
            )}
            
            {activeModal === 'book' && (
                <BookSearch isOpen={true} onClose={closeModal} />
            )}
        </Container>
    );
}

export default Home;