SELECT * -- READ
FROM Admin
WHERE AdminID = 1;

UPDATE Admin -- UPDATE
SET 
    Name = 'John Updated',
    Email = 'john.updated@example.com',
    Phone = 987654321
WHERE AdminID = 1;

SELECT * -- READ AFTER UPDATE
FROM Admin
WHERE AdminID = 1;
