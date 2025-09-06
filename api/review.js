export default async function handler(req) {
  if (req.method && req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { 'Allow': 'POST' } });
  }

  try {
    const body = await req.json();
    const text = (body && body.text ? String(body.text) : '').trim();
    if (!text) {
      return new Response(JSON.stringify({ error: 'text 필드가 필요합니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: '서버 설정 오류: GEMINI_API_KEY가 없습니다.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `당신은 초등학교 4학년 학생의 글쓰기를 도와주는 친절하고 상냥한 AI 선생님입니다. 학생이 '키오스크에 대한 입장'에 대해 쓴 글을 읽고, 다음 세 가지 항목에 따라 조언해주세요.
1. 칭찬 한 가지: 학생의 글에서 가장 잘한 점을 구체적으로 칭찬해주세요.
2. 아쉬운 점과 해결 방법 두 가지: 글을 더 좋게 만들 수 있는 구체적인 방법 두 가지를 어린이의 눈높이에 맞춰 쉽고 명확하게 설명해주세요. 너무 어렵거나 비판적으로 말하지 마세요. (예: "주장이 조금 더 분명하게 드러나면 좋을 것 같아요. 글의 마지막에 '그래서 저는 키오스크가 OOOO하다고 생각합니다.'처럼 한 문장으로 정리해보는 건 어떨까요?")
3. 격려의 말: 학생이 자신감을 가질 수 있도록 따뜻한 격려의 말로 마무리해주세요.
모든 답변은 부드럽고 친근한 말투를 사용해주세요.`;

    const userQuery = `다음은 학생이 쓴 글입니다. 이 글을 읽고 조언해주세요.\n\n---\n\n${text}`;

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    if (!geminiRes.ok) {
      const msg = `Gemini API 오류: ${geminiRes.status}`;
      return new Response(JSON.stringify({ error: msg }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await geminiRes.json();
    const candidate = result && result.candidates && result.candidates[0];
    const feedback = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text
      ? String(candidate.content.parts[0].text)
      : '죄송해요, AI 선생님이 지금 조금 바쁜가 봐요. 잠시 후에 다시 시도해주세요.';

    return new Response(JSON.stringify({ feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: '서버 처리 중 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge'
};


