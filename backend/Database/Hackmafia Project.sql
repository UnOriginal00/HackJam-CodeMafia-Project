
-- NEW TABLE GROUPS
-- ============================================
-- DATABASE: group_collab_db
-- Stores shared data across users and groups
-- ============================================

CREATE DATABASE group_collab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE group_collab_db;
-- We use utf8mb4 to support all characters (emojis, symbols, any language)
-- and COLLATE utf8mb4_unicode_ci to compare text without case sensitivity.



-- Stores group information including name, description, and creation date.
CREATE TABLE Group_list (
    Group_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores user IDs and their group membership.
-- 'email' connects to the individual database. 'joined_at' tracks registration time.
CREATE TABLE Users (
    User_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Group_id INT NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Group_id) REFERENCES Group_list(Group_id)
);

-- INDEXES FOR: Users table
-- Purpose: Fast user login and duplicate email check
CREATE INDEX idx_users_email
ON Users (email);
-- Purpose: Quick access to all users in a specific group  
CREATE INDEX idx_users_group ON Users(Group_id);



-- Stores ideas submitted by users in a group.
-- Each idea is linked to the group and the submitting user.
CREATE TABLE Ideas (
    Idea_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    Group_id INT,
    content TEXT NOT NULL,
    submitted_by INT NOT NULL,
    FOREIGN KEY (Group_id) REFERENCES Group_list(Group_id),
    FOREIGN KEY (submitted_by) REFERENCES Users(User_id)
);

-- ============================================
-- INDEXES FOR: Ideas table
-- ===========================================

CREATE INDEX idx_ideas_group ON Ideas (Group_id );
CREATE INDEX idx_ideas_submitter ON Ideas (submitted_by);
CREATE INDEX idx_ideas_group_submitter ON Ideas (Group_id, submitted_by);



 

-- Stores votes made by users on ideas within the group.
-- Each vote links to a specific idea and user.
CREATE TABLE Votes (
    votes_id INT PRIMARY KEY AUTO_INCREMENT,
    Idea_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type ENUM('upvote', 'downvote'),
    FOREIGN KEY (Idea_id) REFERENCES Ideas(Idea_id),
    FOREIGN KEY (user_id) REFERENCES Users(User_id)
);

CREATE INDEX idx_votes_idea ON Votes (Idea_id); -- Count votes quickly for ranking calculations
CREATE INDEX idx_votes_user ON Votes (user_id); -- Track individual user voting history
CREATE INDEX idx_votes_user_idea_unique ON Votes (user_id, Idea_id); --  Prevent duplicate votes (system integrity)


SHOW INDEX FROM Votes ; 
 


-- Stores shared notes created by users within the group.
-- Each note is linked to the group and the author.
CREATE TABLE Notes (
    Note_id INT PRIMARY KEY AUTO_INCREMENT,
    Group_id INT,
    Author_id INT,
    Content TEXT,
    FOREIGN KEY (Author_id) REFERENCES Users(User_id),
    FOREIGN KEY (Group_id) REFERENCES Group_list(Group_id)
);

CREATE INDEX idx_notes_group ON Notes (Group_id);  -- Load all shared notes from a specific group
CREATE INDEX idx_notes_author ON Notes (Author_id); -- Find all notes created by a specific user

SHOW INDEX FROM Notes;


-- Stores group chat messages sent by users.
-- Each message is linked to the group and the sender.
CREATE TABLE Chat_history (
    Message_ID INT PRIMARY KEY AUTO_INCREMENT,
    Group_ID INT,
    Sender_ID INT,
    Message_Text TEXT NOT NULL,
    FOREIGN KEY (Sender_ID) REFERENCES Users(User_id),
    FOREIGN KEY (Group_ID) REFERENCES Group_list(Group_id)
);

CREATE INDEX idx_chat_group ON Chat_history (Group_ID); -- Load chat history for a specific group
CREATE INDEX idx_chat_group_sender ON Chat_history (Group_ID, Sender_ID); -- Find messages from a specific user within a group

SHOW INDEX FROM Chat_history;


-- ============================================
-- DATABASE: INDIVIDUAL DATA
-- This section defines the second database, which stores private user information
-- and AI-generated content. It is designed to operate independently from group-level data.
-- ============================================


CREATE database Individual_data;
use Individual_data;

-- Stores personal information for each user: name, surname, and email.
CREATE TABLE User_details (
    User_id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(70) NOT NULL,
    Surname VARCHAR(70) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores private notes written by the user.
-- Each note is linked to the user who created it.
CREATE TABLE Personal_notes (
    Note_id INT PRIMARY KEY AUTO_INCREMENT,
    User_id INT NOT NULL,
    FOREIGN KEY (User_id) REFERENCES User_details(User_id),
    Content TEXT NOT NULL,
    Created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_pnotes_user ON Personal_notes (User_id); -- -- Purpose: Load all personal notes for a user
CREATE fulltext index idx_pnotes_content_ft ON Personal_notes (Content); -- -- Purpose: AI text search for note summarization
SHOW INDEX FROM Personal_notes;
SELECT * FROM Personal_notes 
WHERE MATCH(Content) AGAINST('innovación' IN NATURAL LANGUAGE MODE);


-- Stores AI-generated suggestions or summaries for the user.
-- Each entry is linked to the user and includes a type label.
CREATE TABLE AI_generated_data (
    Entry_id INT PRIMARY KEY AUTO_INCREMENT,
    User_id INT NOT NULL,
    FOREIGN KEY (User_id) REFERENCES User_details(User_id),
    Data_type ENUM('summary', 'suggestion', 'reminder') NOT NULL,
    Content TEXT NOT NULL,
    Generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_data_user ON AI_generated_data (User_id); -- generated content for each user
CREATE INDEX idx_ai_data_user_type ON AI_generated_data (User_id, Data_type); -- Filter AI content by type and user

SHOW INDEX FROM AI_generated_data;

SELECT *  FROM AI_generated_data;



-- Note: Main dashboard metrics per group
-- Purpose: Shows total members, ideas, and votes for each group
-- Business Use: High-level group performance overview for administrators


CREATE VIEW view_group_metrics AS
SELECT 
    g.group_name,
    COUNT(DISTINCT u.User_id) as total_members,
    COUNT(DISTINCT i.Idea_id) as total_ideas,
    COUNT(DISTINCT v.votes_id) as total_votes
FROM Group_list g
LEFT JOIN Users u ON g.Group_id = u.Group_id
LEFT JOIN Ideas i ON g.Group_id = i.Group_id  
LEFT JOIN Votes v ON i.Idea_id = v.Idea_id
GROUP BY g.Group_id, g.group_name;



-- Note: Ranking of ideas by vote count across all groups  
-- Purpose: Identifies most popular ideas for featuring and analysis
-- Business Use: Community engagement tracking and success story identification


CREATE VIEW view_top_ideas AS
SELECT 
    i.Idea_id,
    i.content,
    g.group_name,
    COUNT(v.votes_id) as vote_count
FROM Ideas i
JOIN Group_list g ON i.Group_id = g.Group_id
LEFT JOIN Votes v ON i.Idea_id = v.Idea_id
GROUP BY i.Idea_id, i.content, g.group_name
ORDER BY vote_count DESC;


SELECT * FROM information_schema.views 
WHERE table_schema = 'group_collab_db'














