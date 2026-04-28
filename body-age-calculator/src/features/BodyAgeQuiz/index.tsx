import { useState } from 'react'
import { useQuiz } from './hooks/useQuiz'
import { WelcomeScreen } from './components/WelcomeScreen'
import { AgeInput } from './components/AgeInput'
import { QuizScreen } from './components/QuizScreen'
import { RevealScreen } from './components/RevealScreen'
import { ResultScreen } from './components/ResultScreen'
import { RegistrationScreen } from './components/RegistrationScreen'
import { AlreadyRegisteredScreen } from './components/AlreadyRegisteredScreen'
import { registerUser } from './api/registerUser'

export function BodyAgeQuiz() {
  const { state, start, setAge, selectOption, nextQuestion, prevQuestion, revealComplete, goToRegistration, submitRegistration, alreadyRegistered, reset } = useQuiz()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSubmitRegistration = async (name: string, phone: string, dialCode: string): Promise<void> => {
    const strippedDial = dialCode.replace(/^\+/, '')
    const fullPhone = `${strippedDial}${phone}`
    const result = await registerUser({
      name,
      phoneNo: fullPhone,
      realAge: state.age,
      bodyAge: state.bodyAge,
      answers: state.answers,
    })
    if (result.success) {
      submitRegistration(name, fullPhone, strippedDial)
      window.location.href = `https://habit.yoga/?ref=body-age-calculator&ph=${fullPhone}&country=${strippedDial}&name=${encodeURIComponent(name)}`
    } else if (result.message?.toLowerCase().includes('already exists')) {
      alreadyRegistered(name, fullPhone, strippedDial)
    } else {
      throw new Error(result.message || 'Registration failed')
    }
  }

  return (
    <div className="font-nunito bg-[#fcf9f4] min-h-[100dvh] w-full max-w-[430px] mx-auto relative overflow-x-hidden">

      {/* Profile badge — visible after already_registered login */}
      {state.isLoggedIn && (
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-extrabold shadow-lg border-2 border-white"
            style={{ background: 'linear-gradient(135deg, #1a3558, #3aadaa)' }}
          >
            {state.name.charAt(0).toUpperCase()}
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl w-[220px] overflow-hidden" style={{ border: '1.5px solid #e5e5e5' }}>
                <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #1a3558, #3aadaa)' }}>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-[18px] font-extrabold mb-2">
                    {state.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-white font-extrabold text-[15px] m-0">{state.name}</p>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2">
                  {state.phone && (
                    <div>
                      <p className="text-[11px] text-[#afafaf] uppercase tracking-wide m-0">Mobile</p>
                      <p className="text-[13px] font-bold text-[#1a3558] m-0">+{state.phone}</p>
                    </div>
                  )}
                  {state.age > 0 && (
                    <div>
                      <p className="text-[11px] text-[#afafaf] uppercase tracking-wide m-0">Real Age</p>
                      <p className="text-[13px] font-bold text-[#1a3558] m-0">{state.age} yrs</p>
                    </div>
                  )}
                  {state.bodyAge > 0 && (
                    <div>
                      <p className="text-[11px] text-[#afafaf] uppercase tracking-wide m-0">Body Age</p>
                      <p className="text-[13px] font-bold text-[#3aadaa] m-0">{state.bodyAge} yrs</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Flow: welcome → quiz → result → register → dashboard */}
      {state.screen === 'welcome' && (
        <WelcomeScreen onStart={start} />
      )}
      {state.screen === 'age_input' && (
        <AgeInput onSubmit={setAge} onClose={reset} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen
          state={state}
          onSelectOption={selectOption}
          onNext={nextQuestion}
          onBack={prevQuestion}
        />
      )}
      {state.screen === 'reveal' && (
        <RevealScreen
          bodyAge={state.bodyAge}
          onComplete={() => revealComplete(state.bodyAge)}
        />
      )}
      {state.screen === 'result' && (
        <ResultScreen state={state} onRegister={goToRegistration} />
      )}
      {state.screen === 'registration' && (
        <RegistrationScreen bodyAge={state.bodyAge} onSubmit={handleSubmitRegistration} />
      )}
      {state.screen === 'already_registered' && (
        <AlreadyRegisteredScreen
          name={state.name}
          phone={state.phone}
          dialCode={state.dialCode}
          onRetryQuiz={start}
        />
      )}
    </div>
  )
}
