import { useState } from 'react'
import styles from './RegistrationScreen.module.css'
import { REG_STRINGS } from './constants'

interface RegistrationScreenProps {
  bodyAge: number
  onSubmit: (name: string, phone: string) => void
}

export function RegistrationScreen({ bodyAge, onSubmit }: RegistrationScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = REG_STRINGS.errorName
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = REG_STRINGS.errorPhone
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onSubmit(name.trim(), phone.replace(/\s/g, ''))
  }

  return (
    <div className={styles.screen}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryIcon}>&#x26A1;</div>
        <div>
          <p className={styles.summaryBodyAgeLabel}>{REG_STRINGS.bodyAgeLabel}</p>
          <p className={styles.summaryBodyAgeValue}>
            {bodyAge} <span className={styles.summaryYears}>{REG_STRINGS.yearsUnit}</span>
          </p>
        </div>
      </div>
      <h2 className={styles.heading}>{REG_STRINGS.heading}</h2>
      <p className={styles.subtext}>{REG_STRINGS.subtext}</p>
      <div className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{REG_STRINGS.nameLabel}</label>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type="text"
              placeholder={REG_STRINGS.namePlaceholder}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            />
          </div>
          {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{REG_STRINGS.phoneLabel}</label>
          <div className={styles.inputWrap}>
            <div className={styles.phoneRow}>
              <span className={styles.phonePrefix}>&#x1F1EE;&#x1F1F3; {REG_STRINGS.phonePrefix}</span>
              <input
                className={styles.phoneInput}
                type="tel"
                placeholder={REG_STRINGS.phonePlaceholder}
                value={phone}
                maxLength={10}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, phone: undefined })) }}
              />
            </div>
          </div>
          {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
        </div>
        <button className={styles.ctaBtn} onClick={handleSubmit}>{REG_STRINGS.cta}</button>
        <div className={styles.privacy}>&#x1F512; {REG_STRINGS.privacy}</div>
      </div>
    </div>
  )
}
