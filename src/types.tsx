export interface Review {
  id: number; // 고유 식별자 (타임스탬프로 간단히 생성)
  reviewTitle: string;
  reviewContent: string;
  movieTitle: string;
  movieInfo: string;
  viewDate: string; // 저장 시점의 날짜 문자열
}