USE usof;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pfp_key TEXT,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE posts (
    id CHAR(36) PRIMARY KEY,
    author_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'locked', 'inactive') NOT NULL DEFAULT 'active',
    content TEXT NOT NULL,

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE post_categories (
    post_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,

    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id CHAR(36) PRIMARY KEY,
    author_id CHAR(36),
    post_id CHAR(36) NOT NULL,
    quote_id CHAR(36),
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    content TEXT NOT NULL,

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (quote_id) REFERENCES comments(id) ON DELETE SET NULL
);

CREATE TABLE likes (
    id CHAR(36) PRIMARY KEY,
    author_id CHAR(36),
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('like', 'dislike') NOT NULL,
    post_id CHAR(36),
    comment_id CHAR(36),

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,

    CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)),

    UNIQUE (author_id, post_id),
    UNIQUE (author_id, comment_id)
);

CREATE TABLE registration_intents (
    id CHAR(36) PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_update_intents (
    id CHAR(36) PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);