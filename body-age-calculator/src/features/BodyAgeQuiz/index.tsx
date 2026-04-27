import { useQuiz } from './hooks/useQuiz'
import { useSound } from './hooks/useSound'
import { WelcomeScreen } from './components/WelcomeScreen'
import { AgeInput } from './components/AgeInput'
import { QuizScreen } from './components/QuizScreen'
import { RevealScreen } from './components/RevealScreen'
import { ResultScreen } from './components/ResultScreen'
import styles from './BodyAgeQuiz.module.css'

export function BodyAgeQuiz() {
  const { state, start, setAge, selectOption, nextQuestion, revealComplete, reset } = useQuiz()
  const { startBgMusic } = useSound()

  const handleStart = () => {
    startBgMusic()
    start()
  }

  return (
    <div className={styles.root}>
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
        <ResultScreen state={state} onReset={reset} />
      )}
    </div>
  )
}
