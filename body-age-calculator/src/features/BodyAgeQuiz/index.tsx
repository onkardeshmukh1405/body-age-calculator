import { useQuiz } from './hooks/useQuiz'
import { useSound } from './hooks/useSound'
import { WelcomeScreen } from './components/WelcomeScreen'
import { AgeInput } from './components/AgeInput'
import { QuizScreen } from './components/QuizScreen'
import { RevealScreen } from './components/RevealScreen'
import { ResultScreen } from './components/ResultScreen'
import { RegistrationScreen } from './components/RegistrationScreen'
import { SuccessScreen } from './components/SuccessScreen'
export function BodyAgeQuiz() {
  const { state, start, setAge, selectOption, nextQuestion, revealComplete, goToRegistration, submitRegistration, reset } = useQuiz()
  const { startBgMusic } = useSound()

  const handleStart = () => {
    startBgMusic()
    start()
  }

  return (
    <div className="font-nunito bg-[#fcf9f4] min-h-[100dvh] w-full max-w-[430px] mx-auto relative overflow-x-hidden">
      {state.screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {state.screen === 'age_input' && (
        <AgeInput onSubmit={setAge} onClose={reset} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen
          state={state}
          onSelectOption={selectOption}
          onNext={nextQuestion}
          onClose={reset}
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
        <RegistrationScreen bodyAge={state.bodyAge} onSubmit={submitRegistration} />
      )}
      {state.screen === 'success' && (
        <SuccessScreen name={state.name} onReset={reset} />
      )}
    </div>
  )
}
