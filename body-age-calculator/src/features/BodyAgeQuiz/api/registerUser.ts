import { QUESTIONS } from '../constants/questions'

interface RegisterPayload {
  name: string
  phoneNo: string
  realAge: number
  bodyAge: number
  answers: number[]
}

export async function registerUser({ name, phoneNo, realAge, bodyAge, answers }: RegisterPayload) {
  const quiz = answers.map((score, i) => {
    const q = QUESTIONS[i]
    const option = q.options.find(o => o.score === score)
    return {
      question: q.text,
      answer: option?.label ?? '',
    }
  })

  const response = await fetch('https://backend-body-age-calculator.onrender.com/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phoneNo: phoneNo.replace(/^\+/, ''),
      realAge: String(realAge),
      bodyAge: String(bodyAge),
      quiz,
    }),
  })

  // Always parse JSON — the body has success/message even on error status codes
  return response.json()
}
