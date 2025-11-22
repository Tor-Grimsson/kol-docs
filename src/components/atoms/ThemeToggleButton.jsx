import { useTheme } from '../../hooks/useTheme.js'
import Icon from './Icon.jsx'

const ThemeToggleButton = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`kol-btn flex-center ${className}`}
      aria-label="Toggle theme"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

export default ThemeToggleButton
