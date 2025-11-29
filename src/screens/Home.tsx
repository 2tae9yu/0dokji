import React, { useState } from "react";
import styled from "styled-components";

import FilmSearch from "../components/FilmSearch";
import BookSearch from "../components/BookSearch";

// --- 👇 스타일 코드 (기존과 동일) ---

const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 70px);
    padding: 40px 20px;
    text-align: center;
    box-sizing: border-box;
`;

const Title = styled.div`
    margin-bottom: 50px;
    h1 {
        font-size: 2.2rem;
        font-weight: 700;
        color: #343a40;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
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
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    img {
        width: 150px;
        height: 150px;
        margin-bottom: 40px;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #212529;
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