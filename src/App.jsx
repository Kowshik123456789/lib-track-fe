import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://lib-track-be.onrender.com';

function App() {
  const [books, setBooks] = useState([]);
  const [userName, setUserName] = useState('Koushik');
  const [message, setMessage] = useState('');

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books', error);
      setMessage('Error fetching books from server.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    if (!userName.trim()) {
      setMessage('Please enter a user name first!');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/borrow`, {
        book_id: bookId,
        user_name: userName
      });
      setMessage(response.data.message);
      fetchBooks(); // Refresh book list
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error borrowing book');
    }
  };

  // Handle returning a book
  const handleReturn = async (bookId) => {
    if (!userName.trim()) {
      setMessage('Please enter a user name first!');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/return`, {
        book_id: bookId,
        user_name: userName
      });
      setMessage(response.data.message);
      fetchBooks(); // Refresh book list
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error returning book');
    }
  };

  return (
    <div className="container">
      <h1>Library Borrow System</h1>
      
      <div className="user-section">
        <label htmlFor="userName">Your Name: </label>
        <input 
          type="text" 
          id="userName" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Enter your name"
        />
      </div>

      {message && <div className="message-box">{message}</div>}

      <div className="books-list">
        <h2>Available Books</h2>
        {books.length === 0 ? (
          <p>No books found. Check database connection.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.total_copies}</td>
                  <td className={book.available_copies > 0 ? "available" : "unavailable"}>
                    {book.available_copies}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleBorrow(book.id)} 
                      disabled={book.available_copies === 0}
                      className="borrow-btn"
                    >
                      Borrow
                    </button>
                    <button 
                      onClick={() => handleReturn(book.id)} 
                      className="return-btn"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
