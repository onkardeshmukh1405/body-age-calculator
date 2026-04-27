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
  const streakCount = state.answers.filter(s => s <= -1).length
  const { play, startBgMusic, toggleMusic, musicOn } = useSound()

  const handleStart = () => {
    startBgMusic()
    start()
  }

  return (
    <div className={styles.root}>
      {state.screen === 'welcome' && (
        <WelcomeScreen
          onStart={handleStart}
          onToggleMusic={toggleMusic}
          musicOn={musicOn}
        />
      )}
      {state.screen === 'age_input' && (
        <AgeInput onSubmit={setAge} />
      )}
      {state.screen === 'quiz' && (
        <QuizScreen
          state={state}
          streakCount={streakCount}
          onSelectOption={selectOption}
          onNext={nextQuestion}
          onClose={reset}
          onPlayPop={() => play('pop')}
          onPlayWhoosh={() => play('whoosh')}
        />
      )}
      {state.screen === 'reveal' && (
        <RevealScreen
          bodyAge={state.bodyAge}
          onComplete={() => revealComplete(state.bodyAge)}
          onPlayCountdown={() => play('countdown')}
          onPlayCelebrate={() => play('celebrate')}
        />
      )}
      {state.screen === 'result' && (
        <ResultScreen state={state} onReset={reset} />
      )}
    </div>
  )
}
