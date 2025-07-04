import { Link } from 'react-router-dom'
import './Home.scss'

export const Home = () => {
  return (
    <>
      <h1>Welcome to the Games App!</h1>
      <Link to="/games/4row">Four in a row</Link>
    </>
  )
}
