import './App.css';
import IndexPage from './components/IndexPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MainLayout from './components/MainLayout';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import { Routes, Route } from 'react-router-dom'
import { UserContextProvider } from './components/UserContext';

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route exact path='/' element={<MainLayout />}>
          <Route index element={<IndexPage />} />
          <Route exact path='/login' element={<LoginPage />} />
          <Route exact path='/register' element={<RegisterPage />} />
          <Route exact path='/createPost' element={<CreatePost />} />
          <Route exact path='/post/:id' element={<PostPage />} />
          <Route exact path='/edit/:id' element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
