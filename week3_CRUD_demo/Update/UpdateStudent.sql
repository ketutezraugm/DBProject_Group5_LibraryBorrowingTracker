SELECT * -- CHECK / READ
FROM Student
WHERE MemberID = 3;

UPDATE Student -- UPDATE
SET 
    Name = 'Alice Putri',
    Department = 'Information Systems',
    Email = 'alice.putri@example.com',
    Phone = 812345678
WHERE MemberID = 3;

SELECT * -- CHECK / READ AFTER UPDATE
FROM Student
WHERE MemberID = 3;
