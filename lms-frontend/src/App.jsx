// src/App.jsx
import { useState } from 'react';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';

function App() {
  const [tab, setTab] = useState('users');

  return (
    <div>
      <header
        style={{
          padding: 16,
          borderBottom: '1px solid #ccc',
          marginBottom: 16,
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          onClick={() => setTab('users')}
          style={{
            padding: '8px 16px',
            background: tab === 'users' ? '#007bff' : '#eee',
            color: tab === 'users' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Quản lý người dùng
        </button>
        <button
          onClick={() => setTab('courses')}
          style={{
            padding: '8px 16px',
            background: tab === 'courses' ? '#007bff' : '#eee',
            color: tab === 'courses' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Quản lý khóa học
        </button>
      </header>

      {tab === 'users' && <UserManagement />}
      {tab === 'courses' && <CourseManagement />}
    </div>
  );
}

export default App;
