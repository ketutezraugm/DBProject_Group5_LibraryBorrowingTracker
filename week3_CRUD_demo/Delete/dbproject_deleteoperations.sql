USE DB_proj_library_system;

-- Delete a student who has no borrow records
DELETE FROM Student 
WHERE MemberID = 50;

-- Delete a book that is currently available
DELETE FROM Book
WHERE BookID = 60 AND Status = 'available';

-- Delete a category
DELETE FROM Category
WHERE CategoryID = 10;

-- Delete a borrow record
DELETE FROM Borrow
WHERE BorrowID = 5;

-- Delete an admin
DELETE FROM Admin
WHERE AdminID = 3;
