SELECT * -- READ / CHECK
FROM Admin
WHERE AdminID = 1;

UPDATE Admin -- UPDATE ADMIN INFO
SET 
    Name = 'John Updated',
    Email = 'john.updated@example.com',
    Phone = 987654321
WHERE AdminID = 1;

SELECT * -- READ / CHECK AFTER UPDATE
FROM Admin
WHERE AdminID = 1;
