SELECT * -- READ / CHECK
FROM Book
WHERE BookID = 10;


UPDATE Book -- UPDATE BOOK INFO
SET 
    Title = 'Clean Code (Updated Edition)',
    Author = 'Robert C. Martin',
    ISBN = 987654321,
    PublicationYear = 2021,
    Status = 'available',
    AdminID = 2,
    CategoryID = 3
WHERE BookID = 10;

SELECT * -- READ / CHECK AFTER UPDATE
FROM Book
WHERE BookID = 10;
