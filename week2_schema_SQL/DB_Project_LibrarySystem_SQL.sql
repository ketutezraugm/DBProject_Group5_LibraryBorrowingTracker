CREATE DATABASE IF NOT EXISTS DB_proj_library_system;
USE DB_proj_library_system;

CREATE TABLE Admin (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Phone INT
);

CREATE TABLE Category (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(20)
);

CREATE TABLE Student (
    MemberID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Department VARCHAR(50),
    Email VARCHAR(100),
    Phone INT
);

CREATE TABLE Book (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200),
    Author VARCHAR(100),
    ISBN INT,
    PublicationYear YEAR,
    Status ENUM('available', 'borrowed'),
    AdminID INT,
    CategoryID INT,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Borrow (
    BorrowID INT PRIMARY KEY AUTO_INCREMENT,
    BorrowDate DATE,
    ReturnDueDate INT,
    ReturnDate DATE,
    BookID INT,
    MemberID INT,
    FOREIGN KEY (BookID) REFERENCES Book(BookID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (MemberID) REFERENCES Student(MemberID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);