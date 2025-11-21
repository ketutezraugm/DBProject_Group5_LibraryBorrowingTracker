-- List all available books with category name and admin in charge
SELECT 
    Book.BookID,
    Book.Title,
    Book.Author,
    Category.CategoryName,
    Admin.Name AS AdminName
FROM Book
JOIN Category ON Book.CategoryID = Category.CategoryID
JOIN Admin ON Book.AdminID = Admin.AdminID
WHERE Book.Status = 'available';

-- Show all borrowed books and who borrowed them
SELECT 
    Borrow.BorrowID,
    Book.Title,
    Student.Name AS Borrower,
    Borrow.BorrowDate,
    Borrow.ReturnDueDate,
    Borrow.ReturnDate
FROM Borrow
JOIN Book ON Borrow.BookID = Book.BookID
JOIN Student ON Borrow.MemberID = Student.MemberID
WHERE Book.Status = 'borrowed';

-- Find overdue books (ReturnDueDate < CURRENT_DATE AND ReturnDate IS NULL)
SELECT 
    Borrow.BorrowID,
    Book.Title,
    Student.Name AS Borrower,
    Borrow.BorrowDate,
    Borrow.ReturnDueDate
FROM Borrow
JOIN Book ON Borrow.BookID = Book.BookID
JOIN Student ON Borrow.MemberID = Student.MemberID
WHERE Borrow.ReturnDate IS NULL
  AND DATE_ADD(Borrow.BorrowDate, INTERVAL Borrow.ReturnDueDate DAY) < CURDATE();

-- Count how many books each student has borrowed
SELECT 
    Student.MemberID,
    Student.Name,
    COUNT(Borrow.BookID) AS TotalBorrowed
FROM Student
LEFT JOIN Borrow ON Student.MemberID = Borrow.MemberID
GROUP BY Student.MemberID, Student.Name
ORDER BY TotalBorrowed DESC;

-- See complete book information (book + admin + category + current borrower if any)
SELECT 
    Book.BookID,
    Book.Title,
    Book.Author,
    Book.Status,
    Category.CategoryName,
    Admin.Name AS AdminName,
    Student.Name AS CurrentBorrower
FROM Book
JOIN Category ON Book.CategoryID = Category.CategoryID
JOIN Admin ON Book.AdminID = Admin.AdminID
LEFT JOIN Borrow ON Book.BookID = Borrow.BookID AND Borrow.ReturnDate IS NULL
LEFT JOIN Student ON Borrow.MemberID = Student.MemberID
ORDER BY Book.BookID ASC;
