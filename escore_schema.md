# ESCORE Database Schema

```sql
CREATE DATABASE "ESCORE"
WITH OWNER = postgres
ENCODING = 'UTF8'
LC_COLLATE = 'Vietnamese_Vietnam.1252'
LC_CTYPE = 'Vietnamese_Vietnam.1252'
LOCALE_PROVIDER = 'libc'
TABLESPACE = pg_default
CONNECTION LIMIT = -1
IS_TEMPLATE = False;
```

## 1. Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('student', 'lecture', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Course Table
```sql
CREATE TABLE course (
  course_id SERIAL PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  lecture_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  semester VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Materials Table
```sql
CREATE TABLE materials (
  mate_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES course(course_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  file_url TEXT,
  upload_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Enrollment Table
```sql
CREATE TABLE enrollment (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  course_id INT REFERENCES course(course_id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);
```

## 5. Test Table
```sql
CREATE TABLE test (
  test_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES course(course_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50),
  date DATE,
  max_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. Grade Table
```sql
CREATE TABLE grade (
  grade_id SERIAL PRIMARY KEY,
  test_id INT REFERENCES test(test_id) ON DELETE CASCADE,
  student_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  lecture_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  score NUMERIC(5,2),
  graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(test_id, student_id)
);
```

## 7. Announcement Table
```sql
CREATE TABLE announcement (
  anno_id SERIAL PRIMARY KEY,
  course_id INT REFERENCES course(course_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 8. Notification Table
```sql
CREATE TABLE notification (
  notif_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(200),
  type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
