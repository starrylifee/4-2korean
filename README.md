# 국어 수행평가: 비교하는 글쓰기 (키오스크 장단점)

## 기능 요약
- 단계형 작성 흐름(정보 입력 → AI 조언 → 최종 확인)
- AI 검토(서버리스 API `/api/review`) 완료 후에만 2단계 완료 가능
- PDF 저장 2가지 방식
  - 임베디드 폰트 PDF(jsPDF, 한글 폰트 포함)
  - 브라우저 인쇄/내보내기(선택/검색 가능한 텍스트 유지)

## 로컬 실행
정적 파일 호스팅으로 동작합니다. `index.html`을 브라우저로 열면 됩니다.
- AI 검토 API(`/api/review`)는 서버리스로 동작하므로, 로컬 테스트는 Vercel CLI를 권장합니다.
  - `.env`에 `GEMINI_API_KEY`를 설정한 뒤:
    - Windows CMD: `set GEMINI_API_KEY=키 && vercel dev`
    - PowerShell: `$env:GEMINI_API_KEY="키"; vercel dev`
  - 또는 프로젝트 루트에 `.env` 파일을 만들고 `vercel dev` 실행

## Vercel 배포
1. 본 폴더를 Vercel에 연결합니다.
2. 환경변수 추가
   - `GEMINI_API_KEY`: Google Generative Language API 키
3. 배포 후 동작 확인
   - `/api/review`가 200을 반환하는지
   - 1단계에서 글 작성 → 2단계에서 AI 조언 수신 → 2단계 완료 버튼 활성화 → 3단계 PDF 버튼 동작

## 폰트
- jsPDF로 생성하는 PDF에는 `NanumGothic-Regular.ttf`를 런타임에 로드하여 임베드합니다.
- 브라우저 인쇄(시스템 PDF) 방식은 별도 폰트 임베딩 없이 선택/검색 가능한 텍스트로 출력됩니다.

## 사용 흐름
1) 학교/번호/이름, 본문(최소 600자) 입력 → 2) AI 검토 받기 → 3) 조언 반영 후 2단계 완료 → 4) PDF 저장 또는 인쇄/내보내기

## 주의사항
- 학교/번호/이름과 본문은 최소 600자 조건을 충족해야 다음 단계로 이동합니다.
- AI 검토 API 장애 시 2단계 완료 버튼은 비활성화됩니다.
 - `.env`는 깃에 올리지 않습니다. 예시는 `.env.example` 참고.
